import React from 'react';
import { Clock, CalendarBlank, Calendar, TrendUp, ArrowRight } from '@phosphor-icons/react';
import Sparkline from './Sparkline';

/**
 * ForecastRow — Pulse VF.
 * 3 KPI cards V9 com top-accent diferenciado por bucket (24h / 7d / 30d).
 */
export default function ForecastRow({ data = {} }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const items = [
    {
      id: '24h', label: 'Próximas 24h', icon: Clock,
      revenue: data.revenue24h ?? 18420,
      charges: data.charges24h ?? 47,
      withdrawals: data.withdrawals24h ?? 12500,
      accent: '#00C194', icVariant: 'mint',
      spark: [40, 38, 45, 52, 48, 55, 62], sparkColor: 'emerald',
    },
    {
      id: '7d', label: 'Próximos 7 dias', icon: CalendarBlank,
      revenue: data.revenue7d ?? 142380,
      charges: data.charges7d ?? 312,
      withdrawals: data.withdrawals7d ?? 78400,
      accent: '#002443', icVariant: 'blue',
      spark: [120, 135, 142, 138, 155, 162, 158], sparkColor: 'blue',
    },
    {
      id: '30d', label: 'Próximos 30 dias', icon: Calendar,
      revenue: data.revenue30d ?? 612480,
      charges: data.charges30d ?? 1287,
      withdrawals: data.withdrawals30d ?? 285000,
      accent: '#0F2B2B', icVariant: 'deep',
      spark: [480, 510, 545, 580, 595, 612, 625], sparkColor: 'violet',
    },
  ];

  const icThemes = {
    mint:  { bg: 'linear-gradient(135deg, #E0F8F1, #B4FCE8)', color: '#005A43', border: '#4DD8AB' },
    blue:  { bg: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)', color: '#001124', border: '#8AA5BD' },
    deep:  { bg: 'linear-gradient(135deg, #E8EDED, #C0CDCD)', color: '#091818', border: '#8FAAAA' },
  };

  return (
    <div>
      {/* Section Header VF */}
      <div
        className="relative flex items-end justify-between flex-wrap gap-3 mb-4 pb-3"
        style={{ borderBottom: '1px solid #E2E8F0' }}
      >
        <div
          className="absolute"
          style={{
            left: 0, bottom: -1, width: 80, height: 2,
            background: 'linear-gradient(90deg, #00C194, #5CF7CF)', borderRadius: 99,
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
            Forecast · prospectivo
          </div>
          <h2
            style={{
              margin: 0, fontFamily: 'Inter, sans-serif',
              fontSize: 22, fontWeight: 800, letterSpacing: '-0.022em',
              color: '#001124', lineHeight: 1.2,
            }}
          >
            Vai{' '}
            <em
              style={{
                fontStyle: 'normal',
                background: 'linear-gradient(135deg,#00C194,#007A5C)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              acontecer
            </em>
          </h2>
        </div>
        <div
          className="inline-flex items-center justify-center"
          style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #E0F8F1, #B4FCE8)',
            color: '#005A43',
            border: '1px solid #4DD8AB',
          }}
        >
          <TrendUp weight="duotone" size={22} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const ic = icThemes[item.icVariant];
          return (
            <div
              key={item.id}
              className="relative overflow-hidden p-5 flex flex-col transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #fff, #F0FAF6)',
                border: '1px solid #80E5C6',
                borderRadius: 14,
                minHeight: 200,
                gap: 12,
              }}
            >
              <span
                className="absolute top-0 left-0 right-0"
                style={{ height: 3, background: `linear-gradient(90deg, ${item.accent}, #5CF7CF)` }}
              />

              {/* Top */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="inline-flex items-center justify-center"
                    style={{
                      width: 32, height: 32, borderRadius: 9,
                      background: ic.bg, color: ic.color, border: `1px solid ${ic.border}`,
                    }}
                  >
                    <Icon weight="duotone" size={16} />
                  </div>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10, fontWeight: 800,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: '#007A5C',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <ArrowRight weight="bold" size={13} style={{ color: '#B3F0DE' }} />
              </div>

              {/* Valor */}
              <div>
                <p
                  className="font-mono"
                  style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: '#547C9D', marginBottom: 4,
                  }}
                >
                  Receita esperada
                </p>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 24, fontWeight: 800, letterSpacing: '-0.024em',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #007A5C, #001124)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    color: 'transparent',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmt(item.revenue)}
                </div>
              </div>

              <Sparkline data={item.spark} color={item.sparkColor} height={28} />

              {/* Footer mini-stats */}
              <div
                className="grid grid-cols-2 gap-3 pt-3 mt-auto"
                style={{ borderTop: '1px dashed #B3F0DE' }}
              >
                <div>
                  <p className="font-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#547C9D' }}>
                    Cobranças
                  </p>
                  <p className="font-mono" style={{ fontSize: 13, fontWeight: 800, color: '#001124', fontVariantNumeric: 'tabular-nums' }}>
                    {item.charges}
                  </p>
                </div>
                <div>
                  <p className="font-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#547C9D' }}>
                    Saques
                  </p>
                  <p className="font-mono" style={{ fontSize: 13, fontWeight: 800, color: '#001124', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(item.withdrawals)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}