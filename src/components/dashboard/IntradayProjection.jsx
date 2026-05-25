import React from 'react';
import { Sun, Moon } from '@phosphor-icons/react';

/**
 * IntradayProjection — Pulse VF.
 * Card branco com tint mint + icon container amber + progress dia.
 */
export default function IntradayProjection({ today = {} }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const now = new Date();
  const hourPct = (now.getHours() * 60 + now.getMinutes()) / (24 * 60);

  const realizedToday = today.realized ?? 18420;
  const avg4wAtThisHour = today.avgAtThisHour ?? 17800;
  const projectedClose = today.projected ?? Math.round(realizedToday / Math.max(hourPct, 0.05));

  const onPace = realizedToday >= avg4wAtThisHour;

  return (
    <div
      className="relative h-full overflow-hidden p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #fff, #F0FAF6)',
        border: '1px solid #80E5C6',
        boxShadow: '0 4px 14px -4px rgba(0,193,148,0.12)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              color: '#B45309',
              border: '1px solid #FDE68A',
            }}
          >
            <Sun weight="duotone" size={18} />
          </div>
          <div>
            <p
              className="font-mono"
              style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#B45309',
              }}
            >
              Receita esperada hoje
            </p>
            <p className="font-mono" style={{ fontSize: 10, color: '#547C9D', fontWeight: 600 }}>
              Até fechamento (23:59)
            </p>
          </div>
        </div>
        <span
          className="font-mono inline-flex items-center gap-1"
          style={{
            padding: '4px 10px', borderRadius: 99,
            background: onPace
              ? 'linear-gradient(135deg, #B3F0DE, #B4FCE8)'
              : 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            color: onPace ? '#005A43' : '#B45309',
            border: onPace ? '1px solid #4DD8AB' : '1px solid #FDE68A',
            fontSize: 9.5, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}
        >
          {onPace ? 'No ritmo' : 'Abaixo do ritmo'}
        </span>
      </div>

      {/* Valor */}
      <div
        className="font-mono"
        style={{
          fontSize: 28, fontWeight: 800, letterSpacing: '-0.024em', lineHeight: 1,
          background: 'linear-gradient(135deg, #007A5C, #001124)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {fmt(projectedClose)}
      </div>
      <p className="mt-1" style={{ fontSize: 11, color: '#547C9D' }}>
        Realizado agora:{' '}
        <span className="font-mono" style={{ fontWeight: 800, color: '#001124' }}>{fmt(realizedToday)}</span>
        <span className="mx-1.5">·</span>
        Média 4 sem.:{' '}
        <span className="font-mono" style={{ fontWeight: 700 }}>{fmt(avg4wAtThisHour)}</span>
      </p>

      {/* Progress bar do dia */}
      <div className="mt-4">
        <div
          className="flex items-center justify-between mb-1.5 font-mono"
          style={{ fontSize: 10, color: '#547C9D', fontWeight: 700 }}
        >
          <span className="inline-flex items-center gap-1">
            <Sun weight="duotone" size={11} /> 00:00
          </span>
          <span style={{ color: '#001124', fontWeight: 800 }}>{Math.round(hourPct * 100)}% do dia</span>
          <span className="inline-flex items-center gap-1">
            23:59 <Moon weight="duotone" size={11} />
          </span>
        </div>
        <div
          style={{
            height: 8, background: '#E0F8F1',
            borderRadius: 99, overflow: 'hidden', border: '1px solid #B3F0DE',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${hourPct * 100}%`,
              background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
              borderRadius: 99,
              boxShadow: '0 0 6px rgba(245,158,11,0.45)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}