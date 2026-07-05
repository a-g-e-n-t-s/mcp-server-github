import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubGetRepoTool } from '@/mcp-server/tools/definitions/github-get-repo.tool.js';
import { githubCompareTool } from '@/mcp-server/tools/definitions/github-compare.tool.js';
import { githubSearchCodeTool } from '@/mcp-server/tools/definitions/github-search-code.tool.js';

describe('github_get_repo tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required owner and repo fields', () => {
      const result = githubGetRepoTool.inputSchema.safeParse({});
      expect(result.success).toBe(false);
      const validResult = githubGetRepoTool.inputSchema.safeParse({ owner: 'org', repo: 'app' });
      expect(validResult.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('should get repository info successfully', async () => {
      const mockReturn = {
        success: true,
        full_name: 'org/app',
        description: 'An app',
        html_url: 'https://github.com/org/app',
        default_branch: 'main',
        visibility: 'public',
        language: 'TypeScript',
        stargazers_count: 100,
        forks_count: 20,
        open_issues_count: 5,
        created_at: '2023-01-01',
        updated_at: '2024-01-01',
        topics: ['typescript', 'mcp'],
      };
      mockProvider.getRepo.mockResolvedValue(mockReturn);

      const result = await githubGetRepoTool.logic(
        { owner: 'org', repo: 'app' },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.getRepo).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'org', repo: 'app' }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubGetRepoTool.name).toBe('github_get_repo');
    });

    it('should be read-only', () => {
      expect(githubGetRepoTool.annotations?.readOnlyHint).toBe(true);
    });
  });
});

describe('github_compare tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required owner, repo, base, and head fields', () => {
      const schema = githubCompareTool.inputSchema;
      expect(schema.shape).toHaveProperty('owner');
      expect(schema.shape).toHaveProperty('repo');
      expect(schema.shape).toHaveProperty('base');
      expect(schema.shape).toHaveProperty('head');
    });
  });

  describe('Tool Logic', () => {
    it('should compare commits successfully', async () => {
      const mockReturn = {
        success: true,
        status: 'ahead',
        ahead_by: 3,
        behind_by: 0,
        total_commits: 3,
        html_url: 'https://github.com/org/app/compare/main...feat',
        commits: [{ sha: 'abc1234', message: 'feat: add X', author: 'dev', date: '2024-01-01' }],
        files: [{ filename: 'src/x.ts', status: 'added', additions: 10, deletions: 0 }],
      };
      mockProvider.compareCommits.mockResolvedValue(mockReturn);

      const result = await githubCompareTool.logic(
        { owner: 'org', repo: 'app', base: 'main', head: 'feat' },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.compareCommits).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'org', repo: 'app', base: 'main', head: 'feat' }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubCompareTool.name).toBe('github_compare');
    });

    it('should be read-only', () => {
      expect(githubCompareTool.annotations?.readOnlyHint).toBe(true);
    });
  });
});

describe('github_search_code tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required q field', () => {
      const schema = githubSearchCodeTool.inputSchema;
      expect(schema.shape).toHaveProperty('q');
    });
  });

  describe('Tool Logic', () => {
    it('should search code successfully', async () => {
      const mockReturn = {
        success: true,
        total_count: 2,
        items: [{
          name: 'errors.ts',
          path: 'src/types-global/errors.ts',
          repository: 'org/app',
          html_url: 'https://github.com/org/app/blob/main/src/types-global/errors.ts',
          score: 1.5,
        }],
      };
      mockProvider.searchCode.mockResolvedValue(mockReturn);

      const result = await githubSearchCodeTool.logic(
        { q: 'McpError repo:org/app' },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.searchCode).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'McpError repo:org/app' }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubSearchCodeTool.name).toBe('github_search_code');
    });

    it('should be read-only', () => {
      expect(githubSearchCodeTool.annotations?.readOnlyHint).toBe(true);
    });
  });
});
