export async function processReviewEvent(payload, prisma) {
  const { review, pull_request, repository } = payload;

  console.log(`👀 Processing review on PR #${pull_request.number} by ${review.user.login}`);

  try {
    // Find the PR
    const pr = await prisma.pullRequest.findUnique({
      where: { githubId: pull_request.id },
    });

    if (!pr) {
      console.log(`⚠️ PR #${pull_request.number} not found`);
      return;
    }

    // Save review
    await prisma.review.upsert({
      where: { githubId: review.id },
      update: {
        state: review.state,
        submittedAt: new Date(review.submitted_at),
      },
      create: {
        githubId: review.id,
        pullRequestId: pr.id,
        reviewerId: review.user.login,
        state: review.state,
        submittedAt: new Date(review.submitted_at),
      },
    });

    console.log(`✅ Saved review (${review.state})`);

  } catch (error) {
    console.error('❌ Error processing review:', error);
    throw error;
  }
}