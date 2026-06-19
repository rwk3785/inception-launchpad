'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ArtifactViewerProps {
  content: string;
  filename: string;
  githubUrl?: string;
}

export default function ArtifactViewer({
  content,
  filename,
  githubUrl,
}: ArtifactViewerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy text-sm">
            📄
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{filename}</p>
            <p className="text-xs text-gray-400">Artifact output</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Open in GitHub ↗
            </a>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="btn-primary text-xs py-1.5 px-3"
          >
            {expanded ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Expandable markdown preview */}
      {expanded && (
        <div className="p-6 prose prose-sm prose-headings:text-navy prose-a:text-navy max-w-none overflow-auto max-h-[600px]">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
