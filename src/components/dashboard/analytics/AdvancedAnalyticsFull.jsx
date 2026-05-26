import React from 'react';
import {
  Users, ShieldWarning, Trophy, Globe, Pulse,
  ChartBar, Sparkle, Gavel,
} from '@phosphor-icons/react';
import {
  COHORT_DATA, HOURLY_WEEKDAY_HEATMAP, TOP_BINS, CHARGEBACK_DISTRIBUTION,
  FRAUD_INSIGHTS, DISPUTE_DEFENSE, CARD_DECLINE_REASONS,
} from './analyticsMockData';
import {
  VF, VfCard, VfSectionHeader, VfPill, VfProgress,
  VfInsightFooter, VfNumber,
  fmtCurrency, fmtInt,
} from './vfHelpers';

/* ─── Cohort cell color (only brand mint + system) ─── */
const cohortStyle = (v) => {
  if (v === null || v === undefined) return { bg: 'rgba(176,240,222,0.18)', color: '#B5C2C2' };
  if (v >= 70) return { bg: `linear-gradient(135deg, #1ECB9D, ${VF.mintDark})`, color: '#fff' };
  if (v >= 50) return { bg: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', color: VF.mintDark };
  if (v >= 40) return { bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', color: VF.amber };
  if (v >= 30) return { bg: 'linear-gradient(135deg, #FED7AA, #FDBA74)', color: '#9A3412' };
  return { bg: VF.redBg, color: VF.red };
};

const heatBg = (rate) => {
  if (rate >= 90) return `linear-gradient(135deg, #1ECB9D, ${VF.mintDark})`;
  if (rate >= 85) return 'linear-gradient(135deg, #4DD8AB, #1ECB9D)';
  if (rate >= 80) return 'linear-gradient(135deg, #FEF3C7, #FDE68A)';
  if (rate >= 75) return 'linear-gradient(135deg, #FED7AA, #FDBA74)';
  return 'linear-gradient(135deg, #FCA5A5, #F87171)';
};

export default function AdvancedAnalyticsFull() {
  return (
    <div className="space-y-4">
      {/* ===== ROW 1 — Cohort de Retenção ===== */}
      <VfCard>
        <VfSectionHeader
          eyebrow="Retenção · cohorts"
          title="Cohort de"
          highlight="retenção de clientes"
          icon={Users}
          rightSlot={<VfPill variant="navy">Últimos 6 meses</VfPill>}
        />

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Cohort', 'Clientes', 'M0', 'M+1', 'M+2', 'M+3', 'M+4', 'M+5'].map((h, i) => (
                  <th
                    key={h}
                    className="font-mono"
                    style={{
                      padding: '10px 8px',
                      textAlign: i === 0 ? 'left' : i === 1 ? 'right' : 'center',
                      fontSize: 9.5, fontWeight: 800,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: VF.muted,
                      borderBottom: `1px solid ${VF.mintBorder}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COHORT_DATA.map((c) => (
                <tr key={c.cohort}>
                  <td style={{ padding: '6px 8px', fontSize: 12, fontWeight: 800, color: VF.navy }}>{c.cohort}</td>
                  <td className="font-mono" style={{ padding: '6px 8px', textAlign: 'right', fontSize: 11, color: VF.muted, fontVariantNumeric: 'tabular-nums' }}>{fmtInt(c.size)}</td>
                  {['m0', 'm1', 'm2', 'm3', 'm4', 'm5'].map((m) => {
                    const s = cohortStyle(c[m]);
                    return (
                      <td key={m} style={{ padding: 3 }}>
                        <div
                          className="font-mono"
                          style={{
                            background: s.bg, color: s.color,
                            textAlign: 'center', padding: '7px 4px',
                            borderRadius: 6,
                            fontSize: 11, fontWeight: 800,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {c[m] !== null && c[m] !== undefined ? `${c[m]}%` : '—'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <VfInsightFooter icon={Sparkle}>
          Cohort de <strong style={{ color: VF.mintDark }}>Abr/26 retém 74% em M+1</strong> — melhor performance dos últimos 6 meses.
        </VfInsightFooter>
      </VfCard>

      {/* ===== ROW 2 — Heatmap Hora x Dia ===== */}
      <VfCard>
        <VfSectionHeader
          eyebrow="Aprovação · heatmap"
          title="Aprovação por"
          highlight="dia × hora"
          icon={Pulse}
          rightSlot={(
            <div className="flex items-center gap-1.5">
              <span className="font-mono" style={{ fontSize: 9.5, color: VF.muted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pior</span>
              <div className="flex gap-0.5">
                {[
                  'linear-gradient(135deg, #FCA5A5, #F87171)',
                  'linear-gradient(135deg, #FED7AA, #FDBA74)',
                  'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                  'linear-gradient(135deg, #4DD8AB, #1ECB9D)',
                  `linear-gradient(135deg, #1ECB9D, ${VF.mintDark})`,
                ].map((g, i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: g }} />
                ))}
              </div>
              <span className="font-mono" style={{ fontSize: 9.5, color: VF.muted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Melhor</span>
            </div>
          )}
        />

        <div className="overflow-x-auto">
          <div style={{ minWidth: 720 }}>
            <div className="grid mb-1.5" style={{ gridTemplateColumns: '44px repeat(24, 1fr)', gap: 2 }}>
              <div />
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  className="font-mono"
                  style={{ fontSize: 9, color: VF.faint, textAlign: 'center', fontWeight: 700 }}
                >
                  {i % 3 === 0 ? `${i}h` : ''}
                </div>
              ))}
            </div>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div
                key={day}
                className="grid"
                style={{ gridTemplateColumns: '44px repeat(24, 1fr)', gap: 2, marginBottom: 2 }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: 10, fontWeight: 800,
                    color: VF.navy, alignSelf: 'center',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}
                >
                  {day}
                </div>
                {HOURLY_WEEKDAY_HEATMAP.filter((c) => c.day === day).map((cell) => (
                  <div
                    key={`${day}-${cell.hour}`}
                    className="transition-transform hover:scale-110 cursor-pointer"
                    style={{
                      height: 22, borderRadius: 4,
                      background: heatBg(cell.rate),
                    }}
                    title={`${day} ${cell.hour}h: ${cell.rate.toFixed(1)}% · ${cell.volume} tx`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </VfCard>

      {/* ===== ROW 3 — Top BINs + Pareto Recusas ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <VfCard className="lg:col-span-3">
          <VfSectionHeader
            eyebrow="BINs · performance"
            title="Top BINs por"
            highlight="performance"
            icon={Trophy}
            rightSlot={<VfPill variant="navy">8 BINs principais</VfPill>}
          />

          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {['BIN', 'Emissor', 'Bandeira', 'Tier', 'Tx', 'Aprovação'].map((h, i) => (
                    <th
                      key={h}
                      className="font-mono"
                      style={{
                        padding: '10px 8px',
                        textAlign: i >= 4 ? 'right' : 'left',
                        fontSize: 9.5, fontWeight: 800,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: VF.muted,
                        borderBottom: `1px solid ${VF.mintBorder}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_BINS.map((b, idx) => (
                  <tr
                    key={b.bin}
                    style={{ background: idx % 2 === 1 ? 'rgba(176,240,222,0.18)' : 'transparent' }}
                  >
                    <td className="font-mono" style={{ padding: '10px 8px', fontSize: 12, fontWeight: 800, color: VF.navy }}>{b.bin}</td>
                    <td style={{ padding: '10px 8px', fontSize: 12, color: VF.navy, fontWeight: 700 }}>{b.issuer}</td>
                    <td style={{ padding: '10px 8px', fontSize: 12, color: VF.muted }}>{b.brand}</td>
                    <td style={{ padding: '10px 8px' }}><VfPill variant="navy">{b.tier}</VfPill></td>
                    <td className="font-mono" style={{ padding: '10px 8px', textAlign: 'right', fontSize: 12, color: VF.navy, fontVariantNumeric: 'tabular-nums' }}>{fmtInt(b.count)}</td>
                    <td
                      className="font-mono"
                      style={{
                        padding: '10px 8px', textAlign: 'right',
                        fontSize: 13, fontWeight: 800,
                        color: b.approvalRate >= 90 ? VF.mintDark : b.approvalRate >= 85 ? VF.amber : VF.red,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {b.approvalRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VfCard>

        <VfCard className="lg:col-span-2">
          <VfSectionHeader eyebrow="Recusas · pareto" title="Análise" highlight="Pareto" icon={ChartBar} />
          <p className="font-mono" style={{ fontSize: 10.5, color: VF.muted, marginBottom: 12, fontWeight: 600 }}>
            80% das recusas em poucas causas.
          </p>
          <div className="space-y-2.5">
            {CARD_DECLINE_REASONS.slice(0, 5).map((d, idx) => {
              const cumulative = CARD_DECLINE_REASONS.slice(0, idx + 1).reduce((sum, r) => sum + r.share, 0);
              return (
                <div key={d.code}>
                  <div className="flex items-center justify-between" style={{ fontSize: 11.5, marginBottom: 4 }}>
                    <span className="truncate flex-1" style={{ color: VF.navy, fontWeight: 700 }}>{d.reason}</span>
                    <span className="font-mono ml-2" style={{ fontWeight: 800, color: VF.navy, fontVariantNumeric: 'tabular-nums' }}>{d.share}%</span>
                  </div>
                  <div
                    style={{
                      position: 'relative',
                      height: 6, borderRadius: 99,
                      background: '#E0F8F1',
                      border: '1px solid #B3F0DE',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute', height: '100%',
                        width: `${cumulative}%`,
                        background: 'linear-gradient(90deg, #FCA5A5, #F87171)',
                        opacity: 0.35,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute', height: '100%',
                        width: `${d.share}%`,
                        background: 'linear-gradient(90deg, #F87171, #DC2626)',
                      }}
                    />
                  </div>
                  <p className="font-mono" style={{ fontSize: 9.5, color: VF.faint, marginTop: 2 }}>
                    acumulado {cumulative.toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </VfCard>
      </div>

      {/* ===== ROW 4 — Fraude + Defesa de Disputas ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VfCard>
          <VfSectionHeader
            eyebrow="Risco · antifraude"
            title="Inteligência"
            highlight="antifraude"
            icon={ShieldWarning}
            rightSlot={<VfPill variant="solid">{fmtCurrency(FRAUD_INSIGHTS.preventedLossBRL)} prevenido</VfPill>}
          />

          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Taxa de fraude', value: `${FRAUD_INSIGHTS.fraudRate}%`,           sub: `${FRAUD_INSIGHTS.fraudRateChange}pp vs período`, color: VF.red,      bg: VF.redBg,                                       border: VF.redBorder },
              { label: 'Sinalizadas',    value: fmtInt(FRAUD_INSIGHTS.flagged),            sub: `${FRAUD_INSIGHTS.trueFraud} confirmadas`,         color: VF.navy,     bg: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)',    border: '#8AA5BD' },
              { label: 'Falsos positivos', value: fmtInt(FRAUD_INSIGHTS.falsePositives),  sub: null,                                              color: VF.amber,    bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',    border: VF.amberBorder },
              { label: 'Falsos negativos', value: fmtInt(FRAUD_INSIGHTS.falseNegatives),  sub: null,                                              color: VF.red,      bg: VF.redBg,                                       border: VF.redBorder },
            ].map((m) => (
              <div
                key={m.label}
                style={{ padding: 10, borderRadius: 9, background: m.bg, border: `1px solid ${m.border}` }}
              >
                <p className="font-mono" style={{ fontSize: 9.5, color: VF.muted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {m.label}
                </p>
                <span className="font-mono" style={{ fontSize: 18, fontWeight: 800, color: m.color, fontVariantNumeric: 'tabular-nums' }}>
                  {m.value}
                </span>
                {m.sub && <p className="font-mono" style={{ fontSize: 9.5, color: VF.muted, fontWeight: 600 }}>{m.sub}</p>}
              </div>
            ))}
          </div>

          <div className="pt-3" style={{ borderTop: '1px dashed #B3F0DE' }}>
            <p
              className="font-mono inline-flex items-center gap-1 mb-2"
              style={{
                fontSize: 10, fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: VF.muted,
              }}
            >
              <Globe weight="duotone" size={11} />
              Top países por risco
            </p>
            <div className="space-y-1.5">
              {FRAUD_INSIGHTS.topCountries.map((c) => (
                <div key={c.country} className="flex items-center justify-between" style={{ fontSize: 12 }}>
                  <span style={{ color: VF.navy, fontWeight: 700 }}>{c.country}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono" style={{ fontSize: 10, color: VF.muted, fontWeight: 600 }}>{fmtInt(c.count)} tx</span>
                    <span
                      className="font-mono"
                      style={{
                        width: 48, textAlign: 'right',
                        fontWeight: 800,
                        color: c.fraudRate >= 2 ? VF.red : c.fraudRate >= 1 ? VF.amber : VF.mintDark,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {c.fraudRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </VfCard>

        <VfCard>
          <VfSectionHeader
            eyebrow="Disputas · defesa"
            title="Defesa de"
            highlight="disputas"
            icon={Gavel}
            rightSlot={<VfPill variant="solid">Win rate {DISPUTE_DEFENSE.winRate}%</VfPill>}
          />

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center" style={{ padding: 10, borderRadius: 9, background: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', border: '1px solid #4DD8AB' }}>
              <p className="font-mono" style={{ fontSize: 9.5, color: VF.mintDark, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ganhas</p>
              <VfNumber size={20}>{DISPUTE_DEFENSE.totalWon}</VfNumber>
            </div>
            <div className="text-center" style={{ padding: 10, borderRadius: 9, background: VF.redBg, border: `1px solid ${VF.redBorder}` }}>
              <p className="font-mono" style={{ fontSize: 9.5, color: VF.red, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Perdidas</p>
              <span className="font-mono" style={{ fontSize: 20, fontWeight: 800, color: VF.red, fontVariantNumeric: 'tabular-nums' }}>{DISPUTE_DEFENSE.totalLost}</span>
            </div>
            <div className="text-center" style={{ padding: 10, borderRadius: 9, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: `1px solid ${VF.amberBorder}` }}>
              <p className="font-mono" style={{ fontSize: 9.5, color: VF.amber, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pendentes</p>
              <span className="font-mono" style={{ fontSize: 20, fontWeight: 800, color: VF.amber, fontVariantNumeric: 'tabular-nums' }}>{DISPUTE_DEFENSE.totalPending}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div style={{ padding: 10, borderRadius: 9, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: `1px solid ${VF.amberBorder}` }}>
              <p className="font-mono" style={{ fontSize: 9.5, color: VF.amber, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Valor em risco</p>
              <span className="font-mono" style={{ fontSize: 16, fontWeight: 800, color: VF.amber, fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(DISPUTE_DEFENSE.amountAtRisk)}</span>
            </div>
            <div style={{ padding: 10, borderRadius: 9, background: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', border: '1px solid #4DD8AB' }}>
              <p className="font-mono" style={{ fontSize: 9.5, color: VF.mintDark, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Recuperado</p>
              <span className="font-mono" style={{ fontSize: 16, fontWeight: 800, color: VF.mintDark, fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(DISPUTE_DEFENSE.amountRecovered)}</span>
            </div>
          </div>

          <p className="font-mono" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: VF.muted, marginBottom: 8 }}>
            Distribuição de chargebacks
          </p>
          <div className="space-y-2">
            {CHARGEBACK_DISTRIBUTION.slice(0, 5).map((c) => (
              <div key={c.reason}>
                <div className="flex items-center justify-between" style={{ fontSize: 11.5, marginBottom: 3 }}>
                  <span className="truncate pr-2" style={{ color: VF.navy, fontWeight: 700 }}>{c.reason}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono" style={{ fontSize: 10, color: VF.muted, fontWeight: 600 }}>{c.count}</span>
                    <span
                      className="font-mono"
                      style={{
                        width: 64, textAlign: 'right',
                        fontWeight: 800,
                        color: c.recoveryRate >= 50 ? VF.mintDark : c.recoveryRate >= 25 ? VF.amber : VF.red,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {c.recoveryRate}% rec.
                    </span>
                  </div>
                </div>
                <VfProgress value={c.share * 2.5} gradient={`linear-gradient(90deg, ${VF.navy2}, ${VF.deep})`} height={4} />
              </div>
            ))}
          </div>
        </VfCard>
      </div>
    </div>
  );
}