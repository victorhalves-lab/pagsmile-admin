import React, { useState } from 'react';
import { Award, Store, Globe, Percent, Calendar, Save } from 'lucide-react';
import { loyaltyProgramConfig } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const programTypes = ['Pontos', 'Cashback', 'Níveis', 'Híbrido (Pontos + Níveis + Cashback)'];
const channels = ['Online', 'Loja Física (PDV)', 'iFood', 'App Próprio'];

export default function LoyaltyConfig() {
  const [type, setType] = useState(loyaltyProgramConfig.type);
  const [baseRule, setBaseRule] = useState('1');
  const [validity, setValidity] = useState(loyaltyProgramConfig.points_validity_days);
  const [omnichannel, setOmnichannel] = useState(loyaltyProgramConfig.omnichannel);
  const [activeChannels, setActiveChannels] = useState(loyaltyProgramConfig.channels);
  const [multiplier, setMultiplier] = useState(loyaltyProgramConfig.multiplier_default);

  const toggleChannel = (ch) => {
    setActiveChannels((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configuração do Programa</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Defina o tipo de programa, regras de pontuação e canais</p>
      </div>

      {/* Tipo de programa */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-mint-500" /> Tipo de programa
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {programTypes.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`p-3 rounded-lg border text-xs font-medium text-left transition-colors ${type === t ? 'border-mint-500 bg-mint-50 dark:bg-mint-500/10 text-mint-700 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-mint-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Regra de pontuação */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
          <Percent className="w-4 h-4 text-mint-500" /> Regra de pontuação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Pontos por R$1 gasto</label>
            <div className="flex items-center gap-2">
              <input value={baseRule} onChange={(e) => setBaseRule(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
              <span className="text-sm text-slate-500">pt / R$1</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Multiplicador padrão</label>
            <input type="number" step="0.1" value={multiplier} onChange={(e) => setMultiplier(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block flex items-center gap-1"><Calendar className="w-3 h-3" /> Validade dos pontos (dias)</label>
            <input type="number" value={validity} onChange={(e) => setValidity(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
          </div>
        </div>
      </div>

      {/* Omnichannel */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-mint-500" /> Fidelidade Omnichannel
        </h3>
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-4">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Ativar pontos em todos os canais</p>
            <p className="text-xs text-slate-500">Clientes ganham pontos em loja física, online e parceiros</p>
          </div>
          <button onClick={() => setOmnichannel(!omnichannel)} className={`relative w-11 h-6 rounded-full transition-colors ${omnichannel ? 'bg-mint-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${omnichannel ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {channels.map((ch) => (
            <button
              key={ch}
              onClick={() => toggleChannel(ch)}
              disabled={!omnichannel}
              className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-40 ${activeChannels.includes(ch) ? 'border-mint-500 bg-mint-50 dark:bg-mint-500/10 text-mint-700 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              <Store className="w-3.5 h-3.5" /> {ch}
            </button>
          ))}
        </div>
      </div>

      <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
        <Save className="w-4 h-4" /> Salvar configuração
      </button>
    </div>
  );
}