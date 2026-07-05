import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_create_review';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  pull_number: z.number().describe('Pull request number'),
  event: z.enum(['APPROVE', 'REQUEST_CHANGES', 'COMMENT']).describe('Review action'),
  body: z.string().optional().describe('Review body/comment'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  id: z.number(),
  state: z.string(),
  html_url: z.string(),
  user: z.string(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.createReview(input);
}

export const githubCreateReviewTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Create Review',
  description: 'Submit a review on a pull request. Can approve, request changes, or leave a comment.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
