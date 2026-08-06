import React, { useState } from 'react';
import { Users, Mail, Send, Target, TrendingUp, MapPin, Sparkles, MessageSquare, Zap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import {
  cdpKpis, revenueComposition, revenueByChannel, campaignList, rfvMatrix,
} from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const kpis = [
  { label: 'Total de clientes', value: cdpKpis.total_customers.toLocaleString('pt-BR'), icon: Users, accent: 'mint' },
  { label: 'Mensagens enviadas', value: (cdpKpis.messages_sent / 1000).toFixed(0) + 'k', icon: Send, accent: 'navy' },
  { label: 'Conversões', value: cdpKpis.conversions.toLocaleString('pt-BR'), icon: Target, accent: 'mint' },
  { label: 'Receita gerada', value: `R$ ${(cdpKpis.revenue_generated / 1000).toFixed(0)}k`, icon: TrendingUp, accent: 'navy' },
];

const quickLinks = [
  { label: 'Clientes (360º)', icon: Users, page: 'CdpCustomers' },
  { label: 'Segmentos', icon: Target, page: 'CdpSegments' },
  { label: 'Análise RFV', icon: BarChart3, page: 'CdpRfvAnalysis' },
  { label: 'Campanhas', icon: Send, page: 'CdpCampaigns' },
  { label: 'Automação', icon: Zap, page: 'CdpAutomation' },
  { label: 'Geo Campanhas', icon: MapPin, page: 'CdpGeoCampaigns' },
];

const channelColors = ['#2bc196', '#002443', '#5cf7cf', '#f59e0b'];

export default function CdpDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CDP / CRM</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Customer Data Platform · Jornada, segmentação e campanhas</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-mint-50 text-mint-700 text-xs font-semibold border border-mint-200">
          {cdpKpis.active_campaigns} campanhas ativas · {cdpKpis.automation_flows} automações
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${k.accent === 'mint' ? 'bg-mint-50 text-mint-600' : 'bg-navy-50 text-navy-600'}`}>
              <k.icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Receita gerada por canal</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueByChannel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" vertical={false} />
              <XAxis dataKey="channel" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {revenueByChannel.map((_, i) => (
                  <Cell key={i} fill={channelColors[i % channelColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Composição da receita</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={revenueComposition} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {revenueComposition.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {revenueComposition.map((r) => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{r.name}</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">R$ {(r.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RFV + Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Segmentação RFV</h3>
          <div className="space-y-2">
            {rfvMatrix.map((s) => (
              <div key={s.segment} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{s.segment}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-mint-100 text-mint-700">{s.pct}%</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.action}</p>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{s.count.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-mint-500" /> Acesso rápido
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((q) => (
              <Link
                key={q.page}
                to={createPageUrl(q.page)}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-mint-400 hover:bg-mint-50/50 dark:hover:bg-mint-500/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-mint-100 dark:group-hover:bg-mint-500/20 flex items-center justify-center transition-colors">
                  <q.icon className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-mint-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}