import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';

const TOOL_NAME = 'github_list_releases';

const InputSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  per_page: z.number().optional().describe('Results per page'),
  page: z.number().optional().describe('Page number'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  total_count: z.number(),
  releases: z.array(
    z.object({
      id: z.number(),
      tag_name: z.string(),
      name: z.string().nullable(),
      draft: z.boolean(),
      prerelease: z.boolean(),
      html_url: z.string(),
      created_at: z.string(),
      published_at: z.string().nullable(),
    }),
  ),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.listReleases(input);
}

export const githubListReleasesTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'List Releases',
  description: 'List releases for a repository, ordered by most recent first.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
