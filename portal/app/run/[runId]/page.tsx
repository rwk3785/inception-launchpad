'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAgentById, getRelatedAgents } from '@/lib/registry';
import ArtifactViewer from '@/components/ArtifactViewer';
import AgentCard from '@/components/AgentCard';
import type { RunResult, RunStatus } from '@/lib/github';

interface RunPageProps {
  params: { runId: string };
}

const MOCK_CONTENT = `# Stakeholder Impact Map

## Executive Summary

This analysis identifies key stakeholder groups affected by the initiative and provides recommended engagement strategies.

## Stakeholder Groups

| Stakeholder | Impact Level | Influence | Key Concern |
|---|---|---|---|
| Retail Customers | High | Medium | Ease of use, speed |
| Compliance Team | High | High | Regulatory alignment |
| Product Engineering | Medium | High | Technical feasibility |
| Operations | Medium | Medium | Process change |
| Senior Leadership | Low | High | ROI and timeline |

## Recommended Actions

1. **Compliance early** — engage compliance in week 1 to validate approach
2. **Customer research** — run 5 discovery interviews before design begins
3. **Exec sponsor** — align with a senior leader to unblock cross-team decisions

## Risk Flags

- Regulatory sign-off may take 4–6 weeks — build buffer into timeline
- Operations team currently understaffed — plan change management carefully
`;

function StatusPill({ status }: { status: RunStatus }) {
  const config: Record<RunStatus, { label: string; classes: string; icon: string }> = {
    queued: {
      label: 'Queued',
      classes: 'bg-gray-100 text-gray-600 border-gray-200',
      icon: '🕐',
    },
    running: {
      label: 'Running…',
      classes: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: '⚙️',
    },
    complete: {
      label: 'Complete',
      classes: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: '✅',
    },
    failed: {
      label: 'Failed',
      classes: 'bg-red-100 text-red-700 border-red-200',
      icon: '❌',
    },
  };

  const { label, classes, icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${classes}`}
    >
      <span>{icon}</span>
      {label}
    </span>
  );
}

export default function RunStatusPage({ params }: RunPageProps) {
  const { runId } = params;

  // Derive agentId from mock runId format: "mock-{agentId}-{timestamp}"
  const parts = runId.split('-');
  const agentId = parts.length >= 2 ? parts[1] : 'orchestrator';

  const agent = getAgentById(agentId);
  const related = agent ? getRelatedAgents(agentId).slice(0, 3) : [];

  const [status, setStatus] = useState<RunStatus>('running');
  const [result, setResult] = useState<RunResult | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Simulate polling: transition running → complete after 3 seconds
  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(elapsed);

      if (elapsed >= 3 && status === 'running') {
        setStatus('complete');
        setResult({
          runId,
          agentId,
          status: 'complete',
          startedAt: new Date(startTime).toISOString(),
          completedAt: new Date().toISOString(),
          artifactName: agent?.outputs[0]?.artifact ?? 'output.md',
          artifactUrl: `https://github.com/example/inception-agents/actions/runs/${runId}/artifacts`,
        });
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-navy transition-colors">
          Home
        </Link>
        <span>/</span>
        {agent && (
          <>
            <Link
              href={`/agents/${agentId}`}
              className="hover:text-navy transition-colors"
            >
              {agent.business_name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-700 font-medium">Run Result</span>
      </nav>

      {/* Status card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy mb-1">
              {agent?.business_name ?? 'Agent Run'}
            </h1>
            <p className="text-sm text-gray-400 font-mono">Run ID: {runId}</p>
          </div>
          <StatusPill status={status} />
        </div>

        {/* Progress details */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Agent
            </dt>
            <dd className="text-sm font-semibold text-gray-800">
              {agent?.business_name ?? agentId}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Started
            </dt>
            <dd className="text-sm font-semibold text-gray-800">
              {new Date().toLocaleTimeString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Elapsed
            </dt>
            <dd className="text-sm font-semibold text-gray-800">
              {status === 'running'
                ? `${elapsedSeconds}s`
                : result?.completedAt
                ? `${Math.round(
                    (new Date(result.completedAt).getTime() -
                      new Date(result.startedAt).getTime()) /
                      1000
                  )}s`
                : '—'}
            </dd>
          </div>
        </dl>

        {/* Running animation */}
        {status === 'running' && (
          <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 animate-spin text-blue-600 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Agent is running
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  The AI is processing your inputs. This usually takes 1–3
                  minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Failed state */}
        {status === 'failed' && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-semibold text-red-800 mb-1">
              Run failed
            </p>
            <p className="text-xs text-red-600">
              {result?.errorMessage ??
                'An unexpected error occurred. Please try again.'}
            </p>
            {agent && (
              <Link
                href={`/agents/${agentId}`}
                className="mt-3 inline-flex btn-primary text-xs py-1.5 px-3"
              >
                Try again →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Results — shown when complete */}
      {status === 'complete' && result && (
        <>
          <section>
            <h2 className="text-lg font-bold text-navy mb-4">
              Output Artifact
            </h2>
            <ArtifactViewer
              content={MOCK_CONTENT}
              filename={result.artifactName ?? 'output.md'}
              githubUrl={result.artifactUrl}
            />
          </section>

          {/* Run another tool */}
          {related.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-navy">
                  Run another tool
                </h2>
                <Link
                  href="/agents"
                  className="text-sm font-semibold text-navy hover:text-gold transition-colors"
                >
                  Browse all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <AgentCard key={rel.id} agent={rel} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
