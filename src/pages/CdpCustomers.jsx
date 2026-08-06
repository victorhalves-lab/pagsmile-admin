import React, { useState } from 'react';
import { Search, Mail, Phone, Star, ShoppingBag, Coins, Eye } from 'lucide-react';
import { customers360 } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const rfvStyle = {
  Champion: 'bg-mint-100 text-mint-700',
  Loyal: 'bg-blue-100 text-blue-700',
  Promising: 'bg-cyan-100 text-cyan-700',
  'At Risk': 'bg-amber-100 text-amber-700',
  Hibernating: 'bg-slate-200 text-slate-600',
};

const levelStyle = {
  Bronze: 'text-amber-700',
  Prata: 'text-slate-500',
  Ouro: 'text-amber-500',
  Diamante: 'text-mint-600',
};

export default function CdpCustomers() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(customers360[0]);

  const filtered = customers360.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clientes (Visão 360º)</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Base de clientes com jornada completa, RFV e pontos</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs text-slate-500 dark:text-slate-400 uppercase">
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Última compra</th>
                <th className="px-4 py-3 font-medium text-right">Gasto total</th>
                <th className="px-4 py-3 font-medium">RFV</th>
                <th className="px-4 py-3 font-medium">Nível</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 ${selected.id === c.id ? 'bg-mint-50/40 dark:bg-mint-500/5' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.last_purchase}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">R$ {c.total_spent.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${rfvStyle[c.rfv]}`}>{c.rfv}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold ${levelStyle[c.level]}`}>{c.level}</span></td>
                  <td className="px-4 py-3 text-right"><Eye className="w-4 h-4 text-slate-400 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 360 detail */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-mint-100 text-mint-700 flex items-center justify-center font-bold text-lg">
              {selected.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{selected.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${rfvStyle[selected.rfv]}`}>{selected.rfv}</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Mail className="w-3.5 h-3.5 text-slate-400" /> {selected.email}</div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Phone className="w-3.5 h-3.5 text-slate-400" /> {selected.phone}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
              <ShoppingBag className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Pedidos</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white">{selected.orders}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
              <Coins className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Pontos</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white">{selected.points.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
              <Star className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Nível</p>
              <p className={`font-bold text-sm ${levelStyle[selected.level]}`}>{selected.level}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Timeline</p>
            <div className="space-y-3">
              <div className="flex gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-500 mt-1.5" />
                <div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">Compra realizada</p>
                  <p className="text-slate-400">{selected.last_purchase} · R$ {selected.total_spent.toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5" />
                <div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">E-mail de cupom enviado</p>
                  <p className="text-slate-400">2 dias antes</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5" />
                <div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">Entrou no programa</p>
                  <p className="text-slate-400">Jan/2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}