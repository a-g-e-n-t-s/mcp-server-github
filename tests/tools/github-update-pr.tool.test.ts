import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubUpdatePrTool } from '@/mcp-server/tools/definitions/github-update-pr.tool.js';

describe('github_update_pr tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubUpdatePrTool.inputSchema.safeParse({ owner: 'org', repo: 'name', pull_number: 1, title: 'New title' });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.updatePullRequest.mockResolvedValue({ success: true, number: 1, url: 'https://api.github.com/repos/org/name/pulls/1', html_url: 'https://github.com/org/name/pull/1', title: 'New title', state: 'open' });
      const input = githubUpdatePrTool.inputSchema.parse({ owner: 'org', repo: 'name', pull_number: 1, title: 'New title' });
      const result = await githubUpdatePrTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.title).toBe('New title');
      expect(mockProvider.updatePullRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubUpdatePrTool.name).toBe('github_update_pr'); });
    it('has correct readOnlyHint', () => { expect(githubUpdatePrTool.annotations?.readOnlyHint).toBeUndefined(); });
  });
});
