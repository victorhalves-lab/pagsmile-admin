import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Calendar, CaretRight, Clock } from '@phosphor-icons/react';

/**
 * ReceivablesBreakdown — Pulse VF (reescrito em Tailwind puro).
 * Container card branco com tint mint + grid de 4 KPI cards V9.
 */

const BUCKETS_BASE = [
  { id: 'd1',   label: 'D+1',   sub: 'Próximas 24h',     accent: '#00C194' },
  { id: 'd7',   label: 'D+7',   sub: 'Esta semana',      accent: '#002443' },
  { id: 'd30',  label: 'D+30',  sub: 'Próximos 30 dias', accent: '#0F2B2B' },
  { id: 'd30p', label: 'D+30+', sub: 'Mais de 30 dias',  accent: '#5CF7CF' },
];

export default function ReceivablesBreakdown({ data = {} }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
    }).format(v || 0);

  const defaults = { d1: 18420, d7: 47830, d30: 125640, d30p: 38990 };
  const buckets = BUCKETS_BASE.map((b) => ({ ...b, value: data[b.id] ?? defaults[b.id] }));
  const total = buckets.reduce((s, b) => s + (b.value || 0), 0);

  return (
    <div
      className="relative h-full p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #ffffff, #F0FAF6)',
        border: '1px solid #80E5C6',
        boxShadow: '0 4px 14px -4px rgba(0,193,148,0.12)',
      }}
    >
      {/* Section header VF */}
      <div
        className="relative flex items-end justify-between flex-wrap gap-3 mb-4 pb-3"
        style={{ borderBottom: '1px solid #B3F0DE' }}
      >
        <div
          className="absolute"
          style={{
            left: 0, bottom: -1, width: 80, height: 2,
            background: 'linear-gradient(90deg, #00C194, #5CF7CF)',
            borderRadius: 99,
          }}
        />
        <div>
          <div
            className="font-mono inline-flex items-center gap-2 mb-1.5"
            style={{
              fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#007A5C',
            }}
          >
            <span style={{ width: 18, height: 2, background: '#00C194', borderRadius: 99 }} />
            Recebíveis · breakdown por bucket
          </div>
          <h3
            className="m-0 flex items-center gap-2.5 flex-wrap"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '-0.018em',
              color: '#001124',
              lineHeight: 1.2,
            }}
          >
            <span>
              A{' '}
              <em
                style={{
                  fontStyle: 'normal',
                  background: 'linear-gradient(135deg,#00C194,#007A5C)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                receber
              </em>
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: 12, fontWeight: 700, color: '#013766',
                background: '#E6ECF2',
                padding: '3px 10px', borderRadius: 99,
                border: '1px solid #C0CFDC',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmt(total)}
            </span>
          </h3>
        </div>
        <Link
          to={createPageUrl('ReceivablesAgenda')}
          className="inline-flex items-center gap-2 transition-all hover:-translate-y-px"
          style={{
            padding: '7px 12px', borderRadius: 8,
            background: '#fff', color: '#007A5C',
            border: '1.5px solid #00C194',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800, fontSize: 12,
            textDecoration: 'none',
          }}
        >
          <Calendar weight="duotone" size={14} />
          Ver agenda
          <CaretRight weight="bold" size={12} />
        </Link>
      </div>

      {/* Grid de 4 KPI cards V9 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {buckets.map((b) => {
          const pct = total > 0 ? (b.value / total) * 100 : 0;
          return (
            <Link
              key={b.id}
              to={`${createPageUrl('ReceivablesAgenda')}?bucket=${b.id}`}
              className="group relative overflow-hidden p-4 flex flex-col justify-between transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #fff, #F0FAF6)',
                border: '1px solid #80E5C6',
                borderRadius: 14,
                textDecoration: 'none',
                minHeight: 138,
                color: '#001124',
                gap: 8,
              }}
            >
              {/* Top accent gradient */}
              <span
                className="absolute top-0 left-0 right-0"
                style={{
                  height: 3,
                  background: `linear-gradient(90deg, ${b.accent}, #5CF7CF)`,
                }}
              />

              {/* Header: label + icon */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10, fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#007A5C',
                  }}
                >
                  {b.label}
                </span>
                <span
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'linear-gradient(135deg, #E0F8F1, #B4FCE8)',
                    color: '#005A43',
                    border: '1px solid #4DD8AB',
                  }}
                >
                  <Clock weight="duotone" size={14} />
                </span>
              </div>

              {/* Valor */}
              <div
                className="font-mono"
                style={{
                  fontSize: 22, fontWeight: 800,
                  letterSpacing: '-0.024em', lineHeight: 1,
                  background: 'linear-gradient(135deg, #007A5C, #001124)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontVariantNumeric: 'tabular-nums',
                  display: 'flex', alignItems: 'flex-start', gap: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 11, fontWeight: 600,
                    WebkitTextFillColor: '#013766', color: '#013766',
                    marginRight: 3, marginTop: 3,
                  }}
                >
                  R$
                </span>
                {fmt(b.value).replace('R$', '').trim()}
              </div>

              {/* Progress bar */}
              <div
                className="overflow-hidden"
                style={{
                  height: 5,
                  background: '#E0F8F1',
                  borderRadius: 99,
                  border: '1px solid #B3F0DE',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #1ECB9D, #007A5C, #5CF7CF)',
                    borderRadius: 99,
                    boxShadow: '0 0 6px rgba(0,193,148,0.45)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              {/* Footer: sub + pct */}
              <div
                className="font-mono flex items-baseline justify-between"
                style={{ fontSize: 10.5, color: '#013766', fontWeight: 600 }}
              >
                <span>{b.sub}</span>
                <span style={{ color: '#007A5C', fontWeight: 800 }}>
                  {pct.toFixed(0)}%
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}