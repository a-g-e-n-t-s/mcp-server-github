import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubCreatePrTool } from '@/mcp-server/tools/definitions/github-create-pr.tool.js';

describe('github_create_pr tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubCreatePrTool.inputSchema.safeParse({ owner: 'org', repo: 'name', title: 'Test', head: 'feat', base: 'main' });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.createPullRequest.mockResolvedValue({ success: true, number: 1, url: 'https://api.github.com/repos/org/name/pulls/1', html_url: 'https://github.com/org/name/pull/1', state: 'open', title: 'Test', head: 'feat', base: 'main', draft: false });
      const input = githubCreatePrTool.inputSchema.parse({ owner: 'org', repo: 'name', title: 'Test', head: 'feat', base: 'main' });
      const result = await githubCreatePrTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.number).toBe(1);
      expect(mockProvider.createPullRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubCreatePrTool.name).toBe('github_create_pr'); });
    it('has correct readOnlyHint', () => { expect(githubCreatePrTool.annotations?.readOnlyHint).toBeUndefined(); });
  });
});
