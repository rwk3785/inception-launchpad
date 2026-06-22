import { notFound } from 'next/navigation';
import { getAgentById, getRelatedAgents } from '@/lib/registry';
import AgentDetailClient from '@/components/AgentDetailClient';

interface AgentDetailPageProps {
  params: { id: string };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const [agent, related] = await Promise.all([
    getAgentById(params.id),
    getRelatedAgents(params.id),
  ]);

  if (!agent) notFound();

  return <AgentDetailClient agent={agent} related={related.slice(0, 3)} />;
}
