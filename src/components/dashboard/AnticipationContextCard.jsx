import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Lightning, ArrowRight } from '@phosphor-icons/react';

/**
 * AnticipationContextCard — Pulse VF.
 * Reference card hero V9 (.pvf-rc) com gradient mint, watermark icon
 * e CTA com .pvf-btn-glass. Mantém toda a lógica de valores/taxa.
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
    <div className="pvf-rc h-full" style={{ minHeight: 230 }}>
      {/* Watermark icon top-right (V9 padrão) */}
      <div className="pvf-rc-wm">
        <Lightning weight="duotone" size={46} />
      </div>

      {/* Eyebrow */}
      <div>
        <div className="pvf-rc-lab" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 99,
              background: 'rgba(92,247,207,0.18)',
              color: '#5CF7CF',
              fontSize: 9,
              letterSpacing: '0.12em',
              border: '1px solid rgba(92,247,207,0.35)',
              fontWeight: 800,
            }}
          >
            ● ELEGÍVEL
          </span>
          <span>Antecipação · disponível agora</span>
        </div>
      </div>

      {/* Valor principal */}
      <div>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Você pode antecipar até
        </p>
        <div className="pvf-rc-val">
          <span className="pvf-ccy">R$</span>
          {fmt(receivableAmount).replace('R$', '').trim()}
        </div>
      </div>

      {/* Métricas */}
      <div className="pvf-rc-desc" style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>
          Taxa <b style={{ fontFamily: 'JetBrains Mono, monospace' }}>{feePercentage.toFixed(2)}%</b>
        </span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>
          Recebe hoje <b style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(net)}</b>
        </span>
      </div>

      {/* CTA glass */}
      <Link to={createPageUrl('Anticipation')} style={{ marginTop: 8, display: 'inline-block' }}>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            background: 'rgba(255,255,255,0.14)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.28)',
            borderRadius: 11,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            transition: '0.18s',
            position: 'relative',
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Antecipar agora
          <ArrowRight weight="bold" size={15} />
        </button>
      </Link>
    </div>
  );
}