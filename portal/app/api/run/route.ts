import { NextRequest, NextResponse } from 'next/server';
import { triggerAgentRun } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, inputs } = body as {
      agentId: string;
      inputs: Record<string, string>;
    };

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
        { status: 400 }
      );
    }

    const workflowFile = `run-${agentId}.yml`;
    const runId = await triggerAgentRun(agentId, workflowFile, inputs ?? {});

    return NextResponse.json({ runId }, { status: 202 });
  } catch (err) {
    console.error('[api/run] Error:', err);
    return NextResponse.json(
      { error: 'Failed to trigger agent run' },
      { status: 500 }
    );
  }
}
