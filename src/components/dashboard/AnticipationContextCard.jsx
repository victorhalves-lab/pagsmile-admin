import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Lightning, ArrowRight } from '@phosphor-icons/react';

/**
 * AnticipationContextCard — Pulse VF (reescrito em Tailwind puro).
 * Reference card hero V9 — gradient mint + watermark + CTA glass.
 */
export default function AnticipationContextCard({
  receivableAmount = 212880,
  feePercentage = 1.99,
  netAmount,
}) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
    }).format(v || 0);

  const fee = (receivableAmount * feePercentage) / 100;
  const net = netAmount ?? receivableAmount - fee;

  return (
    <div
      className="relative h-full overflow-hidden rounded-[18px] p-7 text-white flex flex-col justify-between"
      style={{
        background: 'linear-gradient(135deg, #00C194, #007A5C)',
        boxShadow: '0 12px 32px -8px rgba(0,193,148,0.5)',
        minHeight: 240,
      }}
    >
      {/* Watermark glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -60, right: -40, width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(92,247,207,0.4), transparent 60%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: 20, right: 20, color: '#fff', opacity: 0.85,
          filter: 'drop-shadow(0 0 14px rgba(92,247,207,0.65)) drop-shadow(0 4px 12px rgba(0,0,0,0.18))',
        }}
      >
        <Lightning weight="duotone" size={46} />
      </div>

      {/* Eyebrow + chip */}
      <div className="relative">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 font-mono"
            style={{
              padding: '3px 9px',
              borderRadius: 99,
              background: 'rgba(92,247,207,0.18)',
              color: '#5CF7CF',
              fontSize: 9.5,
              letterSpacing: '0.14em',
              border: '1px solid rgba(92,247,207,0.35)',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: 99, background: '#5CF7CF' }} />
            Elegível
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            Antecipação · disponível agora
          </span>
        </div>
      </div>

      {/* Valor principal */}
      <div className="relative">
        <p
          className="font-mono"
          style={{
            fontSize: 10.5,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 700,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Você pode antecipar até
        </p>
        <div
          className="font-mono"
          style={{
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: '-0.030em',
            lineHeight: 0.95,
            color: '#fff',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 600,
              marginRight: 6,
              marginTop: 6,
            }}
          >
            R$
          </span>
          {fmt(receivableAmount).replace('R$', '').trim()}
        </div>
      </div>

      {/* Métricas */}
      <div
        className="relative font-mono flex items-center flex-wrap"
        style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.82)',
          fontWeight: 700,
          gap: 16,
        }}
      >
        <span>
          Taxa <b style={{ color: '#5CF7CF', fontWeight: 900 }}>{feePercentage.toFixed(2)}%</b>
        </span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>
          Recebe hoje <b style={{ color: '#5CF7CF', fontWeight: 900 }}>{fmt(net)}</b>
        </span>
      </div>

      {/* CTA glass */}
      <div className="relative">
        <Link
          to={createPageUrl('Anticipation')}
          className="inline-flex items-center gap-2 transition-all hover:-translate-y-px"
          style={{
            padding: '10px 18px',
            background: 'rgba(255,255,255,0.16)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.32)',
            borderRadius: 12,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          Antecipar agora
          <ArrowRight weight="bold" size={15} />
        </Link>
      </div>
    </div>
  );
}