import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { eventQueue } from '@/lib/queue';


function verifySignature(payload, signature) {
  if (!signature) return false;
  
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(request) {
  try {
    const headersList = await headers();
    const signature = headersList.get('x-hub-signature-256');
    const eventType = headersList.get('x-github-event');
    const deliveryId = headersList.get('x-github-delivery');

    console.log(`📨 Received webhook: ${eventType} (${deliveryId})`);

    if (!signature || !eventType || !deliveryId) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    const rawBody = await request.text();
    
    if (!verifySignature(rawBody, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);

    const existing = await prisma.webhookEvent.findUnique({
      where: { eventId: deliveryId }
    });

    if (existing) {
      console.log(`⚠️ Duplicate event ${deliveryId}`);
      return NextResponse.json({ status: 'duplicate' });
    }

    let repositoryId = null;
    
    if (payload.repository) {
      
      let repo = await prisma.repository.findUnique({
        where: { githubId: payload.repository.id }
      });

      if (!repo) {
        repo = await prisma.repository.create({
          data: {
            githubId: payload.repository.id,
            name: payload.repository.name,
            fullName: payload.repository.full_name,
            defaultBranch: payload.repository.default_branch || 'main',
            isPrivate: payload.repository.private || false,
            stars: payload.repository.stargazers_count || 0,
          }
        });
        console.log(`📁 Created repository: ${repo.fullName}`);
      }

      repositoryId = repo.id;
    }

    
    const event = await prisma.webhookEvent.create({
      data: {
        eventId: deliveryId,
        eventType,
        payload,
        repositoryId,
      }
    });

    
    try {
      await eventQueue.add('process-webhook', {
        eventId: event.id,
        eventType,
        deliveryId,
      });
      console.log(`✅ Event queued: ${deliveryId}`);
    } catch (queueError) {
      if (queueError.message && queueError.message.includes('NOPERM')) {
      } else {
        
        console.warn(`⚠️ Queue error (event saved to DB): ${queueError.message}`);
      }
    }

    return NextResponse.json({ 
      status: 'saved',
      eventId: event.id 
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    service: 'github-webhook-handler'
  });
}