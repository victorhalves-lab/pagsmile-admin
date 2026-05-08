import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trophy, Pause, X, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * A/B test com significância estatística + decomposição + ação 1-click.
 * DIFERENCIAL — Stripe não tem A/B; Shopify exige apps pagos sem UI clara.
 */
export default function AbTestDetailedCard() {
  const tests = [
    {
      name: 'PIX First (mobile)',
      status: 'winner',
      lift: 11.8,
      pValue: 0.01,
      confidence: 99,
      sampleSize: 12380,
      duration: 8,
      conversion: 76,
      baselineConv: 68,
      mobileLift: 14.2,
      desktopLift: 6.4,
    },
    {
      name: '1-Step Layout',
      status: 'positive',
      lift: 8.8,
      pValue: 0.04,
      confidence: 96,
      sampleSize: 12290,
      duration: 12,
      conversion: 74,
      baselineConv: 68,
      mobileLift: 9.1,
      desktopLift: 8.2,
    },
    {
      name: 'Campos reduzidos',
      status: 'inconclusive',
      lift: 5.9,
      pValue: 0.18,
      confidence: 82,
      sampleSize: 12510,
      duration: 6,
      conversion: 72,
      baselineConv: 68,
      mobileLift: 7.2,
      desktopLift: 4.1,
    },
  ];

  const statusBadge = {
    winner: { label: 'Vencedor', icon: Trophy, color: 'bg-emerald-500 text-white' },
    positive: { label: 'Positivo', icon: CheckCircle2, color: 'bg-blue-500 text-white' },
    inconclusive: { label: 'Inconclusivo', icon: Pause, color: 'bg-slate-400 text-white' },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">A/B Tests — Resultados detalhados</CardTitle>
          <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px] gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Estatísticamente válido
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tests.map((t, i) => {
          const sb = statusBadge[t.status];
          const Icon = sb.icon;
          const isSignificant = t.confidence >= 95;
          return (
            <div key={i} className={cn(
              "rounded-xl border-2 p-4",
              t.status === 'winner' ? "border-emerald-300 bg-emerald-50/40 dark:bg-emerald-900/10" :
              t.status === 'positive' ? "border-blue-200 bg-blue-50/40 dark:bg-blue-900/10" :
              "border-slate-200 bg-slate-50/40"
            )}>
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-5 h-5", t.status === 'winner' ? "text-emerald-600" : t.status === 'positive' ? "text-blue-600" : "text-slate-500")} />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <Badge className={cn("text-[9px] mt-0.5", sb.color)}>{sb.label}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{t.conversion}%</p>
                  <p className={cn("text-xs font-bold", t.lift > 0 ? "text-emerald-600" : "text-red-600")}>
                    {t.lift > 0 ? '+' : ''}{t.lift}% vs baseline
                  </p>
                </div>
              </div>

              {/* Estatística */}
              <div className="grid grid-cols-4 gap-2 text-xs mb-3 p-2 bg-white dark:bg-slate-900 rounded-lg">
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-slate-500">Confiança</p>
                  <p className={cn("font-bold", isSignificant ? "text-emerald-600" : "text-amber-600")}>
                    {t.confidence}%
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-slate-500">p-value</p>
                  <p className="font-bold font-mono text-[11px]">{t.pValue}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-slate-500">Amostra</p>
                  <p className="font-bold">{t.sampleSize.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-slate-500">Duração</p>
                  <p className="font-bold">{t.duration}d</p>
                </div>
              </div>

              {/* Decomposição por segmento */}
              <div className="space-y-1 mb-3">
                <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Lift por segmento</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded px-2 py-1">
                    <span className="text-slate-500">Mobile</span>
                    <span className="font-bold text-emerald-600">+{t.mobileLift}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded px-2 py-1">
                    <span className="text-slate-500">Desktop</span>
                    <span className="font-bold text-emerald-600">+{t.desktopLift}%</span>
                  </div>
                </div>
              </div>

              <Progress value={t.conversion} className="h-1.5 mb-3" />

              <div className="flex items-center gap-2">
                {t.status === 'winner' && (
                  <Button size="sm" className="bg-[#2bc196] hover:bg-[#25a880] gap-1 text-xs"
                    onClick={() => toast.success(`Implementando "${t.name}" como padrão`)}>
                    <Trophy className="w-3 h-3" /> Implementar vencedor
                  </Button>
                )}
                {t.status === 'inconclusive' && (
                  <Button size="sm" variant="outline" className="gap-1 text-xs"
                    onClick={() => toast.info('Continuando teste para mais amostra')}>
                    Continuar coletando
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="gap-1 text-xs ml-auto"
                  onClick={() => toast.info('Detalhes completos abertos')}>
                  Ver detalhes →
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}