import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Layers, CreditCard, QrCode, RotateCcw, AlertTriangle, Sparkles, Users
} from 'lucide-react';

/**
 * Tabs com badges contadores em cada aba (paridade Stripe/Linear).
 * Lê os contadores das transações filtradas para mostrar números reais.
 */
export default function TransactionsTabs({ counts = {} }) {
  const tabs = [
    { value: 'all',      label: 'Todas',           icon: Layers,         badge: counts.all },
    { value: 'card',     label: 'Cartão',          icon: CreditCard,     badge: counts.card },
    { value: 'pix',      label: 'PIX',             icon: QrCode,         badge: counts.pix },
    { value: 'refunds',  label: 'Reembolsos',      icon: RotateCcw,      badge: counts.refunds },
    { value: 'declines', label: 'Análise Recusas', icon: AlertTriangle,  badge: counts.declines, badgeVariant: 'destructive' },
    { value: 'recovery', label: 'Recovery Agent',  icon: Sparkles,       aiBadge: true },
    { value: 'crm',      label: 'CRM',             icon: Users },
  ];

  return (
    <TabsList className="h-auto flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800">
      {tabs.map(t => {
        const Icon = t.icon;
        return (
          <TabsTrigger key={t.value} value={t.value} className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Icon className="w-4 h-4" />
            {t.label}
            {t.aiBadge && (
              <Badge className="ml-1 bg-gradient-to-r from-[#2bc196] to-[#5cf7cf] text-white px-1.5 py-0 text-[9px] border-0">AI</Badge>
            )}
            {t.badge != null && t.badge > 0 && (
              <Badge
                variant={t.badgeVariant === 'destructive' ? 'destructive' : 'secondary'}
                className="ml-1 px-1.5 py-0 text-[10px] font-semibold h-4 min-w-4"
              >
                {t.badge > 999 ? '999+' : t.badge}
              </Badge>
            )}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}