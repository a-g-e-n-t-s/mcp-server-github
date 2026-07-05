import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubDispatchWorkflowTool } from '@/mcp-server/tools/definitions/github-dispatch-workflow.tool.js';

describe('github_dispatch_workflow tool', () => {
  const mockProvider = createMockGitHubProvider();

  beforeEach(() => {
    mockProvider.resetMocks();
    container.clearInstances();
    container.register(GitHubProviderToken, { useValue: mockProvider });
  });

  describe('Input Schema', () => {
    it('should have required owner, repo, workflow_id, and ref fields', () => {
      const schema = githubDispatchWorkflowTool.inputSchema;
      expect(schema.shape).toHaveProperty('owner');
      expect(schema.shape).toHaveProperty('repo');
      expect(schema.shape).toHaveProperty('workflow_id');
      expect(schema.shape).toHaveProperty('ref');
    });
  });

  describe('Tool Logic', () => {
    it('should dispatch a workflow successfully', async () => {
      const mockReturn = {
        success: true,
        message: 'Workflow dispatch triggered for ci.yml on main',
      };
      mockProvider.dispatchWorkflow.mockResolvedValue(mockReturn);

      const result = await githubDispatchWorkflowTool.logic(
        { owner: 'org', repo: 'app', workflow_id: 'ci.yml', ref: 'main' },
        createTestContext(),
        createTestSdkContext(),
      );

      expect(mockProvider.dispatchWorkflow).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'org', repo: 'app', workflow_id: 'ci.yml', ref: 'main' }),
      );
      expect(result).toEqual(mockReturn);
    });
  });

  describe('Tool Metadata', () => {
    it('should have correct name', () => {
      expect(githubDispatchWorkflowTool.name).toBe('github_dispatch_workflow');
    });

    it('should not be read-only', () => {
      expect(githubDispatchWorkflowTool.annotations?.readOnlyHint).toBe(false);
    });
  });
});
