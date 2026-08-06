import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, Star, ShoppingBag, Coins, Download, RefreshCw, MessageSquare, ShoppingCart, ArrowUpDown, ChevronRight } from 'lucide-react';
import { customers360 } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';
import { customerTimelineEvents } from '@/components/loyalty-cdp/mocks/cdpAnalyticsMocks';

const rfvStyle = {
  Champion: 'bg-mint-100 text-mint-700',
  Loyal: 'bg-blue-100 text-blue-700',
  Promising: 'bg-purple-100 text-purple-700',
  'At Risk': 'bg-amber-100 text-amber-700',
  Hibernating: 'bg-slate-200 text-slate-600',
};

const rfvLabel = {
  Champion: 'Campeão', Loyal: 'Fiel', Promising: 'Promissor', 'At Risk': 'Em risco', Hibernating: 'Hibernando',
};

const levelStyle = {
  Bronze: 'text-amber-700', Prata: 'text-slate-500', Ouro: 'text-amber-500', Diamante: 'text-mint-600',
};

const timelineIcon = {
  purchase: { bg: 'bg-mint-500', icon: ShoppingCart },
  whatsapp: { bg: 'bg-green-500', icon: MessageSquare },
  rfv_change: { bg: 'bg-blue-400', icon: ArrowUpDown },
};

const extendedCustomers = [
  ...customers360,
  { id: 'cu7', name: 'Marco A. Poletto Filho', email: 'marco@email.com', phone: '+55 11 99736-4799', last_purchase: '2026-08-05', total_spent: 6566, orders: 192, rfv: 'Champion', points: 6566, level: 'Diamante', avg_ticket: 34.20 },
  { id: 'cu8', name: 'Roberto Lima', email: 'roberto@email.com', phone: '+55 21 99601-2261', last_purchase: '2026-08-04', total_spent: 2398, orders: 67, rfv: 'Champion', points: 2398, level: 'Ouro', avg_ticket: 35.80 },
  { id: 'cu9', name: 'Isadora Manfrinato', email: 'isadora@email.com', phone: '+55 31 99756-7786', last_purchase: '2026-08-03', total_spent: 1592, orders: 49, rfv: 'Loyal', points: 1592, level: 'Ouro', avg_ticket: 32.49 },
];

export default function CdpCustomers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(extendedCustomers[0]);
  const [rfvFilter, setRfvFilter] = useState('Todos');

  const rfvOptions = ['Todos', 'Champion', 'Loyal', 'Promising', 'At Risk', 'Hibernating'];

  const filtered = extendedCustomers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search);
    const matchRfv = rfvFilter === 'Todos' || c.rfv === rfvFilter;
    return matchSearch && matchRfv;
  });

  const totalCustomers = extendedCustomers.length;
  const noPhone = extendedCustomers.filter((c) => !c.phone).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Todos os Clientes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Visão 360º com jornada completa, RFV e engajamento</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"><RefreshCw className="w-3.5 h-3.5" /> Atualizar</button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"><Download className="w-3.5 h-3.5" /> Exportar</button>
        </div>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total de clientes', value: '42.100', sub: '3.585 novos este mês', highlight: true },
          { label: 'Sem nº de telefone', value: '26.836', sub: '22,03% dos clientes', red: true },
          { label: 'Sem data de aniversário', value: '103.366', sub: '84,87% dos clientes', red: true },
          { label: 'Clientes para enriquecer', value: '26.202', sub: 'Descubra o perfil', highlight: true },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">{k.label}</p>
            <p className={`text-2xl font-bold font-mono ${k.red ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{k.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome, celular ou CPF..." className="w-64 pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <select value={rfvFilter} onChange={(e) => setRfvFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm">
          {rfvOptions.map((o) => <option key={o} value={o}>{o === 'Todos' ? 'Status RFV: Todos' : rfvLabel[o] || o}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Table */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs text-slate-500 dark:text-slate-400 uppercase">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Status RFV</th>
                  <th className="px-4 py-3 font-medium">Celular</th>
                  <th className="px-4 py-3 font-medium text-right">Compras</th>
                  <th className="px-4 py-3 font-medium text-right">Últ. compra</th>
                  <th className="px-4 py-3 font-medium text-right">Gasto total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((c, idx) => (
                  <tr key={c.id} onClick={() => { setSelected(c); navigate('/CdpCustomerDetail'); }} className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 ${selected?.id === c.id ? 'bg-mint-50/40 dark:bg-mint-500/5' : ''}`}>
                    <td className="px-4 py-3 text-xs text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white flex items-center gap-1">{c.name} <ChevronRight className="w-3 h-3 text-slate-300" /></p>
                      <p className="text-xs text-slate-400">{c.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${rfvStyle[c.rfv]}`}>{rfvLabel[c.rfv] || c.rfv}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-slate-700 dark:text-slate-200">{c.orders}</td>
                    <td className="px-4 py-3 text-right text-xs text-slate-500">{c.last_purchase}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">R$ {c.total_spent.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 360 detail */}
        {selected && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-mint-100 text-mint-700 flex items-center justify-center font-bold text-lg">{selected.name.charAt(0)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{selected.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${rfvStyle[selected.rfv]}`}>{rfvLabel[selected.rfv] || selected.rfv}</span>
                </div>
                <p className="text-xs text-slate-500">{selected.phone}</p>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400 uppercase">Gasta em média</p>
                <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">R$ {((selected.total_spent / selected.orders) || 0).toFixed(2)}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400 uppercase">Gasto total</p>
                <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">R$ {selected.total_spent.toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-slate-400">{selected.orders} compras</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400 uppercase">Pontos</p>
                <p className="font-mono font-bold text-sm text-mint-600">{selected.points.toLocaleString('pt-BR')}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400 uppercase">Nível</p>
                <p className={`font-bold text-sm ${levelStyle[selected.level]}`}>{selected.level}</p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Histórico de eventos</p>
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-3">
                  {customerTimelineEvents.map((ev, i) => {
                    const meta = timelineIcon[ev.type] || { bg: 'bg-slate-400', icon: Star };
                    const Icon = meta.icon;
                    return (
                      <div key={i} className="flex gap-3 relative">
                        <div className={`w-7 h-7 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0 z-10`}>
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 pb-1">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{ev.title}</p>
                          <p className="text-[11px] text-slate-500">{ev.desc}</p>
                          <p className="text-[10px] text-slate-400">{ev.date}</p>
                          {ev.coupon && <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200">🏷 {ev.coupon}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}