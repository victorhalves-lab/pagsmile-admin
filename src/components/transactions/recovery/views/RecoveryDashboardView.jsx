import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area,
} from 'recharts';
import { Clock, TrendingUp } from 'lucide-react';
import {
  RECOVERY_TREND_14D, RECOVERY_BY_CHANNEL, RECOVERY_BEST_HOURS, DECLINE_REASONS,
} from '../mocks/recoveryAgentMocks';

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
};

function SectionHeader({ eyebrow, title, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
      <div>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#007A5C',
        }}>{eyebrow}</span>
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: '#0F172A',
          marginTop: 4, margin: 0, letterSpacing: '-0.012em',
        }}>{title}</h3>
      </div>
      {badge && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', borderRadius: 999,
          background: '#E0F8F1', color: '#007A5C',
          fontSize: 11, fontWeight: 700,
        }}>
          <TrendingUp size={12} strokeWidth={2.5} />
          {badge}
        </div>
      )}
    </div>
  );
}

export default function RecoveryDashboardView() {
  const topReasons = [...DECLINE_REASONS].sort((a, b) => b.volume_30d - a.volume_30d).slice(0, 6);
  const bestHour = Math.max(...RECOVERY_BEST_HOURS.map(x => x.rate));

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16,
    }}>
      {/* Evolução */}
      <div style={CARD}>
        <SectionHeader
          eyebrow="EVOLUÇÃO · 14 DIAS"
          title="Valor recuperado vs taxa de sucesso"
        />
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={RECOVERY_TREND_14D} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="recoveredFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C194" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#00C194" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDEDED" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  boxShadow: '0 8px 24px -8px rgba(15,23,42,0.18)',
                }}
                cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area yAxisId="left" type="monotone" dataKey="recovered" stroke="#00C194" strokeWidth={2.5} fill="url(#recoveredFill)" dot={false} name="R$ recuperado" activeDot={{ r: 4, fill: '#00C194', strokeWidth: 2, stroke: '#FFFFFF' }} />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#002443" strokeWidth={2} dot={false} name="Taxa %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top motivos */}
      <div style={CARD}>
        <SectionHeader
          eyebrow="TOP 6 MOTIVOS DE RECUSA"
          title="Onde está o maior volume de recuperação"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {topReasons.map((r, idx) => {
            const widthPct = (r.volume_30d / topReasons[0].volume_30d) * 100;
            const isTop = idx === 0;
            return (
              <div key={r.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <code style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      color: '#475569', background: '#F1F5F9',
                      padding: '2px 6px', borderRadius: 4,
                      letterSpacing: '0.04em',
                    }}>{r.code}</code>
                    <span style={{
                      fontSize: 13, color: '#0F172A', fontWeight: 600,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{r.label}</span>
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 800,
                    color: '#007A5C', fontVariantNumeric: 'tabular-nums',
                  }}>{r.recovery_rate}%</span>
                </div>
                <div style={{
                  width: '100%', height: 6, borderRadius: 999,
                  background: '#F1F5F9', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${widthPct}%`, height: '100%',
                    background: isTop
                      ? 'linear-gradient(90deg, #1ECB9D 0%, #007A5C 100%)'
                      : 'linear-gradient(90deg, #6FE1B1 0%, #00C194 100%)',
                    borderRadius: 999,
                    transition: 'width .6s ease',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                  {r.volume_30d} recusas / 30d
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Eficácia por canal */}
      <div style={CARD}>
        <SectionHeader
          eyebrow="EFICÁCIA POR CANAL"
          title="Taxa de conversão por canal usado"
        />
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RECOVERY_BY_CHANNEL} layout="vertical" margin={{ left: 0, right: 14 }}>
              <defs>
                <linearGradient id="channelBar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1ECB9D" />
                  <stop offset="100%" stopColor="#007A5C" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EDEDED" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }} domain={[0, 80]} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="channel" tick={{ fontSize: 11.5, fill: '#0F172A', fontWeight: 600 }} width={90} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  boxShadow: '0 8px 24px -8px rgba(15,23,42,0.18)',
                }}
                cursor={{ fill: 'rgba(0,193,148,0.06)' }}
              />
              <Bar dataKey="rate" fill="url(#channelBar)" radius={[0, 6, 6, 0]} name="Taxa %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Melhores horários */}
      <div style={CARD}>
        <SectionHeader
          eyebrow="MELHORES HORÁRIOS"
          title="Janelas com maior taxa de sucesso"
          badge={`Pico ${bestHour}%`}
        />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 10,
        }}>
          {RECOVERY_BEST_HOURS.map(h => {
            const isBest = h.rate === bestHour;
            const intensity = h.rate / bestHour;
            return (
              <div key={h.hour} style={{
                position: 'relative',
                padding: '14px 10px', textAlign: 'center',
                background: isBest
                  ? 'linear-gradient(135deg, #1ECB9D 0%, #007A5C 100%)'
                  : `rgba(0,193,148,${0.04 + intensity * 0.16})`,
                border: isBest ? '1px solid #00C194' : '1px solid #E2E8F0',
                borderRadius: 12,
                color: isBest ? '#fff' : '#0F172A',
                boxShadow: isBest ? '0 6px 18px -4px rgba(0,193,148,0.42)' : 'none',
                overflow: 'hidden',
              }}>
                {isBest && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 800,
                    color: '#fff', background: 'rgba(255,255,255,0.22)',
                    padding: '1px 5px', borderRadius: 999,
                    letterSpacing: '0.08em',
                  }}>★</div>
                )}
                <Clock size={12} strokeWidth={2.2} style={{ color: isBest ? '#fff' : '#94A3B8', marginBottom: 4 }} />
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 800,
                  letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums',
                  color: isBest ? '#fff' : '#0F172A',
                }}>{h.hour}</div>
                <div style={{
                  fontSize: 10.5, marginTop: 2,
                  color: isBest ? 'rgba(255,255,255,0.82)' : '#64748B',
                  fontWeight: 600,
                }}>
                  {h.rate}% sucesso
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}