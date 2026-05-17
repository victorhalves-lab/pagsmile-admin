import React, { useState } from 'react';
import { Search, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
import { DIVERGENCES_LIST, DIVERGENCE_BUCKETS, fmtBRL } from '../mocks/reconciliationAutomatedMocks';

const SEVERITY_META = {
  critical: { label: 'Crítico', color: '#B91C1C', bg: '#FEE2E2', accent: '#B91C1C' },
  high:     { label: 'Alto',    color: '#B91C1C', bg: '#FEE2E2', accent: '#DC2626' },
  medium:   { label: 'Médio',   color: '#B45309', bg: '#FEF3C7', accent: '#D97706' },
  low:      { label: 'Baixo',   color: '#64748B', bg: '#F4F4F4', accent: '#94A3B8' },
};

const STATUS_META = {
  detected:      { label: 'Detectada',    color: '#B45309', bg: '#FEF3C7' },
  investigating: { label: 'Investigando', color: '#002443', bg: '#E6ECF2' },
  proposed:      { label: 'Pronta',       color: '#007A5C', bg: '#E0F8F1' },
  resolved:      { label: 'Resolvida',    color: '#007A5C', bg: '#E0F8F1' },
};

const ACTION_META = {
  contest:  { label: 'Contestar', color: '#fff', bg: 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)' },
  escalate: { label: 'Escalar',   color: '#fff', bg: 'linear-gradient(180deg, #DC2626 0%, #B91C1C 100%)' },
  adjust:   { label: 'Ajustar',   color: '#fff', bg: 'linear-gradient(180deg, #013766 0%, #002443 100%)' },
};

export default function ReconDivergencesView() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = DIVERGENCES_LIST.filter(d => {
    if (filter !== 'all' && d.bucket !== filter) return false;
    if (search && !d.id.toLowerCase().includes(search.toLowerCase()) && !d.transaction_id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 18px',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>
              DIVERGÊNCIAS DETECTADAS
            </span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.012em' }}>
              {filtered.length} de {DIVERGENCES_LIST.length} casos
            </div>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 36, padding: '0 12px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 10, width: 280,
            transition: 'border-color .14s, box-shadow .14s',
          }}>
            <Search size={14} style={{ color: '#94A3B8' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por ID ou transação..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 12, color: '#0F172A',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button" onClick={() => setFilter('all')}
            style={{
              padding: '6px 12px', borderRadius: 999,
              fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700,
              cursor: 'pointer',
              background: filter === 'all' ? 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)' : '#FFFFFF',
              color: filter === 'all' ? '#fff' : '#475569',
              border: filter === 'all' ? '1px solid #00C194' : '1px solid #E2E8F0',
              boxShadow: filter === 'all' ? '0 2px 6px -1px rgba(0,193,148,0.32)' : 'none',
            }}
          >Todos</button>
          {DIVERGENCE_BUCKETS.map(b => {
            const isActive = filter === b.id;
            return (
              <button
                key={b.id}
                type="button" onClick={() => setFilter(b.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 999,
                  fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer',
                  background: isActive ? 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)' : '#FFFFFF',
                  color: isActive ? '#fff' : '#475569',
                  border: isActive ? '1px solid #00C194' : '1px solid #E2E8F0',
                  boxShadow: isActive ? '0 2px 6px -1px rgba(0,193,148,0.32)' : 'none',
                }}
              >
                <code style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9.5, fontWeight: 800,
                  padding: '1px 5px', borderRadius: 3,
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                  color: isActive ? '#fff' : '#475569',
                  letterSpacing: '0.04em',
                }}>{b.code}</code>
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de divergências */}
      <div>
        {filtered.map((d, idx) => {
          const sev = SEVERITY_META[d.severity];
          const st = STATUS_META[d.status];
          const isLast = idx === filtered.length - 1;
          const action = ACTION_META[d.proposed_action];

          return (
            <div key={d.id} style={{
              padding: '16px 18px',
              borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
              borderLeft: `3px solid ${sev.accent}`,
              display: 'grid',
              gridTemplateColumns: '40px minmax(180px, 1fr) minmax(240px, 2fr) auto auto 16px',
              gap: 16, alignItems: 'center',
              transition: 'background .14s',
              cursor: 'pointer',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: sev.bg, color: sev.color,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <AlertTriangle size={17} strokeWidth={2} />
              </div>

              {/* IDs + status pill */}
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 800,
                  color: '#0F172A', letterSpacing: '-0.01em',
                }}>
                  {d.id}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
                    color: '#64748B',
                  }}>{d.transaction_id}</span>
                  <span style={{ fontSize: 10, color: '#CBD5E1' }}>·</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: '#0F172A',
                  }}>{d.acquirer}</span>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  marginTop: 6,
                  padding: '2px 8px', borderRadius: 999,
                  background: st.bg, color: st.color,
                  fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  border: `1px solid ${st.color}33`,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.color }} />
                  {st.label}
                </span>
              </div>

              {/* Root cause */}
              <div style={{
                fontSize: 12.5, color: '#1E293B',
                lineHeight: 1.5, padding: '8px 12px',
                background: '#F8FAFC',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.14em',
                  color: '#007A5C', marginBottom: 4,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Sparkles size={9} strokeWidth={2.5} />
                  CAUSA RAIZ · {d.agent_confidence}% CONFIANÇA
                </div>
                {d.root_cause}
              </div>

              {/* Delta */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 16, fontWeight: 800,
                  color: d.delta < 0 ? '#B91C1C' : d.delta === 0 ? '#64748B' : '#007A5C',
                  fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
                }}>
                  {d.delta > 0 ? '+' : ''}{fmtBRL(d.delta)}
                </div>
                <div style={{
                  fontSize: 10, color: '#94A3B8', marginTop: 2,
                  textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
                }}>diferença</div>
              </div>

              {/* Ação proposta */}
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '6px 12px', borderRadius: 8,
                  background: action.bg,
                  color: action.color,
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 6px -1px rgba(0,0,0,0.15)',
                  whiteSpace: 'nowrap',
                }}>
                  {action.label}
                </span>
              </div>

              <ChevronRight size={16} strokeWidth={2} style={{ color: '#94A3B8' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}