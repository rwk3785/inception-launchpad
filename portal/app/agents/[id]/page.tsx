'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAgentById, getRelatedAgents } from '@/lib/registry';
import MaturityBadge from '@/components/MaturityBadge';
import InputForm from '@/components/InputForm';
import AgentCard from '@/components/AgentCard';

interface AgentDetailPageProps {
  params: { id: string };
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const agent = getAgentById(params.id);

  if (!agent) {
    notFound();
  }

  const related = getRelatedAgents(agent.id).slice(0, 3);
  const [formVisible, setFormVisible] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-navy transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/agents" className="hover:text-navy transition-colors">
          Agents
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{agent.business_name}</span>
      </nav>

      {/* Agent header */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <MaturityBadge maturity={agent.maturity} size="md" />
          {agent.domain.map((d) => (
            <span
              key={d}
              className="rounded-md bg-navy/10 px-2.5 py-1 text-xs font-medium text-navy"
            >
              {d}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
          {agent.business_name}
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed">
          {agent.description}
        </p>

        <p className="mt-3 text-sm text-gray-400">
          Owned by{' '}
          <span className="text-gray-600 font-medium">{agent.owner}</span>
        </p>
      </div>

      {/* What you'll need + What you'll get — two-column */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            What you&apos;ll need
          </h2>
          <ul className="space-y-3">
            {agent.inputs.map((input) => (
              <li key={input.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy text-xs font-bold">
                  {input.required ? '✓' : '?'}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {input.label}
                    {!input.required && (
                      <span className="ml-1.5 text-xs text-gray-400">
                        (optional)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {input.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Outputs */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            What you&apos;ll get
          </h2>
          <ul className="space-y-4">
            {agent.outputs.map((output) => (
              <li key={output.id}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gold text-base">📄</span>
                  <p className="text-sm font-semibold text-gray-800">
                    {output.label}
                  </p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pl-6">
                  {output.description}
                </p>
                <p className="text-xs font-mono text-navy/60 mt-1 pl-6">
                  {output.artifact}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA / Form section */}
      <div className="card overflow-hidden">
        {/* Toggle header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-navy">
                Use This Tool
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Fill out the form below to generate your artifact.
              </p>
            </div>
            <button
              onClick={() => setFormVisible((v) => !v)}
              className={formVisible ? 'btn-secondary' : 'btn-primary'}
            >
              {formVisible ? 'Close Form' : 'Use This Tool →'}
            </button>
          </div>
        </div>

        {/* Collapsible form */}
        {formVisible && (
          <div className="p-6">
            <InputForm agent={agent} />
          </div>
        )}
      </div>

      {/* Related agents */}
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-navy mb-5">Related Agents</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((rel) => (
              <AgentCard key={rel.id} agent={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
