import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const repositories = await prisma.repository.findMany({
      include: { _count: { select: { pullRequests: true, scores: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ repositories });
  } catch (error) {
    console.error('Repositories API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}