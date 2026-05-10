import React from 'react';
import { MODELO_CONFIG } from './mocks/onboardingCasesV4Mock';

export default function ModeloBadge({ modelo }) {
  const config = MODELO_CONFIG[modelo] || { label: modelo, color: '#94A3B8' };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border"
      style={{
        color: config.color,
        borderColor: `${config.color}40`,
        background: `${config.color}10`,
      }}
    >
      {config.label}
    </span>
  );
}