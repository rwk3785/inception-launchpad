import Link from 'next/link';
import { getAllAgents, getAgentById, getSubAgents } from '@/lib/registry';
import AgentCard from '@/components/AgentCard';
import MaturityBadge from '@/components/MaturityBadge';

export default async function HomePage() {
  const [orchestrator, subAgents] = await Promise.all([
    getAgentById('orchestrator'),
    getSubAgents(),
  ]);

  return (
    <div>
      {/* Hero section */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
              Brokerage AI Capability Registry
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Inception Launchpad
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-10">
              AI-powered tools to kick-start your brokerage project — from
              stakeholder analysis to test scenarios, all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/agents/orchestrator" className="btn-gold text-base px-8 py-3">
                ⚡ Run Full Inception Package
              </Link>
              <Link href="/agents" className="btn-secondary bg-transparent border-white text-white hover:bg-white/10 text-base px-8 py-3">
                Browse All Agents
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-navy/5 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-3 sm:grid-cols-3 divide-x divide-gray-200">
            <div className="py-5 px-6 text-center">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Available Agents
              </dt>
              <dd className="text-2xl font-bold text-navy">6</dd>
            </div>
            <div className="py-5 px-6 text-center">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Domains
              </dt>
              <dd className="text-2xl font-bold text-navy">3</dd>
            </div>
            <div className="py-5 px-6 text-center">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Avg. Run Time
              </dt>
              <dd className="text-2xl font-bold text-navy">~2 min</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Featured: orchestrator */}
        {orchestrator && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Featured
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-3xl shadow-md">
                    ⚡
                  </div>
                  <div>
                    <MaturityBadge maturity={orchestrator.maturity} size="md" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-navy mb-4">
                  {orchestrator.business_name}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {orchestrator.description}
                </p>
                <Link
                  href="/agents/orchestrator"
                  className="btn-gold text-base px-8 py-3"
                >
                  ⚡ Start Full Inception Package
                </Link>
              </div>

              {/* What's included */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Includes all 5 sub-agents
                </h3>
                <ul className="space-y-3">
                  {subAgents.map((agent) => (
                    <li key={agent.id} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-gold flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800">
                        {agent.business_name}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Or run each agent individually — see below.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Individual sub-agents grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-navy">
                Individual Tools
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Run any sub-agent on its own for targeted outputs.
              </p>
            </div>
            <Link
              href="/agents"
              className="text-sm font-semibold text-navy hover:text-gold transition-colors"
            >
              View all agents →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-navy rounded-2xl p-8 sm:p-12 text-white">
          <h2 className="text-2xl font-bold mb-8 text-center">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Pick your tool',
                body: 'Browse the registry and choose the agent that matches your current need — or run the full package.',
              },
              {
                step: '2',
                title: 'Fill in the form',
                body: 'Answer a few plain-English questions. No technical knowledge required — just describe your project.',
              },
              {
                step: '3',
                title: 'Get your artifact',
                body: 'The AI agent runs in the background and delivers a ready-to-use markdown document within minutes.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white font-bold text-lg">
                  {step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
