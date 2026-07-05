import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubCompareTool } from '@/mcp-server/tools/definitions/github-compare.tool.js';

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
