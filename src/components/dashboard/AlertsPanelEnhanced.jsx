import React from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingDown, Shield, DollarSign, Webhook, Clock, X,
  ChevronRight, MoreVertical, BellOff, UserPlus, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

/**
 * Alerts Panel com snooze/atribuir [#42].
 * Mantém comportamento do AlertsPanel existente, adiciona ações por alerta.
 */

const alertTypes = {
  critical: { bg: 'bg-red-50 dark:bg-red-950/30',     border: 'border-red-200 dark:border-red-900',     text: 'text-red-900 dark:text-red-200',     icon: 'text-red-600' },
  high:     { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-900', text: 'text-orange-900 dark:text-orange-200', icon: 'text-orange-600' },
  medium:   { bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-900', text: 'text-yellow-900 dark:text-yellow-200', icon: 'text-yellow-600' },
  info:     { bg: 'bg-blue-50 dark:bg-blue-950/30',     border: 'border-blue-200 dark:border-blue-900',     text: 'text-blue-900 dark:text-blue-200',     icon: 'text-blue-600' },
};

export default function AlertsPanelEnhanced({ alerts = [], className }) {
  const [snoozed, setSnoozed] = React.useState([]);
  const { toast } = useToast();

  const defaultAlerts = [
    { id: 'alert_2', type: 'high',   icon: TrendingDown, title: 'Queda na Taxa de Aprovação', message: 'Aprovação caiu 8% nas últimas 3 horas. Mastercard mais afetada.', timestamp: new Date(Date.now() - 7200000) },
    { id: 'alert_3', type: 'medium', icon: Webhook, title: 'Webhook com Falhas', message: 'Webhook "Sistema Principal" teve 5 falhas consecutivas.', timestamp: new Date(Date.now() - 1800000) },
    { id: 'alert_4', type: 'info',   icon: DollarSign, title: 'Saldo Disponível para Saque', message: 'Você tem R$ 125.430,50 disponível para saque.', timestamp: new Date(Date.now() - 600000) },
  ];

  const list = (alerts.length > 0 ? alerts : defaultAlerts).filter((a) => !snoozed.includes(a.id));

  const handleSnooze = (id, duration) => {
    setSnoozed((prev) => [...prev, id]);
    toast({ title: `Alerta adiado por ${duration}`, duration: 2000 });
  };

  const handleAssign = (id) => {
    toast({ title: 'Alerta atribuído à equipe', duration: 2000 });
  };

  const handleNotifyTeam = (id) => {
    toast({ title: 'Equipe notificada via Slack', duration: 2000 });
  };

  const formatTimestamp = (date) => {
    const diff = Date.now() - date.getTime();
    const m = Math.floor(diff / 60000), h = Math.floor(m / 60);
    if (m < 1) return 'Agora';
    if (m < 60) return `${m}min`;
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  return (
    <div className={cn('bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden', className)}>
      <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Alertas</h3>
        <Button variant="ghost" size="sm" className="h-7 text-[10px]">Ver todos</Button>
      </div>

      <ScrollArea className="h-[280px]">
        <div className="p-2">
          {list.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs font-medium text-slate-900 dark:text-white">Tudo certo!</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {list.map((alert) => {
                const Icon = alert.icon || Shield;
                const style = alertTypes[alert.type] || alertTypes.info;
                return (
                  <div key={alert.id} className={cn('p-2.5 rounded-lg border transition-all', style.bg, style.border)}>
                    <div className="flex items-start gap-2">
                      <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', style.icon)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className={cn('text-xs font-semibold truncate', style.text)}>{alert.title}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-slate-400 hover:text-slate-600 flex-shrink-0">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuLabel className="text-[10px] uppercase">Adiar</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleSnooze(alert.id, '1h')} className="text-xs">
                                <BellOff className="w-3 h-3 mr-2" />1 hora
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSnooze(alert.id, '1 dia')} className="text-xs">
                                <BellOff className="w-3 h-3 mr-2" />1 dia
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSnooze(alert.id, '1 semana')} className="text-xs">
                                <BellOff className="w-3 h-3 mr-2" />1 semana
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleAssign(alert.id)} className="text-xs">
                                <UserPlus className="w-3 h-3 mr-2" />Atribuir à equipe
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleNotifyTeam(alert.id)} className="text-xs">
                                <MessageSquare className="w-3 h-3 mr-2" />Notificar via Slack
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{alert.message}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-slate-500">{formatTimestamp(alert.timestamp)}</span>
                          <button className={cn('text-[10px] font-semibold flex items-center gap-0.5', style.icon)}>
                            Ver detalhe
                            <ChevronRight className="w-3 h-3" />
                          </button>
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