import React from 'react';

/**
 * V9TabSwitcher — Pulse VF · Segmented V9.
 * Padrão pill flutuante com indicador ativo gradient mint + glow.
 * Substitui shadcn TabsList por algo idêntico aos protótipos VF.
 */
export default function V9TabSwitcher({ value, onChange, options = [] }) {
  return (
    <div
      className="relative inline-flex items-center"
      style={{
        padding: 4,
        background: 'linear-gradient(135deg, #001124, #002443)',
        borderRadius: 14,
        border: '1px solid rgba(92,247,207,0.18)',
        boxShadow: '0 8px 24px -8px rgba(0,17,36,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        gap: 2,
      }}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="relative inline-flex items-center gap-2 transition-all"
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              border: 0,
              cursor: 'pointer',
              background: active
                ? 'linear-gradient(135deg, #5CF7CF, #00C194)'
                : 'transparent',
              color: active ? '#001124' : 'rgba(255,255,255,0.65)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              fontWeight: active ? 800 : 700,
              letterSpacing: '0.02em',
              boxShadow: active
                ? '0 6px 16px -3px rgba(92,247,207,0.5), inset 0 1px 0 rgba(255,255,255,0.4)'
                : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {Icon && <Icon weight={active ? 'fill' : 'duotone'} size={14} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}