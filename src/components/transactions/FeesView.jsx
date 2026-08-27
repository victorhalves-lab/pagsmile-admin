import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { decomposeFees } from '@/lib/decomposeFees';
import FeesKpiBar from './FeesKpiBar';
import { useTransactionsContext } from './hub/TransactionsContext';
import StatusBadge from '@/components/common/StatusBadge';
import PixFlowBadge from './pix/PixFlowBadge';
import { ChevronRight, CreditCard, QrCode, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const fmtPct = (v) => `${(v || 0).toFixed(2)}%`;

const v9ThStyle = (extra = {}) => ({
  background: 'transparent',
  color: '#5CF7CF',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  padding: '14px 16px',
  textAlign: 'left',
  position: 'relative',
  whiteSpace: 'nowrap',
  borderBottom: 'none',
  userSelect: 'none',
  ...extra,
});

const v9TdStyle = {
  padding: '14px 16px',
  borderBottom: '1px solid #B3F0DE',
  fontSize: 13,
  verticalAlign: 'middle',
  color: '#001124',
};

const v9TblStyle = {
  borderRadius: 16,
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #fff, #FAFEFC)',
  border: '1px solid #80E5C6',
  boxShadow: '0 8px 24px -8px rgba(0, 193, 148, .15)',
};

export default function FeesView() {
  const { stickyFilters } = useTransactionsContext();
  const [expandedRows, setExpandedRows] = useState(new Set());

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', 'fees-view'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 500),
  });

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (stickyFilters.search) {
      const s = stickyFilters.search.toLowerCase();
      result = result.filter(tx =>
        tx.transaction_id?.toLowerCase().includes(s) ||
        tx.customer?.name?.toLowerCase().includes(s) ||
        tx.merchant_name?.toLowerCase().includes(s)
      );
    }
    if (stickyFilters.method && stickyFilters.method !== 'all') {
      result = result.filter(tx => tx.method === stickyFilters.method || tx.type === stickyFilters.method);
    }
    if (stickyFilters.statuses?.length) {
      result = result.filter(tx => stickyFilters.statuses.includes(tx.status));
    }
    // Apenas transações com valor (ignora recusas sem custo)
    result = result.filter(tx => tx.amount > 0 && tx.status !== 'refused' && tx.status !== 'error');
    return result;
  }, [transactions, stickyFilters]);

  const toggleRow = (id) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div style={v9TblStyle}>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FeesKpiBar transactions={filtered} />

      <div style={v9TblStyle}>
        <style>{`
          .v9fees-row:hover td { background: linear-gradient(90deg, #E0F8F1, transparent) !important; }
          .v9fees-row:hover td:first-child { box-shadow: inset 4px 0 0 #00C194; }
        `}</style>

        <div className="flex items-center px-4 py-3" style={{ borderBottom: '1px solid #B3F0DE', background: 'linear-gradient(90deg, #F0FAF6, #fff)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 800,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: '#007A5C',
          }}>
            <span style={{ width: 18, height: 2, background: '#00C194', borderRadius: 99 }} />
            {filtered.length > 0 ? `${filtered.length} transações` : 'Sem transações'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'linear-gradient(180deg, #001124, #002443)' }}>
              <tr>
                <th style={v9ThStyle({ width: 44 })}></th>
                <th style={v9ThStyle()}>Transação</th>
                <th style={v9ThStyle()}>Merchant</th>
                <th style={v9ThStyle()}>Método</th>
                <th style={v9ThStyle({ textAlign: 'right' })}>Valor Bruto</th>
                <th style={v9ThStyle({ textAlign: 'right' })}>Total Taxas</th>
                <th style={v9ThStyle({ textAlign: 'right' })}>Taxa Efetiva</th>
                <th style={v9ThStyle({ textAlign: 'right' })}>Líquido</th>
                <th style={v9ThStyle({ width: 44 })}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center" style={{ height: 128, color: '#547C9D', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, padding: '14px 16px' }}>
                    Nenhuma transação com custo para exibir
                  </td>
                </tr>
              ) : (
                filtered.slice(0, 100).map((row) => {
                  const fees = decomposeFees(row);
                  const isExpanded = expandedRows.has(row.id);
                  const isPix = row.method === 'pix' || row.type === 'pix';
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className="v9fees-row"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleRow(row.id)}
                      >
                        <td style={v9TdStyle}>
                          <ChevronRight className={cn('w-4 h-4 text-slate-400 transition-transform', isExpanded && 'rotate-90')} />
                        </td>
                        <td style={v9TdStyle}>
                          <div className="flex items-center gap-2">
                            <div className={cn('v9ic v9ic-sm', isPix ? 'v9ic-mint' : 'v9ic-blue')}>
                              {isPix ? <QrCode strokeWidth={2.2} /> : <CreditCard strokeWidth={2.2} />}
                            </div>
                            <span className="font-mono text-[11.5px]">{row.transaction_id?.slice(0, 10)}...</span>
                          </div>
                        </td>
                        <td style={v9TdStyle}>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[160px] uppercase">{row.merchant_name || 'N/A'}</p>
                        </td>
                        <td style={v9TdStyle}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-600">{isPix ? 'PIX' : row.card?.brand ? `Cartão · ${row.card.brand}` : 'Cartão'}</span>
                            {isPix && <PixFlowBadge flow={row.pix_flow || 'manual'} size="xs" />}
                          </div>
                          <StatusBadge status={row.status} size="xs" />
                        </td>
                        <td style={{ ...v9TdStyle, textAlign: 'right' }}>
                          <span className="font-semibold text-gray-900">{fmt(row.amount)}</span>
                          {row.installments > 1 && (
                            <p className="text-[10px] text-slate-500 font-mono">{row.installments}x</p>
                          )}
                        </td>
                        <td style={{ ...v9TdStyle, textAlign: 'right' }}>
                          <span className="font-bold text-rose-700">{fmt(fees.totalFees)}</span>
                        </td>
                        <td style={{ ...v9TdStyle, textAlign: 'right' }}>
                          <span className="font-mono text-xs text-slate-600">{fmtPct(fees.effectiveRate)}</span>
                        </td>
                        <td style={{ ...v9TdStyle, textAlign: 'right' }}>
                          <span className="font-bold text-emerald-700">{fmt(fees.netAfterFees)}</span>
                        </td>
                        <td style={v9TdStyle}>
                          <Link to={`${createPageUrl('TransactionDetail')}?id=${row.id}`} onClick={(e) => e.stopPropagation()}>
                            <Eye className="w-4 h-4 text-slate-400 hover:text-emerald-600" />
                          </Link>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr style={{ background: '#F0FAF6' }}>
                          <td style={v9TdStyle}></td>
                          <td colSpan={8} style={{ ...v9TdStyle, padding: '12px 16px 16px' }}>
                            <div className="max-w-md">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Breakdown de Taxas</span>
                                {fees.isEstimated && (
                                  <span className="pill-st" style={{ fontSize: 9, padding: '2px 6px' }}>estimado</span>
                                )}
                              </div>
                              <div className="space-y-1">
                                {fees.components.map((c) => (
                                  <div key={c.key} className="flex justify-between text-xs">
                                    <span className="text-slate-600">
                                      {c.label}
                                      {c.rate != null && c.rate > 0 && (
                                        <span className="text-slate-400 ml-1 font-mono">({c.rate.toFixed(2)}%)</span>
                                      )}
                                    </span>
                                    <span className="font-mono text-slate-700">{fmt(c.value)}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between text-xs border-t border-slate-200 pt-1 mt-1">
                                  <span className="font-semibold text-slate-700">Total de Taxas</span>
                                  <span className="font-bold text-rose-700 font-mono">{fmt(fees.totalFees)}</span>
                                </div>
                                <div className="flex justify-between text-xs pt-0.5">
                                  <span className="font-semibold text-slate-700">Líquido ao Merchant</span>
                                  <span className="font-bold text-emerald-700 font-mono">{fmt(fees.netAfterFees)}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 100 && (
          <div className="px-4 py-3 text-center text-xs text-slate-500" style={{ borderTop: '1px solid #B3F0DE', background: 'linear-gradient(180deg, #fff, #F0FAF6)' }}>
            Exibindo as 100 primeiras de {filtered.length} transações · use os filtros para refinar
          </div>
        )}
      </div>
    </div>
  );
}