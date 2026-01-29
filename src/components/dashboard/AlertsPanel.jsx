import React from 'react';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  TrendingDown, 
  Shield, 
  DollarSign,
  Webhook,
  Key,
  Clock,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const alertTypes = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    icon: 'text-red-600',
    badge: 'bg-red-600'
  },
  high: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    icon: 'text-orange-600',
    badge: 'bg-orange-600'
  },
  medium: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-900',
    icon: 'text-yellow-600',
    badge: 'bg-yellow-600'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    icon: 'text-blue-600',
    badge: 'bg-blue-600'
  }
};

export default function AlertsPanel({ 
  alerts = [],
  onDismiss,
  className 
}) {
  // Mock alerts if none provided
  const defaultAlerts = [
    {
      id: 'alert_1',
      type: 'critical',
      category: 'risk',
      icon: Shield,
      title: 'Chargeback Ratio Alto',
      message: 'Seu ratio está em 0.85%, próximo do limite de 1%. Ação urgente recomendada.',
      action: 'Ver Disputas',
      actionUrl: '/disputes',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 'alert_2',
      type: 'high',
      category: 'performance',
      icon: TrendingDown,
      title: 'Queda na Taxa de Aprovação',
      message: 'Aprovação caiu 8% nas últimas 3 horas. Bandeira Mastercard mais afetada.',
      action: 'Analisar',
      actionUrl: '/transactions',
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: 'alert_3',
      type: 'medium',
      category: 'technical',
      icon: Webhook,
      title: 'Webhook com Falhas',
      message: 'Webhook "Sistema Principal" teve 5 falhas consecutivas.',
      action: 'Verificar',
      actionUrl: '/webhooks',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 'alert_4',
      type: 'info',
      category: 'financial',
      icon: DollarSign,
      title: 'Saldo Disponível para Saque',
      message: 'Você tem R$ 125.430,50 disponível para saque.',
      action: 'Sacar',
      actionUrl: '/withdrawals',
      timestamp: new Date(Date.now() - 600000)
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;
  const criticalCount = displayAlerts.filter(a => a.type === 'critical').length;

  const formatTimestamp = (date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };

  return (
    <div className={cn("bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden", className)}>
      <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Alertas</h3>
          {criticalCount > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {criticalCount}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2">
          Ver todos
        </Button>
      </div>

      <ScrollArea className="h-[320px]">
        <div className="p-2">
          {displayAlerts.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">Tudo certo!</p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">Nenhum alerta</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {displayAlerts.map((alert) => {
                const Icon = alert.icon;
                const style = alertTypes[alert.type];

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-2.5 rounded-lg border transition-all hover:shadow-sm",
                      style.bg,
                      style.border
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", style.icon)} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className={cn("text-xs font-semibold truncate", style.text)}>
                            {alert.title}
                          </p>
                          {onDismiss && (
                            <button
                              onClick={() => onDismiss(alert.id)}
                              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {alert.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-gray-500">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                          {alert.action && (
                            <button className={cn("text-[10px] font-semibold flex items-center gap-0.5", style.icon)}>
                              {alert.action}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}