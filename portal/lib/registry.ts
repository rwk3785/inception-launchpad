import yaml from 'js-yaml';

export type Maturity = 'experimental' | 'pilot' | 'production';

export interface AgentInput {
  id: string;
  label: string;
  description: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface AgentOutput {
  id: string;
  label: string;
  description: string;
  artifact: string;
}

export interface Agent {
  id: string;
  business_name: string;
  description: string;
  maturity: Maturity;
  domain: string[];
  owner: string;
  inputs: AgentInput[];
  outputs: AgentOutput[];
  related: string[];
}

// ---------------------------------------------------------------------------
// Fallback mock data (used when GitHub API is unavailable, e.g. in local dev)
// ---------------------------------------------------------------------------
const MOCK_AGENTS: Agent[] = [
  {
    id: 'orchestrator',
    business_name: 'Full Inception Package',
    description:
      'Run the complete brokerage inception workflow end-to-end. This orchestrator coordinates all sub-agents — stakeholder analysis, product story, work breakdown, viability check, and test scenarios — producing a full inception artifact bundle in one go.',
    maturity: 'pilot',
    domain: ['Product Management', 'Strategy'],
    owner: 'Platform Engineering',
    inputs: [
      {
        id: 'project_name',
        label: 'Project Name',
        description: 'The working name for your brokerage initiative',
        type: 'text',
        required: true,
        placeholder: 'e.g. Retail Options Onboarding Revamp',
      },
      {
        id: 'problem_statement',
        label: 'Problem Statement',
        description:
          'Describe the problem or opportunity this project addresses in 2–4 sentences',
        type: 'textarea',
        required: true,
        placeholder:
          'e.g. New retail customers drop off during options approval because the process takes 5 days and involves 3 separate DocuSign packets...',
      },
      {
        id: 'target_segment',
        label: 'Target Customer Segment',
        description: 'Which customer group does this primarily serve?',
        type: 'select',
        required: true,
        options: [
          'Retail Investors',
          'Active Traders',
          'Institutional Clients',
          'Financial Advisors',
          'Internal Operations',
        ],
      },
    ],
    outputs: [
      {
        id: 'inception_bundle',
        label: 'Inception Bundle',
        description:
          'ZIP archive containing all inception artifacts: stakeholder map, PR/FAQ, epic list, feasibility report, and test scenario inventory.',
        artifact: 'inception-bundle.zip',
      },
    ],
    related: [
      'stakeholder-analyzer',
      'prfaq-writer',
      'epic-generator',
      'feasibility-analyzer',
      'test-data-identifier',
    ],
  },
  {
    id: 'stakeholder-analyzer',
    business_name: 'Stakeholder Impact Analyzer',
    description:
      'Identifies every stakeholder group touched by a brokerage initiative and generates a structured impact map with influence ratings, communication recommendations, and potential blockers.',
    maturity: 'pilot',
    domain: ['Product Management'],
    owner: 'Platform Engineering',
    inputs: [
      {
        id: 'project_name',
        label: 'Project Name',
        description: 'The working name for your initiative',
        type: 'text',
        required: true,
        placeholder: 'e.g. Options Onboarding Revamp',
      },
      {
        id: 'project_scope',
        label: 'Project Scope',
        description:
          'Brief description of what the project will change or introduce',
        type: 'textarea',
        required: true,
        placeholder:
          'e.g. Replace 3-step DocuSign flow with in-app digital approval for Level 1 options...',
      },
      {
        id: 'business_unit',
        label: 'Primary Business Unit',
        description: 'Which part of the organisation owns this project?',
        type: 'select',
        required: false,
        options: [
          'Retail Brokerage',
          'Wealth Management',
          'Institutional',
          'Technology',
          'Operations',
          'Compliance',
        ],
      },
    ],
    outputs: [
      {
        id: 'stakeholder_map',
        label: 'Stakeholder Impact Map',
        description:
          'Markdown document listing all stakeholder groups with impact level, influence rating, key concerns, and recommended engagement strategy.',
        artifact: 'stakeholder-map.md',
      },
    ],
    related: ['orchestrator', 'prfaq-writer', 'feasibility-analyzer'],
  },
  {
    id: 'prfaq-writer',
    business_name: 'Product Story Generator',
    description:
      'Produces an Amazon-style PR/FAQ document for your brokerage initiative. The output includes a mock press release, customer FAQ, and internal FAQ — helping teams align on value proposition before any code is written.',
    maturity: 'pilot',
    domain: ['Product Management'],
    owner: 'Platform Engineering',
    inputs: [
      {
        id: 'project_name',
        label: 'Project Name',
        description: 'The working name of your initiative',
        type: 'text',
        required: true,
        placeholder: 'e.g. Instant Options Approval',
      },
      {
        id: 'customer_benefit',
        label: 'Primary Customer Benefit',
        description: 'What is the #1 thing customers will celebrate?',
        type: 'textarea',
        required: true,
        placeholder:
          'e.g. Retail customers can get approved for options trading in under 2 minutes without leaving the app...',
      },
      {
        id: 'target_segment',
        label: 'Target Customer Segment',
        description: 'Who is the primary beneficiary?',
        type: 'select',
        required: true,
        options: [
          'Retail Investors',
          'Active Traders',
          'Institutional Clients',
          'Financial Advisors',
          'Internal Operations',
        ],
      },
    ],
    outputs: [
      {
        id: 'prfaq',
        label: 'PR/FAQ Document',
        description:
          'Markdown document with mock press release headline, opening paragraph, customer quotes, customer FAQ (5 questions), and internal FAQ (5 questions).',
        artifact: 'prfaq.md',
      },
    ],
    related: ['orchestrator', 'stakeholder-analyzer', 'epic-generator'],
  },
  {
    id: 'epic-generator',
    business_name: 'Work Breakdown Builder',
    description:
      'Transforms a project description into a structured Jira-ready epic and story hierarchy. Output includes 3–6 epics each with 4–8 user stories, acceptance criteria, and story-point estimates.',
    maturity: 'pilot',
    domain: ['Product Management'],
    owner: 'Platform Engineering',
    inputs: [
      {
        id: 'project_name',
        label: 'Project Name',
        description: 'Name of the initiative to break down',
        type: 'text',
        required: true,
        placeholder: 'e.g. Options Onboarding Revamp',
      },
      {
        id: 'scope_description',
        label: 'Scope Description',
        description:
          'What will be built? Include key features and integrations.',
        type: 'textarea',
        required: true,
        placeholder:
          'e.g. In-app options approval wizard integrating with KYC service, risk engine, and DocuSign replacement...',
      },
      {
        id: 'team_size',
        label: 'Approximate Team Size',
        description: 'How many engineers will work on this?',
        type: 'select',
        required: false,
        options: ['1–2', '3–5', '6–10', '10+'],
      },
    ],
    outputs: [
      {
        id: 'epic_breakdown',
        label: 'Epic & Story Breakdown',
        description:
          'Markdown document with a hierarchy of epics, user stories, acceptance criteria, and story-point estimates ready for import into Jira.',
        artifact: 'epic-breakdown.md',
      },
    ],
    related: ['orchestrator', 'prfaq-writer', 'feasibility-analyzer'],
  },
  {
    id: 'feasibility-analyzer',
    business_name: 'Viability Checker',
    description:
      'Evaluates a brokerage initiative across five dimensions: regulatory feasibility, technical complexity, operational readiness, market timing, and financial viability. Produces a scored report with red/amber/green ratings and a recommended path forward.',
    maturity: 'pilot',
    domain: ['Product Management', 'Strategy'],
    owner: 'Platform Engineering',
    inputs: [
      {
        id: 'project_name',
        label: 'Project Name',
        description: 'Name of the initiative to evaluate',
        type: 'text',
        required: true,
        placeholder: 'e.g. Options Onboarding Revamp',
      },
      {
        id: 'project_description',
        label: 'Project Description',
        description:
          'Describe the initiative in enough detail to assess feasibility (2–5 sentences)',
        type: 'textarea',
        required: true,
        placeholder:
          'e.g. Replace DocuSign-based options approval with an in-app digital workflow. Requires KYC integration and changes to risk-tier assignment logic...',
      },
      {
        id: 'regulatory_region',
        label: 'Regulatory Region',
        description: 'Primary regulatory jurisdiction for this initiative',
        type: 'select',
        required: true,
        options: ['US (FINRA/SEC)', 'UK (FCA)', 'EU (ESMA)', 'APAC', 'Other'],
      },
    ],
    outputs: [
      {
        id: 'feasibility_report',
        label: 'Feasibility Report',
        description:
          'Markdown report with RAG scores across five feasibility dimensions, key risks with mitigations, and a recommended decision (Proceed / Conditional / Halt).',
        artifact: 'feasibility-report.md',
      },
    ],
    related: ['orchestrator', 'stakeholder-analyzer', 'epic-generator'],
  },
  {
    id: 'test-data-identifier',
    business_name: 'Test Scenario Finder',
    description:
      'Analyses a brokerage feature description and generates a comprehensive test scenario inventory covering happy paths, edge cases, regulatory checks, and integration failure modes — ready for QA planning.',
    maturity: 'pilot',
    domain: ['Product Management', 'Quality Assurance'],
    owner: 'Platform Engineering',
    inputs: [
      {
        id: 'feature_description',
        label: 'Feature Description',
        description: 'Describe the feature or user flow to test',
        type: 'textarea',
        required: true,
        placeholder:
          'e.g. In-app options approval wizard: user fills out trading experience form, system calls risk engine, DocuSign replacement signs agreement...',
      },
      {
        id: 'feature_name',
        label: 'Feature Name',
        description: 'Short name for the feature (used in scenario titles)',
        type: 'text',
        required: true,
        placeholder: 'e.g. Options Approval Wizard',
      },
      {
        id: 'test_focus',
        label: 'Test Focus Area',
        description: 'Which area should receive the most attention?',
        type: 'select',
        required: false,
        options: [
          'Happy Path',
          'Edge Cases',
          'Regulatory Compliance',
          'Integration Failures',
          'Performance',
          'All of the above',
        ],
      },
    ],
    outputs: [
      {
        id: 'test_scenarios',
        label: 'Test Scenario Inventory',
        description:
          'Markdown document with categorised test scenarios, each including: scenario title, preconditions, steps, expected result, and test data requirements.',
        artifact: 'test-scenarios.md',
      },
    ],
    related: ['orchestrator', 'epic-generator', 'feasibility-analyzer'],
  },
];

// ---------------------------------------------------------------------------
// GitHub Contents API helpers
// ---------------------------------------------------------------------------
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER ?? 'rwk3785';
const REPO_NAME = process.env.GITHUB_REPO_NAME ?? 'inception-launchpad';
const BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchFileContent(path: string): Promise<string> {
  const url = `${BASE_URL}/contents/${path}`;
  const res = await fetch(url, {
    headers: githubHeaders(),
    // Cache with 60-second revalidation via Next.js fetch cache
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – Next.js extended fetch option
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `GitHub Contents API error for "${path}": ${res.status} ${res.statusText}`
    );
  }

  const data = (await res.json()) as { content: string };
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

// ---------------------------------------------------------------------------
// Index parsing — registry/index.yaml lists agent IDs
// ---------------------------------------------------------------------------
async function fetchAgentIdsFromIndex(): Promise<string[]> {
  const raw = await fetchFileContent('registry/index.yaml');
  const parsed = yaml.load(raw) as { agents: string[] } | string[] | null;

  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.agents)) {
    return parsed.agents;
  }
  throw new Error('Unexpected shape for registry/index.yaml');
}

// ---------------------------------------------------------------------------
// Single-agent manifest parsing
// ---------------------------------------------------------------------------
async function fetchAgentManifest(id: string): Promise<Agent> {
  const raw = await fetchFileContent(`agents/${id}.yaml`);
  const parsed = yaml.load(raw) as Partial<Agent> & { id?: string };

  // Ensure the id field is set (manifest may or may not include it)
  return { id, ...parsed } as Agent;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch all agent manifests from the GitHub repo.
 * Falls back to hardcoded mock data if the API is unavailable.
 */
export async function getAllAgents(): Promise<Agent[]> {
  if (!GITHUB_TOKEN) {
    console.warn('[registry] No GITHUB_TOKEN — using mock agent data');
    return MOCK_AGENTS;
  }

  try {
    const ids = await fetchAgentIdsFromIndex();
    const agents = await Promise.all(ids.map((id) => fetchAgentManifest(id)));
    return agents;
  } catch (err) {
    console.error('[registry] GitHub API error, falling back to mock data:', err);
    return MOCK_AGENTS;
  }
}

/**
 * Fetch a single agent manifest by ID.
 * Falls back to the mock list on error.
 */
export async function getAgentById(id: string): Promise<Agent | null> {
  if (!GITHUB_TOKEN) {
    console.warn('[registry] No GITHUB_TOKEN — using mock agent data');
    return MOCK_AGENTS.find((a) => a.id === id) ?? null;
  }

  try {
    return await fetchAgentManifest(id);
  } catch (err) {
    console.error(`[registry] Failed to fetch agent "${id}", falling back:`, err);
    return MOCK_AGENTS.find((a) => a.id === id) ?? null;
  }
}

/**
 * Return all agents except the orchestrator.
 */
export async function getSubAgents(): Promise<Agent[]> {
  const agents = await getAllAgents();
  return agents.filter((a) => a.id !== 'orchestrator');
}

/**
 * Return agents related to the given agent based on its `related` field.
 */
export async function getRelatedAgents(id: string): Promise<Agent[]> {
  const agent = await getAgentById(id);
  if (!agent || !agent.related?.length) return [];

  const results = await Promise.all(
    agent.related.map((relatedId) => getAgentById(relatedId))
  );
  return results.filter((a): a is Agent => a !== null);
}
