import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

/**
 * BalanceCard — Pulse V9 / VF.
 * Hero card navy gradient + glow corner watermark, sub-cards solid mint/blue.
 * Dados/props/comportamento preservados.
 */
export default function BalanceCard({
  available = 0,
  pending = 0,
  blocked = 0,
  className,
}) {
  const [showValues, setShowValues] = useState(true);

  const fmt = (v) => {
    if (!showValues) return '•••••••';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
  };

  const total = available + pending + blocked;
  const totalStr = fmt(total);
  const totalMatch = showValues ? totalStr.match(/^(R\$)\s*(.+)$/) : null;
  const ccy = totalMatch ? totalMatch[1] : null;
  const numStr = totalMatch ? totalMatch[2] : totalStr;

  // Sub-items
  const items = [
    {
      label: 'Disponível',
      value: available,
      bg: 'linear-gradient(135deg, var(--pag-mint-500), var(--pag-mint-700))',
      shadow: '0 8px 24px -6px rgba(0,193,148,.5)',
      pillBg: 'rgba(255,255,255,.20)',
      pillColor: '#fff',
      labelColor: 'rgba(255,255,255,.85)',
      svg: (
        <>
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
        </>
      ),
    },
    {
      label: 'A receber',
      value: pending,
      bg: 'linear-gradient(135deg, var(--pag-blue-700), var(--pag-blue-900))',
      shadow: '0 8px 24px -6px rgba(0,36,67,.55)',
      pillBg: 'rgba(92,247,207,.20)',
      pillColor: 'var(--pag-glow-500)',
      labelColor: 'var(--pag-glow-500)',
      svg: (
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </>
      ),
    },
    {
      label: 'Bloqueado',
      value: blocked,
      bg: 'linear-gradient(135deg, var(--pag-deep-500), var(--pag-deep-700))',
      shadow: '0 8px 24px -6px rgba(15,43,43,.55)',
      pillBg: 'rgba(92,247,207,.18)',
      pillColor: 'var(--pag-glow-500)',
      labelColor: 'var(--pag-glow-500)',
      svg: (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
      ),
    },
  ];

  return (
    <div className={cn('v9rc v9rc-blue v9rc-lg', className)} style={{ minHeight: 'auto' }}>
      {/* Watermark Wallet */}
      <div className="wm">
        <svg viewBox="0 0 24 24">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
        </svg>
      </div>

      {/* Header label */}
      <div className="relative flex items-center justify-between mb-2">
        <div className="lab" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--pag-glow-500)',
            boxShadow: '0 0 8px var(--pag-glow-500)',
            animation: 'pvf-pulse 1.6s infinite',
            display: 'inline-block'
          }} />
          SALDO TOTAL · TEMPO REAL
        </div>
        <button
          type="button"
          onClick={() => setShowValues(!showValues)}
          className="text-white/50 hover:text-white transition-colors"
          aria-label="alternar visibilidade"
        >
          {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Big number */}
      <div className="v relative">
        {ccy && <span className="ccy">{ccy}</span>}
        {numStr}
      </div>

      {/* Sub-cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 relative">
        {items.map((it) => (
          <div
            key={it.label}
            style={{
              background: it.bg,
              boxShadow: it.shadow,
              borderRadius: 14,
              padding: 16,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'rgba(255,255,255,.15)',
                border: '1px solid rgba(255,255,255,.20)',
                display: 'grid', placeItems: 'center',
                flexShrink: 0,
              }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {it.svg}
                </svg>
              </div>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                color: it.labelColor,
                fontWeight: 800,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                background: it.pillBg,
                padding: '3px 8px',
                borderRadius: 99,
                border: '1px solid rgba(255,255,255,.20)',
              }}>
                {it.label}
              </span>
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-.022em',
              lineHeight: 1,
            }}>
              {fmt(it.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-5 relative">
        <Button
          size="sm"
          className="h-9 px-4 font-bold text-white border-0"
          style={{
            background: 'linear-gradient(135deg, var(--pag-mint-400), var(--pag-mint-700))',
            boxShadow: '0 6px 18px -3px rgba(0,193,148,.55)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
          Solicitar saque
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 px-4 font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-md"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Ver extrato
        </Button>
      </div>
    </div>
  );
}