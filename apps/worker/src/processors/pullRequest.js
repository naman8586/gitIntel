import { calculateContributorScore } from '../scoring/calculator.js';

export async function processPullRequestEvent(payload, prisma) {
  const { action, pull_request, repository } = payload;

  console.log(`🔀 Processing PR #${pull_request.number} in ${repository.full_name} (${action})`);

  try {
    // Find repository
    const repo = await prisma.repository.findUnique({
      where: { githubId: repository.id },
    });

    if (!repo) {
      console.log(`⚠️ Repository not found: ${repository.full_name}`);
      return;
    }

    // Detect bug fix
    const isBugFix = /\b(fix|bug|issue|hotfix|patch)\b/i.test(
      pull_request.title + ' ' + (pull_request.body || '')
    );

    // Upsert pull request
    await prisma.pullRequest.upsert({
      where: { githubId: pull_request.id },
      update: {
        state: pull_request.state,
        mergedAt: pull_request.merged_at ? new Date(pull_request.merged_at) : null,
        linesAdded: pull_request.additions || 0,
        linesDeleted: pull_request.deletions || 0,
      },
      create: {
        githubId: pull_request.id,
        number: pull_request.number,
        repositoryId: repo.id,
        authorId: pull_request.user?.login || 'unknown',
        title: pull_request.title,
        state: pull_request.state,
        mergedAt: pull_request.merged_at ? new Date(pull_request.merged_at) : null,
        createdAt: new Date(pull_request.created_at),
        linesAdded: pull_request.additions || 0,
        linesDeleted: pull_request.deletions || 0,
        isBugFix,
      },
    });

    console.log(`✅ Saved PR #${pull_request.number}`);

    // Recalculate contributor score
    if (pull_request.user?.login) {
      await calculateContributorScore(
        pull_request.user.login,
        repo.id,
        prisma
      );
    }

  } catch (error) {
    console.error('❌ Error processing PR:', error);
    throw error;
  }
}