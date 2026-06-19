/**
 * GitHub API client stubs.
 * Replace these with real GitHub API calls once the workflow is wired up.
 *
 * Environment variables required (see .env.example):
 *   GITHUB_TOKEN       – personal access token with repo + workflow scope
 *   GITHUB_REPO        – owner/repo e.g. "my-org/inception-agents"
 *   GITHUB_WORKFLOW_ID – workflow file e.g. "run-agent.yml"
 *   GITHUB_DEFAULT_BRANCH – branch to dispatch on, e.g. "main"
 */

export type RunStatus = 'queued' | 'running' | 'complete' | 'failed';

export interface RunResult {
  runId: string;
  agentId: string;
  status: RunStatus;
  startedAt: string;
  completedAt?: string;
  artifactName?: string;
  artifactUrl?: string;
  errorMessage?: string;
}

/**
 * Trigger a GitHub Actions workflow dispatch for an agent run.
 * Returns a synthetic runId that callers can poll against.
 */
export async function triggerAgentRun(
  agentId: string,
  inputs: Record<string, string>
): Promise<string> {
  // STUB: In production, POST to:
  // https://api.github.com/repos/{GITHUB_REPO}/actions/workflows/{GITHUB_WORKFLOW_ID}/dispatches
  // with body: { ref: GITHUB_DEFAULT_BRANCH, inputs: { agent_id: agentId, ...inputs } }
  //
  // Then poll /actions/runs to find the run triggered by this dispatch
  // (GitHub doesn't return the run ID from dispatch directly).

  console.log('[github stub] triggerAgentRun', { agentId, inputs });

  // Return a mock run ID for the scaffold
  const mockRunId = `mock-${agentId}-${Date.now()}`;
  return mockRunId;
}

/**
 * Poll the status of a workflow run.
 */
export async function getRunStatus(runId: string): Promise<RunResult> {
  // STUB: In production, GET:
  // https://api.github.com/repos/{GITHUB_REPO}/actions/runs/{numericRunId}
  // and map conclusion → RunStatus

  console.log('[github stub] getRunStatus', { runId });

  // Mock response: after 3 seconds simulate completion
  const agentId = runId.split('-')[1] ?? 'unknown';

  return {
    runId,
    agentId,
    status: 'complete',
    startedAt: new Date(Date.now() - 5000).toISOString(),
    completedAt: new Date().toISOString(),
    artifactName: 'output.md',
    artifactUrl: `https://github.com/example/inception-agents/actions/runs/${runId}/artifacts`,
  };
}

/**
 * Fetch the text content of a run artifact.
 * In production this downloads the ZIP from GitHub Artifacts API and extracts the file.
 */
export async function getArtifactContent(
  _runId: string,
  _artifactName: string
): Promise<string> {
  // STUB: GitHub artifacts require an authenticated download URL.
  // GET /repos/{GITHUB_REPO}/actions/runs/{runId}/artifacts
  // then GET the archive_download_url and unzip.

  return `# Sample Output

This is a **mock artifact** returned by the scaffold stub.

## What would appear here

Once the GitHub Actions workflow is connected, the real AI-generated artifact will be rendered here as formatted markdown.

### Next Steps
1. Set your \`GITHUB_TOKEN\` in \`.env.local\`
2. Configure \`GITHUB_REPO\` and \`GITHUB_WORKFLOW_ID\`
3. Replace the stubs in \`lib/github.ts\` with real API calls
`;
}
