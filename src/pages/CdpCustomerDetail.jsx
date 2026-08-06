import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Send, Tag, Download, Phone, Mail, MapPin, Calendar, CreditCard,
  ShoppingCart, MessageSquare, Award, Coins, TrendingUp, Users, Sparkles,
  Star, Clock, Target, Gift, AlertTriangle, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  customer360Full, customerPurchases, customerCommunications,
  customerSegments, customerTimelineFull, customerMonthlySpend,
} from '@/components/loyalty-cdp/mocks/customer360Mocks';

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
  { id: 'journey', label: 'Jornada', icon: Clock },
  { id: 'purchases', label: 'Compras', icon: ShoppingCart },
  { id: 'comms', label: 'Comunicações', icon: MessageSquare },
  { id: 'loyalty', label: 'Fidelidade', icon: Award },
  { id: 'segments', label: 'Segmentos', icon: Users },
  { id: 'predictions', label: 'Predições IA', icon: Sparkles },
];

const timelineIcon = {
  purchase: { bg: 'bg-mint-500', icon: ShoppingCart },
  whatsapp: { bg: 'bg-green-500', icon: MessageSquare },
  email: { bg: 'bg-blue-400', icon: Mail },
  rfv_change: { bg: 'bg-purple-400', icon: TrendingUp },
  points: { bg: 'bg-amber-400', icon: Coins },
  reward: { bg: 'bg-pink-400', icon: Gift },
  segment: { bg: 'bg-slate-400', icon: Users },
};

export default function CdpCustomerDetail() {
  const [tab, setTab] = useState('overview');
  const c = customer360Full;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/CdpCustomers" className="hover:text-mint-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Clientes
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 dark:text-slate-300 font-medium">{c.name}</span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-mint-100 text-mint-700 flex items-center justify-center font-bold text-2xl flex-shrink-0">{c.avatar_letter}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{c.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: c.rfv.bg, color: c.rfv.color }}>RFV: {c.rfv.label}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: c.level.color }}>★ {c.level.name}</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.city}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Nasc: {c.birthdate}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {c.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">{t}</span>
                ))}
                {c.channels.map((ch) => (
                  <span key={ch} className="px-2 py-0.5 rounded-md bg-mint-50 text-mint-700 text-[11px] font-medium border border-mint-200">{ch}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-xs font-semibold"><Send className="w-3.5 h-3.5" /> Enviar msg</button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"><Tag className="w-3.5 h-3.5" /> Adicionar tag</button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"><Download className="w-3.5 h-3.5" /> Exportar</button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? 'border-mint-500 text-mint-700 dark:text-mint-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab c={c} />}
      {tab === 'journey' && <JourneyTab />}
      {tab === 'purchases' && <PurchasesTab />}
      {tab === 'comms' && <CommsTab />}
      {tab === 'loyalty' && <LoyaltyTab c={c} />}
      {tab === 'segments' && <SegmentsTab />}
      {tab === 'predictions' && <PredictionsTab c={c} />}
    </div>
  );
}

function OverviewTab({ c }) {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Score RFV</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Recência (R)', value: c.rfv_scores.recency, max: 5, color: '#2bc196' },
            { label: 'Frequência (F)', value: c.rfv_scores.frequency, max: 5, color: '#3b82f6' },
            { label: 'Valor (M)', value: c.rfv_scores.monetary, max: 5, color: '#8b5cf6' },
            { label: 'RFV combinado', value: c.rfv_scores.rfv_combined, max: 5, color: '#f59e0b' },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs text-slate-400">/ {s.max}</span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(s.value / s.max) * 100}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Gasto total', value: `R$ ${c.metrics.total_spent.toLocaleString('pt-BR')}`, sub: `${c.metrics.orders} compras`, icon: ShoppingCart, color: '#2bc196' },
          { label: 'Ticket médio', value: `R$ ${c.metrics.avg_ticket.toFixed(2)}`, sub: `${c.metrics.items_per_order} itens/pedido`, icon: CreditCard, color: '#3b82f6' },
          { label: 'Ciclo de recompra', value: `${c.metrics.avg_cycle_days} dias`, sub: 'média entre compras', icon: Clock, color: '#8b5cf6' },
          { label: 'Canal preferido', value: c.metrics.favorite_channel, sub: `Pagamento: ${c.metrics.preferred_payment}`, icon: Target, color: '#f59e0b' },
          { label: 'Primeira compra', value: c.first_purchase, sub: `${c.lifecycle_days} dias de relação`, icon: Calendar, color: '#2bc196' },
          { label: 'Última compra', value: c.metrics.last_purchase, sub: 'há 11 dias', icon: TrendingUp, color: '#3b82f6' },
          { label: 'Taxa de devolução', value: `${c.metrics.return_rate}%`, sub: `${c.metrics.returns} devoluções`, icon: AlertTriangle, color: '#ef4444' },
          { label: 'Cashback acumulado', value: `R$ ${c.loyalty.cashback_earned.toFixed(2)}`, sub: `${c.loyalty.rewards_redeemed} prêmios`, icon: Gift, color: '#f59e0b' },
        ].map((m) => (
          <div key={m.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${m.color}15`, color: m.color }}>
              <m.icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-500">{m.label}</p>
            <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">{m.value}</p>
            <p className="text-[11px] text-slate-400">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Gasto mensal (últimos 8 meses)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={customerMonthlySpend}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2bc196" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2bc196" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
            <Tooltip formatter={(v) => [`R$ ${v.toFixed(2)}`, 'Gasto']} />
            <Area type="monotone" dataKey="value" stroke="#2bc196" strokeWidth={2} fill="url(#colorSpend)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function JourneyTab() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Linha do tempo completa</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-4">
          {customerTimelineFull.map((ev, i) => {
            const meta = timelineIcon[ev.type] || { bg: 'bg-slate-400', icon: Star };
            const Icon = meta.icon;
            return (
              <div key={i} className="flex gap-3 relative">
                <div className={`w-8 h-8 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0 z-10`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{ev.title}</p>
                  <p className="text-xs text-slate-500">{ev.desc}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ev.date}</p>
                  {ev.coupon && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200">🏷 {ev.coupon}</span>}
                  {ev.value && <span className="inline-block mt-1 ml-1 px-2 py-0.5 rounded text-[10px] bg-mint-50 text-mint-700 border border-mint-200">R$ {ev.value.toFixed(2)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PurchasesTab() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Histórico de compras ({customerPurchases.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase">
              <th className="px-4 py-3 text-left font-medium">Data</th>
              <th className="px-4 py-3 text-left font-medium">Canal</th>
              <th className="px-4 py-3 text-right font-medium">Itens</th>
              <th className="px-4 py-3 text-right font-medium">Valor</th>
              <th className="px-4 py-3 text-left font-medium">Cupom</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {customerPurchases.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{p.date}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.channel}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-200">{p.items}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">R$ {p.value.toFixed(2)}</td>
                <td className="px-4 py-3">{p.coupon ? <span className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200">🏷 {p.coupon}</span> : <span className="text-slate-400 text-xs">—</span>}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === 'aprovado' ? 'bg-mint-100 text-mint-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CommsTab() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Comunicações recebidas ({customerCommunications.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase">
              <th className="px-4 py-3 text-left font-medium">Data</th>
              <th className="px-4 py-3 text-left font-medium">Canal</th>
              <th className="px-4 py-3 text-left font-medium">Campanha</th>
              <th className="px-4 py-3 text-center font-medium">Abriu</th>
              <th className="px-4 py-3 text-center font-medium">Clicou</th>
              <th className="px-4 py-3 text-center font-medium">Converteu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {customerCommunications.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{m.date}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.channel}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{m.campaign}</td>
                <td className="px-4 py-3 text-center">{m.opened ? <span className="text-mint-600">✓</span> : <span className="text-slate-300">✕</span>}</td>
                <td className="px-4 py-3 text-center">{m.clicked ? <span className="text-mint-600">✓</span> : <span className="text-slate-300">✕</span>}</td>
                <td className="px-4 py-3 text-center">{m.converted ? <span className="text-mint-600">✓</span> : <span className="text-slate-300">✕</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LoyaltyTab({ c }) {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2"><Award className="w-4 h-4 text-mint-500" /> Progresso do nível</h3>
          <span className="text-xs text-slate-500">{c.loyalty.tier_progress}% para {c.loyalty.tier_next}</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full bg-gradient-to-r from-mint-400 to-mint-600" style={{ width: `${c.loyalty.tier_progress}%` }} />
        </div>
        <p className="text-xs text-slate-500">Faltam <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{c.loyalty.tier_remaining} pontos</span> para o próximo nível</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Saldo de pontos', value: c.loyalty.points_balance.toLocaleString('pt-BR'), icon: Coins, color: '#2bc196' },
          { label: 'Pontos ganhos (ano)', value: c.loyalty.points_earned_ytd.toLocaleString('pt-BR'), icon: TrendingUp, color: '#3b82f6' },
          { label: 'Pontos resgatados (ano)', value: c.loyalty.points_redeemed_ytd.toLocaleString('pt-BR'), icon: Gift, color: '#8b5cf6' },
          { label: 'Cashback acumulado', value: `R$ ${c.loyalty.cashback_earned.toFixed(2)}`, icon: Sparkles, color: '#f59e0b' },
        ].map((m) => (
          <div key={m.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${m.color}15`, color: m.color }}>
              <m.icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-500">{m.label}</p>
            <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recompensas resgatadas</h3>
        <div className="space-y-2">
          {['Tapioca grátis', 'Brigadeiro de pistache', 'Frete grátis', '15% OFF próxima compra', 'Bebida grátis', 'Combo casal', 'Sobremesa grátis'].slice(0, c.loyalty.rewards_redeemed).map((r, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <Gift className="w-4 h-4 text-mint-500" />
              <span className="text-sm text-slate-700 dark:text-slate-200">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SegmentsTab() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Segmentos atribuídos ({customerSegments.length})</h3>
      <div className="space-y-2">
        {customerSegments.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Users className="w-4 h-4" /></div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.name}</p>
                <p className="text-xs text-slate-500">Tipo: {s.type} · desde {s.since}</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.auto ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{s.auto ? 'Automático' : 'Manual'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PredictionsTab({ c }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Probabilidade de churn</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold font-mono ${c.predictions.churn_probability < 20 ? 'text-mint-600' : c.predictions.churn_probability < 50 ? 'text-amber-500' : 'text-red-500'}`}>{c.predictions.churn_probability}%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Baixo risco</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">LTV projetado</p>
          <span className="text-3xl font-bold font-mono text-mint-600">R$ {c.predictions.ltv_projected.toLocaleString('pt-BR')}</span>
          <p className="text-xs text-slate-400 mt-1">próximos 12 meses</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Próxima compra estimada</p>
          <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">{c.predictions.next_purchase_eta}</span>
          <p className="text-xs text-slate-400 mt-1">dias</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-mint-500" /> Ações recomendadas pela IA</h3>
        <div className="space-y-3">
          {c.predictions.recommended_actions.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-mint-400 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center flex-shrink-0"><Target className="w-4 h-4" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{a.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.rationale}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-xs font-semibold whitespace-nowrap">Executar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}