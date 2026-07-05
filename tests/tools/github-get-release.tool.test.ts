import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubGetReleaseTool } from '@/mcp-server/tools/definitions/github-get-release.tool.js';

describe('github_get_release tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required owner, repo, and tag fields', () => {
      const schema = githubGetReleaseTool.inputSchema;
      expect(schema.shape).toHaveProperty('owner');
      expect(schema.shape).toHaveProperty('repo');
      expect(schema.shape).toHaveProperty('tag');
    });
  });

  describe('Tool Logic', () => {
    it('should get a release successfully', async () => {
      const mockReturn = {
        success: true,
        id: 1,
        tag_name: 'v1.0.0',
        name: 'Version 1.0',
        body: 'Release notes',
        html_url: 'https://github.com/org/app/releases/tag/v1.0.0',
        draft: false,
        prerelease: false,
        created_at: '2024-01-01',
        published_at: '2024-01-01',
        assets: [{ name: 'app.zip', size: 1024, download_url: 'https://github.com/org/app/releases/download/v1.0.0/app.zip' }],
      };
      mockProvider.getRelease.mockResolvedValue(mockReturn);

      const result = await githubGetReleaseTool.logic(
        { owner: 'org', repo: 'app', tag: 'v1.0.0' },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.getRelease).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'org', repo: 'app', tag: 'v1.0.0' }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubGetReleaseTool.name).toBe('github_get_release');
    });

    it('should be read-only', () => {
      expect(githubGetReleaseTool.annotations?.readOnlyHint).toBe(true);
    });
  });
});
