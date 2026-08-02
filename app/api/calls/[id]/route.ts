import { NextRequest, NextResponse } from 'next/server';
import { fetchCallById, updateCallRecord, deleteCallRecord } from '@/lib/db';
import { updateCallSchema } from '@/lib/validations/call';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const call = await fetchCallById(params.id);

    if (!call) {
      return NextResponse.json(
        { success: false, error: 'Call record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: call });
  } catch (error) {
    console.error('GET /api/calls/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch call record' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const validation = updateCallSchema.safeParse(body);
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

    const call = await updateCallRecord(params.id, validation.data);

    if (!call) {
      return NextResponse.json(
        { success: false, error: 'Call record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: call,
      message: 'Call record updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/calls/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update call record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteCallRecord(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Call record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Call record deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/calls/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete call record' },
      { status: 500 }
    );
  }
}
