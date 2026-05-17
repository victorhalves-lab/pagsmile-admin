import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, FileUp, ShoppingCart, X } from 'lucide-react';
import { VENDAS_VS_PAGSMILE, fmtBRL } from '../mocks/myReconciliationMocks';

const STATUS_META = {
  match:          { label: 'Bate',                 color: '#007A5C', bg: '#E0F8F1', icon: CheckCircle2 },
  erp_only:       { label: 'Só no ERP',            color: '#B45309', bg: '#FEF3C7', icon: AlertTriangle },
  pagsmile_only:  { label: 'Só na PagSmile',       color: '#013766', bg: '#E6ECF2', icon: AlertTriangle },
  value_mismatch: { label: 'Valor divergente',     color: '#B91C1C', bg: '#FEE2E2', icon: X },
};

const METHOD_BADGE = {
  pix:         { label: 'PIX',     color: '#007A5C', bg: '#E0F8F1' },
  credit_card: { label: 'Cartão',  color: '#013766', bg: '#E6ECF2' },
  boleto:      { label: 'Boleto',  color: '#B45309', bg: '#FEF3C7' },
};

export default function MyReconSalesView() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = VENDAS_VS_PAGSMILE.filter(v => {
    if (filter !== 'all' && v.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const inErp = (v.erp_order || '').toLowerCase().includes(q);
      const inTx  = (v.pagsmile_tx || '').toLowerCase().includes(q);
      if (!inErp && !inTx) return false;
    }
    return true;
  });

  const stats = {
    match:          VENDAS_VS_PAGSMILE.filter(v => v.status === 'match').length,
    erp_only:       VENDAS_VS_PAGSMILE.filter(v => v.status === 'erp_only').length,
    pagsmile_only:  VENDAS_VS_PAGSMILE.filter(v => v.status === 'pagsmile_only').length,
    value_mismatch: VENDAS_VS_PAGSMILE.filter(v => v.status === 'value_mismatch').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Banner upload do ERP */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #E0F8F1 0%, #F4FCF8 100%)',
        border: '1px solid rgba(0,193,148,0.32)',
        borderRadius: 14, flexWrap: 'wrap',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, #1ECB9D 0%, #007A5C 100%)',
          color: '#fff',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 6px 16px -4px rgba(0,193,148,0.42)',
          flexShrink: 0,
        }}>
          <ShoppingCart size={18} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#007A5C',
          }}>VENDAS DO ERP VS PAGSMILE</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.012em' }}>
            Confronto pedido a pedido. Importe seu CSV de vendas para auditoria completa.
          </div>
        </div>
        <button type="button" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          height: 36, padding: '0 16px', borderRadius: 10,
          background: '#FFFFFF',
          border: '1px solid rgba(0,193,148,0.32)',
          color: '#007A5C',
          fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}>
          <FileUp size={14} strokeWidth={2.2} />
          Importar CSV
        </button>
      </div>

      {/* Pills de filtro com contagem */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
      }}>
        <div style={{
          padding: '14px 18px',
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <FilterPill label="Todos" count={VENDAS_VS_PAGSMILE.length} active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterPill label="Bate" count={stats.match} color="#007A5C" active={filter === 'match'} onClick={() => setFilter('match')} />
            <FilterPill label="Só no ERP" count={stats.erp_only} color="#B45309" active={filter === 'erp_only'} onClick={() => setFilter('erp_only')} />
            <FilterPill label="Só na PagSmile" count={stats.pagsmile_only} color="#013766" active={filter === 'pagsmile_only'} onClick={() => setFilter('pagsmile_only')} />
            <FilterPill label="Valor divergente" count={stats.value_mismatch} color="#B91C1C" active={filter === 'value_mismatch'} onClick={() => setFilter('value_mismatch')} />
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 34, padding: '0 12px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 10, width: 240,
          }}>
            <Search size={13} style={{ color: '#94A3B8' }} />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pedido ou transação..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 12, color: '#0F172A',
              }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Pedido (ERP)', 'Transação (PagSmile)', 'Método', 'Valor ERP', 'Valor PagSmile', 'Delta', 'Status'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 16px',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: '#64748B', fontWeight: 700,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, idx) => {
              const meta = STATUS_META[v.status];
              const StIcon = meta.icon;
              const method = METHOD_BADGE[v.method];
              return (
                <tr key={v.id} style={{ borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: v.erp_order ? '#0F172A' : '#CBD5E1' }}>
                    {v.erp_order || '-'}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: v.pagsmile_tx ? '#0F172A' : '#CBD5E1' }}>
                    {v.pagsmile_tx || '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 999,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      background: method.bg, color: method.color,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{method.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: v.erp_value !== null ? '#0F172A' : '#CBD5E1', fontVariantNumeric: 'tabular-nums' }}>
                    {v.erp_value !== null ? fmtBRL(v.erp_value) : '-'}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: v.pagsmile_value !== null ? '#0F172A' : '#CBD5E1', fontVariantNumeric: 'tabular-nums' }}>
                    {v.pagsmile_value !== null ? fmtBRL(v.pagsmile_value) : '-'}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: v.delta === 0 ? '#94A3B8' : v.delta < 0 ? '#B91C1C' : '#007A5C' }}>
                    {v.delta === 0 ? '-' : `${v.delta > 0 ? '+' : ''}${fmtBRL(v.delta)}`}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 9px', borderRadius: 999,
                      background: meta.bg, color: meta.color,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      border: `1px solid ${meta.color}33`,
                    }}>
                      <StIcon size={10} strokeWidth={2.5} />
                      {meta.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterPill({ label, count, color = '#475569', active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 999,
      fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700,
      cursor: 'pointer',
      background: active ? 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)' : '#FFFFFF',
      color: active ? '#fff' : color,
      border: active ? '1px solid #00C194' : '1px solid #E2E8F0',
    }}>
      {label}
      <span style={{
        display: 'inline-grid', placeItems: 'center',
        minWidth: 18, height: 18, padding: '0 5px',
        borderRadius: 999,
        background: active ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
        color: active ? '#fff' : color,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, fontWeight: 800,
      }}>{count}</span>
    </button>
  );
}