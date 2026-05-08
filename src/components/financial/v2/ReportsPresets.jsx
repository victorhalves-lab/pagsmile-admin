import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, FileText, Calendar, Users, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Report presets — PayPal inspired ("Pro contador", "Pro IR", "Mensal")
export default function ReportsPresets() {
  const presets = [
    {
      id: 'accountant',
      icon: Calculator,
      color: 'bg-blue-100 text-blue-600',
      title: 'Pro Contador',
      desc: 'Movimentações + taxas + impostos retidos. CSV/OFX padrão.',
      tags: ['CSV', 'OFX', 'PDF'],
    },
    {
      id: 'tax_irpj',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      title: 'Pro IR',
      desc: 'Receita anual, retenções, declaração de movimentação financeira.',
      tags: ['Anual', 'PDF'],
    },
    {
      id: 'monthly_close',
      icon: Calendar,
      color: 'bg-emerald-100 text-emerald-600',
      title: 'Fechamento Mensal',
      desc: 'GMV, taxas, líquido, recebíveis em aberto, conciliação bancária.',
      tags: ['XLSX', 'PDF'],
    },
    {
      id: 'investor',
      icon: Users,
      color: 'bg-amber-100 text-amber-600',
      title: 'Pro Investidor',
      desc: 'KPIs SaaS: MRR, ARR, ARPU, LTV, churn, runway.',
      tags: ['PDF', 'PPT'],
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <CardTitle className="text-base">Presets Inteligentes de Relatório</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => toast.success(`Gerando "${p.title}"...`)}
              className="text-left p-3 bg-white rounded-lg border hover:shadow-md hover:border-purple-300 transition-all group"
            >
              <div className={`w-9 h-9 rounded-lg ${p.color} flex items-center justify-center mb-2`}>
                <p.icon className="w-4 h-4" />
              </div>
              <p className="font-bold text-sm mb-1">{p.title}</p>
              <p className="text-[11px] text-slate-500 leading-snug mb-2">{p.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {p.tags.map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono">{t}</span>
                  ))}
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}