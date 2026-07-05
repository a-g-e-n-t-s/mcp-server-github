import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubRerunWorkflowTool } from '@/mcp-server/tools/definitions/github-rerun-workflow.tool.js';

describe('github_rerun_workflow tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required owner, repo, and run_id fields', () => {
      const schema = githubRerunWorkflowTool.inputSchema;
      expect(schema.shape).toHaveProperty('owner');
      expect(schema.shape).toHaveProperty('repo');
      expect(schema.shape).toHaveProperty('run_id');
    });
  });

  describe('Tool Logic', () => {
    it('should rerun a workflow successfully', async () => {
      const mockReturn = {
        success: true,
        message: 'Workflow run 1 re-run triggered',
      };
      mockProvider.rerunWorkflow.mockResolvedValue(mockReturn);

      const result = await githubRerunWorkflowTool.logic(
        { owner: 'org', repo: 'app', run_id: 1 },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.rerunWorkflow).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'org', repo: 'app', run_id: 1 }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubRerunWorkflowTool.name).toBe('github_rerun_workflow');
    });

    it('should not be read-only', () => {
      expect(githubRerunWorkflowTool.annotations?.readOnlyHint).toBe(false);
    });
  });
});
