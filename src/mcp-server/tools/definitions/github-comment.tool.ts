/**
 * ----------------------------------------------------------------------------------------------------
 * github-comment.tool.ts
 * ----------------------------------------------------------------------------------------------------
 */

import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';

const TOOL_NAME = 'github_comment';

const InputSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  issue_number: z.number().describe('Issue or pull request number'),
  body: z.string().describe('Comment body'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  id: z.number(),
  html_url: z.string(),
  body: z.string(),
  user: z.string(),
  created_at: z.string(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.createComment(input);
}

export const githubCommentTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Create Comment',
  description: 'Create a comment on an issue or pull request. Works for both issues and PRs using the issue number.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
