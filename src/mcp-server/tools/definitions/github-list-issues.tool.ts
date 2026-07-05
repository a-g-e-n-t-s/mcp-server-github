import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_list_issues';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  state: z.enum(['open', 'closed', 'all']).optional().describe('Filter by state'),
  labels: z.string().optional().describe('Comma-separated list of label names'),
  assignee: z.string().optional().describe('Filter by assignee username'),
  sort: z.enum(['created', 'updated', 'comments']).optional().describe('Sort field'),
  direction: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
  per_page: z.number().optional().describe('Results per page'),
  page: z.number().optional().describe('Page number'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  total_count: z.number(),
  issues: z.array(z.object({
    number: z.number(),
    title: z.string(),
    state: z.string(),
    user: z.string(),
    labels: z.array(z.string()),
    assignees: z.array(z.string()),
    created_at: z.string(),
    updated_at: z.string(),
    html_url: z.string(),
    comments: z.number(),
  })),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.listIssues(input);
}

export const githubListIssuesTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'List Issues',
  description: 'List issues in a GitHub repository with optional filters.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
