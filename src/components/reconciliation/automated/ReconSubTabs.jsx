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

/**
 * Tabs V8 oficial — underline mint estilo .s-tabs do V8 standalone.
 */
export default function ReconSubTabs({ value, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 4, alignItems: 'center',
      borderBottom: '1px solid #E2E8F0',
      flexWrap: 'wrap',
      marginBottom: 4,
    }}>
      {TABS.map(t => {
        const Icon = t.icon;
        const active = value === t.id;
        const accentColor = t.accent ? '#B45309' : '#00C194';
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            style={{
              padding: '10px 14px',
              fontFamily: 'Inter, sans-serif',
              fontSize: 12.5,
              fontWeight: active ? 700 : 600,
              color: active ? '#0F172A' : '#64748B',
              borderBottom: `2px solid ${active ? accentColor : 'transparent'}`,
              borderTop: 0, borderLeft: 0, borderRight: 0,
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginBottom: -1,
              transition: 'color .14s, border-color .14s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#1E293B'; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#64748B'; }}
          >
            <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
            <span>{t.label}</span>
            {t.badge != null && (
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, fontWeight: 700,
                padding: '1px 6px', borderRadius: 999,
                background: active ? accentColor : '#EDEDED',
                color: active ? '#FFFFFF' : '#64748B',
                minWidth: 18, textAlign: 'center',
              }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}