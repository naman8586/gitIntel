import { prisma } from '@/lib/prisma';
import { jsonResponse } from '@/lib/api';

export async function GET() {
  try {
    const repositories = await prisma.repository.findMany({
      include: {
        _count: {
          select: {
            pullRequests: true,
            scores: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return jsonResponse({ repositories });
  } catch (error) {
    console.error('Repositories API error:', error);
    return jsonResponse({ error: error.message }, { status: 500 });
  }
}