import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTransactionsContext } from './TransactionsContext';

/**
 * "Última atualização há Xs" + botão refresh visível.
 * Padrão Datadog/Adyen.
 */
export default function LastUpdatedIndicator() {
  const { lastUpdate, refresh } = useTransactionsContext();
  const [, setTick] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // re-render a cada 5s só pra atualizar texto "há Xs"
  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(i);
  }, []);

  const secondsAgo = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
  let label;
  if (secondsAgo < 5) label = 'agora';
  else if (secondsAgo < 60) label = `há ${secondsAgo}s`;
  else if (secondsAgo < 3600) label = `há ${Math.floor(secondsAgo / 60)}min`;
  else label = `há ${Math.floor(secondsAgo / 3600)}h`;

  const isStale = secondsAgo > 60;

  const handleRefresh = () => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        isStale ? "bg-amber-400" : "bg-emerald-500 animate-pulse"
      )} />
      <span>Atualizado {label}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleRefresh}
        title="Atualizar"
      >
        <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
      </Button>
    </div>
  );
}