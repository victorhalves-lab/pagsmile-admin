import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Brain, Eye, Ban } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_CLUSTERS = [
  {
    id: 'cl_001', risk_score: 92, severity: 'critical',
    pattern: 'Mesma faixa BIN + janela 30min + valores R$50-90',
    bin_prefix: '539XXX', tx_count: 47, tpv: 3_245.80,
    window: '2026-05-09 06:30 → 07:00', region: 'SP capital',
    suspect_reason: 'BIN testado · velocity anormal · 3 lojistas atingidos · todas declined',
    related_merchants: ['mkt_001', 'mkt_087', 'mkt_134'],
  },
  {
    id: 'cl_002', risk_score: 78, severity: 'high',
    pattern: 'Mesmo dispositivo + diferentes cartões + valores escalonados',
    bin_prefix: 'multi', tx_count: 23, tpv: 8_920.00,
    window: '2026-05-09 02:15 → 04:40', region: 'BSB / brasileira',
    suspect_reason: 'Device fingerprint repetido · pattern de teste de cartão',
    related_merchants: ['mkt_054'],
  },
  {
    id: 'cl_003', risk_score: 68, severity: 'medium',
    pattern: 'Mesmo IP + múltiplos pagadores diferentes',
    bin_prefix: '434XXX', tx_count: 12, tpv: 1_847.30,
    window: '2026-05-09 05:00 → 06:00', region: 'IP estrangeiro proxy',
    suspect_reason: 'IP de proxy detectado · pagadores não relacionados · tickets acima da média',
    related_merchants: ['mkt_201'],
  },
];

const SEV_CFG = {
  critical: { label: 'CRÍTICO', color: 'bg-red-100 text-red-700 border-red-300' },
  high: { label: 'ALTO', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  medium: { label: 'MÉDIO', color: 'bg-blue-100 text-blue-700 border-blue-300' },
};

export default function MentorFraudClusters() {
  return (
    <Card className="border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="w-4 h-4 text-red-600" />
          Clusters de fraude potencial detectados
          <Badge className="text-[9px] bg-red-200 text-red-800">{MOCK_CLUSTERS.length}</Badge>
          <span className="ml-auto text-[10px] text-slate-500">algoritmo de agrupamento por BIN+janela+região+device</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {MOCK_CLUSTERS.map((c) => {
          const sev = SEV_CFG[c.severity];
          return (
            <div key={c.id} className={`p-3 rounded-lg border-2 ${sev.color}`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${c.severity === 'critical' ? 'text-red-600' : c.severity === 'high' ? 'text-amber-600' : 'text-blue-600'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-[9px] ${sev.color} font-bold`}>{sev.label}</Badge>
                    <span className="text-xs font-bold">Risk score {c.risk_score}/100</span>
                    <span className="text-[10px] text-slate-500">· cluster {c.id}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.pattern}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{c.suspect_reason}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap text-[10px]">
                    <span><strong>BIN:</strong> {c.bin_prefix}</span>
                    <span><strong>Transações:</strong> {c.tx_count}</span>
                    <span><strong>TPV exposto:</strong> R$ {c.tpv.toFixed(2)}</span>
                    <span><strong>Janela:</strong> {c.window}</span>
                    <span><strong>Região:</strong> {c.region}</span>
                    <span><strong>Lojistas:</strong> {c.related_merchants.length}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => toast.info(`Drill-down: ${c.tx_count} transações do cluster`)}>
                    <Eye className="w-3 h-3 mr-1" />Ver
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] text-red-600 border-red-300 hover:bg-red-50" onClick={() => toast.success(`BIN ${c.bin_prefix} adicionado à blocklist · ${c.tx_count} tx serão bloqueadas`)}>
                    <Ban className="w-3 h-3 mr-1" />Bloquear
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}