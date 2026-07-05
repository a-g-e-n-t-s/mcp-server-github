import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubListReviewsTool } from '@/mcp-server/tools/definitions/github-list-reviews.tool.js';

describe('github_list_reviews tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubListReviewsTool.inputSchema.safeParse({ owner: 'org', repo: 'repo', pull_number: 1 });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.listReviews.mockResolvedValue({ success: true, total_count: 1, reviews: [{ id: 200, state: 'APPROVED', body: 'LGTM', user: 'reviewer', submitted_at: '2024-01-01', html_url: 'https://github.com/org/repo/pull/1#pullrequestreview-200' }] });
      const input = githubListReviewsTool.inputSchema.parse({ owner: 'org', repo: 'repo', pull_number: 1 });
      const result = await githubListReviewsTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.total_count).toBe(1);
      expect(result.reviews).toHaveLength(1);
      expect(mockProvider.listReviews).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubListReviewsTool.name).toBe('github_list_reviews'); });
    it('has correct readOnlyHint', () => { expect(githubListReviewsTool.annotations?.readOnlyHint).toBe(true); });
  });
});
