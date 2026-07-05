import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubCreateIssueTool } from '@/mcp-server/tools/definitions/github-create-issue.tool.js';

describe('github_create_issue tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubCreateIssueTool.inputSchema.safeParse({ owner: 'org', repo: 'repo', title: 'Bug report' });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.createIssue.mockResolvedValue({ success: true, number: 42, title: 'Bug report', state: 'open', html_url: 'https://github.com/org/repo/issues/42', user: 'tester' });
      const input = githubCreateIssueTool.inputSchema.parse({ owner: 'org', repo: 'repo', title: 'Bug report' });
      const result = await githubCreateIssueTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.number).toBe(42);
      expect(mockProvider.createIssue).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubCreateIssueTool.name).toBe('github_create_issue'); });
    it('has correct readOnlyHint', () => { expect(githubCreateIssueTool.annotations?.readOnlyHint).toBe(false); });
  });
});
