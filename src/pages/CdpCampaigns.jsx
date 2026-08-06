import React, { useState } from 'react';
import { Send, Plus, Mail, MessageSquare, Smartphone, Bell, Play, Pause, BarChart3 } from 'lucide-react';
import { campaignList } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';
import { campaignPerformanceData } from '@/components/loyalty-cdp/mocks/cdpAnalyticsMocks';

const channelMeta = {
  Email: { icon: Mail, color: '#2bc196' },
  WhatsApp: { icon: MessageSquare, color: '#25d366' },
  SMS: { icon: Smartphone, color: '#002443' },
  Push: { icon: Bell, color: '#f59e0b' },
};

const statusStyle = {
  ativa: 'bg-mint-100 text-mint-700 border-mint-200',
  programada: 'bg-amber-100 text-amber-700 border-amber-200',
  pausada: 'bg-slate-100 text-slate-500 border-slate-200',
};

// Enrich campaigns with "received" and revenue highlight
const enriched = campaignList.map((c, i) => ({
  ...c,
  received: Math.round(c.sent * (0.65 + Math.random() * 0.25)),
  revenue_highlight: c.revenue > 50000,
}));

export default function CdpCampaigns() {
  const [tab, setTab] = useState('ativas');

  const filtered = enriched.filter((c) => tab === 'ativas' ? c.status === 'ativa' : c.status !== 'ativa');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campanhas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Disparo multicanal: WhatsApp, Email, SMS, Push</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Nova campanha
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {['ativas', 'pausadas'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-colors ${tab === t ? 'border-mint-500 text-mint-700 dark:text-mint-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const ch = channelMeta[c.channel] || { icon: Send, color: '#2bc196' };
          const convRate = c.sent > 0 ? ((c.conv / c.sent) * 100).toFixed(1) : '0';
          return (
            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              {/* Top */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${ch.color}20`, color: ch.color }}>
                      <ch.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">{c.channel}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle[c.status]}`}>{c.status}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Segmento: {c.segment}</p>
              </div>

              {/* Revenue highlight */}
              <div className="px-4 pt-3 pb-1">
                <p className={`text-2xl font-bold font-mono ${c.revenue > 0 ? 'text-mint-600' : 'text-slate-400'}`}>
                  R$ {c.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-400">{convRate}% taxa de conversão</p>
              </div>

              {/* Stats */}
              <div className="px-4 py-3 space-y-1.5">
                {[
                  { icon: Send, label: 'Mensagens enviadas', value: c.sent.toLocaleString('pt-BR') },
                  { icon: MessageSquare, label: 'Mensagens recebidas', value: c.received.toLocaleString('pt-BR') },
                  { icon: BarChart3, label: 'Conversões realizadas', value: c.conv.toLocaleString('pt-BR') },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-500"><row.icon className="w-3 h-3" /> {row.label}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 px-4 pb-4">
                <button className="flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-mint-600 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-mint-400 transition-colors flex items-center justify-center gap-1">
                  <BarChart3 className="w-3 h-3" /> Desempenho
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

      {/* Performance table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Performance detalhada das campanhas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-slate-500 uppercase">
                <th className="px-4 py-3 font-medium">Campanha</th>
                <th className="px-4 py-3 font-medium text-right">Audiência</th>
                <th className="px-4 py-3 font-medium text-right">Msgs enviadas</th>
                <th className="px-4 py-3 font-medium text-right">Conversões</th>
                <th className="px-4 py-3 font-medium text-right">Receita total</th>
                <th className="px-4 py-3 font-medium text-right">Custo</th>
                <th className="px-4 py-3 font-medium text-right">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {campaignPerformanceData.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">{r.name}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.audience.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.msgs_sent.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right font-mono text-mint-600 font-semibold">{r.conversions}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">R$ {r.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">R$ {r.cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right"><span className={`font-semibold ${r.roas ? 'text-mint-600' : 'text-slate-400'}`}>{r.roas || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}