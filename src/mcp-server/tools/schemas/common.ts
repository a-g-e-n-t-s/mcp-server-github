/**
 * @fileoverview Shared Zod schemas for GitHub tool definitions.
 * Reduces duplication across tool files by providing common field schemas.
 */
import { z } from 'zod';

export const OwnerSchema = z.string().describe('Repository owner (user or organization)');
export const RepoSchema = z.string().describe('Repository name');
export const IssueNumberSchema = z.number().describe('Issue or pull request number');
export const PullNumberSchema = z.number().describe('Pull request number');

export const PaginationSchema = {
  per_page: z.number().optional().describe('Results per page (max 100)'),
  page: z.number().optional().describe('Page number'),
};
