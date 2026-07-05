import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubGetIssueTool } from '@/mcp-server/tools/definitions/github-get-issue.tool.js';

describe('github_get_issue tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubGetIssueTool.inputSchema.safeParse({ owner: 'org', repo: 'repo', issue_number: 42 });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.getIssue.mockResolvedValue({ success: true, number: 42, title: 'Bug', state: 'open', body: 'desc', html_url: 'https://github.com/org/repo/issues/42', user: 'u', labels: ['bug'], assignees: ['dev'], created_at: '2024-01-01', updated_at: '2024-01-02', closed_at: null, comments: 3 });
      const input = githubGetIssueTool.inputSchema.parse({ owner: 'org', repo: 'repo', issue_number: 42 });
      const result = await githubGetIssueTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.number).toBe(42);
      expect(result.comments).toBe(3);
      expect(mockProvider.getIssue).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubGetIssueTool.name).toBe('github_get_issue'); });
    it('has correct readOnlyHint', () => { expect(githubGetIssueTool.annotations?.readOnlyHint).toBe(true); });
  });
});
