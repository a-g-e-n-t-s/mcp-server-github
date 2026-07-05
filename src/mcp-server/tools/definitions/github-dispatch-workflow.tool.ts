import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_dispatch_workflow';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  workflow_id: z.union([z.string(), z.number()]).describe('Workflow ID or filename'),
  ref: z.string().describe('Branch or tag to run the workflow on'),
  inputs: z
    .record(z.string(), z.string())
    .optional()
    .describe('Workflow input parameters'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.dispatchWorkflow(input);
}

export const githubDispatchWorkflowTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Dispatch Workflow',
  description:
    'Trigger a workflow_dispatch event to manually run a workflow. Requires the workflow to have on: workflow_dispatch configured.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
