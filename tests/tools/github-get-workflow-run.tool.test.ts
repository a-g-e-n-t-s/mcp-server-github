import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubGetWorkflowRunTool } from '@/mcp-server/tools/definitions/github-get-workflow-run.tool.js';

describe('github_get_workflow_run tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required owner, repo, and run_id fields', () => {
      const schema = githubGetWorkflowRunTool.inputSchema;
      expect(schema.shape).toHaveProperty('owner');
      expect(schema.shape).toHaveProperty('repo');
      expect(schema.shape).toHaveProperty('run_id');
    });
  });

  describe('Tool Logic', () => {
    it('should get a workflow run successfully', async () => {
      const mockReturn = {
        success: true,
        id: 1,
        name: 'CI',
        status: 'completed',
        conclusion: 'success',
        branch: 'main',
        event: 'push',
        html_url: 'https://github.com/org/app/actions/runs/1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        run_number: 10,
        run_attempt: 1,
        head_sha: 'abc123',
      };
      mockProvider.getWorkflowRun.mockResolvedValue(mockReturn);

      const result = await githubGetWorkflowRunTool.logic(
        { owner: 'org', repo: 'app', run_id: 1 },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.getWorkflowRun).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'org', repo: 'app', run_id: 1 }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubGetWorkflowRunTool.name).toBe('github_get_workflow_run');
    });

    it('should be read-only', () => {
      expect(githubGetWorkflowRunTool.annotations?.readOnlyHint).toBe(true);
    });
  });
});
