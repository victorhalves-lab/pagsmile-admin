import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { REGULATORY_PROGRAMS } from '@/components/mentor/mocks/salesPlansMock';

const PROGRAM_METRICS = {
  visa_vamp: { chargeback_ratio: 0.42, threshold_warning: 0.65, threshold_excessive: 0.90, status: 'compliant', enrolled_since: '2023-04-15' },
  mc_ecp: { chargeback_ratio: 0.38, threshold_warning: 0.50, threshold_excessive: 1.00, status: 'compliant', enrolled_since: '2023-04-15' },
  elo_score: { chargeback_ratio: 0.31, threshold_warning: 0.60, threshold_excessive: 0.80, status: 'compliant', enrolled_since: '2024-01-10' },
  hiper_pro: { chargeback_ratio: 0.28, threshold_warning: 0.55, threshold_excessive: 0.75, status: 'compliant', enrolled_since: '2024-06-01' },
  amex_fraud: { chargeback_ratio: 0.18, threshold_warning: 0.40, threshold_excessive: 0.60, status: 'compliant', enrolled_since: '2025-02-01' },
};

export default function SalesPlanRegulatoryTab({ plan }) {
  const programs = plan?.regulatory_programs || ['visa_vamp', 'mc_ecp'];

  return (
    <div className="space-y-4">
      <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200">
        <CardContent className="p-3 text-xs flex items-start gap-2">
          <Shield className="w-4 h-4 text-emerald-700 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-900 dark:text-emerald-200">Score de aderência geral: {plan?.program_compliance_score || 96}/100</p>
            <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">
              Plano em conformidade com {programs.length} programa(s) regulatório(s). Métricas atualizadas a cada 24h conforme reportes das bandeiras.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {programs.map((p) => {
          const config = REGULATORY_PROGRAMS[p];
          const metrics = PROGRAM_METRICS[p];
          if (!config || !metrics) return null;
          const isWarning = metrics.chargeback_ratio >= metrics.threshold_warning * 0.8;
          const pct = (metrics.chargeback_ratio / metrics.threshold_excessive) * 100;
          return (
            <Card key={p}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{config.icon}</span>
                    <div>
                      <p>{config.label}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{config.description}</p>
                    </div>
                  </span>
                  <Badge className={metrics.status === 'compliant' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                    {metrics.status === 'compliant' ? <><CheckCircle2 className="w-3 h-3 mr-1" />Compliant</> : <><AlertTriangle className="w-3 h-3 mr-1" />Risco</>}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>Chargeback ratio atual</span>
                    <span><strong>{metrics.chargeback_ratio.toFixed(2)}%</strong> de {metrics.threshold_excessive.toFixed(2)}%</span>
                  </div>
                  <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className={`h-2 rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    <div className="absolute top-0 h-2 w-0.5 bg-amber-600" style={{ left: `${(metrics.threshold_warning / metrics.threshold_excessive) * 100}%` }} title="Threshold de alerta" />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1">
                    <span>Saudável</span>
                    <span>Alerta: {metrics.threshold_warning}%</span>
                    <span>Excessivo: {metrics.threshold_excessive}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded">
                    <p className="text-slate-500">Inscrito desde</p>
                    <p className="font-bold">{new Date(metrics.enrolled_since).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded">
                    <p className="text-slate-500">Headroom</p>
                    <p className={`font-bold ${(100 - pct) < 25 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {(100 - pct).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}