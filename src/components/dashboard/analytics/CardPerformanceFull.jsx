import React from 'react';
import {
  CreditCard, ShieldCheck, ArrowsClockwise, Warning,
  Target as TargetIcon, Pulse, ChartBar, Buildings, Lightning,
} from '@phosphor-icons/react';
import {
  CARD_KPIS, CARD_BRANDS, CARD_INSTALLMENTS, CARD_VALUE_RANGES,
  CARD_DECLINE_REASONS, CARD_ISSUER_PERFORMANCE, CARD_HOURLY_APPROVAL,
  CARD_RETRY_FUNNEL,
} from './analyticsMockData';
import {
  VF, VfCard, VfSectionHeader, VfKpiTile, VfPill, VfProgress,
  VfInsightFooter, VfNumber,
  fmtCurrency, fmtCurrencyFull, fmtInt,
  rateColor, rateBarGradient,
} from './vfHelpers';

export default function CardPerformanceFull() {
  const peak = CARD_HOURLY_APPROVAL.reduce((max, h) => (h.rate > max.rate ? h : max), CARD_HOURLY_APPROVAL[0]);
  const trough = CARD_HOURLY_APPROVAL.reduce((min, h) => (h.rate < min.rate ? h : min), CARD_HOURLY_APPROVAL[0]);

  return (
    <div className="space-y-4">
      {/* ===== ROW 1 — KPIs ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <VfKpiTile icon={TargetIcon}  label="Aprovação"    value={`${CARD_KPIS.approvalRate}%`}      sub={`Meta ${CARD_KPIS.approvalRateTarget}%`}  change={CARD_KPIS.approvalRateChange} />
        <VfKpiTile icon={CreditCard}  label="Tentativas"   value={fmtInt(CARD_KPIS.totalAttempts)}    sub={`${fmtInt(CARD_KPIS.totalApproved)} aprov.`} accent={VF.navy2} />
        <VfKpiTile icon={Pulse}       label="Volume"       value={fmtCurrency(CARD_KPIS.totalVolume)} change={CARD_KPIS.totalVolumeChange} />
        <VfKpiTile icon={ChartBar}    label="Ticket Médio" value={fmtCurrency(CARD_KPIS.avgTicket)}   change={CARD_KPIS.avgTicketChange} accent={VF.deep} />
        <VfKpiTile icon={ShieldCheck} label="3DS"          value={`${CARD_KPIS.threeDsUsage}%`}        sub={`+${CARD_KPIS.threeDsLiftPp}pp aprov.`} accent={VF.navy2} />
        <VfKpiTile icon={Warning}     label="Chargeback"   value={`${CARD_KPIS.chargebackRate}%`}      change={CARD_KPIS.chargebackRateChange} inverted accent={VF.amber} />
      </div>

      {/* ===== ROW 2 — Aprovação por Bandeira ===== */}
      <VfCard>
        <VfSectionHeader
          eyebrow="Cartão · bandeiras"
          title="Aprovação por"
          highlight="bandeira"
          icon={CreditCard}
          rightSlot={<VfPill variant="navy">6 bandeiras</VfPill>}
        />

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Bandeira', 'Tentativas', 'Aprovados', 'Recusados', 'Volume', 'D/C', 'Taxa Aprov.'].map((h, i) => (
                  <th
                    key={h}
                    className="font-mono"
                    style={{
                      padding: '10px 8px',
                      textAlign: i === 0 ? 'left' : 'right',
                      fontSize: 9.5, fontWeight: 800,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: VF.muted,
                      borderBottom: `1px solid ${VF.mintBorder}`,
                      width: i === 6 ? 140 : 'auto',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CARD_BRANDS.map((b, idx) => (
                <tr
                  key={b.brand}
                  style={{
                    background: idx % 2 === 1 ? 'rgba(176,240,222,0.18)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '12px 8px' }}>
                    <div className="flex items-center gap-2">
                      <div
                        className="font-mono inline-flex items-center justify-center"
                        style={{
                          width: 36, height: 22, borderRadius: 5,
                          background: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)',
                          color: VF.navy, border: '1px solid #8AA5BD',
                          fontSize: 8, fontWeight: 900, letterSpacing: '0.04em',
                        }}
                      >
                        {b.label.substring(0, 4).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: VF.navy }}>{b.label}</span>
                      <span className="font-mono" style={{ fontSize: 10, color: VF.faint }}>({b.share}%)</span>
                    </div>
                  </td>
                  <td className="font-mono" style={{ padding: '12px 8px', textAlign: 'right', fontSize: 12, color: VF.navy, fontVariantNumeric: 'tabular-nums' }}>{fmtInt(b.count)}</td>
                  <td className="font-mono" style={{ padding: '12px 8px', textAlign: 'right', fontSize: 12, fontWeight: 800, color: VF.mintDark, fontVariantNumeric: 'tabular-nums' }}>{fmtInt(b.approved)}</td>
                  <td className="font-mono" style={{ padding: '12px 8px', textAlign: 'right', fontSize: 12, color: VF.red, fontVariantNumeric: 'tabular-nums' }}>{fmtInt(b.declined)}</td>
                  <td className="font-mono" style={{ padding: '12px 8px', textAlign: 'right', fontSize: 12, fontWeight: 800, color: VF.navy, fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(b.volume)}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <span className="font-mono" style={{ fontSize: 10, color: VF.navy2, fontWeight: 700 }}>{b.debit}%</span>
                    <span style={{ margin: '0 4px', color: VF.faint }}>/</span>
                    <span className="font-mono" style={{ fontSize: 10, color: VF.deep, fontWeight: 700 }}>{b.credit}%</span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <div className="flex items-center gap-2 justify-end">
                      <VfProgress value={b.approvalRate} gradient={rateBarGradient(b.approvalRate)} width={70} height={5} />
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 12, fontWeight: 800, color: rateColor(b.approvalRate),
                          width: 44, textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {b.approvalRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </VfCard>

      {/* ===== ROW 3 — Parcelamento + Faixa de Valor ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VfCard>
          <VfSectionHeader eyebrow="Cartão · parcelas" title="Aprovação por" highlight="parcelamento" />
          <div className="space-y-3">
            {CARD_INSTALLMENTS.map((i) => (
              <div key={i.range}>
                <div className="flex items-center justify-between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <div>
                    <span style={{ fontWeight: 800, color: VF.navy }}>{i.label}</span>
                    <span className="font-mono ml-2" style={{ fontSize: 10, color: VF.muted, fontWeight: 600 }}>
                      {fmtInt(i.count)} tx · {fmtCurrency(i.volume)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono" style={{ fontSize: 10, color: VF.muted, fontWeight: 700 }}>MDR {i.mdr}%</span>
                    <span className="font-mono" style={{ fontSize: 13, fontWeight: 800, color: rateColor(i.approvalRate), fontVariantNumeric: 'tabular-nums' }}>
                      {i.approvalRate}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <VfProgress value={i.approvalRate} gradient={rateBarGradient(i.approvalRate)} height={5} />
                  <span className="font-mono" style={{ fontSize: 10, color: VF.faint, width: 44, textAlign: 'right' }}>
                    {i.share}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <VfInsightFooter icon={Lightning}>
            Parcelamentos 11x-12x têm{' '}
            <strong style={{ color: VF.red }}>79.4%</strong> de aprovação — considere capping em 10x.
          </VfInsightFooter>
        </VfCard>

        <VfCard>
          <VfSectionHeader eyebrow="Cartão · ticket" title="Aprovação por" highlight="faixa de valor" />
          <div className="space-y-3">
            {CARD_VALUE_RANGES.map((v) => (
              <div key={v.label}>
                <div className="flex items-center justify-between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <div>
                    <span style={{ fontWeight: 800, color: VF.navy }}>{v.label}</span>
                    <span className="font-mono ml-2" style={{ fontSize: 10, color: VF.muted, fontWeight: 600 }}>
                      {fmtInt(v.count)} tx · ticket {fmtCurrency(v.avg)}
                    </span>
                  </div>
                  <span className="font-mono" style={{ fontSize: 13, fontWeight: 800, color: rateColor(v.approvalRate), fontVariantNumeric: 'tabular-nums' }}>
                    {v.approvalRate}%
                  </span>
                </div>
                <VfProgress value={v.approvalRate} gradient={rateBarGradient(v.approvalRate)} height={5} />
                <p className="font-mono" style={{ fontSize: 10, color: VF.muted, marginTop: 4 }}>
                  Principal motivo:{' '}
                  <span style={{ color: VF.navy, fontWeight: 700 }}>{v.declineMain}</span>
                </p>
              </div>
            ))}
          </div>
        </VfCard>
      </div>

      {/* ===== ROW 4 — Recusas + Retry Intelligence ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VfCard>
          <VfSectionHeader
            eyebrow="Cartão · recusas"
            title="Análise de"
            highlight="recusas"
            rightSlot={<VfPill variant="warn">{fmtInt(CARD_KPIS.totalDeclined)} recusas</VfPill>}
          />
          <div className="space-y-2">
            {CARD_DECLINE_REASONS.map((d) => (
              <div
                key={d.code}
                className="flex items-center gap-3 p-2.5 transition-all hover:-translate-y-px"
                style={{
                  background: VF.surface,
                  border: `1px solid ${VF.mintBorder}`,
                  borderRadius: 10,
                }}
              >
                <div
                  className="font-mono inline-flex items-center justify-center"
                  style={{
                    width: 44, height: 28, borderRadius: 6,
                    background: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)',
                    color: VF.navy, border: '1px solid #8AA5BD',
                    fontSize: 10, fontWeight: 900,
                  }}
                >
                  {d.code}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 12, fontWeight: 700, color: VF.navy }} className="truncate">{d.reason}</p>
                  <p className="font-mono" style={{ fontSize: 10, color: VF.muted, fontWeight: 600 }}>
                    {fmtInt(d.count)} tx · {d.share}% do total
                  </p>
                </div>
                <VfPill variant={d.recoverable ? 'mint' : 'navy'}>
                  {d.recoverable ? 'Recuperável' : 'Definitivo'}
                </VfPill>
              </div>
            ))}
          </div>
        </VfCard>

        <VfCard>
          <VfSectionHeader
            eyebrow="Cartão · retry"
            title="Retry"
            highlight="intelligence"
            icon={ArrowsClockwise}
            rightSlot={<VfPill variant="solid">+{fmtCurrency(CARD_RETRY_FUNNEL.recoveredVolume)} recuperado</VfPill>}
          />

          {(() => {
            const funnel = [
              { label: 'Recusas no período',     value: CARD_RETRY_FUNNEL.declined,         pct: 100,                                                                       grad: 'linear-gradient(90deg, #C0CFDC, #8AA5BD)' },
              { label: 'Elegíveis para retry',   value: CARD_RETRY_FUNNEL.eligibleForRetry, pct: (CARD_RETRY_FUNNEL.eligibleForRetry / CARD_RETRY_FUNNEL.declined) * 100,    grad: `linear-gradient(90deg, #013766, ${VF.navy2})` },
              { label: 'Re-tentadas',             value: CARD_RETRY_FUNNEL.retried,          pct: (CARD_RETRY_FUNNEL.retried / CARD_RETRY_FUNNEL.declined) * 100,            grad: `linear-gradient(90deg, #1A3939, ${VF.deep})` },
              { label: 'Recuperadas com sucesso', value: CARD_RETRY_FUNNEL.recovered,        pct: (CARD_RETRY_FUNNEL.recovered / CARD_RETRY_FUNNEL.declined) * 100,           grad: `linear-gradient(90deg, #1ECB9D, ${VF.mintDark})` },
            ];
            return (
              <div className="space-y-2.5">
                {funnel.map((step) => (
                  <div key={step.label}>
                    <div className="flex items-center justify-between" style={{ fontSize: 11.5, marginBottom: 4 }}>
                      <span style={{ color: VF.navy, fontWeight: 700 }}>{step.label}</span>
                      <span className="font-mono" style={{ color: VF.navy, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                        {fmtInt(step.value)}{' '}
                        <span style={{ color: VF.muted, fontWeight: 600 }}>({step.pct.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <VfProgress value={step.pct} gradient={step.grad} height={8} />
                  </div>
                ))}
              </div>
            );
          })()}

          <div
            className="mt-4 pt-3 grid grid-cols-2 gap-2 text-center"
            style={{ borderTop: '1px dashed #B3F0DE' }}
          >
            <div>
              <p className="font-mono" style={{ fontSize: 9.5, color: VF.muted, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Taxa de recuperação
              </p>
              <VfNumber size={20}>{CARD_KPIS.retryRecoveredRate}%</VfNumber>
            </div>
            <div>
              <p className="font-mono" style={{ fontSize: 9.5, color: VF.muted, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Tentativas médias
              </p>
              <VfNumber size={20}>{CARD_RETRY_FUNNEL.avgAttempts}</VfNumber>
            </div>
          </div>
        </VfCard>
      </div>

      {/* ===== ROW 5 — Emissor + Hora ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <VfCard className="lg:col-span-2">
          <VfSectionHeader eyebrow="Cartão · emissor" title="Por" highlight="emissor" icon={Buildings} />
          <div className="space-y-2.5">
            {CARD_ISSUER_PERFORMANCE.map((i) => (
              <div key={i.issuer} className="flex items-center gap-3" style={{ fontSize: 12 }}>
                <span className="truncate" style={{ width: 110, fontWeight: 800, color: VF.navy }}>
                  {i.issuer}
                </span>
                <div className="flex-1">
                  <VfProgress value={i.approvalRate} gradient={rateBarGradient(i.approvalRate)} height={5} />
                </div>
                <span
                  className="font-mono"
                  style={{
                    width: 48, textAlign: 'right',
                    fontWeight: 800, color: rateColor(i.approvalRate),
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {i.approvalRate}%
                </span>
                <span
                  className="font-mono"
                  style={{
                    width: 70, textAlign: 'right', fontSize: 10,
                    color: VF.mintDark, fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  +{i.retryLift}pp retry
                </span>
              </div>
            ))}
          </div>
        </VfCard>

        <VfCard className="lg:col-span-3">
          <VfSectionHeader
            eyebrow="Cartão · hora"
            title="Aprovação por"
            highlight="hora do dia"
            rightSlot={(
              <div className="flex items-center gap-2">
                <VfPill variant="mint">Pico {peak.hour}h · {peak.rate.toFixed(1)}%</VfPill>
                <VfPill variant="err">Vale {trough.hour}h · {trough.rate.toFixed(1)}%</VfPill>
              </div>
            )}
          />
          <div className="flex items-end gap-0.5" style={{ height: 130 }}>
            {CARD_HOURLY_APPROVAL.map((h) => {
              const barHeight = ((h.rate - 70) / 25) * 100;
              const grad = rateBarGradient(h.rate);
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center justify-end group relative">
                  <div
                    className="w-full transition-all hover:opacity-90"
                    style={{
                      height: `${barHeight}%`,
                      background: grad,
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <div
                    className="absolute opacity-0 group-hover:opacity-100 pointer-events-none font-mono"
                    style={{
                      top: -28, left: '50%', transform: 'translateX(-50%)',
                      background: VF.navy, color: '#fff',
                      fontSize: 10, padding: '3px 8px', borderRadius: 5,
                      whiteSpace: 'nowrap',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {h.hour}h: {h.rate.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="flex justify-between mt-1.5 font-mono"
            style={{ fontSize: 9.5, color: VF.faint, fontWeight: 700 }}
          >
            <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
          </div>
        </VfCard>
      </div>
    </div>
  );
}