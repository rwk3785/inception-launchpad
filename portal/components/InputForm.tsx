'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Agent, AgentInput } from '@/lib/registry';

interface InputFormProps {
  agent: Agent;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: AgentInput;
  value: string;
  onChange: (val: string) => void;
}) {
  if (field.type === 'textarea') {
    return (
      <textarea
        id={field.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        rows={4}
        className="input-field resize-y"
      />
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <select
        id={field.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        className="input-field"
      >
        <option value="">Select an option…</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      id={field.id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className="input-field"
    />
  );
}

type FormState = 'idle' | 'submitting' | 'error';

export default function InputForm({ agent }: InputFormProps) {
  const router = useRouter();

  const initialValues = Object.fromEntries(
    agent.inputs.map((f) => [f.id, ''])
  );
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const primaryOutput = agent.outputs[0];
  const submitLabel = primaryOutput
    ? `Generate ${primaryOutput.label}`
    : 'Run Agent';

  function handleChange(fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id, inputs: values }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      router.push(`/run/${data.runId}`);
    } catch (err) {
      setFormState('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {agent.inputs.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="label">
            {field.label}
            {field.required && (
              <span className="text-red-500 ml-1" aria-hidden>
                *
              </span>
            )}
          </label>
          <p className="text-xs text-gray-500 mb-1.5">{field.description}</p>
          <FieldInput
            field={field}
            value={values[field.id] ?? ''}
            onChange={(val) => handleChange(field.id, val)}
          />
        </div>
      ))}

      {errorMessage && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="btn-primary w-full justify-center py-3 text-base"
      >
        {formState === 'submitting' ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
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
            Submitting…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
