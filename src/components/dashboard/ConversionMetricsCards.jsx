import React from 'react';
import {
  CreditCard, QrCode, FileText, TrendUp, Target as TargetIcon,
  Percent, ArrowUpRight, ArrowDownRight,
} from '@phosphor-icons/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  VF, VfCard, VfSectionHeader, VfPill, VfProgress, VfNumber, fmtInt,
} from './analytics/vfHelpers';

const fmtCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1,
  }).format(v || 0);

/* ─── Conversion KPI Card V9 ─── */
const ConversionCard = ({ title, rate, previousRate, approved, total, icon: Icon, benchmark, accent }) => {
  const trend = rate - previousRate;
  const isPositive = trend >= 0;
  const isAboveBenchmark = benchmark ? rate >= benchmark : true;
  const accentColor = accent || VF.mint;

  return (
    <div
      className="relative overflow-hidden p-4 transition-all hover:-translate-y-0.5"
      style={{
        background: VF.surface,
        border: `1px solid ${VF.mintBorder}`,
        borderRadius: 14,
        minHeight: 152,
      }}
    >
      {/* Top accent line V9 */}
      <span
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${accentColor}, ${VF.glow})`,
        }}
      />

      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex-shrink-0 inline-flex items-center justify-center"
            style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #E0F8F1, #B4FCE8)',
              color: VF.mintDark,
              border: `1px solid ${VF.mintBorder}`,
            }}
          >
            <Icon weight="duotone" size={16} />
          </div>
          <div className="min-w-0">
            <p
              className="font-mono truncate"
              style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: VF.mintDark,
              }}
            >
              {title}
            </p>
            <p
              className="font-mono"
              style={{ fontSize: 10, color: VF.muted, fontVariantNumeric: 'tabular-nums' }}
            >
              {fmtInt(approved)} / {fmtInt(total)}
            </p>
          </div>
        </div>
        <span
          className="font-mono inline-flex items-center gap-0.5"
          style={{
            padding: '3px 7px', borderRadius: 99,
            background: isPositive
              ? 'linear-gradient(135deg, #B3F0DE, #B4FCE8)'
              : 'linear-gradient(135deg, #FEE2E2, #FCA5A5)',
            color: isPositive ? VF.mintDark : VF.red,
            border: `1px solid ${isPositive ? '#4DD8AB' : '#FCA5A5'}`,
            fontSize: 9.5, fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {isPositive ? <ArrowUpRight weight="bold" size={9} /> : <ArrowDownRight weight="bold" size={9} />}
          {Math.abs(trend).toFixed(1)}%
        </span>
      </div>

      <div className="flex items-end justify-between mb-2 gap-2">
        <VfNumber size={32}>{rate.toFixed(1)}%</VfNumber>
        {benchmark && (
          <VfPill variant={isAboveBenchmark ? 'mint' : 'err'}>
            BMK {benchmark}%
          </VfPill>
        )}
      </div>

      <VfProgress
        value={Math.min(rate, 100)}
        gradient={`linear-gradient(90deg, ${accentColor}, ${VF.mintDark})`}
        height={5}
      />
    </div>
  );
};

export default function ConversionMetricsCards({ transactions = [] }) {
  const metrics = React.useMemo(() => {
    const cardTx = transactions.filter((t) => t.method === 'credit_card' || t.method === 'debit_card');
    const pixTx = transactions.filter((t) => t.method === 'pix');
    const boletoTx = transactions.filter((t) => t.method === 'boleto');

    const calc = (txs) => {
      const approved = txs.filter((t) => t.status === 'approved').length;
      return { approved, total: txs.length, rate: txs.length > 0 ? (approved / txs.length) * 100 : 0 };
    };

    const allMetrics = calc(transactions);
    const cardMetrics = calc(cardTx);
    const pixMetrics = calc(pixTx);
    const boletoMetrics = calc(boletoTx);

    return {
      all:    { ...allMetrics,    previousRate: allMetrics.rate - 1.2 },
      card:   { ...cardMetrics,   previousRate: cardMetrics.rate - 0.8, benchmark: 75 },
      pix:    { ...pixMetrics,    previousRate: pixMetrics.rate + 0.5,  benchmark: 90 },
      boleto: { ...boletoMetrics, previousRate: boletoMetrics.rate - 2.1, benchmark: 50 },
    };
  }, [transactions]);

  // Tendência mock (4 semanas)
  const trendData = [
    { name: 'Sem 1', cartao: 72, pix: 93, boleto: 46, geral: 76 },
    { name: 'Sem 2', cartao: 74, pix: 94, boleto: 48, geral: 78 },
    { name: 'Sem 3', cartao: 71, pix: 95, boleto: 44, geral: 75 },
    { name: 'Sem 4', cartao: 73, pix: 94, boleto: 47, geral: 77 },
  ];

  // Volume mock
  const volumeData = [
    { name: 'Cartão', value: 1250000, color: VF.navy2 },
    { name: 'PIX',    value: 890000,  color: VF.mint },
    { name: 'Boleto', value: 320000,  color: VF.deep },
  ];

  const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div
        style={{
          background: VF.navy, color: '#fff',
          padding: '8px 12px', borderRadius: 8,
          border: '1px solid rgba(92,247,207,0.3)',
          boxShadow: '0 8px 24px -8px rgba(0,17,36,0.4)',
        }}
      >
        <p className="font-mono" style={{ fontSize: 10, color: VF.glow, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
          {payload[0].payload.name}
        </p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3" style={{ fontSize: 11 }}>
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>{entry.name}</span>
            <span className="font-mono" style={{ fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <ConversionCard title="Conversão Geral"   rate={metrics.all.rate}    previousRate={metrics.all.previousRate}    approved={metrics.all.approved}    total={metrics.all.total}    icon={TargetIcon}  accent={VF.deep} />
        <ConversionCard title="Conversão Cartão" rate={metrics.card.rate}   previousRate={metrics.card.previousRate}   approved={metrics.card.approved}   total={metrics.card.total}   icon={CreditCard}  accent={VF.navy2} benchmark={metrics.card.benchmark} />
        <ConversionCard title="Conversão PIX"    rate={metrics.pix.rate}    previousRate={metrics.pix.previousRate}    approved={metrics.pix.approved}    total={metrics.pix.total}    icon={QrCode}      accent={VF.mint}  benchmark={metrics.pix.benchmark} />
        <ConversionCard title="Conversão Boleto" rate={metrics.boleto.rate} previousRate={metrics.boleto.previousRate} approved={metrics.boleto.approved} total={metrics.boleto.total} icon={FileText}    accent={VF.amber} benchmark={metrics.boleto.benchmark} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VfCard>
          <VfSectionHeader
            eyebrow="Conversão · evolução"
            title="Tendência por"
            highlight="método"
            icon={TrendUp}
          />
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="vfGradMint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={VF.mint} stopOpacity={0.42} />
                    <stop offset="100%" stopColor={VF.mint} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="vfGradNavy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={VF.navy2} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={VF.navy2} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="vfGradDeep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={VF.deep} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={VF.deep} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0F8F1" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: VF.muted, fontFamily: 'JetBrains Mono, monospace' }} stroke="#B3F0DE" />
                <YAxis tick={{ fontSize: 10, fill: VF.muted, fontFamily: 'JetBrains Mono, monospace' }} stroke="#B3F0DE" domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="cartao" name="Cartão" stroke={VF.navy2} fill="url(#vfGradNavy)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="pix"    name="PIX"    stroke={VF.mint}  fill="url(#vfGradMint)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="boleto" name="Boleto" stroke={VF.deep}  fill="url(#vfGradDeep)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            {[
              { label: 'Cartão', color: VF.navy2 },
              { label: 'PIX',    color: VF.mint },
              { label: 'Boleto', color: VF.deep },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                <span className="font-mono" style={{ fontSize: 10.5, color: VF.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </VfCard>

        <VfCard>
          <VfSectionHeader
            eyebrow="Volume · método"
            title="Distribuição de"
            highlight="volume"
            icon={Percent}
          />
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={volumeData}
                  cx="50%" cy="50%"
                  innerRadius={56} outerRadius={86}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {volumeData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => fmtCurrency(v)}
                  contentStyle={{
                    background: VF.navy, color: '#fff',
                    border: '1px solid rgba(92,247,207,0.3)',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  itemStyle={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}
                  labelStyle={{ color: VF.glow }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            {volumeData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                <span className="font-mono" style={{ fontSize: 10.5, color: VF.muted, fontWeight: 700, letterSpacing: '0.06em' }}>
                  <strong style={{ color: VF.navy }}>{item.name}</strong>: {fmtCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </VfCard>
      </div>
    </div>
  );
}