import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Layers,
  TrendingUp,
  AlertTriangle,
  Pause,
  CalendarClock,
  ShieldAlert,
} from 'lucide-react';

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

/**
 * KPI Bar Mentor para SplitManagement · F2789-F2796.
 * Mostra distribuição por tipo, vigências expirando, alertas e TPV roteado.
 */
export default function MentorSplitKPIBar({ rules = [] }) {
  const stats = useMemo(() => {
    const active = rules.filter((r) => r.status === 'active');
    const paused = rules.filter((r) => r.status === 'paused' || r.status === 'inactive');
    const totalTpv = rules.reduce((s, r) => s + (r.total_volume || 0), 0);

    // Distribuição por tipo
    const byType = {
      percentage: rules.filter((r) => r.split_type === 'percentage' || !r.split_type).length,
      fixed: rules.filter((r) => r.split_type === 'fixed').length,
      scaled: rules.filter((r) => r.split_type === 'scaled').length,
      conditional: rules.filter((r) => r.split_type === 'conditional').length,
    };

    // Vigência expirando em 30 dias (mock — usa metadata se houver)
    const now = new Date();
    const in30 = new Date();
    in30.setDate(now.getDate() + 30);
    const expiringSoon = rules.filter((r) => {
      const end = r.mentor_lifecycle?.vigency_end;
      if (!end) return false;
      const d = new Date(end);
      return d >= now && d <= in30;
    }).length;

    // Splits órfãos: sem terminais ou sem beneficiários válidos (heurística)
    const orphans = rules.filter(
      (r) => !r.recipients || r.recipients.length === 0 || r.recipients.every((rec) => !rec.value)
    ).length;

    return { active: active.length, paused: paused.length, totalTpv, byType, expiringSoon, orphans };
  }, [rules]);

  const KPI = ({ icon: Icon, label, value, sub, color, badge }) => (
    <div className={`rounded-lg border p-3 ${color}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 opacity-80" />
        <p className="text-[10px] uppercase font-bold opacity-80">{label}</p>
        {badge && <Badge className="text-[9px] ml-auto">{badge}</Badge>}
      </div>
      <p className="text-xl font-black">{value}</p>
      {sub && <p className="text-[10px] opacity-70">{sub}</p>}
    </div>
  );

  return (
    <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">
            Mentor · KPIs Operacionais do Split
          </p>
          <Badge className="bg-violet-100 text-violet-700 text-[9px] ml-auto">Wave H.5</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <KPI
            icon={Layers}
            label="Ativos"
            value={stats.active}
            sub={`${stats.paused} pausado(s)`}
            color="bg-white dark:bg-slate-900 border-slate-200"
          />
          <KPI
            icon={TrendingUp}
            label="TPV Roteado"
            value={formatCurrency(stats.totalTpv)}
            sub="acumulado"
            color="bg-white dark:bg-slate-900 border-slate-200"
          />
          <KPI
            icon={Layers}
            label="Por tipo"
            value={
              <span className="text-xs font-mono leading-tight block">
                {stats.byType.percentage}% / {stats.byType.fixed}fix / {stats.byType.scaled}esc / {stats.byType.conditional}cond
              </span>
            }
            sub="percentual / fixo / escalonado / condicional"
            color="bg-white dark:bg-slate-900 border-slate-200"
          />
          <KPI
            icon={CalendarClock}
            label="Vigência ≤30d"
            value={stats.expiringSoon}
            sub="exigem renovação"
            color={
              stats.expiringSoon > 0
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-white dark:bg-slate-900 border-slate-200'
            }
          />
          <KPI
            icon={ShieldAlert}
            label="Órfãos"
            value={stats.orphans}
            sub="sem beneficiários"
            color={
              stats.orphans > 0
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-white dark:bg-slate-900 border-slate-200'
            }
          />
          <KPI
            icon={Pause}
            label="Em pausa"
            value={stats.paused}
            sub="sem rotear TPV"
            color="bg-white dark:bg-slate-900 border-slate-200"
          />
        </div>
        {(stats.expiringSoon > 0 || stats.orphans > 0) && (
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 rounded p-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Atenção:
            {stats.expiringSoon > 0 && <span> {stats.expiringSoon} split(s) com vigência expirando em ≤30d.</span>}
            {stats.orphans > 0 && <span> {stats.orphans} split(s) órfão(s) sem beneficiários válidos.</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}