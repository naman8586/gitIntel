import prisma from '../../web/lib/prisma.js';
import { processEvents } from './processors/index.js';

// Poll for unprocessed events every 5 seconds
async function pollEvents() {
  try {
    const unprocessedEvents = await prisma.webhookEvent.findMany({
      where: {
        processed: false,
      },
      orderBy: {
        receivedAt: 'asc',
      },
      take: 10, // Process 10 events at a time
    });

    if (unprocessedEvents.length > 0) {
      console.log(`🔄 Found ${unprocessedEvents.length} events to process`);

      for (const event of unprocessedEvents) {
        try {
          await processEvents(event, prisma);

          // Mark as processed
          await prisma.webhookEvent.update({
            where: { id: event.id },
            data: {
              processed: true,
              processedAt: new Date(),
            },
          });

          console.log(
            `✅ Processed event: ${event.eventType} (${event.eventId})`
          );
        } catch (error) {
          console.error(
            `❌ Error processing event ${event.id}:`,
            error.message
          );
        }
      }
    }
  } catch (error) {
    console.error('❌ Polling error:', error.message);
  }
}

// Start polling
console.log('🚀 Worker started, polling for events...');
console.log('⏱️  Poll interval: 5 seconds\n');

setInterval(pollEvents, 5000);

// Run immediately on start
pollEvents();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📛 SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});
