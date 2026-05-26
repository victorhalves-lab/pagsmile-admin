import React from 'react';
import {
  QrCode, Clock, Lightning, Buildings, Repeat, Fingerprint,
  ArrowsCounterClockwise, Target as TargetIcon, WarningCircle, Sparkle,
} from '@phosphor-icons/react';
import {
  PIX_KPIS, PIX_FLOW_DISTRIBUTION, PIX_TIMING_BUCKETS, PIX_BANK_DISTRIBUTION,
  PIX_VALUE_RANGES, PIX_MANDATES, PIX_REFUND_REASONS, PIX_HOURLY_CONVERSION,
} from './analyticsMockData';
import {
  VF, VfCard, VfSectionHeader, VfKpiTile, VfPill, VfProgress,
  VfInsightFooter, VfNumber,
  fmtCurrency, fmtCurrencyFull, fmtInt,
  convColor, convBarGradient,
} from './vfHelpers';

export default function PixPerformanceFull() {
  const peak = PIX_HOURLY_CONVERSION.reduce((m, h) => (h.rate > m.rate ? h : m), PIX_HOURLY_CONVERSION[0]);
  const trough = PIX_HOURLY_CONVERSION.reduce((m, h) => (h.rate < m.rate ? h : m), PIX_HOURLY_CONVERSION[0]);

  return (
    <div className="space-y-4">
      {/* ===== ROW 1 — KPIs ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <VfKpiTile icon={TargetIcon}            label="Conversão"   value={`${PIX_KPIS.conversionRate}%`}                                                              change={PIX_KPIS.conversionRateChange} />
        <VfKpiTile icon={QrCode}                label="QRs Gerados" value={fmtInt(PIX_KPIS.totalGenerated)}                                                            sub={`${fmtInt(PIX_KPIS.totalPaid)} pagos`} accent={VF.navy2} />
        <VfKpiTile icon={Clock}                 label="Tempo Médio" value={PIX_KPIS.avgPaymentTime}                                                                    sub={`Mediana ${PIX_KPIS.medianPaymentTime}`} accent={VF.deep} />
        <VfKpiTile icon={Lightning}             label="Volume"      value={fmtCurrency(PIX_KPIS.totalVolume)}                                                          sub={`Ticket ${fmtCurrency(PIX_KPIS.avgTicket)}`} />
        <VfKpiTile icon={WarningCircle}         label="Expirados"   value={`${((PIX_KPIS.totalExpired / PIX_KPIS.totalGenerated) * 100).toFixed(1)}%`}                  sub={`${fmtInt(PIX_KPIS.totalExpired)} QRs`}     accent={VF.amber} />
        <VfKpiTile icon={ArrowsCounterClockwise} label="Devoluções"  value={`${PIX_KPIS.refundRate}%`}                                                                  sub="Sobre pagos"                                accent={VF.deep} />
      </div>

      {/* ===== ROW 2 — Distribuição por Fluxo PIX ===== */}
      <VfCard>
        <VfSectionHeader
          eyebrow="PIX · Open Finance"
          title="Distribuição por"
          highlight="fluxo PIX"
          icon={Fingerprint}
          rightSlot={<VfPill variant="solid" icon={Sparkle}>Open Finance ativo</VfPill>}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {PIX_FLOW_DISTRIBUTION.map((f) => {
            const themes = {
              manual:    { icon: QrCode,      accent: VF.mint,   accentDark: VF.mintDark, glow: VF.glow },
              automatic: { icon: Repeat,      accent: VF.navy2,  accentDark: VF.navy,     glow: '#5B7AAB' },
              biometric: { icon: Fingerprint, accent: VF.deep,   accentDark: '#091818',   glow: '#5C8888' },
            };
            const t = themes[f.flow] || themes.manual;
            const Icon = t.icon;
            return (
              <div
                key={f.flow}
                className="relative overflow-hidden p-4 transition-all hover:-translate-y-0.5"
                style={{
                  background: VF.surface,
                  border: `1px solid ${VF.mintBorder}`,
                  borderRadius: 14,
                }}
              >
                <span
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${t.accent}, ${t.glow})`,
                  }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      background: `linear-gradient(135deg, ${t.accent}22, ${t.accent}44)`,
                      color: t.accentDark,
                      border: `1px solid ${t.accent}55`,
                    }}
                  >
                    <Icon weight="duotone" size={16} />
                  </div>
                  <p
                    className="font-mono"
                    style={{
                      fontSize: 10.5, fontWeight: 800,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: t.accentDark,
                    }}
                  >
                    {f.label}
                  </p>
                </div>
                <VfNumber size={28}>{f.share}%</VfNumber>
                <p className="font-mono" style={{ fontSize: 10.5, color: VF.muted, marginTop: 2, marginBottom: 12 }}>
                  do volume PIX · {fmtCurrency(f.volume)}
                </p>
                <div className="space-y-1.5" style={{ fontSize: 11 }}>
                  <div className="flex justify-between">
                    <span className="font-mono" style={{ color: VF.muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 10 }}>Conversão</span>
                    <span className="font-mono" style={{ fontWeight: 800, color: convColor(f.conversion), fontVariantNumeric: 'tabular-nums' }}>{f.conversion}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono" style={{ color: VF.muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 10 }}>Tempo médio</span>
                    <span className="font-mono" style={{ fontWeight: 800, color: VF.navy, fontVariantNumeric: 'tabular-nums' }}>{f.avgTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <VfInsightFooter icon={Sparkle}>
          <strong style={{ color: VF.mintDark }}>PIX Biometria converte +28pp acima do manual</strong> — considere migrar checkouts elegíveis.
        </VfInsightFooter>
      </VfCard>

      {/* ===== ROW 3 — Tempo + Faixa de Valor ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VfCard>
          <VfSectionHeader eyebrow="PIX · timing" title="Tempo até" highlight="pagamento" icon={Clock} />
          <div className="space-y-2.5">
            {PIX_TIMING_BUCKETS.map((b) => {
              const colorMap = {
                emerald: `linear-gradient(90deg, #1ECB9D, ${VF.mintDark})`,
                blue:    `linear-gradient(90deg, #013766, ${VF.navy2})`,
                yellow:  'linear-gradient(90deg, #FBBF24, #F59E0B)',
                amber:   'linear-gradient(90deg, #F59E0B, #D97706)',
                red:     'linear-gradient(90deg, #F87171, #DC2626)',
              };
              return (
                <div key={b.label}>
                  <div className="flex items-center justify-between" style={{ fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: VF.navy, fontWeight: 700 }}>{b.label}</span>
                    <span className="font-mono" style={{ color: VF.navy, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                      {fmtInt(b.count)}{' '}
                      <span style={{ color: VF.muted, fontWeight: 600 }}>({b.share}%)</span>
                    </span>
                  </div>
                  <VfProgress value={b.share} gradient={colorMap[b.color]} height={7} />
                </div>
              );
            })}
          </div>
          <div
            className="mt-4 pt-3 grid grid-cols-2 gap-2 text-center"
            style={{ borderTop: '1px dashed #B3F0DE' }}
          >
            <div
              className="p-2"
              style={{
                background: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)',
                border: '1px solid #4DD8AB', borderRadius: 9,
              }}
            >
              <p className="font-mono" style={{ fontSize: 9.5, color: VF.mintDark, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{`< 5 min`}</p>
              <VfNumber size={18}>82.4%</VfNumber>
            </div>
            <div
              className="p-2"
              style={{
                background: VF.redBg,
                border: `1px solid ${VF.redBorder}`, borderRadius: 9,
              }}
            >
              <p className="font-mono" style={{ fontSize: 9.5, color: VF.red, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{`> 15 min (abandono)`}</p>
              <span className="font-mono" style={{ fontSize: 18, fontWeight: 800, color: VF.red, fontVariantNumeric: 'tabular-nums' }}>6.4%</span>
            </div>
          </div>
        </VfCard>

        <VfCard>
          <VfSectionHeader eyebrow="PIX · ticket" title="Conversão por" highlight="faixa de valor" />
          <div className="space-y-3">
            {PIX_VALUE_RANGES.map((v) => (
              <div key={v.label}>
                <div className="flex items-center justify-between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: VF.navy, fontWeight: 800 }}>{v.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono" style={{ fontSize: 10, color: VF.muted, fontWeight: 600 }}>
                      {fmtInt(v.count)} QRs
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 13, fontWeight: 800, width: 44, textAlign: 'right',
                        color: convColor(v.conversion), fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {v.conversion}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <VfProgress value={v.conversion} gradient={convBarGradient(v.conversion)} height={5} />
                  </div>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10, color: VF.red, fontWeight: 700,
                      width: 60, textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {v.expired}% exp.
                  </span>
                </div>
              </div>
            ))}
          </div>
          <VfInsightFooter icon={WarningCircle}>
            Valores acima de R$ 5k têm <strong style={{ color: VF.red }}>36% de expiração</strong> — alerta de fricção.
          </VfInsightFooter>
        </VfCard>
      </div>

      {/* ===== ROW 4 — Banco Pagador + Mandates ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <VfCard className="lg:col-span-3">
          <VfSectionHeader eyebrow="PIX · pagador" title="Por" highlight="banco pagador" icon={Buildings} />
          <div className="space-y-2">
            {PIX_BANK_DISTRIBUTION.map((b) => (
              <div key={b.bank} className="flex items-center gap-3" style={{ fontSize: 12 }}>
                <span className="truncate" style={{ width: 100, color: VF.navy, fontWeight: 800 }}>{b.bank}</span>
                <div className="flex-1">
                  <VfProgress value={b.share * 2.5} gradient={`linear-gradient(90deg, ${VF.mint}, ${VF.mintDark})`} height={5} />
                </div>
                <span className="font-mono" style={{ width: 44, textAlign: 'right', color: VF.muted, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{b.share}%</span>
                <span
                  className="font-mono"
                  style={{
                    width: 48, textAlign: 'right', fontWeight: 800,
                    color: convColor(b.conversion), fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {b.conversion}%
                </span>
                <span className="font-mono" style={{ width: 64, textAlign: 'right', fontSize: 10, color: VF.muted, fontVariantNumeric: 'tabular-nums' }}>
                  {fmtCurrency(b.volume)}
                </span>
              </div>
            ))}
          </div>
        </VfCard>

        <div
          className="relative overflow-hidden lg:col-span-2 p-5 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${VF.navy2}, ${VF.navy})`,
            color: '#fff',
            boxShadow: '0 12px 32px -8px rgba(0,36,67,0.5)',
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              top: -50, right: -30, width: 180, height: 180,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(92,247,207,0.28), transparent 60%)',
            }}
          />
          <div className="relative flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2.5">
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(92,247,207,0.16)',
                  color: VF.glow,
                  border: '1px solid rgba(92,247,207,0.35)',
                }}
              >
                <Repeat weight="duotone" size={18} />
              </div>
              <div>
                <p className="font-mono" style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: VF.glow }}>
                  Mandates · PIX Auto
                </p>
                <p className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  Open Finance
                </p>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Ativos',          value: fmtInt(PIX_MANDATES.active),       color: VF.glow },
              { label: 'Expirando ≤ 30d', value: fmtInt(PIX_MANDATES.expiringSoon), color: '#FBBF24' },
              { label: 'Revogados',        value: fmtInt(PIX_MANDATES.revoked),      color: '#FCA5A5' },
              { label: 'Taxa de falha',    value: `${PIX_MANDATES.failureRate}%`,    color: '#fff' },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  padding: 10, borderRadius: 9,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <p className="font-mono" style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.65)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {m.label}
                </p>
                <span className="font-mono" style={{ fontSize: 20, fontWeight: 800, color: m.color, fontVariantNumeric: 'tabular-nums' }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
          <div
            className="relative p-2.5"
            style={{
              background: 'rgba(92,247,207,0.10)',
              border: '1px solid rgba(92,247,207,0.3)',
              borderRadius: 9,
            }}
          >
            <p className="font-mono" style={{ fontSize: 9.5, color: VF.glow, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Volume recorrente mensal
            </p>
            <span className="font-mono" style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              {fmtCurrencyFull(PIX_MANDATES.monthlyRecurringVolume)}
            </span>
          </div>
        </div>
      </div>

      {/* ===== ROW 5 — Hora + Devoluções ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <VfCard className="lg:col-span-3">
          <VfSectionHeader
            eyebrow="PIX · hora"
            title="Conversão por"
            highlight="hora do dia"
            rightSlot={(
              <div className="flex items-center gap-2">
                <VfPill variant="mint">Pico {peak.hour}h · {peak.rate.toFixed(1)}%</VfPill>
                <VfPill variant="err">Vale {trough.hour}h · {trough.rate.toFixed(1)}%</VfPill>
              </div>
            )}
          />
          <div className="flex items-end gap-0.5" style={{ height: 130 }}>
            {PIX_HOURLY_CONVERSION.map((h) => {
              const barHeight = ((h.rate - 55) / 25) * 100;
              const grad = convBarGradient(h.rate);
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
          <div className="flex justify-between mt-1.5 font-mono" style={{ fontSize: 9.5, color: VF.faint, fontWeight: 700 }}>
            <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
          </div>
        </VfCard>

        <VfCard className="lg:col-span-2">
          <VfSectionHeader eyebrow="PIX · devoluções" title="Motivos de" highlight="devolução" icon={ArrowsCounterClockwise} />
          <div className="space-y-2.5">
            {PIX_REFUND_REASONS.map((r) => (
              <div key={r.reason}>
                <div className="flex items-center justify-between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <span className="truncate pr-2" style={{ color: VF.navy, fontWeight: 700 }}>{r.reason}</span>
                  <span className="font-mono" style={{ fontWeight: 800, color: VF.navy, fontVariantNumeric: 'tabular-nums' }}>
                    {fmtInt(r.count)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <VfProgress value={r.share} gradient={`linear-gradient(90deg, ${VF.navy2}, ${VF.deep})`} height={4} />
                  </div>
                  <span className="font-mono" style={{ fontSize: 10, color: VF.muted, fontWeight: 700, width: 44, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {r.share}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </VfCard>
      </div>
    </div>
  );
}