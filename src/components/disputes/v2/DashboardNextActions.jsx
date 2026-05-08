import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, AlertCircle, Sparkles, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  { icon: AlertCircle, title: '3 Pre-CBs <24h', subtitle: 'Reembolsar agora salva ~R$ 1.250 + protege ratio', cta: 'Ver fila', tone: 'red' },
  { icon: Clock, title: '2 MEDs <2h', subtitle: 'Decisão obrigatória antes do auto-aceite BCB', cta: 'Decidir', tone: 'orange' },
  { icon: FileText, title: '5 CBs com win prob >70% não contestadas', subtitle: 'Quick wins esquecidos', cta: 'Contestar', tone: 'purple' },
  { icon: Sparkles, title: 'Win rate caiu 5pp em reason 4855', subtitle: 'Ajustar playbook recomendado', cta: 'Revisar', tone: 'amber' },
];

const toneMap = {
  red: 'border-red-200 bg-red-50/40 hover:bg-red-50/70',
  orange: 'border-orange-200 bg-orange-50/40 hover:bg-orange-50/70',
  purple: 'border-purple-200 bg-purple-50/40 hover:bg-purple-50/70',
  amber: 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70',
};

const iconToneMap = {
  red: 'bg-red-100 text-red-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
  amber: 'bg-amber-100 text-amber-600',
};

export default function DashboardNextActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2bc196]" />
          Próximas ações sugeridas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {actions.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${toneMap[a.tone]}`}>
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconToneMap[a.tone]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900">{a.title}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{a.subtitle}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-[10px] flex-shrink-0">
                    {a.cta} <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}