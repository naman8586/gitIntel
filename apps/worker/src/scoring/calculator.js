export async function calculateContributorScore(contributorKey, repositoryId, prisma) {
  console.log(`📊 Calculating score for ${contributorKey}`);

  try {
    // Get contributor's PRs
    const prs = await prisma.pullRequest.findMany({
      where: {
        repositoryId,
        authorId: contributorKey,
      },
    });

    const mergedPRs = prs.filter(pr => pr.mergedAt !== null);
    const bugFixPRs = prs.filter(pr => pr.isBugFix && pr.mergedAt !== null);

    // Get reviews given
    const reviewsGiven = await prisma.review.findMany({
      where: {
        pullRequest: { repositoryId },
        reviewerId: contributorKey,
      },
    });

    const approvedReviews = reviewsGiven.filter(r => r.state === 'APPROVED');

    // Calculate metrics
    const linesAdded = prs.reduce((sum, pr) => sum + pr.linesAdded, 0);
    const linesDeleted = prs.reduce((sum, pr) => sum + pr.linesDeleted, 0);

    // 🔥 SCORING FORMULA
    const score =
      mergedPRs.length * 3 +              // Merged PRs
      bugFixPRs.length * 5 +              // Bug fixes (extra valuable)
      approvedReviews.length * 2 +        // Helpful reviews
      Math.log(linesAdded + 1) * 1;       // Code contribution

    const finalScore = Math.max(0, score);

    // Save score
    await prisma.contributorScore.upsert({
      where: {
        contributorKey_repositoryId: {
          contributorKey,
          repositoryId,
        },
      },
      update: {
        totalScore: finalScore,
        totalPRs: prs.length,
        mergedPRs: mergedPRs.length,
        bugFixPRs: bugFixPRs.length,
        reviewsGiven: reviewsGiven.length,
        calculatedAt: new Date(),
      },
      create: {
        contributorKey,
        repositoryId,
        totalScore: finalScore,
        totalPRs: prs.length,
        mergedPRs: mergedPRs.length,
        bugFixPRs: bugFixPRs.length,
        reviewsGiven: reviewsGiven.length,
      },
    });

    console.log(`✅ Score calculated: ${finalScore.toFixed(2)} for ${contributorKey}`);

    return finalScore;

  } catch (error) {
    console.error('❌ Error calculating score:', error);
    throw error;
  }
}