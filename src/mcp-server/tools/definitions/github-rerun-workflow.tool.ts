import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_rerun_workflow';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  run_id: z.number().describe('Workflow run ID to re-run'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.rerunWorkflow(input);
}

export const githubRerunWorkflowTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Re-run Workflow',
  description: 'Re-run a failed or completed workflow run.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
