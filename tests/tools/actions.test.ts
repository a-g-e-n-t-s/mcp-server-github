import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { GitHubProviderToken } from '@/container/tokens.js';
import { createTestContext, createTestSdkContext, createMockGitHubProvider } from '../helpers/index.js';
import { githubListWorkflowRunsTool } from '@/mcp-server/tools/definitions/github-list-workflow-runs.tool.js';
import { githubGetWorkflowRunTool } from '@/mcp-server/tools/definitions/github-get-workflow-run.tool.js';
import { githubRerunWorkflowTool } from '@/mcp-server/tools/definitions/github-rerun-workflow.tool.js';
import { githubDispatchWorkflowTool } from '@/mcp-server/tools/definitions/github-dispatch-workflow.tool.js';

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
