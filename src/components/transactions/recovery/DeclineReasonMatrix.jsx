import React, { useState } from 'react';
import {
  MessageSquare, Phone, Mail, Zap, Hash, AlertCircle, UserX, Wallet,
  TrendingUp, Calendar, XCircle, Shield, AlertTriangle, Lock, ChevronRight,
} from 'lucide-react';
import { DECLINE_REASONS } from './mocks/recoveryAgentMocks';

const ICON_MAP = {
  Hash, AlertCircle, UserX, Wallet, TrendingUp, Calendar,
  XCircle, Shield, AlertTriangle, Lock,
};

const CHANNEL_META = {
  whatsapp: { label: 'WhatsApp', icon: MessageSquare, color: 'var(--pag-mint-700)', bg: 'var(--pag-mint-50)' },
  whatsapp_pix: { label: 'WhatsApp + PIX', icon: MessageSquare, color: 'var(--pag-mint-700)', bg: 'var(--pag-mint-50)' },
  phone: { label: 'Ligação', icon: Phone, color: 'var(--pag-blue-700)', bg: 'var(--pag-blue-50)' },
  email: { label: 'E-mail', icon: Mail, color: 'var(--v8-fg-muted)', bg: 'var(--v8-bg-surface-2)' },
  auto_retry: { label: 'Auto-retry', icon: Zap, color: 'var(--sys-warn)', bg: 'var(--sys-warn-soft)' },
  sms: { label: 'SMS', icon: MessageSquare, color: 'var(--v8-fg-muted)', bg: 'var(--v8-bg-surface-2)' },
};

const CATEGORY_LABEL = {
  data_error: 'Erro de dado',
  financial: 'Financeiro',
  technical: 'Técnico',
  issuer: 'Emissor',
  fraud: 'Antifraude',
};

const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v || 0);

function RecoveryRateBar({ rate }) {
  const color = rate >= 60 ? 'var(--pag-mint-500)'
    : rate >= 45 ? 'var(--sys-warn)'
    : 'var(--sys-danger)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 80 }}>
      <div style={{
        width: 56, height: 4, borderRadius: 2,
        background: 'var(--v8-bg-surface-3)', overflow: 'hidden',
      }}>
        <div style={{
          width: `${rate}%`, height: '100%', background: color,
          transition: 'width .3s var(--ease-out)',
        }} />
      </div>
      <span className="v8-num" style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>
        {rate}%
      </span>
    </div>
  );
}

export default function DeclineReasonMatrix({ onSelect }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? DECLINE_REASONS
    : DECLINE_REASONS.filter(r => r.category === filter);

  const totalVolume = filtered.reduce((s, r) => s + r.volume_30d, 0);
  const totalValue = filtered.reduce((s, r) => s + r.volume_value, 0);
  const weightedRate = totalVolume
    ? filtered.reduce((s, r) => s + r.recovery_rate * r.volume_30d, 0) / totalVolume
    : 0;

  const categories = [
    { value: 'all', label: 'Todos os motivos' },
    { value: 'data_error', label: 'Erros de dado' },
    { value: 'financial', label: 'Financeiros' },
    { value: 'technical', label: 'Técnicos' },
    { value: 'issuer', label: 'Emissor' },
    { value: 'fraud', label: 'Antifraude' },
  ];

  return (
    <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--v8-bd-default)',
        background: 'var(--v8-bg-surface-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <div>
            <span className="v8-eyebrow">MATRIZ DE RECUPERAÇÃO POR MOTIVO DE RECUSA</span>
            <h3 style={{
              fontSize: 16, fontWeight: 700, letterSpacing: 'var(--tr-tight)',
              color: 'var(--v8-fg-strong)', marginTop: 4, margin: 0,
            }}>
              Estratégia, canal e mensagem por código de recusa
            </h3>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ color: 'var(--v8-fg-muted)' }}>
              <strong className="v8-num" style={{ color: 'var(--v8-fg-strong)' }}>{filtered.length}</strong> motivos
            </span>
            <span style={{ color: 'var(--v8-fg-muted)' }}>
              <strong className="v8-num" style={{ color: 'var(--v8-fg-strong)' }}>{totalVolume}</strong> recusas
            </span>
            <span style={{ color: 'var(--v8-fg-muted)' }}>
              <strong className="v8-num" style={{ color: 'var(--v8-fg-success)' }}>{weightedRate.toFixed(1)}%</strong> sucesso médio
            </span>
            <span style={{ color: 'var(--v8-fg-muted)' }}>
              <strong className="v8-num" style={{ color: 'var(--v8-fg-strong)' }}>{fmtBRL(totalValue)}</strong> em jogo
            </span>
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={filter === c.value ? 'v8-pill v8-pill--brand' : 'v8-pill v8-pill--neutral'}
              style={{ cursor: 'pointer', border: 'none', height: 26, fontSize: 11 }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div>
        {filtered.map((r) => {
          const ReasonIcon = ICON_MAP[r.icon] || AlertCircle;
          const ch = CHANNEL_META[r.primary_channel] || CHANNEL_META.whatsapp;
          const ChIcon = ch.icon;

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelect?.(r)}
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 1.6fr) 90px 110px 1.4fr 110px 16px',
                gap: 14,
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: '1px solid var(--v8-bd-subtle)',
                background: r.highlight ? 'var(--pag-mint-50)' : 'transparent',
                border: 'none',
                borderLeft: r.highlight ? '3px solid var(--pag-mint-500)' : '3px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Inter, sans-serif',
                transition: 'background .14s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = r.highlight ? 'var(--pag-mint-100)' : 'var(--v8-bg-surface-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = r.highlight ? 'var(--pag-mint-50)' : 'transparent'; }}
            >
              {/* Motivo + ícone + categoria */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--v8-bg-surface-2)',
                  border: '1px solid var(--v8-bd-default)',
                  color: 'var(--v8-fg-default)',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <ReasonIcon size={16} strokeWidth={1.8} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <code style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      color: 'var(--v8-fg-muted)',
                      background: 'var(--v8-bg-surface-3)',
                      padding: '1px 6px', borderRadius: 4,
                    }}>{r.code}</code>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      color: 'var(--v8-fg-subtle)',
                    }}>{CATEGORY_LABEL[r.category]}</span>
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 600,
                    color: 'var(--v8-fg-strong)',
                    letterSpacing: 'var(--tr-tight)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{r.label}</div>
                </div>
              </div>

              {/* Volume */}
              <div>
                <div className="v8-num" style={{
                  fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
                }}>{r.volume_30d}</div>
                <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)' }}>recusas/30d</div>
              </div>

              {/* Valor */}
              <div>
                <div className="v8-num" style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--v8-fg-default)',
                }}>{fmtBRL(r.volume_value)}</div>
                <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)' }}>volume</div>
              </div>

              {/* Canal + cadência */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    height: 22, padding: '0 8px', borderRadius: 6,
                    background: ch.bg, color: ch.color,
                    fontSize: 11, fontWeight: 600,
                  }}>
                    <ChIcon size={11} strokeWidth={2} />
                    {ch.label}
                  </div>
                  {r.pix_fallback && (
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                      color: 'var(--pag-mint-700)', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>+PIX</span>
                  )}
                  {r.installments_fallback && (
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                      color: 'var(--pag-blue-700)', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>+PARC</span>
                  )}
                </div>
                <div style={{
                  fontSize: 11, color: 'var(--v8-fg-muted)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {r.template_short}
                </div>
              </div>

              {/* Taxa */}
              <RecoveryRateBar rate={r.recovery_rate} />

              {/* Chevron */}
              <ChevronRight size={14} strokeWidth={2} style={{ color: 'var(--v8-fg-subtle)' }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}