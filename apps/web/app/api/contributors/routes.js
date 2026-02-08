import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contributors = await prisma.contributorScore.findMany({
      orderBy: { totalScore: 'desc' },
      take: 50,
      include: { repository: { select: { name: true, fullName: true } } }
    });
    return NextResponse.json({ contributors });
  } catch (error) {
    console.error('Contributors API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}