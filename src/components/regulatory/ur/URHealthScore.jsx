import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function URHealthScore({ ur }) {
  const score = ur.health_score || 90;
  const color = score >= 90 ? 'text-emerald-600' : score >= 70 ? 'text-amber-600' : 'text-red-600';
  const bg = score >= 90 ? 'bg-emerald-50 border-emerald-200' : score >= 70 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  const checks = [
    { label: 'Registro confirmado', ok: ur.registration_status === 'registered' },
    { label: 'Sem divergência CERC', ok: ur.cerc_conciliation_status === 'conciliated' },
    { label: 'Sem efeitos em conflito', ok: !ur.has_judicial_lien || ur.effects_count <= 1 },
    { label: 'Vencimento não ultrapassado', ok: new Date(ur.expected_date) > new Date() || ur.status === 'liquidated' },
    { label: 'Valor disponível >= 50%', ok: ur.available_value >= ur.net_value * 0.5 },
  ];

  return (
    <Card className={bg}>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Score Saúde Regulatória
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-3">
          <p className={`text-4xl font-black ${color}`}>{score}</p>
          <p className="text-[10px] uppercase font-bold text-slate-500">de 100</p>
        </div>
        <div className="space-y-1">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {c.ok ? <span className="text-emerald-600">✓</span> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
              <span className={c.ok ? 'text-slate-700' : 'text-amber-700'}>{c.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}