import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Sparkles, TrendingUp } from 'lucide-react';
import { TIMELINE_14D, DIVERGENCIAS, SEVERIDADE_META, fmtBRLShort } from '../mocks/myReconciliationMocks';

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
};

export default function MyReconOverviewView() {
  const topDivergencias = [...DIVERGENCIAS]
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16,
    }}>
      {/* Timeline */}
      <div style={CARD}>
        <div style={{ marginBottom: 14 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#007A5C',
          }}>EVOLUÇÃO · 14 DIAS</span>
          <h3 style={{
            fontSize: 15, fontWeight: 700, color: '#0F172A',
            marginTop: 4, margin: 0, letterSpacing: '-0.012em',
          }}>Vendas, recebimentos e taxas cobradas</h3>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TIMELINE_14D} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="vendasFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#002443" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#002443" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="recebidoFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C194" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#00C194" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDEDED" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  boxShadow: '0 8px 24px -8px rgba(15,23,42,0.18)',
                }}
                formatter={(v) => fmtBRLShort(v)}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
              <Area type="monotone" dataKey="vendas" stroke="#002443" strokeWidth={2} fill="url(#vendasFill)" name="Vendas" />
              <Area type="monotone" dataKey="recebido" stroke="#00C194" strokeWidth={2.5} fill="url(#recebidoFill)" name="Recebido" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top divergências por valor */}
      <div style={CARD}>
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>TOP 5 DIVERGÊNCIAS</span>
            <h3 style={{
              fontSize: 15, fontWeight: 700, color: '#0F172A',
              marginTop: 4, margin: 0, letterSpacing: '-0.012em',
            }}>Maiores valores em disputa</h3>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 999,
            background: '#E0F8F1', color: '#007A5C',
            fontSize: 11, fontWeight: 700,
          }}>
            <TrendingUp size={12} strokeWidth={2.5} />
            R$ {fmtBRLShort(topDivergencias.reduce((s, d) => s + d.valor, 0)).replace('R$', '').trim()} total
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topDivergencias.map(d => {
            const sev = SEVERIDADE_META[d.severidade];
            return (
              <div key={d.id} style={{
                padding: '12px 14px',
                background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
                border: '1px solid #E2E8F0',
                borderLeft: `3px solid ${sev.color}`,
                borderRadius: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 7px', borderRadius: 999,
                      background: sev.bg, color: sev.color,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      border: `1px solid ${sev.color}33`,
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: sev.color }} />
                      {sev.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.012em' }}>
                      {d.titulo}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 800,
                    color: '#0F172A', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.018em',
                  }}>
                    {fmtBRLShort(d.valor)}
                  </span>
                </div>
                <div style={{
                  fontSize: 11.5, color: '#475569', lineHeight: 1.5,
                  display: 'flex', alignItems: 'flex-start', gap: 5,
                }}>
                  <Sparkles size={11} strokeWidth={2.2} style={{ color: '#007A5C', marginTop: 2, flexShrink: 0 }} />
                  <span>{d.acao_sugerida}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}