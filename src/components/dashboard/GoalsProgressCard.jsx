import React from 'react';
import { Target as TargetIcon, Gear, Trophy } from '@phosphor-icons/react';

/**
 * GoalsProgressCard — Pulse VF.
 * Card branco + icon container deep + progress bar gradient mint→glow.
 */
export default function GoalsProgressCard({ goals = [], onConfigureGoals }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const defaults = [
    { id: 'gmv',      label: 'GMV mensal',       target: 1500000, current: 945000, format: 'currency',   daysLeft: 12 },
    { id: 'approval', label: 'Aprovação',        target: 90,      current: 87.4,   format: 'percent',    daysLeft: 12 },
    { id: 'cb',       label: 'Chargeback ratio', target: 0.5,     current: 0.85,   format: 'percent_inv', daysLeft: 12 },
  ];
  const list = goals.length > 0 ? goals : defaults;

  const formatVal = (val, format) => {
    if (format === 'currency') return fmt(val);
    if (format === 'percent' || format === 'percent_inv') return `${val.toFixed(1)}%`;
    return val;
  };

  return (
    <div
      className="relative h-full overflow-hidden p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #fff, #F0FAF6)',
        border: '1px solid #80E5C6',
        boxShadow: '0 4px 14px -4px rgba(0,193,148,0.12)',
      }}
    >
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #E8EDED, #C0CDCD)',
              color: '#091818',
              border: '1px solid #8FAAAA',
            }}
          >
            <TargetIcon weight="duotone" size={18} />
          </div>
          <div>
            <p
              className="font-mono"
              style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#091818',
              }}
            >
              Metas do mês
            </p>
            <p className="font-mono" style={{ fontSize: 10, color: '#547C9D', fontWeight: 600 }}>
              Restam {list[0]?.daysLeft ?? 12} dias
            </p>
          </div>
        </div>
        <button
          onClick={onConfigureGoals}
          className="inline-flex items-center gap-1.5 transition-all hover:-translate-y-px"
          style={{
            padding: '6px 11px', borderRadius: 8,
            background: '#fff', color: '#007A5C',
            border: '1.5px solid #00C194',
            fontFamily: 'Inter, sans-serif',
            fontSize: 11, fontWeight: 800, cursor: 'pointer',
          }}
        >
          <Gear weight="duotone" size={12} />
          Configurar
        </button>
      </div>

      <div className="space-y-4">
        {list.map((g) => {
          const inverted = g.format === 'percent_inv';
          const pct = inverted
            ? Math.min((g.target / Math.max(g.current, 0.01)) * 100, 100)
            : Math.min((g.current / g.target) * 100, 100);

          const reached = inverted ? g.current <= g.target : g.current >= g.target;
          const onPace = pct >= 50;

          const bar = reached
            ? 'linear-gradient(90deg, #1ECB9D, #007A5C, #5CF7CF)'
            : onPace
              ? 'linear-gradient(90deg, #013766, #002443)'
              : 'linear-gradient(90deg, #FBBF24, #F59E0B)';

          return (
            <div key={g.id}>
              <div className="flex items-center justify-between mb-1.5">
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#001124' }}>
                  {g.label}
                </p>
                <div className="flex items-center gap-1.5">
                  {reached && <Trophy weight="duotone" size={13} style={{ color: '#F59E0B' }} />}
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 12, fontWeight: 800, color: '#001124',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatVal(g.current, g.format)}
                  </span>
                  <span className="font-mono" style={{ fontSize: 10, color: '#8AA5BD', fontVariantNumeric: 'tabular-nums' }}>
                    / {formatVal(g.target, g.format)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: 6, background: '#E0F8F1', borderRadius: 99,
                  overflow: 'hidden', border: '1px solid #B3F0DE',
                }}
              >
                <div
                  style={{
                    height: '100%', width: `${pct}%`,
                    background: bar, borderRadius: 99,
                    boxShadow: reached ? '0 0 8px rgba(0,193,148,0.5)' : 'none',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <div
                className="flex items-baseline justify-between mt-1 font-mono"
                style={{ fontSize: 10, color: '#547C9D', fontWeight: 600 }}
              >
                <span>{pct.toFixed(0)}% atingido</span>
                {!reached && (
                  <span>
                    Falta:{' '}
                    <span style={{ color: '#001124', fontWeight: 800 }}>
                      {inverted
                        ? `reduzir ${(g.current - g.target).toFixed(2)}pp`
                        : formatVal(g.target - g.current, g.format)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}