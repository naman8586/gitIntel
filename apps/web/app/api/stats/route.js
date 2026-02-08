import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to convert BigInt to string
function serializeBigInt(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

export async function GET() {
  try {
    const [
      totalRepos,
      totalPRs,
      totalEvents,
      topContributors
    ] = await Promise.all([
      prisma.repository.count(),
      prisma.pullRequest.count(),
      prisma.webhookEvent.count({ where: { processed: true } }),
      prisma.contributorScore.findMany({
        orderBy: { totalScore: 'desc' },
        take: 5,
        include: {
          repository: {
            select: {
              name: true,
              fullName: true
            }
          }
        }
      })
    ]);

    // Serialize BigInt values in topContributors
    const serializedContributors = serializeBigInt(topContributors);

    return NextResponse.json({
      totalRepos,
      totalPRs,
      totalEvents,
      topContributors: serializedContributors
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stats',
      details: error.message 
    }, { status: 500 });
  }
}