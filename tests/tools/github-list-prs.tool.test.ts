import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubListPrsTool } from '@/mcp-server/tools/definitions/github-list-prs.tool.js';

describe('github_list_prs tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubListPrsTool.inputSchema.safeParse({ owner: 'org', repo: 'name' });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.listPullRequests.mockResolvedValue({ success: true, total_count: 1, pull_requests: [{ number: 1, title: 'Test', state: 'open', draft: false, user: 'user', head: 'feat', base: 'main', created_at: '2024-01-01', updated_at: '2024-01-01', html_url: 'https://github.com/org/name/pull/1' }] });
      const input = githubListPrsTool.inputSchema.parse({ owner: 'org', repo: 'name' });
      const result = await githubListPrsTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.total_count).toBe(1);
      expect(mockProvider.listPullRequests).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubListPrsTool.name).toBe('github_list_prs'); });
    it('has correct readOnlyHint', () => { expect(githubListPrsTool.annotations?.readOnlyHint).toBe(true); });
  });
});
