import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_update_issue';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  issue_number: z.number().describe('Issue number to update'),
  title: z.string().optional().describe('New title'),
  body: z.string().optional().describe('New body/description'),
  state: z.enum(['open', 'closed']).optional().describe('New state'),
  labels: z.array(z.string()).optional().describe('Labels to set'),
  assignees: z.array(z.string()).optional().describe('Usernames to assign'),
  milestone: z.number().nullable().optional().describe('Milestone number or null to clear'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  number: z.number(),
  title: z.string(),
  state: z.string(),
  html_url: z.string(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.updateIssue(input);
}

export const githubUpdateIssueTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Update Issue',
  description: 'Update an existing issue in a GitHub repository.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
