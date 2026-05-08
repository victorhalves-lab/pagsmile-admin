import React from 'react';
import { AlertTriangle, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Banner global de alertas críticos no topo do Dashboard.
 * Padrão Stripe / Adyen — substitui apenas a parte CRÍTICA do AlertsPanel.
 * O AlertsPanel continua existindo para alertas não-críticos.
 */
export default function CriticalAlertsBanner({ alerts = [], onDismiss }) {
  const [dismissed, setDismissed] = React.useState([]);

  // Mock se nenhum alerta for passado (ambiente demo)
  const defaultCritical = [
    {
      id: 'cb_ratio_critical',
      title: 'Chargeback ratio em 0.85% — próximo do limite Visa',
      action: 'Ver disputas',
      actionUrl: createPageUrl('DisputeDashboard'),
    },
  ];

  const list = (alerts.length > 0 ? alerts : defaultCritical).filter(
    (a) => !dismissed.includes(a.id)
  );

  if (list.length === 0) return null;

  const handleDismiss = (id) => {
    setDismissed((prev) => [...prev, id]);
    onDismiss?.(id);
  };

  return (
    <div className="space-y-2">
      {list.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-red-500',
            'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50',
            'shadow-sm'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-900 dark:text-red-200">
              Alerta crítico
            </p>
            <p className="text-xs text-red-700 dark:text-red-300 truncate">
              {alert.title}
            </p>
          </div>
          {alert.action && alert.actionUrl && (
            <Link to={alert.actionUrl}>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs h-8"
              >
                {alert.action}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          )}
          <button
            onClick={() => handleDismiss(alert.id)}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-200 flex-shrink-0"
            aria-label="Dispensar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}