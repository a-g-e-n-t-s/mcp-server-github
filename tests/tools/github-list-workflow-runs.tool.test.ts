import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubListWorkflowRunsTool } from '@/mcp-server/tools/definitions/github-list-workflow-runs.tool.js';

describe('github_list_workflow_runs tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required owner and repo fields', () => {
      const result = githubListWorkflowRunsTool.inputSchema.safeParse({});
      expect(result.success).toBe(false);
      const validResult = githubListWorkflowRunsTool.inputSchema.safeParse({ owner: 'org', repo: 'app' });
      expect(validResult.success).toBe(true);
    });
  });

  describe('Tool Logic', () => {
    it('should list workflow runs successfully', async () => {
      const mockReturn = {
        success: true,
        total_count: 2,
        workflow_runs: [{
          id: 1,
          name: 'CI',
          status: 'completed',
          conclusion: 'success',
          branch: 'main',
          event: 'push',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          html_url: 'https://github.com/org/app/actions/runs/1',
          run_number: 10,
        }],
      };
      mockProvider.listWorkflowRuns.mockResolvedValue(mockReturn);

      const result = await githubListWorkflowRunsTool.logic(
        { owner: 'org', repo: 'app' },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.listWorkflowRuns).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'org', repo: 'app' }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubListWorkflowRunsTool.name).toBe('github_list_workflow_runs');
    });

    it('should be read-only', () => {
      expect(githubListWorkflowRunsTool.annotations?.readOnlyHint).toBe(true);
    });
  });
});
