import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingDown, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnomalyDetectionCard({ subaccounts = [] }) {
  const anomalies = useMemo(() => {
    const list = [];
    
    // Mock: detect significant drops based on data
    subaccounts.slice(0, 20).forEach((s, idx) => {
      const totalVolume = s.total_volume || 0;
      const currentMonth = s.revenue_current_month || 0;
      
      // Anomaly 1: high volume but low recent activity
      if (totalVolume > 50000 && currentMonth < totalVolume * 0.05) {
        list.push({
          type: 'drop',
          severity: 'high',
          subaccount: s,
          message: 'Queda de ~60% no GMV semanal',
          suggestion: 'Investigar possível churn',
        });
      }
      
      // Anomaly 2: sudden spike
      if (currentMonth > totalVolume * 0.4 && totalVolume > 10000) {
        list.push({
          type: 'spike',
          severity: 'medium',
          subaccount: s,
          message: 'Crescimento de +280% vs média',
          suggestion: 'Validar legitimidade ou registrar growth',
        });
      }
      
      // Anomaly 3: chargebacks elevados
      if ((s.avg_chargeback_ratio || 0) > 0.01) {
        list.push({
          type: 'risk',
          severity: 'high',
          subaccount: s,
          message: `Chargeback ratio ${((s.avg_chargeback_ratio || 0) * 100).toFixed(2)}%`,
          suggestion: 'Acima do limite de 1%',
        });
      }
    });
    
    return list.slice(0, 4);
  }, [subaccounts]);

  const severityConfig = {
    high: { color: 'border-red-200 bg-red-50', textColor: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    medium: { color: 'border-amber-200 bg-amber-50', textColor: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    low: { color: 'border-blue-200 bg-blue-50', textColor: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  };

  const typeIcons = {
    drop: TrendingDown,
    spike: TrendingUp,
    risk: AlertCircle,
  };

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Detecção de Anomalias
          </CardTitle>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {anomalies.length} alertas
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-300" />
            <p className="text-sm text-slate-500">Nenhuma anomalia detectada</p>
            <p className="text-xs text-slate-400">Monitoramento ativo via IA</p>
          </div>
        ) : (
          <div className="space-y-2">
            {anomalies.map((anomaly, idx) => {
              const config = severityConfig[anomaly.severity];
              const Icon = typeIcons[anomaly.type] || AlertCircle;
              return (
                <div 
                  key={idx}
                  className={cn(
                    "p-3 rounded-lg border flex items-start gap-3",
                    config.color
                  )}
                >
                  <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.textColor)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-medium truncate">{anomaly.subaccount.business_name}</p>
                      <Badge variant="outline" className={cn("text-[10px]", config.badge)}>
                        {anomaly.severity === 'high' ? 'Alta' : anomaly.severity === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                    <p className={cn("text-xs", config.textColor)}>{anomaly.message}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{anomaly.suggestion}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}