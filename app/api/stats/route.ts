import { NextResponse } from 'next/server';
import { fetchStatsData } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const stats = await fetchStatsData();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
