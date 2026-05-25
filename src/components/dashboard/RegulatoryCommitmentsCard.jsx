import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Scales,
  Lock,
  Lightning,
  ArrowRight,
  Info,
} from '@phosphor-icons/react';
import { createPageUrl } from '@/components/utils';
import { MOCK_EFFECTS, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';

const TYPES = [
  {
    key: 'judicial',
    label: 'Bloqueios judiciais',
    description: 'Penhoras e ordens judiciais',
    icon: Scales,
    iconVariant: 'pvf-ic-err',
    barColor: '#FCA5A5',
    match: (e) => e.type === 'judicial_lien' || e.type === 'attachment',
  },
  {
    key: 'cessions',
    label: 'Cessões fiduciárias',
    description: 'Recebíveis em garantia',
    icon: Lock,
    iconVariant: 'pvf-ic-warn',
    barColor: '#FDE68A',
    match: (e) => e.type.includes('assignment'),
  },
  {
    key: 'anticipations',
    label: 'Antecipações registradas',
    description: 'Com terceiros (FIDC, bancos)',
    icon: Lightning,
    iconVariant: 'pvf-ic-blue',
    barColor: '#8AA5BD',
    match: (e) => e.type === 'registered_anticipation',
  },
];

export default function RegulatoryCommitmentsCard() {
  const myEffects = MOCK_EFFECTS.filter(
    (e) => e.ur?.merchant?.id === 'mer_001' && e.status === 'active'
  );
  const totalCommitted = myEffects.reduce((s, e) => s + e.value_affected, 0);

  if (myEffects.length === 0) return null;

  const breakdown = TYPES.map((t) => {
    const items = myEffects.filter(t.match);
    const value = items.reduce((s, e) => s + e.value_affected, 0);
    const pct = totalCommitted > 0 ? (value / totalCommitted) * 100 : 0;
    return { ...t, count: items.length, value, pct };
  }).filter((t) => t.count > 0);

  return (
    <div className="pvf-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '18px 22px',
        background: 'linear-gradient(135deg, #002443, #001124)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: -60,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(92,247,207,0.32), transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, position: 'relative', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div className="pvf-ic pvf-ic-solid-blue" style={{ background: 'rgba(92,247,207,0.16)', color: '#5CF7CF', border: '1px solid rgba(92,247,207,0.3)' }}>
              <ShieldCheck weight="duotone" size={22} />
            </div>
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#5CF7CF',
                marginBottom: 4,
              }}>
                Compliance · CERC/B3
              </div>
              <h3 style={{
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: '-0.018em',
                color: '#fff',
                lineHeight: 1.25,
              }}>
                Compromissos sobre seus recebíveis
              </h3>
              <p style={{
                margin: '6px 0 0',
                fontSize: 11.5,
                color: 'rgba(255,255,255,0.65)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Info weight="duotone" size={12} />
                Valores comprometidos por gravames registrados
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#5CF7CF',
              opacity: 0.78,
            }}>
              Total comprometido
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.024em',
              color: '#fff',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
              marginTop: 4,
            }}>
              {formatCurrencyShort(totalCommitted)}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        {/* Stacked bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex',
            height: 8,
            borderRadius: 99,
            overflow: 'hidden',
            background: '#E0F8F1',
            border: '1px solid #B3F0DE',
          }}>
            {breakdown.map((item) => (
              <div
                key={item.key}
                style={{ width: `${item.pct}%`, background: item.barColor }}
                title={`${item.label}: ${item.pct.toFixed(0)}%`}
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: 10 }}>
            {breakdown.map((item) => (
              <div key={item.key} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10.5,
                fontWeight: 700,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: item.barColor }} />
                <span style={{ color: '#547C9D' }}>{item.label}</span>
                <span style={{ color: '#001124', fontWeight: 800 }}>{item.pct.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* KPI cards por tipo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {breakdown.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="pvf-kpi" style={{ minHeight: 140 }}>
                <div className="pvf-kpi-top">
                  <div className={`pvf-ic pvf-ic-sm ${item.iconVariant}`}>
                    <Icon weight="duotone" size={16} />
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 26,
                    fontWeight: 800,
                    color: '#001124',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}>
                    {item.count}
                  </span>
                </div>
                <div>
                  <p style={{
                    margin: '6px 0 2px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#001124',
                    lineHeight: 1.2,
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: 11,
                    color: '#547C9D',
                  }}>
                    {item.description}
                  </p>
                </div>
                <div style={{
                  paddingTop: 8,
                  borderTop: '1px dashed #B3F0DE',
                  marginTop: 4,
                }}>
                  <div className="pvf-kpi-lab" style={{ fontSize: 9 }}>Valor afetado</div>
                  <div className="pvf-kpi-val" style={{ fontSize: 16, marginTop: 2 }}>
                    {formatCurrencyShort(item.value)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px dashed #B3F0DE',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          <p style={{
            margin: 0,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10.5,
            color: '#547C9D',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}>
            Dados sincronizados com registradoras autorizadas BCB
          </p>
          <Link
            to={createPageUrl('MyContractEffects')}
            className="pvf-btn pvf-btn-out pvf-btn-sm"
            style={{ textDecoration: 'none' }}
          >
            Ver detalhes
            <ArrowRight weight="bold" size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}