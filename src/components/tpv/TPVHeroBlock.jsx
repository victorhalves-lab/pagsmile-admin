import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export default function TPVHeroBlock({ kpis }) {
  const isUp = kpis.growth_vs_previous > 0;
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="text-xs uppercase tracking-wider text-cyan-200 font-bold">TPV Total · Período Corrente</div>
          <div className="text-4xl md:text-5xl font-black mt-2 tabular-nums">
            R$ {(kpis.total_tpv / 1_000_000_000).toFixed(2)}B
          </div>
          <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${isUp ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isUp ? '+' : ''}{kpis.growth_vs_previous}% vs período anterior
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold">TPV Líquido</div>
            <div className="text-xl font-black mt-1">R$ {(kpis.net_tpv / 1_000_000_000).toFixed(2)}B</div>
          </div>
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold">Ticket Médio</div>
            <div className="text-xl font-black mt-1">R$ {kpis.avg_ticket}</div>
          </div>
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold">Lojistas Ativos</div>
            <div className="text-xl font-black mt-1">{kpis.active_merchants.toLocaleString('pt-BR')}</div>
          </div>
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold">Aprovação</div>
            <div className="text-xl font-black mt-1">{kpis.approval_rate}%</div>
          </div>
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold">Transações</div>
            <div className="text-xl font-black mt-1">{(kpis.total_transactions / 1_000_000).toFixed(1)}M</div>
          </div>
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold">Chargeback Rate</div>
            <div className="text-xl font-black mt-1">{kpis.chargeback_rate}%</div>
          </div>
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold">Pareto Top 20%</div>
            <div className="text-xl font-black mt-1">{kpis.pareto_top20_concentration}%</div>
          </div>
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold flex items-center gap-1">Projeção EOM <ArrowRight className="w-3 h-3" /></div>
            <div className="text-xl font-black mt-1">R$ {(kpis.projected_eom / 1_000_000_000).toFixed(2)}B</div>
          </div>
        </div>
      </div>
    </Card>
  );
}