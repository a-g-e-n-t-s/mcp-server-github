import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubCreateIssueTool } from '@/mcp-server/tools/definitions/github-create-issue.tool.js';
import { githubGetIssueTool } from '@/mcp-server/tools/definitions/github-get-issue.tool.js';
import { githubListIssuesTool } from '@/mcp-server/tools/definitions/github-list-issues.tool.js';
import { githubUpdateIssueTool } from '@/mcp-server/tools/definitions/github-update-issue.tool.js';
import { githubCommentTool } from '@/mcp-server/tools/definitions/github-comment.tool.js';

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
