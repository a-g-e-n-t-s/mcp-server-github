import { z } from 'zod';
import type { ToolDefinition } from '../utils/tool-definition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/tool-handler-factory.js';
import type { GitHubToolDependencies } from '../utils/tool-handler-factory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_list_workflow_runs';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  workflow_id: z.union([z.string(), z.number()]).optional().describe('Workflow ID or filename'),
  branch: z.string().optional().describe('Branch name to filter by'),
  event: z.string().optional().describe('Event type to filter by'),
  status: z
    .enum([
      'completed',
      'action_required',
      'cancelled',
      'failure',
      'neutral',
      'skipped',
      'stale',
      'success',
      'timed_out',
      'in_progress',
      'queued',
      'requested',
      'waiting',
      'pending',
    ])
    .optional()
    .describe('Status to filter by'),
  per_page: z.number().optional().describe('Results per page'),
  page: z.number().optional().describe('Page number'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  total_count: z.number(),
  workflow_runs: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      status: z.string(),
      conclusion: z.string().nullable(),
      branch: z.string(),
      event: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      html_url: z.string(),
      run_number: z.number(),
    }),
  ),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.listWorkflowRuns(input);
}

export const githubListWorkflowRunsTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'List Workflow Runs',
  description:
    'List workflow runs for a repository. Filter by branch, event type, or status.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
