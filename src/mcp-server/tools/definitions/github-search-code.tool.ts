import { z } from 'zod';
import type { ToolDefinition } from '../utils/tool-definition.js';
import { createGitHubToolHandler, createJsonFormatter } from '../utils/tool-handler-factory.js';
import type { GitHubToolDependencies } from '../utils/tool-handler-factory.js';


const TOOL_NAME = 'github_search_code';

const InputSchema = z.object({
  q: z.string().describe('Search query with optional qualifiers'),
  per_page: z.number().optional().describe('Results per page'),
  page: z.number().optional().describe('Page number'),
});

const OutputSchema = z.object({
  success: z.boolean(),
  total_count: z.number(),
  items: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
      repository: z.string(),
      html_url: z.string(),
      score: z.number(),
    }),
  ),
});

type ToolInput = z.infer<typeof InputSchema>;
type ToolOutput = z.infer<typeof OutputSchema>;

async function logic(input: ToolInput, { provider }: GitHubToolDependencies): Promise<ToolOutput> {
  return provider.searchCode(input);
}

export const githubSearchCodeTool: ToolDefinition<typeof InputSchema, typeof OutputSchema> = {
  name: TOOL_NAME,
  title: 'Search Code',
  description:
    "Search for code across GitHub repositories. Use qualifiers in the query like 'repo:owner/name', 'language:typescript', 'path:src/'.",
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  logic: createGitHubToolHandler(logic),
  responseFormatter: createJsonFormatter<ToolOutput>(),
};
