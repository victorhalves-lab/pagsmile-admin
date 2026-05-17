import React from 'react';
import { LayoutDashboard, ShoppingCart, Percent, Banknote, AlertTriangle } from 'lucide-react';

const TABS = [
  { id: 'overview',    label: 'Visão geral',           icon: LayoutDashboard },
  { id: 'sales',       label: 'Vendas vs PagSmile',    icon: ShoppingCart },
  { id: 'fees',        label: 'Taxas cobradas',        icon: Percent },
  { id: 'settlements', label: 'Recebimentos',          icon: Banknote },
  { id: 'divergences', label: 'Divergências',          icon: AlertTriangle, badge: 6 },
];

export default function MyReconSubTabs({ value, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      padding: 4,
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: 12,
      overflowX: 'auto',
    }}>
      {TABS.map(tab => {
        const Icon = tab.icon;
        const active = value === tab.id;
        return (
          <button
            key={tab.id} type="button"
            onClick={() => onChange(tab.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 14px', borderRadius: 9,
              fontFamily: 'Inter, sans-serif',
              fontSize: 12.5, fontWeight: 700,
              cursor: 'pointer', whiteSpace: 'nowrap',
              background: active ? '#FFFFFF' : 'transparent',
              color: active ? '#007A5C' : '#475569',
              border: active ? '1px solid #E2E8F0' : '1px solid transparent',
              boxShadow: active ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
              transition: 'all .14s',
              letterSpacing: '-0.01em',
            }}
          >
            <Icon size={14} strokeWidth={active ? 2.2 : 1.9} />
            {tab.label}
            {tab.badge && (
              <span style={{
                display: 'inline-grid', placeItems: 'center',
                minWidth: 18, height: 18, padding: '0 5px',
                borderRadius: 999,
                background: active ? '#B91C1C' : '#FEE2E2',
                color: active ? '#fff' : '#B91C1C',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, fontWeight: 800,
              }}>{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}