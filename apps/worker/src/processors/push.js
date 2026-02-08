export async function processPushEvent(payload, prisma) {
  const { commits, repository } = payload;

  if (!commits || commits.length === 0) {
    console.log('⚠️ Push event has no commits');
    return;
  }

  console.log(`📤 Processing push to ${repository.full_name} (${commits.length} commits)`);
  
  // For now, we just log it
  // In the future, we can process individual commits here
}