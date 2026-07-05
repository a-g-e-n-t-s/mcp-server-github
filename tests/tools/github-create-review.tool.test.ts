import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubCreateReviewTool } from '@/mcp-server/tools/definitions/github-create-review.tool.js';

describe('github_create_review tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubCreateReviewTool.inputSchema.safeParse({ owner: 'org', repo: 'repo', pull_number: 1, event: 'APPROVE', body: 'LGTM' });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.createReview.mockResolvedValue({ success: true, id: 200, state: 'APPROVED', html_url: 'https://github.com/org/repo/pull/1#pullrequestreview-200', user: 'reviewer' });
      const input = githubCreateReviewTool.inputSchema.parse({ owner: 'org', repo: 'repo', pull_number: 1, event: 'APPROVE', body: 'LGTM' });
      const result = await githubCreateReviewTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.id).toBe(200);
      expect(result.state).toBe('APPROVED');
      expect(mockProvider.createReview).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubCreateReviewTool.name).toBe('github_create_review'); });
    it('has correct readOnlyHint', () => { expect(githubCreateReviewTool.annotations?.readOnlyHint).toBe(false); });
  });
});
