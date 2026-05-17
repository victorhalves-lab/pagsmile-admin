import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { RECON_TREND_14D, DIVERGENCE_BUCKETS, fmtBRLFromReais } from '../mocks/reconciliationAutomatedMocks';

/**
 * Overview da Conciliação — gráfico de evolução + top 5 buckets.
 * Inline styles V8 puros.
 */
export default function ReconOverviewView() {
  const topDivergences = [...DIVERGENCE_BUCKETS].sort((a, b) => b.value - a.value).slice(0, 5);
  const maxValue = topDivergences[0]?.value || 1;

  // KPIs derivados do trend
  const totalMatched = RECON_TREND_14D.reduce((s, d) => s + d.matched, 0);
  const totalDivergent = RECON_TREND_14D.reduce((s, d) => s + d.divergent, 0);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: 16,
    }}>
      {/* Card: Evolução */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>
              EVOLUÇÃO · 14 DIAS
            </span>
            <h3 style={{
              fontSize: 15, fontWeight: 700, color: '#0F172A',
              marginTop: 4, margin: 0, letterSpacing: '-0.012em',
            }}>
              Matches vs divergências detectadas
            </h3>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 999,
            background: '#E0F8F1', color: '#007A5C',
            fontSize: 11, fontWeight: 700,
          }}>
            <TrendingUp size={12} strokeWidth={2.5} />
            {((totalMatched / (totalMatched + totalDivergent)) * 100).toFixed(1)}% acerto
          </div>
        </div>

        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={RECON_TREND_14D} margin={{ top: 10, right: 6, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="reconMatchedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C194" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#00C194" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reconDivergentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B91C1C" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#B91C1C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDEDED" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11, borderRadius: 10,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  boxShadow: '0 8px 24px -8px rgba(15,23,42,0.18)',
                  padding: '8px 12px',
                }}
                cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                iconType="circle"
              />
              <Area
                type="monotone" dataKey="matched"
                stroke="#00C194" strokeWidth={2.5}
                fill="url(#reconMatchedFill)"
                name="Conciliados"
                dot={false}
                activeDot={{ r: 4, fill: '#00C194', strokeWidth: 2, stroke: '#FFFFFF' }}
              />
              <Area
                type="monotone" dataKey="divergent"
                stroke="#B91C1C" strokeWidth={2}
                fill="url(#reconDivergentFill)"
                name="Divergentes"
                dot={false}
                activeDot={{ r: 4, fill: '#B91C1C', strokeWidth: 2, stroke: '#FFFFFF' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card: Top 5 buckets */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
      }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#007A5C',
          }}>
            TOP 5 BUCKETS POR VALOR
          </span>
          <h3 style={{
            fontSize: 15, fontWeight: 700, color: '#0F172A',
            marginTop: 4, margin: 0, letterSpacing: '-0.012em',
          }}>
            Onde está o maior dinheiro em jogo
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {topDivergences.map((b, idx) => {
            const widthPct = (b.value / maxValue) * 100;
            const barColor = idx === 0
              ? 'linear-gradient(90deg, #B91C1C 0%, #DC2626 100%)'
              : idx === 1
                ? 'linear-gradient(90deg, #B91C1C 0%, #F87171 100%)'
                : 'linear-gradient(90deg, #B45309 0%, #F59E0B 100%)';
            return (
              <div key={b.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <code style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      color: '#475569',
                      background: '#F1F5F9',
                      padding: '2px 6px', borderRadius: 4,
                      letterSpacing: '0.04em',
                    }}>{b.code}</code>
                    <span style={{
                      fontSize: 13, color: '#0F172A', fontWeight: 600,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{b.label}</span>
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13, fontWeight: 800, color: '#B91C1C',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{fmtBRLFromReais(b.value)}</span>
                </div>
                <div style={{
                  position: 'relative',
                  width: '100%', height: 6, borderRadius: 999,
                  background: '#F1F5F9', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${widthPct}%`,
                    height: '100%',
                    background: barColor,
                    borderRadius: 999,
                    transition: 'width .6s ease',
                  }} />
                </div>
                <div style={{
                  fontSize: 11, color: '#94A3B8', marginTop: 4,
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span>{b.count} casos</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                  }}>{widthPct.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}