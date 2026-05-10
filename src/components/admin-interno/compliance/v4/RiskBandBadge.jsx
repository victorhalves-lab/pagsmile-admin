import React from 'react';
import { RISK_BAND_CONFIG } from './mocks/onboardingCasesV4Mock';

export default function RiskBandBadge({ band, score }) {
  if (!band) return <span className="text-xs text-slate-400">—</span>;
  const config = RISK_BAND_CONFIG[band] || { color: '#94A3B8' };
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className="px-2 py-0.5 rounded-md text-xs font-bold text-white"
        style={{ background: config.color }}
      >
        {band}
      </span>
      {score !== undefined && score !== null && (
        <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
          {score}
        </span>
      )}
    </div>
  );
}