import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubListIssuesTool } from '@/mcp-server/tools/definitions/github-list-issues.tool.js';

describe('github_list_issues tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubListIssuesTool.inputSchema.safeParse({ owner: 'org', repo: 'repo', state: 'open' });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.listIssues.mockResolvedValue({ success: true, total_count: 2, issues: [{ number: 1, title: 'A', state: 'open', user: 'u', labels: [], assignees: [], created_at: '2024-01-01', updated_at: '2024-01-01', html_url: 'https://github.com/org/repo/issues/1', comments: 0 }, { number: 2, title: 'B', state: 'open', user: 'u', labels: ['bug'], assignees: ['dev'], created_at: '2024-01-02', updated_at: '2024-01-02', html_url: 'https://github.com/org/repo/issues/2', comments: 1 }] });
      const input = githubListIssuesTool.inputSchema.parse({ owner: 'org', repo: 'repo', state: 'open' });
      const result = await githubListIssuesTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.total_count).toBe(2);
      expect(mockProvider.listIssues).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubListIssuesTool.name).toBe('github_list_issues'); });
    it('has correct readOnlyHint', () => { expect(githubListIssuesTool.annotations?.readOnlyHint).toBe(true); });
  });
});
