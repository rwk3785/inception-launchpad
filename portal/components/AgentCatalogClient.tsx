'use client';

import { useState, useMemo } from 'react';
import AgentCard from '@/components/AgentCard';
import type { Agent, Maturity } from '@/lib/registry';

const ALL_DOMAINS = ['Product Management', 'Strategy', 'Quality Assurance'];
const ALL_MATURITIES: Maturity[] = ['experimental', 'pilot', 'production'];
const MATURITY_LABELS: Record<Maturity, string> = {
  experimental: 'Experimental',
  pilot: 'Pilot',
  production: 'Production',
};

export default function AgentCatalogClient({ agents }: { agents: Agent[] }) {
  const [query, setQuery] = useState('');
  const [activeDomains, setActiveDomains] = useState<Set<string>>(new Set());
  const [activeMaturities, setActiveMaturities] = useState<Set<Maturity>>(new Set());

  function toggleDomain(domain: string) {
    setActiveDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain); else next.add(domain);
      return next;
    });
  }

  function toggleMaturity(m: Maturity) {
    setActiveMaturities((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m); else next.add(m);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return agents.filter((agent) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || agent.business_name.toLowerCase().includes(q) || agent.description.toLowerCase().includes(q);
      const matchesDomain = activeDomains.size === 0 || agent.domain.some((d) => activeDomains.has(d));
      const matchesMaturity = activeMaturities.size === 0 || activeMaturities.has(agent.maturity);
      return matchesQuery && matchesDomain && matchesMaturity;
    });
  }, [agents, query, activeDomains, activeMaturities]);

  const hasFilters = query !== '' || activeDomains.size > 0 || activeMaturities.size > 0;

  function clearFilters() {
    setQuery('');
    setActiveDomains(new Set());
    setActiveMaturities(new Set());
  }

  return (
    <div>
      <div className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-2">AI Agent Catalog</h1>
          <p className="text-white/70">Discover and run AI agents designed for brokerage inception work.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 space-y-4">
          <div className="relative max-w-lg">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">🔍</span>
            <input type="search" placeholder="Search agents…" value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-9" />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">Domain:</span>
            {ALL_DOMAINS.map((domain) => (
              <button key={domain} onClick={() => toggleDomain(domain)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${activeDomains.has(domain) ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-gray-300 hover:border-navy hover:text-navy'}`}>
                {domain}
              </button>
            ))}
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-3 mr-1">Maturity:</span>
            {ALL_MATURITIES.map((m) => (
              <button key={m} onClick={() => toggleMaturity(m)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${activeMaturities.has(m) ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-gray-300 hover:border-navy hover:text-navy'}`}>
                {MATURITY_LABELS[m]}
              </button>
            ))}
            {hasFilters && (
              <button onClick={clearFilters} className="ml-2 text-xs text-gray-400 underline hover:text-gray-600 transition-colors">Clear all</button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-800">{filtered.length}</span> of {agents.length} agents</p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-gray-500 font-medium">No agents match your filters.</p>
            <button onClick={clearFilters} className="mt-4 text-sm text-navy underline hover:text-gold">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
