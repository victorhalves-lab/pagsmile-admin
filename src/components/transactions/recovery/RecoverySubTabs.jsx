import React from 'react';
import {
  BarChart3, ListChecks, MessageSquare, Phone, Mail, Zap, Beaker, Play,
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'simulator', label: 'Simulador', icon: Play, accent: true },
  { id: 'queue', label: 'Fila ao vivo', icon: ListChecks, badge: 67 },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'phone', label: 'Telefone', icon: Phone },
  { id: 'email_sms', label: 'E-mail / SMS', icon: Mail },
  { id: 'auto_retry', label: 'Auto-retry', icon: Zap },
  { id: 'ab_tests', label: 'A/B Tests', icon: Beaker, badge: 3 },
];

/**
 * Tabs V8 oficial — usa .v8-tabs + .v8-tab (underline mint).
 */
export default function RecoverySubTabs({ value, onChange }) {
  return (
    <div className="v8-tabs">
      {TABS.map(t => {
        const Icon = t.icon;
        const active = value === t.id;
        const cls = ['v8-tab'];
        if (active) cls.push('v8-tab--active');
        if (t.accent) cls.push('v8-tab--accent');
        return (
          <button key={t.id} type="button" className={cls.join(' ')} onClick={() => onChange(t.id)}>
            <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
            <span>{t.label}</span>
            {t.badge != null && <span className="v8-tab__badge">{t.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}