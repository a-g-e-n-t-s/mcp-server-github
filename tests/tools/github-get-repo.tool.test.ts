import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubGetRepoTool } from '@/mcp-server/tools/definitions/github-get-repo.tool.js';

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
