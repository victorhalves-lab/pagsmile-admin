import React from 'react';
import { TreeStructure, ArrowRight } from '@phosphor-icons/react';

/**
 * MoneyFlowCard — Pulse VF.
 * Card branco com section header + nodes sankey-like com cores brand-only.
 */
export default function MoneyFlowCard({ data = {} }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const gmv = data.gmv ?? 945000;
  const fees = data.fees ?? Math.round(gmv * 0.025);
  const net = gmv - fees;
  const available = data.available ?? 125430;
  const blocked = data.blocked ?? 2500;
  const receivable = data.receivable ?? net - available - blocked;
  const withdrawn = data.withdrawn ?? 0;
  const anticipated = data.anticipated ?? 0;

  const nodeThemes = {
    slate:   { bg: 'linear-gradient(135deg, #fff, #F4F6F8)', color: '#001124', border: '#C0CFDC' },
    mint:    { bg: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', color: '#005A43', border: '#4DD8AB' },
    blue:    { bg: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)', color: '#002443', border: '#8AA5BD' },
    deep:    { bg: 'linear-gradient(135deg, #E8EDED, #C0CDCD)', color: '#091818', border: '#8FAAAA' },
    warn:    { bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', color: '#B45309', border: '#FDE68A' },
    err:     { bg: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)', color: '#B91C1C', border: '#FCA5A5' },
  };

  const Node = ({ label, value, theme = 'slate', sub }) => {
    const t = nodeThemes[theme];
    return (
      <div
        className="flex-1 min-w-0 text-center p-3 transition-all hover:-translate-y-0.5"
        style={{
          background: t.bg, color: t.color,
          border: `1.5px solid ${t.border}`,
          borderRadius: 12,
        }}
      >
        <p className="font-mono truncate" style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {label}
        </p>
        <p
          className="font-mono truncate"
          style={{
            fontSize: 14, fontWeight: 800, marginTop: 2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fmt(value)}
        </p>
        {sub && (
          <p style={{ fontSize: 9.5, opacity: 0.7, marginTop: 1 }}>{sub}</p>
        )}
      </div>
    );
  };

  const Arrow = ({ pct }) => (
    <div className="flex flex-col items-center justify-center px-1 flex-shrink-0">
      <span
        className="font-mono"
        style={{ fontSize: 9, color: '#547C9D', fontWeight: 800 }}
      >
        {pct}%
      </span>
      <ArrowRight weight="bold" size={16} style={{ color: '#80E5C6' }} />
    </div>
  );

  return (
    <div
      className="relative h-full p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #fff, #F0FAF6)',
        border: '1px solid #80E5C6',
        boxShadow: '0 4px 14px -4px rgba(0,193,148,0.12)',
      }}
    >
      {/* Section header */}
      <div
        className="relative flex items-center gap-3 mb-4 pb-3"
        style={{ borderBottom: '1px solid #B3F0DE' }}
      >
        <div
          className="absolute"
          style={{
            left: 0, bottom: -1, width: 80, height: 2,
            background: 'linear-gradient(90deg, #00C194, #5CF7CF)', borderRadius: 99,
          }}
        />
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
            Fluxo · onde está
          </div>
          <h3
            style={{
              margin: 0, fontFamily: 'Inter, sans-serif',
              fontSize: 17, fontWeight: 800, letterSpacing: '-0.018em',
              color: '#001124', lineHeight: 1.2,
            }}
          >
            Onde meu{' '}
            <em
              style={{
                fontStyle: 'normal',
                background: 'linear-gradient(135deg,#00C194,#007A5C)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              dinheiro
            </em>{' '}
            está?
          </h3>
        </div>
      </div>

      {/* Linha 1: GMV → Net */}
      <div className="space-y-4">
        <div className="flex items-stretch gap-1">
          <Node label="GMV bruto" value={gmv} theme="slate" />
          <Arrow pct={100} />
          <Node label="Taxas/MDR" value={fees} theme="err" sub={`${((fees / gmv) * 100).toFixed(1)}% do GMV`} />
          <Arrow pct={Math.round(100 - (fees / gmv) * 100)} />
          <Node label="Líquido" value={net} theme="mint" />
        </div>

        <div className="flex items-stretch gap-1">
          <div className="w-1/4 flex-shrink-0" />
          <Node label="Disponível" value={available} theme="mint" sub="Para saque" />
          <div className="w-3" />
          <Node label="A receber" value={receivable} theme="warn" sub="Em cronograma" />
          <div className="w-3" />
          <Node label="Bloqueado" value={blocked} theme="err" sub="Reserva/disputas" />
        </div>

        {(withdrawn > 0 || anticipated > 0) && (
          <div
            className="flex items-stretch gap-1 pt-3"
            style={{ borderTop: '1px dashed #B3F0DE' }}
          >
            <Node label="Já sacado" value={withdrawn} theme="blue" sub="No mês" />
            <div className="w-3" />
            <Node label="Antecipado" value={anticipated} theme="deep" sub="No mês" />
            <div className="w-1/2 flex-shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
}