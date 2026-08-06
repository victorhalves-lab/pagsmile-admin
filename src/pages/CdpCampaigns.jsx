import React from 'react';
import { Send, Plus, Mail, MessageSquare, Smartphone, Bell, Play, Pause, Copy } from 'lucide-react';
import { campaignList } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const channelMeta = {
  Email: { icon: Mail, color: '#2bc196' },
  WhatsApp: { icon: MessageSquare, color: '#5cf7cf' },
  SMS: { icon: Smartphone, color: '#002443' },
  Push: { icon: Bell, color: '#f59e0b' },
};

const statusStyle = {
  ativa: 'bg-mint-100 text-mint-700 border-mint-200',
  programada: 'bg-amber-100 text-amber-700 border-amber-200',
  pausada: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function CdpCampaigns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campanhas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Edição e disparo de campanhas multicanal</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Nova campanha
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaignList.map((c) => {
          const ch = channelMeta[c.channel];
          return (
            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${ch.color}20`, color: ch.color }}>
                  <ch.icon className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle[c.status]}`}>{c.status}</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{c.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Segmento: {c.segment}</p>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Enviados</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{c.sent.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Conv.</p>
                  <p className="text-sm font-mono font-bold text-mint-600">{c.conv.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Receita</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">R$ {(c.revenue / 1000).toFixed(0)}k</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-mint-600 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-mint-400 transition-colors">
                  Editar
                </button>
                {c.status === 'ativa' ? (
                  <button className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-600 transition-colors">
                    <Pause className="w-3 h-3" /> Pausar
                  </button>
                ) : (
                  <button className="flex items-center gap-1 text-xs font-semibold text-white bg-mint-500 hover:bg-mint-600 px-3 py-1.5 rounded-lg transition-colors">
                    <Play className="w-3 h-3" /> Ativar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}