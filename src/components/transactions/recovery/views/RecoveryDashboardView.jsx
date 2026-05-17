import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import {
  RECOVERY_TREND_14D, RECOVERY_BY_CHANNEL, RECOVERY_BEST_HOURS, DECLINE_REASONS,
} from '../mocks/recoveryAgentMocks';

export default function RecoveryDashboardView() {
  const topReasons = [...DECLINE_REASONS].sort((a, b) => b.volume_30d - a.volume_30d).slice(0, 6);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16,
    }}>
      {/* Evolução */}
      <div className="v8-card" style={{ padding: 18 }}>
        <span className="v8-eyebrow">EVOLUÇÃO · 14 DIAS</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
          marginTop: 4, marginBottom: 14,
        }}>Valor recuperado vs taxa de sucesso</h3>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RECOVERY_TREND_14D}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--v8-bd-subtle)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--v8-fg-muted)' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'var(--v8-fg-muted)' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: 'var(--v8-fg-muted)' }} />
              <Tooltip
                contentStyle={{
                  fontSize: 11, borderRadius: 8, border: '1px solid var(--v8-bd-default)',
                  background: 'var(--v8-bg-surface)',
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="recovered" stroke="var(--pag-mint-500)" strokeWidth={2} dot={false} name="R$ recuperado" />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="var(--pag-blue-700)" strokeWidth={2} dot={false} name="Taxa %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top motivos de recusa */}
      <div className="v8-card" style={{ padding: 18 }}>
        <span className="v8-eyebrow">TOP 6 MOTIVOS DE RECUSA</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
          marginTop: 4, marginBottom: 14,
        }}>Onde está o maior volume de recuperação</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topReasons.map(r => (
            <div key={r.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <code style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                    color: 'var(--v8-fg-muted)',
                    background: 'var(--v8-bg-surface-3)',
                    padding: '1px 5px', borderRadius: 4,
                  }}>{r.code}</code>
                  <span style={{ fontSize: 12, color: 'var(--v8-fg-strong)', fontWeight: 500 }}>{r.label}</span>
                </div>
                <span className="v8-num" style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--v8-fg-success)',
                }}>{r.recovery_rate}%</span>
              </div>
              <div style={{
                width: '100%', height: 4, borderRadius: 2,
                background: 'var(--v8-bg-surface-3)', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(r.volume_30d / topReasons[0].volume_30d) * 100}%`,
                  height: '100%', background: 'var(--pag-mint-500)',
                }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)', marginTop: 2 }}>
                {r.volume_30d} recusas / 30d
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eficácia por canal */}
      <div className="v8-card" style={{ padding: 18 }}>
        <span className="v8-eyebrow">EFICÁCIA POR CANAL</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
          marginTop: 4, marginBottom: 14,
        }}>Taxa de conversão por canal usado</h3>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RECOVERY_BY_CHANNEL} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--v8-bd-subtle)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--v8-fg-muted)' }} domain={[0, 80]} />
              <YAxis type="category" dataKey="channel" tick={{ fontSize: 11, fill: 'var(--v8-fg-strong)' }} width={80} />
              <Tooltip
                contentStyle={{
                  fontSize: 11, borderRadius: 8, border: '1px solid var(--v8-bd-default)',
                  background: 'var(--v8-bg-surface)',
                }}
              />
              <Bar dataKey="rate" fill="var(--pag-mint-500)" radius={[0, 4, 4, 0]} name="Taxa %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Melhores horários */}
      <div className="v8-card" style={{ padding: 18 }}>
        <span className="v8-eyebrow">MELHORES HORÁRIOS</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
          marginTop: 4, marginBottom: 14,
        }}>Janelas com maior taxa de sucesso</h3>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 8,
        }}>
          {RECOVERY_BEST_HOURS.map(h => {
            const isBest = h.rate === Math.max(...RECOVERY_BEST_HOURS.map(x => x.rate));
            return (
              <div key={h.hour} style={{
                padding: '14px 10px', textAlign: 'center',
                background: isBest ? 'var(--pag-mint-50)' : 'var(--v8-bg-surface-2)',
                border: `1px solid ${isBest ? 'var(--v8-bd-brand)' : 'var(--v8-bd-default)'}`,
                borderRadius: 10,
              }}>
                <div className="v8-num" style={{
                  fontSize: 22, fontWeight: 700,
                  color: isBest ? 'var(--pag-mint-700)' : 'var(--v8-fg-strong)',
                  letterSpacing: 'var(--tr-tighter)',
                }}>{h.hour}</div>
                <div style={{ fontSize: 10, color: 'var(--v8-fg-muted)', marginTop: 2 }}>
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