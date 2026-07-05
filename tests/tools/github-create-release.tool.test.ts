import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubCreateReleaseTool } from '@/mcp-server/tools/definitions/github-create-release.tool.js';

describe('github_create_release tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required owner, repo, and tag_name fields', () => {
      const schema = githubCreateReleaseTool.inputSchema;
      expect(schema.shape).toHaveProperty('owner');
      expect(schema.shape).toHaveProperty('repo');
      expect(schema.shape).toHaveProperty('tag_name');
    });
  });

  describe('Tool Logic', () => {
    it('should create a release successfully', async () => {
      const mockReturn = {
        success: true,
        id: 1,
        tag_name: 'v1.0.0',
        name: 'Version 1.0',
        html_url: 'https://github.com/org/app/releases/tag/v1.0.0',
        draft: false,
        prerelease: false,
        created_at: '2024-01-01',
      };
      mockProvider.createRelease.mockResolvedValue(mockReturn);

      const result = await githubCreateReleaseTool.logic(
        { owner: 'org', repo: 'app', tag_name: 'v1.0.0', name: 'Version 1.0' },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.createRelease).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'org', repo: 'app', tag_name: 'v1.0.0', name: 'Version 1.0' }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubCreateReleaseTool.name).toBe('github_create_release');
    });

    it('should not be read-only', () => {
      expect(githubCreateReleaseTool.annotations?.readOnlyHint).toBe(false);
    });
  });
});
