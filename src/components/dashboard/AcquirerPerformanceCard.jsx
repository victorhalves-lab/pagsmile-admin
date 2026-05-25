import React from 'react';
import { TreeStructure, TrendUp, TrendDown, Sparkle } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * AcquirerPerformanceCard — Pulse VF.
 * Card branco + section header + tabela visual de adquirentes com pills + gauge.
 */
export default function AcquirerPerformanceCard({ acquirers = [] }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const defaults = [
    { name: 'Stone',  approval: 92.4, volume: 845230, change: 1.2,  status: 'best',      bestFor: 'Visa débito' },
    { name: 'Cielo',  approval: 88.1, volume: 612480, change: -0.8, status: 'normal',    bestFor: 'Mastercard' },
    { name: 'Rede',   approval: 86.7, volume: 423190, change: 0.5,  status: 'normal',    bestFor: 'Elo' },
    { name: 'Getnet', approval: 79.3, volume: 198420, change: -3.2, status: 'underperf', bestFor: '—' },
  ];
  const list = acquirers.length > 0 ? acquirers : defaults;

  const statusStyle = {
    best:      { label: 'Melhor',       bg: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', color: '#005A43', border: '#4DD8AB', row: { bg: 'linear-gradient(135deg, #E0F8F1, #fff)', border: '#80E5C6' }, bar: 'linear-gradient(90deg, #1ECB9D, #007A5C, #5CF7CF)' },
    normal:    { label: 'Em linha',     bg: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)', color: '#002443', border: '#8AA5BD', row: { bg: '#fff', border: '#C0CFDC' }, bar: 'linear-gradient(90deg, #C0CFDC, #8AA5BD)' },
    underperf: { label: 'Sub-perf',     bg: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)', color: '#B91C1C', border: '#FCA5A5', row: { bg: 'linear-gradient(135deg, #FEE2E2, #fff)', border: '#FCA5A5' }, bar: 'linear-gradient(90deg, #F87171, #DC2626)' },
  };

  return (
    <div
      className="relative p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #fff, #F0FAF6)',
        border: '1px solid #80E5C6',
        boxShadow: '0 4px 14px -4px rgba(0,193,148,0.12)',
      }}
    >
      {/* Section header */}
      <div
        className="relative flex items-end justify-between flex-wrap gap-3 mb-4 pb-3"
        style={{ borderBottom: '1px solid #B3F0DE' }}
      >
        <div
          className="absolute"
          style={{
            left: 0, bottom: -1, width: 80, height: 2,
            background: 'linear-gradient(90deg, #00C194, #5CF7CF)', borderRadius: 99,
          }}
        />
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #013766, #001124)',
              color: '#5CF7CF',
              boxShadow: '0 6px 14px -3px rgba(0,36,67,0.5)',
            }}
          >
            <TreeStructure weight="duotone" size={22} />
          </div>
          <div>
            <div
              className="font-mono inline-flex items-center gap-2 mb-0.5"
              style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#007A5C',
              }}
            >
              <span style={{ width: 18, height: 2, background: '#00C194', borderRadius: 99 }} />
              Orquestração · últimos 7 dias
            </div>
            <h3
              style={{
                margin: 0, fontFamily: 'Inter, sans-serif',
                fontSize: 17, fontWeight: 800, letterSpacing: '-0.018em',
                color: '#001124', lineHeight: 1.2,
              }}
            >
              Performance por{' '}
              <em
                style={{
                  fontStyle: 'normal',
                  background: 'linear-gradient(135deg,#00C194,#007A5C)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                adquirente
              </em>
            </h3>
          </div>
        </div>
        <span
          className="font-mono inline-flex items-center gap-1"
          style={{
            padding: '4px 10px', borderRadius: 99,
            background: 'linear-gradient(135deg, #1ECB9D, #007A5C)',
            color: '#fff', border: 0,
            fontSize: 9.5, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            boxShadow: '0 4px 12px -2px rgba(0,193,148,0.45)',
          }}
        >
          <Sparkle weight="duotone" size={11} />
          Orquestração IA
        </span>
      </div>

      {/* Tabela */}
      <div className="space-y-2">
        {list.map((acq) => {
          const cfg = statusStyle[acq.status] || statusStyle.normal;
          const positive = acq.change >= 0;
          return (
            <div
              key={acq.name}
              className="flex items-center gap-3 p-3 transition-all hover:-translate-y-px"
              style={{
                background: cfg.row.bg,
                border: `1px solid ${cfg.row.border}`,
                borderRadius: 12,
              }}
            >
              {/* Nome */}
              <div className="w-28 flex-shrink-0">
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 800, color: '#001124' }}>
                  {acq.name}
                </p>
                <span
                  className="font-mono inline-flex items-center mt-0.5"
                  style={{
                    padding: '2px 7px', borderRadius: 99,
                    background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                    fontSize: 9, fontWeight: 800,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}
                >
                  {cfg.label}
                </span>
              </div>

              {/* Approval */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 16, fontWeight: 800, color: '#001124',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {acq.approval.toFixed(1)}%
                  </span>
                  <span className="font-mono" style={{ fontSize: 10, color: '#547C9D', fontWeight: 600 }}>
                    aprovação
                  </span>
                  <span
                    className="font-mono inline-flex items-center gap-0.5 ml-auto"
                    style={{
                      fontSize: 10, fontWeight: 800,
                      color: positive ? '#007A5C' : '#B91C1C',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {positive ? <TrendUp weight="bold" size={10} /> : <TrendDown weight="bold" size={10} />}
                    {Math.abs(acq.change).toFixed(1)}
                  </span>
                </div>
                <div
                  style={{
                    height: 5, background: '#E0F8F1',
                    borderRadius: 99, overflow: 'hidden', border: '1px solid #B3F0DE',
                  }}
                >
                  <div
                    style={{
                      height: '100%', width: `${acq.approval}%`,
                      background: cfg.bar, borderRadius: 99,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Volume + best for */}
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p
                  className="font-mono"
                  style={{
                    fontSize: 12, fontWeight: 800, color: '#001124',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmt(acq.volume)}
                </p>
                <p style={{ fontSize: 10, color: '#547C9D' }}>
                  Ideal: <span style={{ fontWeight: 700, color: '#001124' }}>{acq.bestFor}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer com sugestão */}
      <div
        className="mt-4 pt-3"
        style={{ borderTop: '1px dashed #B3F0DE' }}
      >
        <Link
          to={createPageUrl('AdminIntOrchestration')}
          className="inline-flex items-center gap-2 transition-all"
          style={{ textDecoration: 'none', fontSize: 11.5 }}
        >
          <Sparkle weight="duotone" size={13} style={{ color: '#007A5C' }} />
          <span
            className="font-mono"
            style={{
              color: '#007A5C', fontWeight: 800,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              fontSize: 10.5,
            }}
          >
            Sugestão IA:
          </span>
          <span style={{ color: '#001124', fontWeight: 600 }}>
            Rotear 20% do volume Visa de Getnet → Stone aumenta aprovação em ~3.1%
          </span>
        </Link>
      </div>
    </div>
  );
}