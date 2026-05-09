import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { ACQUIRERS } from '@/components/mentor/mocks/transactionMentorMock';

const STATUS_CFG = {
  healthy: { label: 'Saudável', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  degraded: { label: 'Degradada', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  down: { label: 'Indisponível', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

export default function AcquirerHealthGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-4 h-4" />Saúde das APIs dos adquirentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {ACQUIRERS.map((a) => {
            const cfg = STATUS_CFG[a.api_status];
            return (
              <div key={a.id} className={`p-2.5 rounded-lg border ${a.api_status === 'degraded' ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/10' : a.api_status === 'down' ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{a.logo} <span className="text-[11px] font-bold ml-1">{a.name}</span></span>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                </div>
                <Badge className={`text-[9px] ${cfg.color}`}>{cfg.label}</Badge>
                <p className="text-[9px] text-slate-500 mt-1">Última sync: {new Date(a.last_sync).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}