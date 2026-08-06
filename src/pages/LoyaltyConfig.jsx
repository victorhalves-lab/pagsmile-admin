import React, { useState } from 'react';
import { Sliders, Zap, Crown, Coins, Tag } from 'lucide-react';
import OverviewTab from '@/components/loyalty-cdp/config/OverviewTab';
import EarningRulesTab from '@/components/loyalty-cdp/config/EarningRulesTab';
import LevelsConfigTab from '@/components/loyalty-cdp/config/LevelsConfigTab';
import CashbackTab from '@/components/loyalty-cdp/config/CashbackTab';
import DiscountsTab from '@/components/loyalty-cdp/config/DiscountsTab';

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: Sliders },
  { id: 'earning', label: 'Regras de Acumulação', icon: Zap },
  { id: 'levels', label: 'Níveis & Benefícios', icon: Crown },
  { id: 'cashback', label: 'Cashback', icon: Coins },
  { id: 'discounts', label: 'Descontos & Ofertas', icon: Tag },
];

export default function LoyaltyConfig() {
  const [active, setActive] = useState('overview');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configuração do Programa de Fidelidade</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Configurador completo: tipo, regras por escopo, níveis, cashback e descontos — omnichannel</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-fit max-w-full overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${active === t.id ? 'bg-white dark:bg-slate-900 text-mint-700 dark:text-mint-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div>
        {active === 'overview' && <OverviewTab />}
        {active === 'earning' && <EarningRulesTab />}
        {active === 'levels' && <LevelsConfigTab />}
        {active === 'cashback' && <CashbackTab />}
        {active === 'discounts' && <DiscountsTab />}
      </div>
    </div>
  );
}