import React, { useState } from 'react';
import MyReconHeader from '@/components/my-reconciliation/MyReconHeader';
import MyReconKpiGrid from '@/components/my-reconciliation/MyReconKpiGrid';
import MyReconSubTabs from '@/components/my-reconciliation/MyReconSubTabs';
import MyReconOverviewView from '@/components/my-reconciliation/views/MyReconOverviewView';
import MyReconSalesView from '@/components/my-reconciliation/views/MyReconSalesView';
import MyReconFeesView from '@/components/my-reconciliation/views/MyReconFeesView';
import MyReconSettlementsView from '@/components/my-reconciliation/views/MyReconSettlementsView';
import MyReconDivergencesView from '@/components/my-reconciliation/views/MyReconDivergencesView';

/**
 * Conciliação Completa · Admin Sub (Merchant)
 *
 * Visão do merchant contra a PagSmile, que é seu sub-adquirente.
 * Não existem adquirentes externos aqui. Tudo é:
 *   Lado A (ERP / pedidos do merchant)  vs.  Lado B (PagSmile)
 *
 * 5 abas:
 *  1. Visão geral
 *  2. Vendas vs PagSmile (confronto pedido a pedido)
 *  3. Taxas cobradas (auditoria contrato vs cobrado)
 *  4. Recebimentos (liquidações e saques)
 *  5. Divergências (lista consolidada com ações)
 */
export default function MyReconciliationAutomated() {
  const [auditorActive, setAuditorActive] = useState(true);
  const [subTab, setSubTab] = useState('overview');

  const renderSubTab = () => {
    switch (subTab) {
      case 'overview':    return <MyReconOverviewView />;
      case 'sales':       return <MyReconSalesView />;
      case 'fees':        return <MyReconFeesView />;
      case 'settlements': return <MyReconSettlementsView />;
      case 'divergences': return <MyReconDivergencesView />;
      default:            return <MyReconOverviewView />;
    }
  };

  return (
    <div
      data-ds="v8"
      style={{
        display: 'flex', flexDirection: 'column', gap: 18,
        padding: 20,
        background: 'var(--v8-bg-canvas, #FAFAFA)',
        minHeight: '100vh',
      }}
    >
      <MyReconHeader
        auditorActive={auditorActive}
        onToggle={() => setAuditorActive(v => !v)}
      />

      <MyReconKpiGrid />

      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
          paddingBottom: 14, marginBottom: 14,
          borderBottom: '1px solid #EDEDED',
        }}>
          <div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>
              CONCILIAÇÃO COMPLETA
            </span>
            <div style={{
              marginTop: 4, fontSize: 16, fontWeight: 700,
              letterSpacing: '-0.018em', color: '#0F172A',
            }}>
              Audite vendas, taxas e recebimentos contra a PagSmile
            </div>
          </div>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
            fontWeight: 600, color: '#64748B',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            5 modos · {subTab}
          </span>
        </div>

        <MyReconSubTabs value={subTab} onChange={setSubTab} />

        <div style={{ marginTop: 16 }}>
          {renderSubTab()}
        </div>
      </div>
    </div>
  );
}