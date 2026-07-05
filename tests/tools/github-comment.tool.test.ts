import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubCommentTool } from '@/mcp-server/tools/definitions/github-comment.tool.js';

describe('github_comment tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubCommentTool.inputSchema.safeParse({ owner: 'org', repo: 'repo', issue_number: 42, body: 'Fixed in PR #5' });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.createComment.mockResolvedValue({ success: true, id: 100, html_url: 'https://github.com/org/repo/issues/42#issuecomment-100', body: 'Fixed in PR #5', user: 'dev', created_at: '2024-01-03' });
      const input = githubCommentTool.inputSchema.parse({ owner: 'org', repo: 'repo', issue_number: 42, body: 'Fixed in PR #5' });
      const result = await githubCommentTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.id).toBe(100);
      expect(result.body).toBe('Fixed in PR #5');
      expect(mockProvider.createComment).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubCommentTool.name).toBe('github_comment'); });
    it('has correct readOnlyHint', () => { expect(githubCommentTool.annotations?.readOnlyHint).toBe(false); });
  });
});
