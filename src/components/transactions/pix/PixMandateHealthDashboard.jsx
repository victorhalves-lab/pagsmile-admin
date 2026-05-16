import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { Repeat, CheckCircle, CalendarClock } from 'lucide-react';

import { PulseKpi, PulsePill, PulseSectionHead, PulseCard } from '@/components/pulse';
import { MANDATE_MOCK, MANDATE_COHORT_MOCK, REVOCATION_REASONS, FLOW_COMPARISON } from './pixFlowMockData';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const COHORT_COLORS = ['#2bc196', '#36706c', '#002443', '#f5b942', '#ff6b6b'];

export default function PixMandateHealthDashboard() {
  const active  = MANDATE_MOCK.filter(m => m.status === 'active');
  const revoked = MANDATE_MOCK.filter(m => m.status === 'revoked');
  const mrr     = active.reduce((s, m) => s + m.amount, 0);

  return (
    <div className="space-y-8">
      {/* ── 01 · KPIs ─────────────────────────────────────────── */}
      <section>
        <PulseSectionHead
          num="01"
          eyebrow="MANDATOS · saúde"
          title="Visão executiva"
          sub="MRR recorrente, taxa de sucesso e churn dos consentimentos PIX Automático ativos."
        />
        <div className="pulse-grid-4">
          <PulseKpi
            label="Mandatos ativos"
            value={active.length.toLocaleString('pt-BR')}
            valueSize="xl"
            delta={{ direction: 'up', text: '+12% vs mês anterior' }}
            pill={<PulsePill tone="mint" dot pulse size="xs">LIVE</PulsePill>}
            glow="mint"
          />
          <PulseKpi
            label="MRR · PIX Automático"
            ccy="R$"
            value={fmt(mrr).replace('R$', '').trim()}
            valueSize="lg"
            foot="Recorrente / mês"
          />
          <PulseKpi
            label="Sucesso 1ª tentativa"
            value={`${FLOW_COMPARISON.automatic.success_rate_1st}%`}
            valueSize="xl"
            delta={{ direction: 'up', text: `${FLOW_COMPARISON.automatic.success_rate_3rd}% até 3ª tentativa` }}
            glow="mint"
          />
          <PulseKpi
            label="Churn mensal"
            value={`${FLOW_COMPARISON.automatic.churn_monthly}%`}
            valueSize="xl"
            delta={{ direction: 'down', text: `${revoked.length} revogados` }}
            glow="coral"
          />
        </div>
      </section>

      {/* ── 02 · Cohort Survival ──────────────────────────────── */}
      <section>
        <PulseSectionHead
          num="02"
          eyebrow="COHORT · sobrevivência"
          title="Sobrevivência de mandatos"
          sub="% de mandatos ainda ativos mês a mês após criação."
        />
        <PulseCard>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={MANDATE_COHORT_MOCK}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ededed" />
              <XAxis dataKey="month" stroke="#888" fontSize={11} />
              <YAxis domain={[70, 100]} unit="%" stroke="#888" fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="m1" name="M+1" stroke={COHORT_COLORS[0]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="m2" name="M+2" stroke={COHORT_COLORS[1]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="m3" name="M+3" stroke={COHORT_COLORS[2]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="m4" name="M+4" stroke={COHORT_COLORS[3]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="m5" name="M+5" stroke={COHORT_COLORS[4]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PulseCard>
      </section>

      {/* ── 03 · Motivos + Próximas ───────────────────────────── */}
      <section>
        <PulseSectionHead
          num="03"
          eyebrow="DETALHE"
          title="Revogações e próximas cobranças"
        />
        <div className="pulse-grid-2">
          <PulseCard title={<><Repeat className="w-4 h-4 text-[#2bc196]" /> Motivos de revogação</>}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={REVOCATION_REASONS} dataKey="count" nameKey="reason" cx="50%" cy="50%" outerRadius={80} label>
                  {REVOCATION_REASONS.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </PulseCard>

          <PulseCard
            title={<><CalendarClock className="w-4 h-4 text-[#2bc196]" /> Próximas cobranças</>}
            right={<PulsePill tone="mint" size="xs" dot pulse>LIVE</PulsePill>}
          >
            <div className="space-y-2 max-h-[240px] overflow-y-auto">
              {active.slice(0, 6).map(m => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#f0f0f0] hover:bg-[#fafafa] transition"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#282828] truncate">{m.customer}</p>
                    <p className="text-xs text-[#888]">{m.plan} · {m.bank}</p>
                  </div>
                  <div className="text-right pl-3 shrink-0">
                    <p className="text-sm font-bold pulse-mono text-[#282828]">{fmt(m.amount)}</p>
                    <p className="text-xs text-[#888]">{m.next_charge}</p>
                  </div>
                </div>
              ))}
            </div>
          </PulseCard>
        </div>
      </section>

      {/* ── 04 · Tabela ───────────────────────────────────────── */}
      <section>
        <PulseSectionHead
          num="04"
          eyebrow="MANDATOS · recentes"
          title="Lista detalhada"
          sub="Últimos consentimentos PIX Automático criados e seu status atual."
        />
        <PulseCard bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="pulse-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Plano</th>
                  <th>Banco</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                  <th style={{ textAlign: 'center' }}>Sucesso / Falha</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {MANDATE_MOCK.map(m => (
                  <tr key={m.id}>
                    <td className="font-semibold">{m.customer}</td>
                    <td className="text-[#5a5a5a]">{m.plan}</td>
                    <td className="text-[#5a5a5a]">{m.bank}</td>
                    <td className="pulse-num font-semibold" style={{ textAlign: 'right' }}>{fmt(m.amount)}</td>
                    <td className="pulse-num" style={{ textAlign: 'center' }}>
                      <span className="text-[#18866a] font-semibold">{m.successful_charges}</span>
                      <span className="text-[#a8a8a8] mx-1">/</span>
                      <span className="text-[#b91c1c] font-semibold">{m.failed_charges}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {m.status === 'active'  && <PulsePill tone="mint" size="sm" icon={CheckCircle}>Ativo</PulsePill>}
                      {m.status === 'revoked' && <PulsePill tone="neutral" size="sm">Revogado</PulsePill>}
                      {m.status === 'failed'  && <PulsePill tone="coral" size="sm">Falhando</PulsePill>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PulseCard>
      </section>
    </div>
  );
}