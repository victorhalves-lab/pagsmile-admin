import React from 'react';
import {
  CheckCircle2, XCircle, AlertTriangle, Clock,
  Ban, ShieldOff, Pause, UserMinus, Percent, Calculator, Undo2,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Item de timeline para uma ação undo-able no Audit Trail V8.
 * Suporta os 3 estados: confirmed · cancelled · errored.
 */

const ICON_BY_TYPE = {
  'merchant.block': Ban,
  'merchant.unblock': ShieldOff,
  'merchant.suspend': Pause,
  'subseller.cancel': UserMinus,
  'fee_plan.bulk_change': Percent,
  'manual_adjustment.apply': Calculator,
  'withdrawal.reject': XCircle,
  'anticipation.cancel': Undo2,
};

const STATE_META = {
  confirmed: { icon: CheckCircle2, pillClass: 'v8-pill--success', label: 'Confirmado' },
  cancelled: { icon: XCircle, pillClass: 'v8-pill--neutral', label: 'Desfeito' },
  errored: { icon: AlertTriangle, pillClass: 'v8-pill--danger', label: 'Erro' },
};

const SEVERITY_PILL = {
  low: 'v8-pill--neutral',
  medium: 'v8-pill--info',
  high: 'v8-pill--warning',
  critical: 'v8-pill--danger',
};

const VIA_LABEL = {
  timer_expired: 'timer expirou',
  manual_confirm: 'confirmação manual',
  modal_close: 'fechou modal',
  post_reload_auto: 'auto após reload',
  user_logout_forced: 'forçado por logout',
};

export default function UndoActionTimelineItem({ action }) {
  const TypeIcon = ICON_BY_TYPE[action.action_type] || Clock;
  const stateMeta = STATE_META[action.state] || STATE_META.confirmed;
  const StateIcon = stateMeta.icon;

  const dt = new Date(action.queued_at);
  const relative = formatDistanceToNow(dt, { addSuffix: true, locale: ptBR });
  const absolute = format(dt, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });

  // Texto de duração / motivo
  const durationText = (() => {
    if (action.state === 'cancelled') {
      return `Desfeito após ${action.cancelled_after_seconds}s`;
    }
    if (action.state === 'errored') {
      return `Erro: ${action.errored_reason || 'falha técnica'}`;
    }
    if (action.confirmed_via) {
      const s = action.duration_ms ? Math.round(action.duration_ms / 1000) : 60;
      return `Confirmado após ${s}s · ${VIA_LABEL[action.confirmed_via] || action.confirmed_via}`;
    }
    return '';
  })();

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '14px 16px',
        borderBottom: '1px solid var(--v8-bd-subtle)',
        transition: 'background .14s',
      }}
      className="v8-audit-item"
    >
      {/* Ícone do tipo de ação */}
      <div
        style={{
          width: 36, height: 36,
          borderRadius: 12,
          background: 'var(--v8-bg-brand-soft)',
          color: 'var(--ps-700)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <TypeIcon size={16} strokeWidth={1.8} />
      </div>

      {/* Corpo */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Linha de status pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <span className={`v8-pill ${stateMeta.pillClass}`}>
            <StateIcon size={11} strokeWidth={2} />
            {stateMeta.label}
          </span>
          <span className={`v8-pill ${SEVERITY_PILL[action.severity]}`}>{action.severity}</span>
          <code style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--v8-fg-strong)',
            background: 'var(--v8-bg-surface-2)',
            padding: '2px 7px',
            borderRadius: 6,
            border: '1px solid var(--v8-bd-subtle)',
          }}>
            {action.action_type}
          </code>
          {action.confirmed_via && (
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: 'var(--v8-fg-muted)',
              letterSpacing: '0.04em',
            }}>
              via {action.confirmed_via}
            </span>
          )}
        </div>

        {/* Título */}
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--v8-fg-strong)',
          letterSpacing: '-0.014em',
          lineHeight: 1.35,
          marginBottom: 4,
        }}>
          {action.action_label}
        </div>

        {/* Target */}
        <div style={{
          fontSize: 12,
          color: 'var(--v8-fg-muted)',
          marginBottom: 6,
          lineHeight: 1.5,
        }}>
          {action.target_summary}
        </div>

        {/* Meta: ator + tempo + duração */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          fontSize: 11,
          color: 'var(--v8-fg-muted)',
        }}>
          <span>
            <strong style={{ color: 'var(--v8-fg-strong)', fontWeight: 600 }}>{action.actor.name}</strong>
            {' · '}
            <span style={{ color: 'var(--v8-fg-subtle)' }}>{action.actor.role}</span>
          </span>
          <span title={absolute} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {relative}
          </span>
          {durationText && (
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              color: action.state === 'errored' ? 'var(--v8-fg-danger)' : 'var(--v8-fg-muted)',
            }}>
              {durationText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}