import React from 'react';
import { BarChart3, FileText, AlertCircle, FileSignature, Calendar, HelpCircle } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
  { id: 'files', label: 'Arquivos', icon: FileText, badge: 4 },
  { id: 'divergences', label: 'Divergências', icon: AlertCircle, badge: 47, accent: true },
  { id: 'adjustments', label: 'Ajustes Propostos', icon: FileSignature, badge: 3 },
  { id: 'schedule', label: 'Cronograma', icon: Calendar },
  { id: 'how', label: 'Como funciona', icon: HelpCircle },
];

export default function ReconSubTabs({ value, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 4, padding: 6,
      background: 'var(--v8-bg-surface-2)',
      border: '1px solid var(--v8-bd-default)',
      borderRadius: 12,
      overflowX: 'auto',
    }}>
      {TABS.map(t => {
        const Icon = t.icon;
        const isActive = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              height: 34, padding: '0 14px',
              background: isActive ? 'var(--v8-bg-surface)' : 'transparent',
              border: isActive ? '1px solid var(--v8-bd-default)' : '1px solid transparent',
              borderRadius: 8,
              fontFamily: 'Inter, sans-serif', fontSize: 12,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--v8-fg-strong)' : 'var(--v8-fg-muted)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: isActive ? 'var(--sh-xs)' : 'none',
              transition: 'all .14s var(--ease-out)',
            }}
          >
            <Icon size={13} strokeWidth={isActive ? 2.2 : 1.8} />
            {t.label}
            {t.badge != null && (
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                padding: '1px 6px', borderRadius: 999,
                background: t.accent ? 'var(--sys-danger)' : 'var(--pag-mint-500)',
                color: '#fff', minWidth: 18, textAlign: 'center',
              }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}