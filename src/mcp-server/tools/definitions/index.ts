/**
 * @fileoverview Barrel export for all tool definitions.
 */

// Pull Requests
import { githubCreatePrTool } from './github-create-pr.tool.js';
import { githubGetPrTool } from './github-get-pr.tool.js';
import { githubListPrsTool } from './github-list-prs.tool.js';
import { githubMergePrTool } from './github-merge-pr.tool.js';
import { githubUpdatePrTool } from './github-update-pr.tool.js';

// Issues
import { githubCreateIssueTool } from './github-create-issue.tool.js';
import { githubGetIssueTool } from './github-get-issue.tool.js';
import { githubListIssuesTool } from './github-list-issues.tool.js';
import { githubUpdateIssueTool } from './github-update-issue.tool.js';
import { githubCommentTool } from './github-comment.tool.js';

// Reviews
import { githubCreateReviewTool } from './github-create-review.tool.js';
import { githubListReviewsTool } from './github-list-reviews.tool.js';

// CI / Actions
import { githubListWorkflowRunsTool } from './github-list-workflow-runs.tool.js';
import { githubGetWorkflowRunTool } from './github-get-workflow-run.tool.js';
import { githubRerunWorkflowTool } from './github-rerun-workflow.tool.js';
import { githubDispatchWorkflowTool } from './github-dispatch-workflow.tool.js';

// Releases
import { githubCreateReleaseTool } from './github-create-release.tool.js';
import { githubListReleasesTool } from './github-list-releases.tool.js';
import { githubGetReleaseTool } from './github-get-release.tool.js';

// Repository
import { githubGetRepoTool } from './github-get-repo.tool.js';
import { githubCompareTool } from './github-compare.tool.js';
import { githubSearchCodeTool } from './github-search-code.tool.js';

export const allToolDefinitions = [
  // Pull Requests
  githubCreatePrTool,
  githubGetPrTool,
  githubListPrsTool,
  githubMergePrTool,
  githubUpdatePrTool,
  // Issues
  githubCommentTool,
  githubCreateIssueTool,
  githubGetIssueTool,
  githubListIssuesTool,
  githubUpdateIssueTool,
  // Reviews
  githubCreateReviewTool,
  githubListReviewsTool,
  // CI / Actions
  githubDispatchWorkflowTool,
  githubGetWorkflowRunTool,
  githubListWorkflowRunsTool,
  githubRerunWorkflowTool,
  // Releases
  githubCreateReleaseTool,
  githubGetReleaseTool,
  githubListReleasesTool,
  // Repository
  githubCompareTool,
  githubGetRepoTool,
  githubSearchCodeTool,
];
