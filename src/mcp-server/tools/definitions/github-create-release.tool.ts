import { z } from 'zod';
import type { ToolDefinition } from '../utils/toolDefinition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/toolHandlerFactory.js';
import type { GitHubToolDependencies } from '../utils/toolHandlerFactory.js';
import { OwnerSchema, RepoSchema } from '../schemas/common.js';

const TOOL_NAME = 'github_create_release';

const InputSchema = z.object({
  owner: OwnerSchema,
  repo: RepoSchema,
  tag_name: z.string().describe('Tag name for the release'),
  name: z.string().optional().describe('Release title'),
  body: z.string().optional().describe('Release description'),
  draft: z.boolean().optional().describe('Whether to create as draft'),
  prerelease: z.boolean().optional().describe('Whether to mark as pre-release'),
  target_commitish: z.string().optional().describe('Branch or commit SHA to tag'),
  generate_release_notes: z.boolean().optional().describe('Auto-generate release notes'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  id: z.number(),
  tag_name: z.string(),
  name: z.string().nullable(),
  html_url: z.string(),
  draft: z.boolean(),
  prerelease: z.boolean(),
  created_at: z.string(),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.createRelease(input);
}

export const githubCreateReleaseTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Create Release',
  description:
    'Create a new release for a repository. Can generate release notes automatically.',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
