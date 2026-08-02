import { NextRequest, NextResponse } from 'next/server';
import { fetchCalls, createCallRecord } from '@/lib/db';
import { callSchema } from '@/lib/validations/call';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const callStatus = searchParams.get('callStatus') || '';
    const websiteDiscussed = searchParams.get('websiteDiscussed') || '';
    const addedBy = searchParams.get('addedBy') || '';
    const followUpDate = searchParams.get('followUpDate') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const quickFilter = searchParams.get('quickFilter') || '';

    let calls = await fetchCalls();

    // Client-side/Edge filtering over results
    if (search) {
      const s = search.toLowerCase();
      calls = calls.filter(
        (c) =>
          c.shopName.toLowerCase().includes(s) ||
          c.shopNumber.toLowerCase().includes(s) ||
          (c.remarks && c.remarks.toLowerCase().includes(s)) ||
          c.addedBy.toLowerCase().includes(s)
      );
    }

    if (callStatus) {
      calls = calls.filter((c) => c.callStatus === callStatus);
    }

    if (websiteDiscussed) {
      calls = calls.filter((c) => c.websiteDiscussed === websiteDiscussed);
    }

    if (addedBy) {
      calls = calls.filter((c) => c.addedBy.toLowerCase() === addedBy.toLowerCase());
    }

    if (followUpDate) {
      calls = calls.filter((c) => c.followUpDate === followUpDate);
    }

    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate + 'T23:59:59.999Z').getTime();
      calls = calls.filter((c) => {
        const t = new Date(c.createdAt).getTime();
        return t >= start && t <= end;
      });
    }

    if (quickFilter) {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayDate = new Date();

      switch (quickFilter) {
        case 'today': {
          calls = calls.filter((c) => c.createdAt.startsWith(todayStr));
          break;
        }
        case 'tomorrow': {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];
          calls = calls.filter((c) => c.followUpDate === tomorrowStr);
          break;
        }
        case 'this-week': {
          const startOfWeek = new Date(todayDate);
          startOfWeek.setDate(todayDate.getDate() - todayDate.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          calls = calls.filter((c) => {
            const t = new Date(c.createdAt).getTime();
            return t >= startOfWeek.getTime() && t <= endOfWeek.getTime();
          });
          break;
        }
        case 'this-month': {
          const startOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
          const endOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0, 23, 59, 59, 999);

          calls = calls.filter((c) => {
            const t = new Date(c.createdAt).getTime();
            return t >= startOfMonth.getTime() && t <= endOfMonth.getTime();
          });
          break;
        }
        case 'upcoming': {
          calls = calls.filter((c) => c.followUpDate && c.followUpDate > todayStr);
          break;
        }
        case 'overdue': {
          calls = calls.filter((c) => c.followUpDate && c.followUpDate < todayStr);
          break;
        }
        case 'answered':
          calls = calls.filter((c) => c.callStatus === 'Answered');
          break;
        case 'rejected':
          calls = calls.filter((c) => c.callStatus === 'Rejected');
          break;
        case 'website-discussed':
          calls = calls.filter((c) => c.websiteDiscussed === 'Yes');
          break;
        case 'not-discussed':
          calls = calls.filter((c) => c.websiteDiscussed === 'No');
          break;
        case 'aflah':
          calls = calls.filter((c) => c.addedBy === 'Aflah');
          break;
        case 'anna':
          calls = calls.filter((c) => c.addedBy === 'Anna');
          break;
      }
    }

    return NextResponse.json({
      success: true,
      data: calls,
      total: calls.length,
    });
  } catch (error) {
    console.error('GET /api/calls error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch calls' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = callSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const call = await createCallRecord(validation.data);

    return NextResponse.json(
      { success: true, data: call, message: 'Call record created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/calls error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create call record' },
      { status: 500 }
    );
  }
}
