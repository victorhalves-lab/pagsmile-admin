import React from 'react';
import { Funnel, CaretRight, Warning } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * CheckoutFunnelCard — Pulse VF.
 * Card branco com 4 stages do funil, cores brand-only e alert na maior queda.
 */
export default function CheckoutFunnelCard({ data = {} }) {
  const visitors = data.visitors ?? 12480;
  const opened   = data.opened   ?? 3742;
  const filled   = data.filled   ?? 2105;
  const paid     = data.paid     ?? 1683;

  const stages = [
    { id: 'visitors', label: 'Visitantes',      value: visitors, bar: 'linear-gradient(90deg, #C0CFDC, #8AA5BD)' },
    { id: 'opened',   label: 'Checkout aberto', value: opened,   bar: 'linear-gradient(90deg, #013766, #002443)' },
    { id: 'filled',   label: 'Preenchido',      value: filled,   bar: 'linear-gradient(90deg, #1A3939, #0F2B2B)' },
    { id: 'paid',     label: 'Pago',            value: paid,     bar: 'linear-gradient(90deg, #1ECB9D, #007A5C)' },
  ];

  const overallConversion = (paid / visitors) * 100;

  const drops = stages.slice(1).map((s, idx) => ({
    name: s.label,
    from: stages[idx].label,
    pct: ((stages[idx].value - s.value) / stages[idx].value) * 100,
  }));
  const biggestDrop = drops.reduce((max, d) => (d.pct > max.pct ? d : max), drops[0]);

  return (
    <div
      className="relative h-full p-5 rounded-2xl"
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
              background: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)',
              color: '#001124',
              border: '1px solid #8AA5BD',
            }}
          >
            <Funnel weight="duotone" size={18} />
          </div>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 800, color: '#001124' }}>
              Funil de Checkout
            </p>
            <p className="font-mono" style={{ fontSize: 10.5, color: '#547C9D', fontWeight: 600 }}>
              Conversão geral:{' '}
              <span
                style={{
                  fontWeight: 800, color: '#007A5C',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {overallConversion.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
        <Link
          to={createPageUrl('CheckoutAnalytics')}
          className="inline-flex items-center gap-1 font-mono"
          style={{
            color: '#007A5C', fontSize: 11, fontWeight: 800,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Otimizar
          <CaretRight weight="bold" size={11} />
        </Link>
      </div>

      <div className="space-y-2.5">
        {stages.map((s, idx) => {
          const widthPct = (s.value / visitors) * 100;
          const dropFromPrev = idx > 0 ? ((stages[idx - 1].value - s.value) / stages[idx - 1].value) * 100 : 0;
          return (
            <div key={s.id}>
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11, fontWeight: 700, color: '#001124',
                  }}
                >
                  {s.label}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 12, fontWeight: 800, color: '#001124',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {s.value.toLocaleString('pt-BR')}
                  </span>
                  {idx > 0 && (
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 10, color: '#B91C1C', fontWeight: 800,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      -{dropFromPrev.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  height: 22, background: '#E0F8F1',
                  borderRadius: 6, overflow: 'hidden',
                  border: '1px solid #B3F0DE',
                }}
              >
                <div
                  className="flex items-center justify-end pr-2 transition-all h-full"
                  style={{
                    width: `${widthPct}%`,
                    background: s.bar,
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 9.5, fontWeight: 800, color: '#fff',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {widthPct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {biggestDrop && biggestDrop.pct > 20 && (
        <div
          className="mt-4 p-2.5 flex items-start gap-2 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: '1px solid #FDE68A',
          }}
        >
          <Warning weight="duotone" size={14} style={{ color: '#B45309', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 11, color: '#B45309', lineHeight: 1.4 }}>
            Maior queda:{' '}
            <span style={{ fontWeight: 800 }}>{biggestDrop.from} → {biggestDrop.name}</span>{' '}
            (<span className="font-mono" style={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{biggestDrop.pct.toFixed(0)}%</span>).
            Vale otimizar essa etapa.
          </p>
        </div>
      )}
    </div>
  );
}