import { processPullRequestEvent } from './pullRequest.js';
import { processPushEvent } from './push.js';
import { processReviewEvent } from './review.js';

export async function processEvents(event, prisma) {
  const { eventType, payload } = event;

  console.log(`📋 Processing ${eventType} event...`);

  switch (eventType) {
    case 'pull_request':
      await processPullRequestEvent(payload, prisma);
      break;
    
    case 'push':
      await processPushEvent(payload, prisma);
      break;
    
    case 'pull_request_review':
      await processReviewEvent(payload, prisma);
      break;
    
    default:
      console.log(`⚠️ Unsupported event type: ${eventType}`);
  }
}