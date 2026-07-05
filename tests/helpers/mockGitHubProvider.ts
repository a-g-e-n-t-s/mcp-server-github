import { vi } from 'vitest';

export class MockGitHubProvider {
  // Pull Requests
  createPullRequest = vi.fn();
  getPullRequest = vi.fn();
  listPullRequests = vi.fn();
  mergePullRequest = vi.fn();
  updatePullRequest = vi.fn();

  // Issues
  createIssue = vi.fn();
  getIssue = vi.fn();
  listIssues = vi.fn();
  updateIssue = vi.fn();
  createComment = vi.fn();

  // Reviews
  createReview = vi.fn();
  listReviews = vi.fn();

  // CI / Actions
  listWorkflowRuns = vi.fn();
  getWorkflowRun = vi.fn();
  rerunWorkflow = vi.fn();
  dispatchWorkflow = vi.fn();

  // Releases
  createRelease = vi.fn();
  listReleases = vi.fn();
  getRelease = vi.fn();

  // Repository
  getRepo = vi.fn();
  compareCommits = vi.fn();
  searchCode = vi.fn();

  // Client accessor (used by the handler factory)
  get client() {
    return {};
  }

  resetMocks() {
    this.createPullRequest.mockReset();
    this.getPullRequest.mockReset();
    this.listPullRequests.mockReset();
    this.mergePullRequest.mockReset();
    this.updatePullRequest.mockReset();
    this.createIssue.mockReset();
    this.getIssue.mockReset();
    this.listIssues.mockReset();
    this.updateIssue.mockReset();
    this.createComment.mockReset();
    this.createReview.mockReset();
    this.listReviews.mockReset();
    this.listWorkflowRuns.mockReset();
    this.getWorkflowRun.mockReset();
    this.rerunWorkflow.mockReset();
    this.dispatchWorkflow.mockReset();
    this.createRelease.mockReset();
    this.listReleases.mockReset();
    this.getRelease.mockReset();
    this.getRepo.mockReset();
    this.compareCommits.mockReset();
    this.searchCode.mockReset();
  }
}

export function createMockGitHubProvider(): MockGitHubProvider {
  return new MockGitHubProvider();
}
