/**
 * @fileoverview GitHub API provider using Octokit.
 */
import { Octokit } from '@octokit/rest';
import { McpError, JsonRpcErrorCode } from '@/types-global/errors.js';
import { config } from '@/config/index.js';
import { logger } from '@/utils/index.js';

export class GitHubProvider {
  private octokit: Octokit;

  constructor() {
    if (!config.githubToken) {
      throw new McpError(
        JsonRpcErrorCode.Unauthorized,
        'GITHUB_PERSONAL_ACCESS_TOKEN is required',
      );
    }

    this.octokit = new Octokit({
      auth: config.githubToken,
      baseUrl: config.githubHost
        ? `${config.githubHost}/api/v3`
        : config.githubApiUrl,
    });

    logger.info('GitHubProvider initialized');
  }

  get client(): Octokit {
    return this.octokit;
  }

  // ── Pull Requests ───────────────────────────────────────────────────────

  async createPullRequest(params: {
    owner: string;
    repo: string;
    title: string;
    head: string;
    base: string;
    body?: string;
    draft?: boolean;
    maintainer_can_modify?: boolean;
  }) {
    const { data } = await this.octokit.pulls.create(params);
    return {
      success: true,
      number: data.number,
      url: data.url,
      html_url: data.html_url,
      state: data.state,
      title: data.title,
      head: data.head.ref,
      base: data.base.ref,
      draft: data.draft,
    };
  }

  async mergePullRequest(params: {
    owner: string;
    repo: string;
    pull_number: number;
    merge_method?: 'merge' | 'squash' | 'rebase';
    commit_title?: string;
    commit_message?: string;
  }) {
    const { data } = await this.octokit.pulls.merge(params);
    return {
      success: true,
      sha: data.sha,
      message: data.message,
      merged: data.merged,
    };
  }

  async listPullRequests(params: {
    owner: string;
    repo: string;
    state?: 'open' | 'closed' | 'all';
    head?: string;
    base?: string;
    sort?: 'created' | 'updated' | 'popularity' | 'long-running';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }) {
    const { data } = await this.octokit.pulls.list(params);
    return {
      success: true,
      total_count: data.length,
      pull_requests: data.map((pr) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        draft: pr.draft,
        user: pr.user?.login || 'unknown',
        head: pr.head.ref,
        base: pr.base.ref,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        html_url: pr.html_url,
      })),
    };
  }

  async getPullRequest(params: {
    owner: string;
    repo: string;
    pull_number: number;
    include_diff?: boolean;
    include_files?: boolean;
  }) {
    const { data } = await this.octokit.pulls.get({
      owner: params.owner,
      repo: params.repo,
      pull_number: params.pull_number,
    });

    let diff: string | undefined;
    if (params.include_diff) {
      const diffResponse = await this.octokit.pulls.get({
        owner: params.owner,
        repo: params.repo,
        pull_number: params.pull_number,
        mediaType: { format: 'diff' },
      });
      diff = diffResponse.data as unknown as string;
    }

    let files: Array<{ filename: string; status: string; additions: number; deletions: number }> | undefined;
    if (params.include_files) {
      const filesResponse = await this.octokit.pulls.listFiles({
        owner: params.owner,
        repo: params.repo,
        pull_number: params.pull_number,
      });
      files = filesResponse.data.map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
      }));
    }

    return {
      success: true,
      number: data.number,
      title: data.title,
      state: data.state,
      draft: data.draft,
      body: data.body || '',
      user: data.user?.login || 'unknown',
      head: data.head.ref,
      base: data.base.ref,
      html_url: data.html_url,
      mergeable: data.mergeable,
      merged: data.merged,
      comments_count: data.comments,
      review_comments_count: data.review_comments,
      additions: data.additions,
      deletions: data.deletions,
      changed_files: data.changed_files,
      diff,
      files,
    };
  }

  async updatePullRequest(params: {
    owner: string;
    repo: string;
    pull_number: number;
    title?: string;
    body?: string;
    state?: 'open' | 'closed';
    base?: string;
    maintainer_can_modify?: boolean;
  }) {
    const { data } = await this.octokit.pulls.update(params);
    return {
      success: true,
      number: data.number,
      url: data.url,
      html_url: data.html_url,
      title: data.title,
      state: data.state,
    };
  }

  // ── Issues ──────────────────────────────────────────────────────────────

  async createIssue(params: {
    owner: string;
    repo: string;
    title: string;
    body?: string;
    labels?: string[];
    assignees?: string[];
    milestone?: number;
  }) {
    const { data } = await this.octokit.issues.create(params);
    return {
      success: true,
      number: data.number,
      title: data.title,
      state: data.state,
      html_url: data.html_url,
      user: data.user?.login || 'unknown',
    };
  }

  async getIssue(params: { owner: string; repo: string; issue_number: number }) {
    const { data } = await this.octokit.issues.get(params);
    return {
      success: true,
      number: data.number,
      title: data.title,
      state: data.state,
      body: data.body || '',
      html_url: data.html_url,
      user: data.user?.login || 'unknown',
      labels: data.labels.map((l) => (typeof l === 'string' ? l : l.name || '')),
      assignees: data.assignees?.map((a) => a.login) || [],
      created_at: data.created_at,
      updated_at: data.updated_at,
      closed_at: data.closed_at,
      comments: data.comments,
    };
  }

  async listIssues(params: {
    owner: string;
    repo: string;
    state?: 'open' | 'closed' | 'all';
    labels?: string;
    assignee?: string;
    sort?: 'created' | 'updated' | 'comments';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }) {
    const { data } = await this.octokit.issues.listForRepo(params);
    return {
      success: true,
      total_count: data.length,
      issues: data
        .filter((i) => !i.pull_request)
        .map((i) => ({
          number: i.number,
          title: i.title,
          state: i.state,
          user: i.user?.login || 'unknown',
          labels: i.labels.map((l) => (typeof l === 'string' ? l : l.name || '')),
          assignees: i.assignees?.map((a) => a.login) || [],
          created_at: i.created_at,
          updated_at: i.updated_at,
          html_url: i.html_url,
          comments: i.comments,
        })),
    };
  }

  async updateIssue(params: {
    owner: string;
    repo: string;
    issue_number: number;
    title?: string;
    body?: string;
    state?: 'open' | 'closed';
    labels?: string[];
    assignees?: string[];
    milestone?: number | null;
  }) {
    const { data } = await this.octokit.issues.update(params);
    return {
      success: true,
      number: data.number,
      title: data.title,
      state: data.state,
      html_url: data.html_url,
    };
  }

  async createComment(params: {
    owner: string;
    repo: string;
    issue_number: number;
    body: string;
  }) {
    const { data } = await this.octokit.issues.createComment(params);
    return {
      success: true,
      id: data.id,
      html_url: data.html_url,
      body: data.body || '',
      user: data.user?.login || 'unknown',
      created_at: data.created_at,
    };
  }

  // ── Reviews ─────────────────────────────────────────────────────────────

  async createReview(params: {
    owner: string;
    repo: string;
    pull_number: number;
    event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
    body?: string;
  }) {
    const { data } = await this.octokit.pulls.createReview(params);
    return {
      success: true,
      id: data.id,
      state: data.state,
      html_url: data.html_url,
      user: data.user?.login || 'unknown',
    };
  }

  async listReviews(params: {
    owner: string;
    repo: string;
    pull_number: number;
    per_page?: number;
    page?: number;
  }) {
    const { data } = await this.octokit.pulls.listReviews(params);
    return {
      success: true,
      total_count: data.length,
      reviews: data.map((r) => ({
        id: r.id,
        state: r.state,
        body: r.body || '',
        user: r.user?.login || 'unknown',
        submitted_at: r.submitted_at || '',
        html_url: r.html_url,
      })),
    };
  }

  // ── CI / Actions ────────────────────────────────────────────────────────

  async listWorkflowRuns(params: {
    owner: string;
    repo: string;
    workflow_id?: string | number;
    branch?: string;
    event?: string;
    status?: 'completed' | 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'skipped' | 'stale' | 'success' | 'timed_out' | 'in_progress' | 'queued' | 'requested' | 'waiting' | 'pending';
    per_page?: number;
    page?: number;
  }) {
    const { data } = await this.octokit.actions.listWorkflowRunsForRepo(params);
    return {
      success: true,
      total_count: data.total_count,
      workflow_runs: data.workflow_runs.map((r) => ({
        id: r.id,
        name: r.name || '',
        status: r.status || 'unknown',
        conclusion: r.conclusion,
        branch: r.head_branch || '',
        event: r.event,
        created_at: r.created_at,
        updated_at: r.updated_at,
        html_url: r.html_url,
        run_number: r.run_number,
      })),
    };
  }

  async getWorkflowRun(params: {
    owner: string;
    repo: string;
    run_id: number;
  }) {
    const { data } = await this.octokit.actions.getWorkflowRun(params);
    return {
      success: true,
      id: data.id,
      name: data.name || '',
      status: data.status || 'unknown',
      conclusion: data.conclusion,
      branch: data.head_branch || '',
      event: data.event,
      html_url: data.html_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      run_number: data.run_number,
      run_attempt: data.run_attempt || 1,
      head_sha: data.head_sha,
    };
  }

  async rerunWorkflow(params: { owner: string; repo: string; run_id: number }) {
    await this.octokit.actions.reRunWorkflow(params);
    return { success: true, message: `Workflow run ${params.run_id} re-run triggered` };
  }

  async dispatchWorkflow(params: {
    owner: string;
    repo: string;
    workflow_id: string | number;
    ref: string;
    inputs?: Record<string, string>;
  }) {
    await this.octokit.actions.createWorkflowDispatch(params);
    return { success: true, message: `Workflow dispatch triggered for ${params.workflow_id} on ${params.ref}` };
  }

  // ── Releases ────────────────────────────────────────────────────────────

  async createRelease(params: {
    owner: string;
    repo: string;
    tag_name: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
    target_commitish?: string;
    generate_release_notes?: boolean;
  }) {
    const { data } = await this.octokit.repos.createRelease(params);
    return {
      success: true,
      id: data.id,
      tag_name: data.tag_name,
      name: data.name || '',
      html_url: data.html_url,
      draft: data.draft,
      prerelease: data.prerelease,
      created_at: data.created_at,
    };
  }

  async listReleases(params: {
    owner: string;
    repo: string;
    per_page?: number;
    page?: number;
  }) {
    const { data } = await this.octokit.repos.listReleases(params);
    return {
      success: true,
      total_count: data.length,
      releases: data.map((r) => ({
        id: r.id,
        tag_name: r.tag_name,
        name: r.name || '',
        draft: r.draft,
        prerelease: r.prerelease,
        html_url: r.html_url,
        created_at: r.created_at,
        published_at: r.published_at,
      })),
    };
  }

  async getRelease(params: {
    owner: string;
    repo: string;
    release_id?: number;
    tag?: string;
  }) {
    let data;
    if (params.tag) {
      ({ data } = await this.octokit.repos.getReleaseByTag({
        owner: params.owner,
        repo: params.repo,
        tag: params.tag,
      }));
    } else if (params.release_id) {
      ({ data } = await this.octokit.repos.getRelease({
        owner: params.owner,
        repo: params.repo,
        release_id: params.release_id,
      }));
    } else {
      throw new McpError(JsonRpcErrorCode.InvalidParams, 'Either release_id or tag is required');
    }
    return {
      success: true,
      id: data.id,
      tag_name: data.tag_name,
      name: data.name || '',
      body: data.body || '',
      html_url: data.html_url,
      draft: data.draft,
      prerelease: data.prerelease,
      created_at: data.created_at,
      published_at: data.published_at,
      assets: data.assets.map((a) => ({
        name: a.name,
        size: a.size,
        download_url: a.browser_download_url,
      })),
    };
  }

  // ── Repository ──────────────────────────────────────────────────────────

  async getRepo(params: { owner: string; repo: string }) {
    const { data } = await this.octokit.repos.get(params);
    return {
      success: true,
      full_name: data.full_name,
      description: data.description || '',
      html_url: data.html_url,
      default_branch: data.default_branch,
      visibility: data.visibility || (data.private ? 'private' : 'public'),
      language: data.language || '',
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      open_issues_count: data.open_issues_count,
      created_at: data.created_at,
      updated_at: data.updated_at,
      topics: data.topics || [],
    };
  }

  async compareCommits(params: {
    owner: string;
    repo: string;
    base: string;
    head: string;
  }) {
    const { data } = await this.octokit.repos.compareCommits({
      owner: params.owner,
      repo: params.repo,
      base: params.base,
      head: params.head,
    });
    return {
      success: true,
      status: data.status,
      ahead_by: data.ahead_by,
      behind_by: data.behind_by,
      total_commits: data.total_commits,
      html_url: data.html_url,
      commits: data.commits.slice(0, 30).map((c) => ({
        sha: c.sha.substring(0, 7),
        message: c.commit.message.split('\n')[0] || '',
        author: c.commit.author?.name || 'unknown',
        date: c.commit.author?.date || '',
      })),
      files: data.files?.slice(0, 100).map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
      })),
    };
  }

  async searchCode(params: {
    q: string;
    per_page?: number;
    page?: number;
  }) {
    const { data } = await this.octokit.search.code(params);
    return {
      success: true,
      total_count: data.total_count,
      items: data.items.map((item) => ({
        name: item.name,
        path: item.path,
        repository: item.repository.full_name,
        html_url: item.html_url,
        score: item.score,
      })),
    };
  }
}
