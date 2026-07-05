import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubGetPrTool } from '@/mcp-server/tools/definitions/github-get-pr.tool.js';

describe('github_get_pr tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubGetPrTool.inputSchema.safeParse({ owner: 'org', repo: 'name', pull_number: 1 });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.getPullRequest.mockResolvedValue({ success: true, number: 1, title: 'Test', state: 'open', draft: false, body: '', user: 'user', head: 'feat', base: 'main', html_url: 'https://github.com/org/name/pull/1', mergeable: true, merged: false, comments_count: 0, review_comments_count: 0, additions: 5, deletions: 2, changed_files: 1 });
      const input = githubGetPrTool.inputSchema.parse({ owner: 'org', repo: 'name', pull_number: 1 });
      const result = await githubGetPrTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.number).toBe(1);
      expect(mockProvider.getPullRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubGetPrTool.name).toBe('github_get_pr'); });
    it('has correct readOnlyHint', () => { expect(githubGetPrTool.annotations?.readOnlyHint).toBe(true); });
  });
});
