import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, AlertTriangle } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_EFFECTS, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';

export default function RegulatoryCommitmentsCard() {
  // mock — lojista atual
  const myEffects = MOCK_EFFECTS.filter((e) => e.ur?.merchant?.id === 'mer_001' && e.status === 'active');
  const totalCommitted = myEffects.reduce((s, e) => s + e.value_affected, 0);
  const judicial = myEffects.filter((e) => e.type === 'judicial_lien' || e.type === 'attachment').length;
  const cessions = myEffects.filter((e) => e.type.includes('assignment')).length;
  const anticipations = myEffects.filter((e) => e.type === 'registered_anticipation').length;

  if (myEffects.length === 0) return null;

  return (
    <Card className="border-violet-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-600" /> Compromissos sobre seus recebíveis
          </span>
          <Link to={createPageUrl('MyContractEffects')}>
            <Button size="sm" variant="outline" className="h-7 text-[10px]">
              Ver todos <ExternalLink className="w-2.5 h-2.5 ml-1" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {judicial > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
              <p className="text-[9px] uppercase font-bold text-red-700">⚖️ Judicial</p>
              <p className="text-base font-black text-red-700">{judicial}</p>
            </div>
          )}
          {cessions > 0 && (
            <div className="bg-violet-50 border border-violet-200 rounded p-2 text-center">
              <p className="text-[9px] uppercase font-bold text-violet-700">🛡️ Cessões</p>
              <p className="text-base font-black text-violet-700">{cessions}</p>
            </div>
          )}
          {anticipations > 0 && (
            <div className="bg-cyan-50 border border-cyan-200 rounded p-2 text-center">
              <p className="text-[9px] uppercase font-bold text-cyan-700">⚡ Antecipações</p>
              <p className="text-base font-black text-cyan-700">{anticipations}</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs pt-2 border-t">
          <span className="text-slate-500">Total comprometido:</span>
          <span className="font-bold text-amber-700">{formatCurrencyShort(totalCommitted)}</span>
        </div>
        {judicial > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-[10px] text-red-900 flex items-start gap-1.5">
            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>Você tem bloqueios judiciais ativos — entenda como afetam seus recebimentos</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}