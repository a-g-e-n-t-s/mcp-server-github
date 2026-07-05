import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_get_issue';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  issue_number: z.number().describe('Issue number'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  number: z.number(),
  title: z.string(),
  state: z.string(),
  body: z.string(),
  html_url: z.string(),
  user: z.string(),
  labels: z.array(z.string()),
  assignees: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string().nullable(),
  comments: z.number(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.getIssue(input);
}

export const githubGetIssueTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Get Issue',
  description: 'Get details of a specific issue in a GitHub repository.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
