/**
 * @fileoverview Type definitions for GitHub service operations.
 * Provides typed interfaces for all GitHubProvider method params and returns.
 */

// ── Pull Requests ─────────────────────────────────────────────────────────────

export interface CreatePullRequestParams {
  owner: string;
  repo: string;
  title: string;
  head: string;
  base: string;
  body?: string;
  draft?: boolean;
  maintainer_can_modify?: boolean;
}

export interface CreatePullRequestResult {
  success: boolean;
  number: number;
  url: string;
  html_url: string;
  state: string;
  title: string;
  head: string;
  base: string;
  draft: boolean;
}

export interface GetPullRequestParams {
  owner: string;
  repo: string;
  pull_number: number;
  include_diff?: boolean;
  include_files?: boolean;
}

export interface GetPullRequestResult {
  success: boolean;
  number: number;
  title: string;
  state: string;
  draft: boolean;
  body: string;
  user: string;
  head: string;
  base: string;
  html_url: string;
  mergeable: boolean | null;
  merged: boolean;
  comments_count: number;
  review_comments_count: number;
  additions: number;
  deletions: number;
  changed_files: number;
  diff?: string;
  files?: Array<{ filename: string; status: string; additions: number; deletions: number }>;
}

export interface ListPullRequestsParams {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  head?: string;
  base?: string;
  sort?: 'created' | 'updated' | 'popularity' | 'long-running';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ListPullRequestsResult {
  success: boolean;
  total_count: number;
  pull_requests: Array<{
    number: number;
    title: string;
    state: string;
    draft: boolean;
    user: string;
    head: string;
    base: string;
    created_at: string;
    updated_at: string;
    html_url: string;
  }>;
}

export interface MergePullRequestParams {
  owner: string;
  repo: string;
  pull_number: number;
  merge_method?: 'merge' | 'squash' | 'rebase';
  commit_title?: string;
  commit_message?: string;
}

export interface MergePullRequestResult {
  success: boolean;
  sha: string;
  message: string;
  merged: boolean;
}

export interface UpdatePullRequestParams {
  owner: string;
  repo: string;
  pull_number: number;
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  base?: string;
  maintainer_can_modify?: boolean;
}

export interface UpdatePullRequestResult {
  success: boolean;
  number: number;
  url: string;
  html_url: string;
  title: string;
  state: string;
}

// ── Issues ────────────────────────────────────────────────────────────────────

export interface CreateIssueParams {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
  milestone?: number;
}

export interface CreateIssueResult {
  success: boolean;
  number: number;
  title: string;
  state: string;
  html_url: string;
  user: string;
}

export interface GetIssueParams {
  owner: string;
  repo: string;
  issue_number: number;
}

export interface GetIssueResult {
  success: boolean;
  number: number;
  title: string;
  state: string;
  body: string;
  html_url: string;
  user: string;
  labels: string[];
  assignees: string[];
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  comments: number;
}

export interface ListIssuesParams {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  labels?: string;
  assignee?: string;
  sort?: 'created' | 'updated' | 'comments';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ListIssuesResult {
  success: boolean;
  total_count: number;
  issues: Array<{
    number: number;
    title: string;
    state: string;
    user: string;
    labels: string[];
    assignees: string[];
    created_at: string;
    updated_at: string;
    html_url: string;
    comments: number;
  }>;
}

export interface UpdateIssueParams {
  owner: string;
  repo: string;
  issue_number: number;
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  labels?: string[];
  assignees?: string[];
  milestone?: number | null;
}

export interface UpdateIssueResult {
  success: boolean;
  number: number;
  title: string;
  state: string;
  html_url: string;
}

export interface CreateCommentParams {
  owner: string;
  repo: string;
  issue_number: number;
  body: string;
}

export interface CreateCommentResult {
  success: boolean;
  id: number;
  html_url: string;
  body: string;
  user: string;
  created_at: string;
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface CreateReviewParams {
  owner: string;
  repo: string;
  pull_number: number;
  event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
  body?: string;
}

export interface CreateReviewResult {
  success: boolean;
  id: number;
  state: string;
  html_url: string;
  user: string;
}

export interface ListReviewsParams {
  owner: string;
  repo: string;
  pull_number: number;
  per_page?: number;
  page?: number;
}

export interface ListReviewsResult {
  success: boolean;
  total_count: number;
  reviews: Array<{
    id: number;
    state: string;
    body: string;
    user: string;
    submitted_at: string;
    html_url: string;
  }>;
}

// ── CI / Actions ──────────────────────────────────────────────────────────────

export interface ListWorkflowRunsParams {
  owner: string;
  repo: string;
  workflow_id?: string | number;
  branch?: string;
  event?: string;
  status?: string;
  per_page?: number;
  page?: number;
}

export interface ListWorkflowRunsResult {
  success: boolean;
  total_count: number;
  workflow_runs: Array<{
    id: number;
    name: string;
    status: string;
    conclusion: string | null;
    branch: string;
    event: string;
    created_at: string;
    updated_at: string;
    html_url: string;
    run_number: number;
  }>;
}

export interface GetWorkflowRunParams {
  owner: string;
  repo: string;
  run_id: number;
}

export interface GetWorkflowRunResult {
  success: boolean;
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  branch: string;
  event: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_number: number;
  run_attempt: number;
  head_sha: string;
}

export interface RerunWorkflowParams {
  owner: string;
  repo: string;
  run_id: number;
}

export interface RerunWorkflowResult {
  success: boolean;
  message: string;
}

export interface DispatchWorkflowParams {
  owner: string;
  repo: string;
  workflow_id: string | number;
  ref: string;
  inputs?: Record<string, string>;
}

export interface DispatchWorkflowResult {
  success: boolean;
  message: string;
}

// ── Releases ──────────────────────────────────────────────────────────────────

export interface CreateReleaseParams {
  owner: string;
  repo: string;
  tag_name: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  target_commitish?: string;
  generate_release_notes?: boolean;
}

export interface CreateReleaseResult {
  success: boolean;
  id: number;
  tag_name: string;
  name: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
}

export interface ListReleasesParams {
  owner: string;
  repo: string;
  per_page?: number;
  page?: number;
}

export interface ListReleasesResult {
  success: boolean;
  total_count: number;
  releases: Array<{
    id: number;
    tag_name: string;
    name: string;
    draft: boolean;
    prerelease: boolean;
    html_url: string;
    created_at: string;
    published_at: string | null;
  }>;
}

export interface GetReleaseParams {
  owner: string;
  repo: string;
  release_id?: number;
  tag?: string;
}

export interface GetReleaseResult {
  success: boolean;
  id: number;
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  assets: Array<{ name: string; size: number; download_url: string }>;
}

// ── Repository ────────────────────────────────────────────────────────────────

export interface GetRepoParams {
  owner: string;
  repo: string;
}

export interface GetRepoResult {
  success: boolean;
  full_name: string;
  description: string;
  html_url: string;
  default_branch: string;
  visibility: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string | null;
  updated_at: string | null;
  topics: string[];
}

export interface CompareCommitsParams {
  owner: string;
  repo: string;
  base: string;
  head: string;
}

export interface CompareCommitsResult {
  success: boolean;
  status: string;
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  html_url: string;
  commits: Array<{ sha: string; message: string; author: string; date: string }>;
  files?: Array<{ filename: string; status: string; additions: number; deletions: number }>;
}

export interface SearchCodeParams {
  q: string;
  per_page?: number;
  page?: number;
}

export interface SearchCodeResult {
  success: boolean;
  total_count: number;
  items: Array<{
    name: string;
    path: string;
    repository: string;
    html_url: string;
    score: number;
  }>;
}
