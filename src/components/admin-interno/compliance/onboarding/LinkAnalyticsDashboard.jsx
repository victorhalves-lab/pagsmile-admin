import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MousePointer, FileCheck, Check, TrendingUp } from 'lucide-react';

export default function LinkAnalyticsDashboard({ link }) {
  // Gera dados de últimos 7 dias baseado no link
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 24 * 3600 * 1000);
    const seed = (link.id?.length || 1) + i;
    return {
      day: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      clicks: Math.floor((link.clickCount || 0) / 7) + (seed % 5),
      submissions: Math.floor((link.submissionCount || 0) / 7) + (seed % 3),
    };
  });

  const conversion = link.clickCount > 0 ? ((link.submissionCount / link.clickCount) * 100).toFixed(1) : 0;
  const completion = link.submissionCount > 0 ? ((link.completedCount / link.submissionCount) * 100).toFixed(1) : 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Analytics do Link</h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: MousePointer, label: 'Cliques', value: link.clickCount || 0, color: 'text-blue-600' },
          { icon: FileCheck, label: 'Submissões', value: link.submissionCount || 0, color: 'text-emerald-600' },
          { icon: Check, label: 'Concluídos', value: link.completedCount || 0, color: 'text-violet-600' },
          { icon: TrendingUp, label: 'Conversão', value: `${conversion}%`, color: 'text-amber-600' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#003459] rounded-xl p-3 border border-slate-100 dark:border-slate-700">
              <Icon className={`w-4 h-4 ${s.color} mb-1`} />
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-slate-700 p-4">
        <p className="text-xs font-semibold text-slate-500 mb-2">Últimos 7 dias</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="submissions" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3 border border-emerald-200 dark:border-emerald-500/30">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Taxa de Conversão</p>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{conversion}%</p>
          <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">cliques → submissões</p>
        </div>
        <div className="bg-violet-50 dark:bg-violet-500/10 rounded-xl p-3 border border-violet-200 dark:border-violet-500/30">
          <p className="text-xs text-violet-700 dark:text-violet-300 font-semibold">Taxa de Conclusão</p>
          <p className="text-2xl font-black text-violet-700 dark:text-violet-300">{completion}%</p>
          <p className="text-[10px] text-violet-600/70 dark:text-violet-400/70">submissões → completos</p>
        </div>
      </div>
    </div>
  );
}