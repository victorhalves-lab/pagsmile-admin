import React from 'react';
import { Sparkles, Activity, Clock, TrendingDown, Heart, ShoppingBag, DollarSign, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import RiskScoreExplainPopover from './RiskScoreExplainPopover';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

function MiniKpi({ icon: Icon, label, value, sub, color = 'slate', clickable, onClick }) {
  const map = {
    slate: 'text-slate-700 bg-slate-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    pink: 'text-pink-600 bg-pink-50',
    orange: 'text-orange-600 bg-orange-50',
  };
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl p-3 border border-slate-100 transition-all',
        map[color],
        clickable && 'cursor-pointer hover:shadow-md hover:scale-[1.02]'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <Icon className="w-4 h-4 opacity-70" />
        {clickable && <Sparkles className="w-3 h-3 opacity-50" />}
      </div>
      <p className="text-[10px] uppercase tracking-wider font-medium opacity-70">{label}</p>
      <p className="text-xl font-bold mt-0.5">{value}</p>
      {sub && <p className="text-[10px] opacity-60 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function CustomerHeaderKpis({ customer }) {
  // Health Score: simulated combination of recency + frequency + monetary + risk
  const healthScore = Math.max(0, Math.min(100, 
    50 + ((customer.total_purchases || 0) * 2) + ((customer.total_spent || 0) / 100) - ((customer.risk_score || 0) / 2)
  ));
  const healthLabel = healthScore >= 70 ? 'Excelente' : healthScore >= 40 ? 'Bom' : 'Atenção';

  // Days since last purchase
  let daysSinceLastPurchase = null;
  if (customer.last_purchase_date) {
    daysSinceLastPurchase = Math.floor((new Date() - new Date(customer.last_purchase_date)) / (1000 * 60 * 60 * 24));
  }

  // Churn risk simulado
  const churnRisk = daysSinceLastPurchase > 60 ? 78 : daysSinceLastPurchase > 30 ? 35 : 12;

  // LTV projection (12m)
  const projectedLtv = (customer.total_spent || 0) * 1.4;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      <MiniKpi icon={Heart} label="Health Score" value={`${healthScore.toFixed(0)}`} sub={healthLabel} 
        color={healthScore >= 70 ? 'emerald' : healthScore >= 40 ? 'blue' : 'orange'} />
      
      <MiniKpi icon={ShoppingBag} label="Compras" value={customer.total_purchases || 0} sub="total histórico" />
      
      <MiniKpi icon={DollarSign} label="LTV" value={formatCurrency(customer.total_spent)} 
        sub={`projetado: ${formatCurrency(projectedLtv)}`} color="emerald" />
      
      <MiniKpi icon={Target} label="Ticket Médio" value={formatCurrency(customer.average_ticket)} 
        sub="↑ tendência" color="blue" />
      
      <MiniKpi icon={Clock} label="Última Compra" 
        value={daysSinceLastPurchase !== null ? `${daysSinceLastPurchase}d` : '—'} 
        sub={daysSinceLastPurchase > 30 ? 'dormente' : 'ativo'}
        color={daysSinceLastPurchase > 60 ? 'orange' : daysSinceLastPurchase > 30 ? 'yellow' : 'emerald'} />
      
      <MiniKpi icon={TrendingDown} label="Churn Risk" value={`${churnRisk}%`} 
        sub={churnRisk > 50 ? 'crítico' : churnRisk > 25 ? 'atenção' : 'baixo'}
        color={churnRisk > 50 ? 'orange' : churnRisk > 25 ? 'yellow' : 'emerald'} />
      
      <RiskScoreExplainPopover score={customer.risk_score || 0} customer={customer}>
        <div>
          <MiniKpi icon={Activity} label="Risk Score" value={`${customer.risk_score || 0}/100`} 
            sub="clique p/ detalhes" color="purple" clickable />
        </div>
      </RiskScoreExplainPopover>
    </div>
  );
}