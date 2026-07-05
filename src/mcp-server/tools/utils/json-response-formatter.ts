/**
 * @fileoverview JSON response formatter with configurable verbosity levels.
 * Provides structured JSON output for LLM-optimized tool responses.
 */
import type { ContentBlock } from '@modelcontextprotocol/sdk/types.js';

export type VerbosityLevel = 'minimal' | 'standard' | 'full';

export interface JsonFormatterOptions<T = unknown> {
  verbosity?: VerbosityLevel;
  filter?: (data: T, level: VerbosityLevel) => Partial<T> | T;
  prettyPrint?: boolean;
}

/**
 * Create a JSON response formatter with optional verbosity filtering.
 *
 * Usage:
 * ```typescript
 * const formatter = createJsonFormatter<ToolOutput>({
 *   filter: (result, level) => {
 *     if (level === 'minimal') return { success: result.success };
 *     return result;
 *   },
 * });
 * ```
 */
export function createJsonFormatter<T>(
  options?: JsonFormatterOptions<T>,
): (result: T) => ContentBlock[] {
  const { verbosity = 'standard', filter, prettyPrint = true } = options ?? {};

  return (result: T): ContentBlock[] => {
    const data = filter ? filter(result, verbosity) : result;
    const text = prettyPrint
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);

    return [{ type: 'text', text }];
  };
}
