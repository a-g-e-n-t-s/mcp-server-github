import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';

const TOOL_NAME = 'github_get_workflow_run';

const InputSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  run_id: z.number().describe('Workflow run ID'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  id: z.number(),
  name: z.string(),
  status: z.string(),
  conclusion: z.string().nullable(),
  branch: z.string(),
  event: z.string(),
  html_url: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  run_number: z.number(),
  run_attempt: z.number(),
  head_sha: z.string(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.getWorkflowRun(input);
}

export const githubGetWorkflowRunTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Get Workflow Run',
  description:
    'Get details of a specific workflow run including status, conclusion, and timing.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
