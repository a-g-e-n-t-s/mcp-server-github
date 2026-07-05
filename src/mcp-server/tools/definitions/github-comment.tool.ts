/**
 * ----------------------------------------------------------------------------------------------------
 * github-comment.tool.ts
 * ----------------------------------------------------------------------------------------------------
 */

import { z } from 'zod';
import type { ToolDefinition } from '../utils/tool-definition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/tool-handler-factory.js';
import type { GitHubToolDependencies } from '../utils/tool-handler-factory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_comment';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
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
