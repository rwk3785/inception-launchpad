/**
 * GitHub API client.
 *
 * Environment variables required (see .env.example):
 *   GITHUB_TOKEN          – personal access token with repo + actions scope
 *   GITHUB_REPO_OWNER     – e.g. "rwk3785"
 *   GITHUB_REPO_NAME      – e.g. "inception-launchpad"
 *   NEXT_PUBLIC_GITHUB_REPO – e.g. "rwk3785/inception-launchpad" (for display links)
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER ?? 'rwk3785';
const REPO_NAME = process.env.GITHUB_REPO_NAME ?? 'inception-launchpad';
const BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

export type RunStatus = 'queued' | 'in_progress' | 'completed';
export type RunConclusion = 'success' | 'failure' | null;

export interface RunResult {
  runId: string;
  agentId: string;
  status: RunStatus;
  conclusion: RunConclusion;
  startedAt: string;
  completedAt?: string;
  artifactName?: string;
  artifactUrl?: string;
  errorMessage?: string;
}

/**
 * Trigger a GitHub Actions workflow dispatch for an agent run.
 *
 * POST /repos/{owner}/{repo}/actions/workflows/{workflowFile}/dispatches
 *
 * After dispatching, waits 2 seconds then fetches the latest run to get its ID.
 * Returns the numeric run ID as a string.
 */
export async function triggerAgentRun(
  agentId: string,
  workflowFile: string,
  inputs: Record<string, string>
): Promise<string> {
  if (!GITHUB_TOKEN) {
    throw new Error(
      'GITHUB_TOKEN is not set. Cannot trigger workflow dispatch.'
    );
  }

  const dispatchUrl = `${BASE_URL}/actions/workflows/${encodeURIComponent(workflowFile)}/dispatches`;

  const dispatchRes = await fetch(dispatchUrl, {
    method: 'POST',
    headers: githubHeaders(),
    body: JSON.stringify({
      ref: 'main',
      inputs: { agent_id: agentId, ...inputs },
    }),
  });

  if (!dispatchRes.ok) {
    const body = await dispatchRes.text().catch(() => '');
    throw new Error(
      `GitHub workflow dispatch failed: ${dispatchRes.status} ${dispatchRes.statusText}. ${body}`
    );
  }

  // GitHub does not return the run ID from the dispatch endpoint.
  // Wait briefly so the run has time to appear in the runs list.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Fetch the most recently created run for this workflow.
  const runsUrl = `${BASE_URL}/actions/workflows/${encodeURIComponent(workflowFile)}/runs?per_page=1`;
  const runsRes = await fetch(runsUrl, { headers: githubHeaders() });

  if (!runsRes.ok) {
    const body = await runsRes.text().catch(() => '');
    throw new Error(
      `Failed to fetch workflow runs: ${runsRes.status} ${runsRes.statusText}. ${body}`
    );
  }

  const runsData = (await runsRes.json()) as {
    workflow_runs: Array<{ id: number }>;
  };

  const runId = runsData.workflow_runs[0]?.id;
  if (!runId) {
    throw new Error('No workflow runs found after dispatch.');
  }

  return String(runId);
}

/**
 * Poll the status of a workflow run.
 *
 * GET /repos/{owner}/{repo}/actions/runs/{runId}
 */
export async function getRunStatus(runId: string): Promise<RunResult> {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not set. Cannot fetch run status.');
  }

  const url = `${BASE_URL}/actions/runs/${encodeURIComponent(runId)}`;
  const res = await fetch(url, {
    headers: githubHeaders(),
    // Do not cache status polls — always fetch fresh data.
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Failed to fetch run status for run ${runId}: ${res.status} ${res.statusText}. ${body}`
    );
  }

  const data = (await res.json()) as {
    id: number;
    status: string;
    conclusion: string | null;
    created_at: string;
    updated_at: string;
    name: string;
    html_url: string;
  };

  const status = (data.status ?? 'queued') as RunStatus;
  const conclusion = (data.conclusion ?? null) as RunConclusion;

  return {
    runId,
    agentId: data.name ?? '',
    status,
    conclusion,
    startedAt: data.created_at,
    completedAt: status === 'completed' ? data.updated_at : undefined,
    artifactUrl: data.html_url,
    errorMessage:
      status === 'completed' && conclusion === 'failure'
        ? `Workflow run ${runId} failed. View logs at ${data.html_url}`
        : undefined,
  };
}

/**
 * Fetch the text content of a file from the repo via the Contents API.
 *
 * artifactPath — repo-relative path, e.g. "docs/inception/PRFAQ.md"
 *
 * GET /repos/{owner}/{repo}/contents/{artifactPath}
 * Decodes the base64 `content` field and returns the raw string.
 */
export async function getArtifactContent(artifactPath: string): Promise<string> {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not set. Cannot fetch artifact content.');
  }

  const url = `${BASE_URL}/contents/${artifactPath}`;
  const res = await fetch(url, {
    headers: githubHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Failed to fetch artifact "${artifactPath}": ${res.status} ${res.statusText}. ${body}`
    );
  }

  const data = (await res.json()) as { content: string; encoding: string };

  if (data.encoding !== 'base64') {
    throw new Error(
      `Unexpected encoding "${data.encoding}" for artifact "${artifactPath}".`
    );
  }

  return Buffer.from(data.content, 'base64').toString('utf-8');
}
