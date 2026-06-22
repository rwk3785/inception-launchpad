import { getAllAgents } from '@/lib/registry';
import AgentCatalogClient from '@/components/AgentCatalogClient';

export default async function AgentCatalogPage() {
  const agents = await getAllAgents();
  return <AgentCatalogClient agents={agents} />;
}
