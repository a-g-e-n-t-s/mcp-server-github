import { z } from 'zod';
import type { ToolDefinition } from '../utils/tool-definition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/tool-handler-factory.js';
import type { GitHubToolDependencies } from '../utils/tool-handler-factory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_compare';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  base: z.string().describe('Base branch/tag/commit'),
  head: z.string().describe('Head branch/tag/commit'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  status: z.string(),
  ahead_by: z.number(),
  behind_by: z.number(),
  total_commits: z.number(),
  html_url: z.string(),
  commits: z.array(
    z.object({
      sha: z.string(),
      message: z.string(),
      author: z.string(),
      date: z.string(),
    }),
  ),
  files: z
    .array(
      z.object({
        filename: z.string(),
        status: z.string(),
        additions: z.number(),
        deletions: z.number(),
      }),
    )
    .optional(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.compareCommits(input);
}

export const githubCompareTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Compare Commits',
  description:
    'Compare two branches, tags, or commits. Shows ahead/behind counts, commits, and changed files.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
