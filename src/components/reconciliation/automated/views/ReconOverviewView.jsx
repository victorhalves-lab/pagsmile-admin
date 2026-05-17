import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { RECON_TREND_14D, DIVERGENCE_BUCKETS, fmtBRLFromReais } from '../mocks/reconciliationAutomatedMocks';

export default function ReconOverviewView() {
  const topDivergences = [...DIVERGENCE_BUCKETS].sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: 16,
    }}>
      {/* Trend */}
      <div className="v8-card" style={{ padding: 18 }}>
        <span className="v8-eyebrow">EVOLUÇÃO · 14 DIAS</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
          marginTop: 4, marginBottom: 14,
        }}>Matches vs divergências detectadas</h3>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RECON_TREND_14D}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--v8-bd-subtle)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--v8-fg-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--v8-fg-muted)' }} />
              <Tooltip contentStyle={{
                fontSize: 11, borderRadius: 8,
                border: '1px solid var(--v8-bd-default)',
                background: 'var(--v8-bg-surface)',
              }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="matched" stroke="var(--pag-mint-500)" strokeWidth={2} dot={false} name="Conciliados" />
              <Line type="monotone" dataKey="divergent" stroke="var(--sys-danger)" strokeWidth={2} dot={false} name="Divergentes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top divergências */}
      <div className="v8-card" style={{ padding: 18 }}>
        <span className="v8-eyebrow">TOP 5 BUCKETS POR VALOR</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
          marginTop: 4, marginBottom: 14,
        }}>Onde está o maior dinheiro em jogo</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topDivergences.map(b => (
            <div key={b.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <code style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                    color: 'var(--v8-fg-muted)',
                    background: 'var(--v8-bg-surface-3)',
                    padding: '1px 5px', borderRadius: 4,
                  }}>{b.code}</code>
                  <span style={{ fontSize: 12, color: 'var(--v8-fg-strong)', fontWeight: 500 }}>{b.label}</span>
                </div>
                <span className="v8-num" style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--sys-danger)',
                }}>{fmtBRLFromReais(b.value)}</span>
              </div>
              <div style={{
                width: '100%', height: 4, borderRadius: 2,
                background: 'var(--v8-bg-surface-3)', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(b.value / topDivergences[0].value) * 100}%`,
                  height: '100%', background: 'var(--sys-danger)',
                }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)', marginTop: 2 }}>
                {b.count} casos
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}