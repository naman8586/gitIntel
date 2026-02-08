import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalRepos, totalPRs, totalEvents, topContributors] = await Promise.all([
      prisma.repository.count(),
      prisma.pullRequest.count(),
      prisma.webhookEvent.count({ where: { processed: true } }),
      prisma.contributorScore.findMany({
        orderBy: { totalScore: 'desc' },
        take: 5,
        include: { repository: { select: { name: true, fullName: true } } }
      })
    ]);
    return NextResponse.json({ totalRepos, totalPRs, totalEvents, topContributors });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}