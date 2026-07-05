import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubMergePrTool } from '@/mcp-server/tools/definitions/github-merge-pr.tool.js';

describe('github_merge_pr tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubMergePrTool.inputSchema.safeParse({ owner: 'org', repo: 'name', pull_number: 1 });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.mergePullRequest.mockResolvedValue({ success: true, sha: 'abc123', message: 'Pull request merged', merged: true });
      const input = githubMergePrTool.inputSchema.parse({ owner: 'org', repo: 'name', pull_number: 1 });
      const result = await githubMergePrTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.merged).toBe(true);
      expect(mockProvider.mergePullRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubMergePrTool.name).toBe('github_merge_pr'); });
    it('has correct readOnlyHint', () => { expect(githubMergePrTool.annotations?.readOnlyHint).toBeUndefined(); });
  });
});
