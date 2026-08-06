import React from 'react';
import { Zap, Plus, Mail, MessageSquare, Smartphone, ArrowRight, Play, Pause, Sparkles } from 'lucide-react';
import { automations } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const statusStyle = {
  ativa: 'bg-mint-100 text-mint-700 border-mint-200',
  pausada: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function CdpAutomation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Automação de Marketing</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Jornadas automáticas disparadas pelo comportamento do cliente</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Nova jornada
        </button>
      </div>

      <div className="space-y-3">
        {automations.map((a) => (
          <div key={a.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Zap className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{a.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gatilho: {a.trigger}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle[a.status]}`}>{a.status}</span>
            </div>

            {/* Flow steps */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">Gatilho</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-mint-50 text-xs font-medium text-mint-700"><Mail className="w-3.5 h-3.5" /> Email 2h</span>
              {a.steps >= 3 && (<><ArrowRight className="w-3.5 h-3.5 text-slate-300" /><span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-mint-50 text-xs font-medium text-mint-700"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp 24h</span></>)}
              {a.steps >= 4 && (<><ArrowRight className="w-3.5 h-3.5 text-slate-300" /><span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-mint-50 text-xs font-medium text-mint-700"><Smartphone className="w-3.5 h-3.5" /> SMS 48h</span></>)}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-mint-500" />
                <span className="text-xs text-slate-500">Conversões: <span className="font-mono font-bold text-slate-900 dark:text-white">{a.conversions.toLocaleString('pt-BR')}</span></span>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-mint-600 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-mint-400 transition-colors">
                {a.status === 'ativa' ? <><Pause className="w-3 h-3" /> Pausar</> : <><Play className="w-3 h-3" /> Ativar</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}