import React, { useState } from 'react';
import { Search, AlertTriangle, ChevronRight, Sparkles, FileText } from 'lucide-react';
import {
  DIVERGENCIAS, DIVERGENCE_BUCKETS_LABELS, SEVERIDADE_META, STATUS_DIV_META, fmtBRLShort,
} from '../mocks/myReconciliationMocks';

export default function MyReconDivergencesView() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = DIVERGENCIAS.filter(d => {
    if (filter !== 'all' && d.bucket !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!d.id.toLowerCase().includes(q) && !d.titulo.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const bucketsAtivos = [...new Set(DIVERGENCIAS.map(d => d.bucket))];

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
    }}>
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
            }}>DIVERGÊNCIAS DETECTADAS</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.012em' }}>
              {filtered.length} de {DIVERGENCIAS.length} casos abertos
            </div>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 36, padding: '0 12px',
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 10, width: 280,
          }}>
            <Search size={14} style={{ color: '#94A3B8' }} />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título ou ID..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 12, color: '#0F172A',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <BucketPill label="Todos" active={filter === 'all'} onClick={() => setFilter('all')} />
          {bucketsAtivos.map(b => {
            const meta = DIVERGENCE_BUCKETS_LABELS[b];
            const count = DIVERGENCIAS.filter(d => d.bucket === b).length;
            return (
              <BucketPill
                key={b} label={meta.label} count={count}
                color={meta.color}
                active={filter === b}
                onClick={() => setFilter(b)}
              />
            );
          })}
        </div>
      </div>

      <div>
        {filtered.map((d, idx) => {
          const sev = SEVERIDADE_META[d.severidade];
          const st = STATUS_DIV_META[d.status];
          const isLast = idx === filtered.length - 1;
          const canContest = d.status === 'pronta_contestar';

          return (
            <div key={d.id} style={{
              padding: '16px 18px',
              borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
              borderLeft: `3px solid ${sev.color}`,
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto auto',
              gap: 14, alignItems: 'flex-start',
              transition: 'background .14s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: sev.bg, color: sev.color,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <AlertTriangle size={17} strokeWidth={2} />
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <code style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 800,
                    color: '#0F172A', background: '#F1F5F9',
                    padding: '2px 7px', borderRadius: 5,
                  }}>{d.id}</code>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '2px 7px', borderRadius: 999,
                    background: sev.bg, color: sev.color,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    border: `1px solid ${sev.color}33`,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: sev.color }} />
                    {sev.label}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '2px 7px', borderRadius: 999,
                    background: st.bg, color: st.color,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    border: `1px solid ${st.color}33`,
                  }}>{st.label}</span>
                </div>

                <div style={{
                  fontSize: 14, fontWeight: 700, color: '#0F172A',
                  letterSpacing: '-0.012em', marginBottom: 4,
                }}>{d.titulo}</div>

                <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
                  {d.descricao}
                </div>

                <div style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(180deg, #E0F8F1 0%, #F4FCF8 100%)',
                  border: '1px solid rgba(0,193,148,0.32)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                }}>
                  <Sparkles size={11} strokeWidth={2.2} style={{ color: '#007A5C', marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: '#1E293B', lineHeight: 1.5 }}>
                    <strong style={{ color: '#007A5C', fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      AUDITOR · {d.auditor_confidence}% CONFIANÇA
                    </strong>
                    <div style={{ marginTop: 3 }}>{d.acao_sugerida}</div>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 800,
                  color: d.valor > 1000 ? '#B91C1C' : '#0F172A',
                  letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                }}>{fmtBRLShort(d.valor)}</div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                  color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 2,
                }}>impacto</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                {canContest ? (
                  <button type="button" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    height: 32, padding: '0 14px', borderRadius: 10,
                    background: 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)',
                    color: '#fff', border: '1px solid #009E78',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: '0 4px 10px -2px rgba(0,193,148,0.42)',
                  }}>
                    <FileText size={12} strokeWidth={2.2} />
                    Contestar
                  </button>
                ) : (
                  <button type="button" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    height: 32, padding: '0 14px', borderRadius: 10,
                    background: '#FFFFFF',
                    color: '#475569', border: '1px solid #E2E8F0',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>
                    Detalhes
                    <ChevronRight size={12} strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BucketPill({ label, count, color = '#475569', active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '6px 12px', borderRadius: 999,
      fontFamily: 'Inter, sans-serif', fontSize: 11.5, fontWeight: 700,
      cursor: 'pointer',
      background: active ? 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)' : '#FFFFFF',
      color: active ? '#fff' : color,
      border: active ? '1px solid #00C194' : '1px solid #E2E8F0',
    }}>
      {label}
      {count !== undefined && (
        <span style={{
          display: 'inline-grid', placeItems: 'center',
          minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
          background: active ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
          color: active ? '#fff' : color,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 800,
        }}>{count}</span>
      )}
    </button>
  );
}