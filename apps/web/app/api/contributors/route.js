import { prisma } from '@/lib/prisma';
import { jsonResponse } from '@/lib/api';

export async function GET() {
  try {
    const contributors = await prisma.contributorScore.findMany({
      orderBy: { totalScore: 'desc' },
      take: 50,
      include: {
        repository: {
          select: {
            name: true,
            fullName: true
          }
        }
      }
    });

    return jsonResponse({ contributors });
  } catch (error) {
    console.error('Contributors API error:', error);
    return jsonResponse({ error: error.message }, { status: 500 });
  }
}