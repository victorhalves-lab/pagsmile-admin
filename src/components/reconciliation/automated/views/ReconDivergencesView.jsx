import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { DIVERGENCES_LIST, DIVERGENCE_BUCKETS, fmtBRL } from '../mocks/reconciliationAutomatedMocks';

const SEVERITY_META = {
  critical: { label: 'Crítico', color: 'var(--sys-danger)' },
  high: { label: 'Alto', color: 'var(--sys-danger)' },
  medium: { label: 'Médio', color: 'var(--sys-warn)' },
  low: { label: 'Baixo', color: 'var(--v8-fg-muted)' },
};

const STATUS_META = {
  detected: { label: 'Detectada', color: 'var(--sys-warn)' },
  investigating: { label: 'Investigando', color: 'var(--pag-blue-700)' },
  proposed: { label: 'Pronta', color: 'var(--pag-mint-700)' },
  resolved: { label: 'Resolvida', color: 'var(--pag-mint-500)' },
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
    <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--v8-bd-default)',
        background: 'var(--v8-bg-surface-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <div>
            <span className="v8-eyebrow">DIVERGÊNCIAS DETECTADAS</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
              {filtered.length} de {DIVERGENCES_LIST.length} casos
            </div>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 32, padding: '0 10px',
            background: 'var(--v8-bg-surface)',
            border: '1px solid var(--v8-bd-default)',
            borderRadius: 8, width: 260,
          }}>
            <Search size={13} style={{ color: 'var(--v8-fg-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por ID ou transação..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 12, color: 'var(--v8-fg-strong)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button" onClick={() => setFilter('all')}
            className={filter === 'all' ? 'v8-pill v8-pill--brand' : 'v8-pill v8-pill--neutral'}
            style={{ cursor: 'pointer', border: 'none', height: 26, fontSize: 11 }}
          >Todos</button>
          {DIVERGENCE_BUCKETS.map(b => (
            <button
              key={b.id}
              type="button" onClick={() => setFilter(b.id)}
              className={filter === b.id ? 'v8-pill v8-pill--brand' : 'v8-pill v8-pill--neutral'}
              style={{ cursor: 'pointer', border: 'none', height: 26, fontSize: 11 }}
            >
              {b.code} · {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {filtered.map(d => {
          const sev = SEVERITY_META[d.severity];
          const st = STATUS_META[d.status];
          return (
            <div key={d.id} style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--v8-bd-subtle)',
              borderLeft: `3px solid ${sev.color}`,
              display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              <AlertTriangle size={16} style={{ color: sev.color, flexShrink: 0 }} />
              <div style={{ minWidth: 200 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--v8-fg-strong)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {d.id}
                </div>
                <div style={{ fontSize: 10, color: 'var(--v8-fg-muted)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                  {d.transaction_id} · {d.acquirer}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 240, fontSize: 12, color: 'var(--v8-fg-default)' }}>
                {d.root_cause}
              </div>
              <div style={{ textAlign: 'right' }} className="v8-num">
                <div style={{ fontSize: 14, fontWeight: 700, color: d.delta < 0 ? 'var(--sys-danger)' : 'var(--pag-mint-700)' }}>
                  {d.delta > 0 ? '+' : ''}{fmtBRL(d.delta)}
                </div>
                <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)' }}>diferença</div>
              </div>
              <span style={{
                padding: '2px 8px', borderRadius: 999,
                background: 'var(--v8-bg-surface-2)',
                border: `1px solid ${st.color}40`,
                fontSize: 10, fontWeight: 700, color: st.color,
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}