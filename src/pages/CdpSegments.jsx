import React from 'react';
import { Target, Plus, Users, Send } from 'lucide-react';
import { segments } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

export default function CdpSegments() {
  const totalSize = segments.reduce((s, seg) => s + seg.size, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Segmentos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Segmentação inteligente via RFV ou regras personalizadas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Novo segmento
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Users className="w-5 h-5" /></div>
        <div>
          <p className="text-xs text-slate-500">Clientes segmentáveis no total</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">{totalSize.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((s) => (
          <div key={s.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Target className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{s.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.criteria}</p>
                </div>
              </div>
              {s.campaign_active > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-mint-100 text-mint-700">
                  <Send className="w-3 h-3" /> {s.campaign_active} ativas
                </span>
              )}
            </div>
            <div className="flex items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <div>
                <p className="text-xs text-slate-500">Tamanho do segmento</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{s.size.toLocaleString('pt-BR')}</p>
              </div>
              <p className="text-xs text-slate-400 mb-1">{((s.size / totalSize) * 100).toFixed(1)}% da base</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}