import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubCreatePrTool } from '@/mcp-server/tools/definitions/github-create-pr.tool.js';
import { githubGetPrTool } from '@/mcp-server/tools/definitions/github-get-pr.tool.js';
import { githubListPrsTool } from '@/mcp-server/tools/definitions/github-list-prs.tool.js';
import { githubMergePrTool } from '@/mcp-server/tools/definitions/github-merge-pr.tool.js';
import { githubUpdatePrTool } from '@/mcp-server/tools/definitions/github-update-pr.tool.js';

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

describe('github_get_pr tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('validates required fields', () => {
      const result = githubGetPrTool.inputSchema.safeParse({ owner: 'org', repo: 'name', pull_number: 1 });
      expect(result.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('calls provider method and returns result', async () => {
      mockProvider.getPullRequest.mockResolvedValue({ success: true, number: 1, title: 'Test', state: 'open', draft: false, body: '', user: 'user', head: 'feat', base: 'main', html_url: 'https://github.com/org/name/pull/1', mergeable: true, merged: false, comments_count: 0, review_comments_count: 0, additions: 5, deletions: 2, changed_files: 1 });
      const input = githubGetPrTool.inputSchema.parse({ owner: 'org', repo: 'name', pull_number: 1 });
      const result = await githubGetPrTool.logic(input, createTestContext(), createTestSdkContext());
      expect(result.success).toBe(true);
      expect(result.number).toBe(1);
      expect(mockProvider.getPullRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tool Metadata', () => {
    it('has correct name', () => { expect(githubGetPrTool.name).toBe('github_get_pr'); });
    it('has correct readOnlyHint', () => { expect(githubGetPrTool.annotations?.readOnlyHint).toBe(true); });
  });
});

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
