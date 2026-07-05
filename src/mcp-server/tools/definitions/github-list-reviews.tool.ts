import { z } from 'zod';
import type { ToolDefinition } from '../utils/tool-definition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/tool-handler-factory.js';
import type { GitHubToolDependencies } from '../utils/tool-handler-factory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_list_reviews';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  pull_number: z.number().describe('Pull request number'),
  per_page: z.number().optional().describe('Results per page'),
  page: z.number().optional().describe('Page number'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  total_count: z.number(),
  reviews: z.array(z.object({
    id: z.number(),
    state: z.string(),
    body: z.string(),
    user: z.string(),
    submitted_at: z.string(),
    html_url: z.string(),
  })),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.listReviews(input);
}

export const githubListReviewsTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'List Reviews',
  description: 'List reviews on a pull request.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
