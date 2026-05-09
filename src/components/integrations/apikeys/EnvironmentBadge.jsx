import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ENVS = {
  production: { label: 'PROD', cls: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' },
  sandbox: { label: 'SANDBOX', cls: 'bg-yellow-500/15 text-yellow-700 border-yellow-500/30' },
  test: { label: 'TEST', cls: 'bg-blue-500/15 text-blue-700 border-blue-500/30' },
  staging: { label: 'STAGING', cls: 'bg-violet-500/15 text-violet-700 border-violet-500/30' },
};

export default function EnvironmentBadge({ env = 'production', className }) {
  const cfg = ENVS[env] || ENVS.production;
  return (
    <Badge variant="outline" className={cn('text-[10px] font-mono font-bold', cfg.cls, className)}>
      {cfg.label}
    </Badge>
  );
}