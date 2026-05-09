import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AntiArbitrageMonitor — Detecta padrões de arbitragem em tarifas/MDR cross-merchant
 * Diferencial PagSmile: monitora abuso de tier pricing entre sub-lojistas do mesmo grupo
 */
export default function AntiArbitrageMonitor({ alerts = [] }) {
  const defaultAlerts = alerts.length > 0 ? alerts : [
    {
      id: 1,
      severity: 'high',
      pattern: 'Volume migration detectado',
      description: 'Sub-lojista X aumentou volume em 340% após mudança de plano de tarifa do parceiro Y',
      affectedMerchants: ['Loja Premium SP', 'Loja Outlet RJ'],
      financialImpact: 18450,
      detectedAt: '2026-05-08T14:22:00',
      status: 'pending_review',
    },
    {
      id: 2,
      severity: 'medium',
      pattern: 'Parcelamento estratégico',
      description: 'Padrão de uso 12x sem juros 78% acima da média do grupo após queda de MDR',
      affectedMerchants: ['Eletrônicos Z'],
      financialImpact: 6230,
      detectedAt: '2026-05-08T11:40:00',
      status: 'investigating',
    },
    {
      id: 3,
      severity: 'low',
      pattern: 'MCC switching',
      description: 'Tentativa de migração de MCC após benchmark de tarifas (4789 → 5411)',
      affectedMerchants: ['Mercado Bairro'],
      financialImpact: 1280,
      detectedAt: '2026-05-07T16:15:00',
      status: 'flagged',
    },
  ];

  const sevConfig = {
    high: { color: 'text-red-700', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300', label: 'Alto', icon: 'bg-red-500' },
    medium: { color: 'text-amber-700', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300', label: 'Médio', icon: 'bg-amber-500' },
    low: { color: 'text-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-300', label: 'Baixo', icon: 'bg-blue-500' },
  };

  const totalImpact = defaultAlerts.reduce((s, a) => s + a.financialImpact, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            Anti-Arbitragem Monitor
            <Badge variant="destructive" className="ml-1">{defaultAlerts.length}</Badge>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-normal">Impacto Total</p>
            <p className="text-lg font-bold text-red-600">
              R$ {totalImpact.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {defaultAlerts.map((alert) => {
          const cfg = sevConfig[alert.severity];
          return (
            <div key={alert.id} className={cn('rounded-xl border-2 p-3', cfg.bg, cfg.border)}>
              <div className="flex items-start gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white shadow flex-shrink-0', cfg.icon)}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={cn('text-[10px]', cfg.color, 'bg-white border')}>
                      {cfg.label}
                    </Badge>
                    <p className={cn('font-semibold text-sm', cfg.color)}>{alert.pattern}</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{alert.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                    <span>📍 {alert.affectedMerchants.join(', ')}</span>
                    <span className="font-mono">
                      💰 R$ {alert.financialImpact.toLocaleString('pt-BR')}
                    </span>
                    <span>🕐 {new Date(alert.detectedAt).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="bg-white">
                  <Eye className="w-3 h-3 mr-1" />
                  Investigar
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}