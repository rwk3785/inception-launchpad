import Link from 'next/link';
import type { Agent } from '@/lib/registry';
import MaturityBadge from './MaturityBadge';

interface AgentCardProps {
  agent: Agent;
  featured?: boolean;
}

export default function AgentCard({ agent, featured = false }: AgentCardProps) {
  if (featured) {
    return (
      <div className="card p-6 border-2 border-gold/40 bg-gradient-to-br from-navy/5 to-gold/5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold text-xl flex-shrink-0">
            ⚡
          </div>
          <MaturityBadge maturity={agent.maturity} size="md" />
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">{agent.business_name}</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {agent.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {agent.domain.map((d) => (
            <span
              key={d}
              className="rounded-md bg-navy/10 px-2.5 py-1 text-xs font-medium text-navy"
            >
              {d}
            </span>
          ))}
        </div>
        <Link href={`/agents/${agent.id}`} className="btn-gold w-full justify-center">
          ⚡ Run Full Inception Package
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-5 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <MaturityBadge maturity={agent.maturity} />
        <div className="flex flex-wrap gap-1 justify-end">
          {agent.domain.slice(0, 1).map((d) => (
            <span
              key={d}
              className="rounded-md bg-surface px-2 py-0.5 text-xs text-gray-500 border border-gray-200"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-base font-bold text-navy mb-2">{agent.business_name}</h3>

      <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
        {agent.description}
      </p>

      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{agent.owner}</span>
          <Link
            href={`/agents/${agent.id}`}
            className="text-sm font-semibold text-navy hover:text-gold transition-colors flex items-center gap-1"
          >
            Use This Tool
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
