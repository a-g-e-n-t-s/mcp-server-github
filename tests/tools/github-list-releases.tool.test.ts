import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubListReleasesTool } from '@/mcp-server/tools/definitions/github-list-releases.tool.js';

describe('github_list_releases tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required owner and repo fields', () => {
      const result = githubListReleasesTool.inputSchema.safeParse({});
      expect(result.success).toBe(false);
      const validResult = githubListReleasesTool.inputSchema.safeParse({ owner: 'org', repo: 'app' });
      expect(validResult.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('should list releases successfully', async () => {
      const mockReturn = {
        success: true,
        total_count: 1,
        releases: [{
          id: 1,
          tag_name: 'v1.0.0',
          name: 'Version 1.0',
          draft: false,
          prerelease: false,
          html_url: 'https://github.com/org/app/releases/tag/v1.0.0',
          created_at: '2024-01-01',
          published_at: '2024-01-01',
        }],
      };
      mockProvider.listReleases.mockResolvedValue(mockReturn);

      const result = await githubListReleasesTool.logic(
        { owner: 'org', repo: 'app' },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.listReleases).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'org', repo: 'app' }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubListReleasesTool.name).toBe('github_list_releases');
    });

    it('should be read-only', () => {
      expect(githubListReleasesTool.annotations?.readOnlyHint).toBe(true);
    });
  });
});
