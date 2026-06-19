import type { Maturity } from '@/lib/registry';

interface MaturityBadgeProps {
  maturity: Maturity;
  size?: 'sm' | 'md';
}

const config: Record<
  Maturity,
  { label: string; classes: string; dot: string }
> = {
  experimental: {
    label: 'Experimental',
    classes: 'bg-amber-100 text-amber-800 border border-amber-200',
    dot: 'bg-amber-500',
  },
  pilot: {
    label: 'Pilot',
    classes: 'bg-blue-100 text-blue-800 border border-blue-200',
    dot: 'bg-blue-500',
  },
  production: {
    label: 'Production',
    classes: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
};

export default function MaturityBadge({
  maturity,
  size = 'sm',
}: MaturityBadgeProps) {
  const { label, classes, dot } = config[maturity];
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${textSize} ${padding} ${classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
