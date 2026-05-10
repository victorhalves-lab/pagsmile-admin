import React from 'react';
import { ORIGEM_CONFIG } from './mocks/onboardingCasesV4Mock';

export default function OrigemBadge({ origem }) {
  const config = ORIGEM_CONFIG[origem] || { label: origem, icon: '?' };
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
      <span>{config.icon}</span>
      <span className="font-medium">{config.label}</span>
    </span>
  );
}