import React from 'react';
import { Building2, Send, Target, TrendingUp, ShieldCheck, AlertTriangle, Mail, MessageSquare, Smartphone, Bell, ChevronRight } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { adminIntCdpKpis } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const channelColors = { whatsapp: '#25d366', email: '#2bc196', sms: '#3b82f6', push: '#f59e0b' };
const channelIcons = { WhatsApp: MessageSquare, Email: Mail, SMS: Smartphone, Push: Bell };

const merchantStatusStyle = {
  saudável: 'bg-mint-100 text-mint-700',
  atenção: 'bg-amber-100 text-amber-700',
  risco: 'bg-red-100 text-red-700',
};

export default function AdminIntCdpDashboard() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CDP / CRM · Governança</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{adminIntCdpKpis.merchants_active_cdp} merchants ativos de {adminIntCdpKpis.merchants_eligible} elegíveis · supervisão consolidada</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-navy-50 text-navy-700 text-xs font-semibold border border-navy-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Supervisão PagSmile
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Merchants ativos no CDP', value: adminIntCdpKpis.merchants_active_cdp, sub: `${adminIntCdpKpis.merchants_eligible} elegíveis`, icon: Building2 },
          { label: 'Mensagens enviadas', value: `${(adminIntCdpKpis.messages_sent_platform / 1000000).toFixed(1)}M`, sub: 'total plataforma', icon: Send },
          { label: 'Conversões', value: `${(adminIntCdpKpis.conversions_platform / 1000).toFixed(0)}k`, sub: `${((adminIntCdpKpis.conversions_platform / adminIntCdpKpis.messages_sent_platform) * 100).toFixed(2)}% taxa`, icon: Target },
          { label: 'Receita gerada', value: `R$ ${(adminIntCdpKpis.revenue_generated_platform / 1000000).toFixed(1)}M`, sub: 'atribuída ao CDP', icon: TrendingUp },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center mb-2"><k.icon className="w-4 h-4" /></div>
            <p className="text-xs text-slate-500">{k.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">{k.value}</p>
            <p className="text-[11px] text-slate-400">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Volume trend */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Volume de mensagens por canal (últimos 7 meses)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={adminIntCdpKpis.volume_trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}k`} />
            <Tooltip />
            <Legend />
            {Object.keys(channelColors).map((k) => (
              <Line key={k} type="monotone" dataKey={k} stroke={channelColors[k]} strokeWidth={2} dot={false} name={k.charAt(0).toUpperCase() + k.slice(1)} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Channel mix */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Mix de canais</h3>
          <div className="space-y-3">
            {adminIntCdpKpis.channel_mix.map((c) => {
              const Icon = channelIcons[c.channel] || Send;
              return (
                <div key={c.channel} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15`, color: c.color }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{c.channel}</span>
                      <span className="font-mono text-slate-500">{c.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 w-16 text-right">R$ {(c.revenue / 1000000).toFixed(1)}M</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* LGPD monitor */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-mint-500" /> Monitor LGPD / Opt-out</h3>
            <span className="text-xs text-slate-500">Opt-in rate: <span className="font-mono font-semibold text-mint-600">{adminIntCdpKpis.opt_in_rate}%</span></span>
          </div>
          <div className="space-y-2">
            {adminIntCdpKpis.lgpd_alerts.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.severity === 'alto' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{a.merchant}</p>
                    <p className="text-xs text-slate-500">{a.type} · {a.count} caso(s) · {a.since}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${a.severity === 'alto' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{a.severity}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Merchant breakdown table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Desempenho por merchant</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase">
                <th className="px-4 py-3 text-left font-medium">Merchant</th>
                <th className="px-4 py-3 text-right font-medium">Msgs enviadas</th>
                <th className="px-4 py-3 text-right font-medium">Conversões</th>
                <th className="px-4 py-3 text-right font-medium">Taxa conv.</th>
                <th className="px-4 py-3 text-right font-medium">Receita gerada</th>
                <th className="px-4 py-3 text-center font-medium">Opt-out pend.</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adminIntCdpKpis.top_merchants.map((m) => (
                <tr key={m.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{m.name}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">{m.sent.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right font-mono text-mint-600 font-semibold">{m.conv.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">{m.conv_rate}%</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">R$ {m.revenue.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.opt_out > 5 ? 'bg-red-100 text-red-700' : m.opt_out > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{m.opt_out}</span></td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${merchantStatusStyle[m.status]}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Custos de disparo (mensal)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
                <div><p className="text-sm font-medium text-slate-700 dark:text-slate-200">WhatsApp</p><p className="text-xs text-slate-500">Marketing</p></div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">R$ {adminIntCdpKpis.whatsapp_cost_monthly.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Smartphone className="w-4 h-4" /></div>
                <div><p className="text-sm font-medium text-slate-700 dark:text-slate-200">SMS</p><p className="text-xs text-slate-500">Marketing</p></div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">R$ {adminIntCdpKpis.sms_cost_monthly.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Alertas de compliance</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200"><p className="font-semibold text-amber-700 dark:text-amber-400">Opt-out pendente</p><p className="text-slate-600 dark:text-slate-300 mt-0.5">{adminIntCdpKpis.opt_out_pending} merchants com fila de opt-out pendente de processamento</p></div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200"><p className="font-semibold text-red-700 dark:text-red-400">Limite de disparos</p><p className="text-slate-600 dark:text-slate-300 mt-0.5">1 merchant acima do limite de disparos/hora (Edu+ Cursos)</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}