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
    <div className={cn("bg-white rounded-xl border border-gray-100 overflow-hidden", className)}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Alertas</h3>
          {criticalCount > 0 && (
            <Badge className="bg-red-600 text-white h-5 px-2">
              {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          Ver todos
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-2">
          {displayAlerts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Tudo certo!</p>
              <p className="text-xs text-gray-500 mt-1">Nenhum alerta no momento</p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayAlerts.map((alert) => {
                const Icon = alert.icon;
                const style = alertTypes[alert.type];

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all hover:shadow-sm",
                      style.bg,
                      style.border
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-1.5 rounded", style.bg)}>
                        <Icon className={cn("w-4 h-4", style.icon)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={cn("text-sm font-semibold", style.text)}>
                            {alert.title}
                          </p>
                          {onDismiss && (
                            <button
                              onClick={() => onDismiss(alert.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">
                          {alert.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                          {alert.action && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn("h-7 text-xs", style.icon)}
                            >
                              {alert.action}
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
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