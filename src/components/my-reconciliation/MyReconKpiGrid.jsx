import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Banknote, AlertTriangle } from 'lucide-react';
import { KPI_PERIODO, fmtBRLShort } from './mocks/myReconciliationMocks';

/**
 * Grid de KPIs financeiros do merchant (5 cards).
 * Mostra: vendas, taxas (esperado vs cobrado), recebido, a receber, divergências.
 */
export default function MyReconKpiGrid() {
  const k = KPI_PERIODO;
  const deltaTaxas = k.taxas_cobradas - k.taxas_esperadas;
  const pctRecebido = ((k.recebido_na_conta / k.vendas_brutas) * 100).toFixed(1);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 14,
    }}>
      <KpiCard
        variant="mint"
        icon={DollarSign}
        eyebrow="VENDAS NO PERÍODO"
        value={fmtBRLShort(k.vendas_brutas)}
        sub={`${k.vendas_count.toLocaleString('pt-BR')} transações aprovadas`}
      />

      <KpiCard
        variant={deltaTaxas > 0 ? 'warn' : 'success'}
        icon={Percent}
        eyebrow="TAXAS COBRADAS"
        value={fmtBRLShort(k.taxas_cobradas)}
        delta={deltaTaxas}
        deltaLabel={deltaTaxas > 0 ? 'acima do contrato' : 'dentro do contrato'}
        sub={`Esperado ${fmtBRLShort(k.taxas_esperadas)}`}
      />

      <KpiCard
        variant="accent"
        icon={Banknote}
        eyebrow="RECEBIDO NA CONTA"
        value={fmtBRLShort(k.recebido_na_conta)}
        sub={`${pctRecebido}% do bruto já creditado`}
      />

      <KpiCard
        variant="info"
        icon={TrendingUp}
        eyebrow="A RECEBER"
        value={fmtBRLShort(k.a_receber)}
        sub="Agenda de recebíveis futuros"
      />

      <KpiCard
        variant="danger"
        icon={AlertTriangle}
        eyebrow="DIVERGÊNCIAS ABERTAS"
        value={k.divergencias_abertas}
        sub={`${fmtBRLShort(k.divergencias_valor)} em disputa`}
      />
    </div>
  );
}

function KpiCard({ variant, icon: Icon, eyebrow, value, sub, delta, deltaLabel }) {
  const styles = {
    mint: {
      bg: 'linear-gradient(135deg, #00C194 0%, #007A5C 100%)',
      border: 'transparent',
      valueColor: '#fff',
      labelColor: 'rgba(255,255,255,0.82)',
      iconBg: 'rgba(255,255,255,0.22)',
      iconColor: '#fff',
    },
    hero: {
      bg: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
      border: 'rgba(92,247,207,0.22)',
      valueColor: '#fff',
      labelColor: 'rgba(255,255,255,0.62)',
      iconBg: 'rgba(92,247,207,0.18)',
      iconColor: '#5CF7CF',
    },
    accent: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      borderTop: '3px solid #00C194',
      valueColor: '#0F172A',
      labelColor: '#007A5C',
      iconBg: '#E0F8F1',
      iconColor: '#007A5C',
    },
    info: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      borderTop: '3px solid #013766',
      valueColor: '#0F172A',
      labelColor: '#013766',
      iconBg: '#E6ECF2',
      iconColor: '#013766',
    },
    warn: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      borderTop: '3px solid #B45309',
      valueColor: '#0F172A',
      labelColor: '#B45309',
      iconBg: '#FEF3C7',
      iconColor: '#B45309',
    },
    danger: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      borderTop: '3px solid #B91C1C',
      valueColor: '#0F172A',
      labelColor: '#B91C1C',
      iconBg: '#FEE2E2',
      iconColor: '#B91C1C',
    },
    success: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      borderTop: '3px solid #00C194',
      valueColor: '#0F172A',
      labelColor: '#007A5C',
      iconBg: '#E0F8F1',
      iconColor: '#007A5C',
    },
  }[variant] || {};

  return (
    <div style={{
      position: 'relative',
      padding: '16px 18px',
      borderRadius: 14,
      background: styles.bg,
      border: `1px solid ${styles.border}`,
      borderTop: styles.borderTop || `1px solid ${styles.border}`,
      boxShadow: variant === 'mint' || variant === 'hero'
        ? '0 6px 18px -4px rgba(0,193,148,0.25)'
        : '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: styles.labelColor,
        }}>{eyebrow}</span>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: styles.iconBg, color: styles.iconColor,
          display: 'grid', placeItems: 'center',
        }}>
          <Icon size={14} strokeWidth={2} />
        </div>
      </div>

      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 26, fontWeight: 800,
        color: styles.valueColor, letterSpacing: '-0.025em',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.05,
      }}>{value}</div>

      {delta !== undefined && delta !== 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          marginTop: 6,
          padding: '2px 8px', borderRadius: 999,
          background: delta > 0 ? '#FEE2E2' : '#E0F8F1',
          color: delta > 0 ? '#B91C1C' : '#007A5C',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
        }}>
          {delta > 0 ? <TrendingUp size={10} strokeWidth={2.5} /> : <TrendingDown size={10} strokeWidth={2.5} />}
          {delta > 0 ? '+' : ''}{fmtBRLShort(delta)} {deltaLabel}
        </div>
      )}

      {sub && (
        <div style={{
          fontSize: 11.5, color: variant === 'mint' || variant === 'hero' ? 'rgba(255,255,255,0.72)' : '#64748B',
          marginTop: delta ? 4 : 6,
          fontWeight: 500,
        }}>{sub}</div>
      )}
    </div>
  );
}