import { z } from 'zod';
import type { ToolDefinition } from '../utils/tool-definition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/tool-handler-factory.js';
import type { GitHubToolDependencies } from '../utils/tool-handler-factory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_create_issue';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  title: z.string().describe('Issue title'),
  body: z.string().optional().describe('Issue body/description'),
  labels: z.array(z.string()).optional().describe('Labels to apply'),
  assignees: z.array(z.string()).optional().describe('Usernames to assign'),
  milestone: z.number().optional().describe('Milestone number to associate'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  number: z.number(),
  title: z.string(),
  state: z.string(),
  html_url: z.string(),
  user: z.string(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.createIssue(input);
}

export const githubCreateIssueTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Create Issue',
  description: 'Create a new issue in a GitHub repository.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
