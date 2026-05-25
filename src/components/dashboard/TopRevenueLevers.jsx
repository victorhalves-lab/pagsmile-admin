import React from 'react';
import { Rocket, CaretRight, TrendUp } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * TopRevenueLevers — Pulse VF.
 * Card branco + section header + lista de 5 alavancas com badge type + CTA outline.
 */
export default function TopRevenueLevers({ levers = [] }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const defaults = [
    { id: 'route_visa', title: 'Rotear Visa débito → Stone', desc: 'Stone tem 4.3pp mais aprovação que Getnet em Visa débito', impact: 8420, type: 'orchestration', cta: 'Configurar', to: createPageUrl('AdminIntOrchestration') },
    { id: 'recover_3ds', title: 'Ativar 3DS soft-decline retry', desc: '127 transações soft-declined recuperáveis nos últimos 7 dias', impact: 5340, type: 'recovery', cta: 'Ativar regra', to: createPageUrl('RecoveryAgent') },
    { id: 'pix_discount', title: 'Oferecer 2% desconto no PIX', desc: 'Migrar 15% do volume cartão → PIX reduz custos em ~1.8%', impact: 3870, type: 'pricing', cta: 'Configurar', to: createPageUrl('CheckoutBuilder') },
    { id: 'recurring_card_update', title: 'Account Updater nas recorrências', desc: '47 cartões expirando em 30 dias — evitar churn de R$ 12.4k', impact: 12480, type: 'churn', cta: 'Configurar', to: createPageUrl('Subscriptions') },
    { id: 'cb_alert', title: 'Conectar Ethoca/Verifi', desc: 'Reduzir 30% dos chargebacks do mês via pré-disputa', impact: 4250, type: 'risk', cta: 'Conectar', to: createPageUrl('PreChargebacks') },
  ];

  const list = levers.length > 0 ? levers : defaults;
  const total = list.reduce((sum, l) => sum + (l.impact || 0), 0);

  const typeStyle = {
    orchestration: { bg: 'linear-gradient(135deg, #E8EDED, #C0CDCD)', color: '#091818', border: '#8FAAAA' },
    recovery:      { bg: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', color: '#005A43', border: '#4DD8AB' },
    pricing:       { bg: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)', color: '#002443', border: '#8AA5BD' },
    churn:         { bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', color: '#B45309', border: '#FDE68A' },
    risk:          { bg: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)', color: '#B91C1C', border: '#FCA5A5' },
  };

  return (
    <div
      className="relative overflow-hidden p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #fff, #F0FAF6)',
        border: '1px solid #80E5C6',
        boxShadow: '0 4px 14px -4px rgba(0,193,148,0.12)',
      }}
    >
      {/* Section header */}
      <div
        className="relative flex items-end justify-between flex-wrap gap-3 mb-4 pb-3"
        style={{ borderBottom: '1px solid #B3F0DE' }}
      >
        <div
          className="absolute"
          style={{
            left: 0, bottom: -1, width: 80, height: 2,
            background: 'linear-gradient(90deg, #00C194, #5CF7CF)', borderRadius: 99,
          }}
        />
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #1ECB9D, #007A5C)',
              color: '#fff',
              boxShadow: '0 6px 14px -3px rgba(0,193,148,0.55)',
            }}
          >
            <Rocket weight="duotone" size={22} />
          </div>
          <div>
            <div
              className="font-mono inline-flex items-center gap-2 mb-1"
              style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#007A5C',
              }}
            >
              <span style={{ width: 18, height: 2, background: '#00C194', borderRadius: 99 }} />
              Alavancas de receita
            </div>
            <h3
              style={{
                margin: 0, fontFamily: 'Inter, sans-serif',
                fontSize: 18, fontWeight: 800, letterSpacing: '-0.018em',
                color: '#001124', lineHeight: 1.2,
              }}
            >
              Top 5{' '}
              <em
                style={{
                  fontStyle: 'normal',
                  background: 'linear-gradient(135deg,#00C194,#007A5C)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                oportunidades
              </em>
            </h3>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono" style={{ fontSize: 10, color: '#547C9D', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Potencial total
          </p>
          <p
            className="font-mono"
            style={{
              fontSize: 20, fontWeight: 800, lineHeight: 1,
              background: 'linear-gradient(135deg, #007A5C, #001124)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmt(total)}<span style={{ fontSize: 11, color: '#547C9D' }}>/mês</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {list.map((lever, idx) => {
          const ts = typeStyle[lever.type] || typeStyle.orchestration;
          return (
            <div
              key={lever.id}
              className="flex items-center gap-3 p-3 transition-all hover:-translate-y-px"
              style={{
                background: '#fff',
                border: '1px solid #B3F0DE',
                borderRadius: 12,
              }}
            >
              <div
                className="flex-shrink-0 inline-flex items-center justify-center font-mono"
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'linear-gradient(135deg, #E0F8F1, #B4FCE8)',
                  color: '#005A43',
                  border: '1px solid #4DD8AB',
                  fontSize: 12, fontWeight: 800,
                }}
              >
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#001124' }}>
                    {lever.title}
                  </p>
                  <span
                    className="font-mono"
                    style={{
                      padding: '2px 7px', borderRadius: 99,
                      background: ts.bg, color: ts.color, border: `1px solid ${ts.border}`,
                      fontSize: 9, fontWeight: 800,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}
                  >
                    {lever.type}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#547C9D', lineHeight: 1.4 }}>{lever.desc}</p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="font-mono" style={{ fontSize: 9, color: '#547C9D', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Impacto/mês
                </p>
                <p
                  className="font-mono inline-flex items-center gap-0.5"
                  style={{
                    fontSize: 14, fontWeight: 800, color: '#007A5C',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <TrendUp weight="bold" size={12} />
                  +{fmt(lever.impact)}
                </p>
              </div>
              <Link
                to={lever.to}
                className="inline-flex items-center gap-1 flex-shrink-0 transition-all hover:-translate-y-px"
                style={{
                  padding: '7px 12px', borderRadius: 8,
                  background: '#fff', color: '#007A5C',
                  border: '1.5px solid #00C194',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11, fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                {lever.cta}
                <CaretRight weight="bold" size={11} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}