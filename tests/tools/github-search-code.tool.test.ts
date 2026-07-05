import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubSearchCodeTool } from '@/mcp-server/tools/definitions/github-search-code.tool.js';

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
