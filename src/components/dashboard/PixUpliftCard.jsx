import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkle, ArrowRight, Fingerprint } from '@phosphor-icons/react';
import { FLOW_COMPARISON } from '@/components/transactions/pix/pixFlowMockData';

/**
 * PixUpliftCard — Pulse VF.
 * Reference card hero V9 dark navy + watermark Fingerprint + CTA glow + uplift visual.
 */
export default function PixUpliftCard() {
  const current = FLOW_COMPARISON.manual.conversion;
  const target = FLOW_COMPARISON.biometric.conversion;
  const uplift = target - current;

  return (
    <div
      className="relative overflow-hidden p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #002443, #001124)',
        color: '#fff',
        boxShadow: '0 12px 32px -8px rgba(0,36,67,0.55)',
        border: 0,
      }}
    >
      {/* Watermark + glow ambient */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -70, right: -50, width: 220, height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(92,247,207,0.32), transparent 60%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: 22, right: 22, color: '#5CF7CF', opacity: 0.6,
          filter: 'drop-shadow(0 0 14px rgba(92,247,207,0.5))',
        }}
      >
        <Fingerprint weight="duotone" size={64} />
      </div>

      <div className="relative flex items-start gap-4">
        <div
          className="flex-shrink-0 inline-flex items-center justify-center"
          style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(92,247,207,0.16)',
            color: '#5CF7CF',
            border: '1px solid rgba(92,247,207,0.35)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <Fingerprint weight="duotone" size={26} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Eyebrow */}
          <p
            className="font-mono inline-flex items-center gap-1.5"
            style={{
              fontSize: 10.5, fontWeight: 800,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#5CF7CF', marginBottom: 6,
            }}
          >
            <Sparkle weight="duotone" size={12} />
            Oportunidade detectada
          </p>

          {/* Título */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 16, fontWeight: 700,
              color: '#fff', lineHeight: 1.4,
            }}
          >
            Habilite{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #5CF7CF, #B4FCE8)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                color: 'transparent', fontWeight: 800,
              }}
            >
              PIX por Biometria
            </span>{' '}
            e aumente sua conversão de{' '}
            <span
              className="font-mono"
              style={{
                textDecoration: 'line-through',
                color: 'rgba(255,255,255,0.5)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {current}%
            </span>{' '}
            →{' '}
            <span
              className="font-mono"
              style={{
                color: '#5CF7CF', fontWeight: 800,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {target}%
            </span>
          </p>

          {/* Stats inline */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <span
              className="font-mono inline-flex items-center gap-1"
              style={{
                fontSize: 11, color: '#5CF7CF', fontWeight: 800,
                letterSpacing: '0.04em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <ArrowRight weight="bold" size={11} />
              +{uplift}pp conversão
            </span>
            <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
              · jornada ~<span style={{ fontWeight: 800, color: '#fff' }}>12s</span>
            </span>
            <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
              · fraude <span style={{ fontWeight: 800, color: '#fff' }}>15x</span> menor
            </span>
            <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
              · sem redirect
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/OpenFinanceHub"
              className="inline-flex items-center gap-1.5 transition-all hover:-translate-y-px"
              style={{
                padding: '9px 16px', borderRadius: 9,
                background: 'linear-gradient(135deg, #5CF7CF, #00C194)',
                color: '#001124',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13, fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 6px 16px -3px rgba(92,247,207,0.5)',
              }}
            >
              Habilitar agora
              <ArrowRight weight="bold" size={13} />
            </Link>
            <Link
              to="/PixBiometricInsights"
              className="inline-flex items-center transition-all hover:bg-white/10"
              style={{
                padding: '9px 16px', borderRadius: 9,
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.18)',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13, fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Ver insights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}