import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubUpdateIssueTool } from '@/mcp-server/tools/definitions/github-update-issue.tool.js';

describe('github_update_issue tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubUpdateIssueTool.inputSchema.safeParse({ owner: 'org', repo: 'repo', issue_number: 42, state: 'closed' });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.updateIssue.mockResolvedValue({ success: true, number: 42, title: 'Bug', state: 'closed', html_url: 'https://github.com/org/repo/issues/42' });
      const input = githubUpdateIssueTool.inputSchema.parse({ owner: 'org', repo: 'repo', issue_number: 42, state: 'closed' });
      const result = await githubUpdateIssueTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.state).toBe('closed');
      expect(mockProvider.updateIssue).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubUpdateIssueTool.name).toBe('github_update_issue'); });
    it('has correct readOnlyHint', () => { expect(githubUpdateIssueTool.annotations?.readOnlyHint).toBe(false); });
  });
});
