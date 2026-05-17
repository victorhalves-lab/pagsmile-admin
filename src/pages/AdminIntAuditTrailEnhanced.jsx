import React, { useState, useMemo } from 'react';
import {
  ScrollText, Download, Search, User, Filter as FilterIcon,
  Clock, CheckCircle2, XCircle, AlertTriangle,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import UndoActionTimelineItem from '@/components/audit/UndoActionTimelineItem';
import {
  mockUndoableActionsHistory,
  mockPendingActionsQueue,
  mockUndoStats,
} from '@/components/mockData/actionWithUndoMocks';

/* Legacy audit events (mantidos) */
const LEGACY_AUDIT = [
  { id: 'leg_1', timestamp: '2026-05-09T14:42:18', user: 'admin@pagsmile.com', action: 'split_rule.update', target: 'merchant_001', severity: 'high', diff: { before: '10/90', after: '12/88' } },
  { id: 'leg_2', timestamp: '2026-05-09T14:32:10', user: 'analyst@pagsmile.com', action: 'risk_rule.create', target: 'rule_velocity_v2', severity: 'medium' },
  { id: 'leg_3', timestamp: '2026-05-09T13:42:00', user: 'admin@pagsmile.com', action: 'orchestration_flow.publish', target: 'flow_002', severity: 'high' },
  { id: 'leg_4', timestamp: '2026-05-09T13:15:00', user: 'compliance@pagsmile.com', action: 'mcc.approve_change', target: 'merchant_023', severity: 'medium', diff: { before: '5411', after: '4789' } },
  { id: 'leg_5', timestamp: '2026-05-09T12:18:00', user: 'admin@pagsmile.com', action: 'limit.update', target: 'merchant_007', severity: 'high', diff: { before: 'R$50k', after: 'R$200k' } },
];

const ACTION_TYPE_OPTIONS = [
  { value: 'all', label: 'Todas ações' },
  { value: 'merchant.block', label: 'Bloqueio Merchant' },
  { value: 'merchant.unblock', label: 'Desbloqueio Merchant' },
  { value: 'merchant.suspend', label: 'Suspensão Merchant' },
  { value: 'subseller.cancel', label: 'Cancelamento Subseller' },
  { value: 'fee_plan.bulk_change', label: 'Plano de Taxa em Massa' },
  { value: 'manual_adjustment.apply', label: 'Ajuste Manual' },
  { value: 'withdrawal.reject', label: 'Rejeição de Saque' },
  { value: 'anticipation.cancel', label: 'Cancel. Antecipação' },
];

const STATE_OPTIONS = [
  { value: 'all', label: 'Todos estados' },
  { value: 'confirmed', label: 'Confirmados' },
  { value: 'cancelled', label: 'Desfeitos' },
  { value: 'errored', label: 'Erro' },
];

const VIA_OPTIONS = [
  { value: 'all', label: 'Todos métodos' },
  { value: 'timer_expired', label: 'Timer expirou' },
  { value: 'manual_confirm', label: 'Confirmação manual' },
  { value: 'modal_close', label: 'Fechou modal' },
  { value: 'post_reload_auto', label: 'Auto após reload' },
];

function V8KPI({ eyebrow, value, sub, accent }) {
  return (
    <div className="v8-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="v8-eyebrow">{eyebrow}</span>
      <span className="v8-num" style={{
        fontSize: 30, fontWeight: 800, letterSpacing: '-0.028em',
        color: accent || 'var(--v8-fg-strong)', lineHeight: 1.04,
      }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--v8-fg-muted)' }}>{sub}</span>}
    </div>
  );
}

function PendingActionRow({ action }) {
  const secondsLeft = Math.max(0, Math.ceil((new Date(action.scheduled_confirm_at).getTime() - Date.now()) / 1000));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--v8-bd-subtle)' }}>
      <div style={{
        width: 32, height: 32, borderRadius: 12,
        background: 'var(--v8-bg-warning)', color: 'var(--v8-fg-warning)',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <Clock size={14} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span className="v8-pill v8-pill--warning"><span className="v8-pill__dot" />Pendente</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--v8-fg-strong)', letterSpacing: '-0.014em' }}>
            {action.action_label}
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)' }}>
          {action.target_summary} · iniciado por {action.actor.name}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="v8-num" style={{
          fontSize: 18, fontWeight: 700,
          color: secondsLeft <= 10 ? 'var(--v8-fg-danger)' : 'var(--v8-fg-warning)',
        }}>
          0:{String(secondsLeft).padStart(2, '0')}
        </div>
        <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)', fontFamily: 'JetBrains Mono, monospace' }}>
          até confirmar
        </div>
      </div>
    </div>
  );
}

function LegacyEventRow({ event }) {
  const sev = {
    critical: 'v8-pill--danger', high: 'v8-pill--warning',
    medium: 'v8-pill--info', low: 'v8-pill--neutral',
  }[event.severity] || 'v8-pill--neutral';

  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--v8-bd-subtle)' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12,
        background: 'var(--v8-bg-surface-2)', color: 'var(--v8-fg-muted)',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <User size={16} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <span className={`v8-pill ${sev}`}>{event.severity}</span>
          <code style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600,
            color: 'var(--v8-fg-strong)', background: 'var(--v8-bg-surface-2)',
            padding: '2px 7px', borderRadius: 6, border: '1px solid var(--v8-bd-subtle)',
          }}>{event.action}</code>
          <span style={{ color: 'var(--v8-fg-subtle)', fontSize: 11 }}>→</span>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--v8-fg-muted)' }}>
            {event.target}
          </code>
        </div>
        <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)' }}>
          <strong style={{ color: 'var(--v8-fg-strong)' }}>{event.user}</strong>
          {' · '}
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {new Date(event.timestamp).toLocaleString('pt-BR')}
          </span>
        </div>
        {event.diff && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 520, marginTop: 8 }}>
            <div style={{ padding: 8, background: 'var(--v8-bg-danger)', border: '1px solid var(--v8-bd-danger)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--v8-fg-danger)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Antes</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, marginTop: 2 }}>{String(event.diff.before)}</div>
            </div>
            <div style={{ padding: 8, background: 'var(--v8-bg-success)', border: '1px solid var(--v8-bd-success)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--v8-fg-success)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Depois</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, marginTop: 2 }}>{String(event.diff.after || '—')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function V8Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: 36, padding: '0 32px 0 12px',
        background: 'var(--v8-bg-surface)', border: '1px solid var(--v8-bd-default)',
        borderRadius: 8, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
        color: 'var(--v8-fg-default)', appearance: 'none', cursor: 'pointer',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export default function AdminIntAuditTrailEnhanced() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [filterVia, setFilterVia] = useState('all');

  const filteredHistory = useMemo(() => {
    const q = search.toLowerCase();
    return mockUndoableActionsHistory.filter(a => {
      if (filterType !== 'all' && a.action_type !== filterType) return false;
      if (filterState !== 'all' && a.state !== filterState) return false;
      if (filterVia !== 'all' && a.confirmed_via !== filterVia) return false;
      if (!q) return true;
      return (
        a.action_label.toLowerCase().includes(q) ||
        a.target_summary.toLowerCase().includes(q) ||
        a.actor.name.toLowerCase().includes(q) ||
        a.action_type.toLowerCase().includes(q)
      );
    });
  }, [search, filterType, filterState, filterVia]);

  const filteredLegacy = useMemo(() => {
    const q = search.toLowerCase();
    if (filterType !== 'all' || filterState !== 'all' || filterVia !== 'all') return [];
    if (!q) return LEGACY_AUDIT;
    return LEGACY_AUDIT.filter(a =>
      a.action.toLowerCase().includes(q) ||
      a.user.toLowerCase().includes(q) ||
      a.target.toLowerCase().includes(q)
    );
  }, [search, filterType, filterState, filterVia]);

  return (
    <div data-ds="v8" style={{ minHeight: '100vh', background: 'var(--v8-bg-canvas)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Audit Trail Enhanced"
          subtitle="Trilha completa de auditoria · ações undo-able com janela de 60s + eventos clássicos"
          icon={ScrollText}
          breadcrumbs={[
            { label: 'Admin Interno', page: 'AdminIntDashboard' },
            { label: 'Administração' },
          ]}
          actions={
            <button
              type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, height: 36,
                padding: '0 14px', background: 'var(--v8-bg-surface)',
                border: '1px solid var(--v8-bd-default)', borderRadius: 12,
                fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                color: 'var(--v8-fg-strong)', cursor: 'pointer',
              }}
            >
              <Download size={14} strokeWidth={2} />
              Exportar CSV
            </button>
          }
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <V8KPI
            eyebrow="EVENTOS HOJE"
            value={mockUndoStats.total_today + LEGACY_AUDIT.length}
            sub={`${mockUndoableActionsHistory.length} undo-able · ${LEGACY_AUDIT.length} clássicos`}
          />
          <V8KPI
            eyebrow="CONFIRMADAS"
            value={`${mockUndoStats.confirmed_pct}%`}
            sub="das ações undo-able"
            accent="var(--v8-fg-success)"
          />
          <V8KPI
            eyebrow="DESFEITAS"
            value={`${mockUndoStats.cancelled_pct}%`}
            sub="canceladas no undo window"
            accent="var(--v8-fg-info)"
          />
          <V8KPI
            eyebrow="PENDENTES AGORA"
            value={mockUndoStats.pending_now}
            sub="aguardando confirm/desfazer"
            accent={mockUndoStats.pending_now > 0 ? 'var(--v8-fg-warning)' : 'var(--v8-fg-muted)'}
          />
        </div>

        {mockPendingActionsQueue.length > 0 && (
          <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px', borderBottom: '1px solid var(--v8-bd-default)',
              background: 'var(--v8-bg-surface-2)',
            }}>
              <Clock size={14} strokeWidth={2} style={{ color: 'var(--v8-fg-warning)' }} />
              <span className="v8-eyebrow" style={{ color: 'var(--v8-fg-warning)' }}>
                AGUARDANDO · {mockPendingActionsQueue.length} ação{mockPendingActionsQueue.length > 1 ? 'es' : ''} pendente{mockPendingActionsQueue.length > 1 ? 's' : ''}
              </span>
            </div>
            {mockPendingActionsQueue.map(a => (
              <PendingActionRow key={a.action_id} action={a} />
            ))}
          </div>
        )}

        <div className="v8-card" style={{ padding: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 220 }}>
            <Search
              size={14} strokeWidth={2}
              style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--v8-fg-subtle)', pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por ação, ator, alvo, tipo..."
              style={{
                width: '100%', height: 36, padding: '0 12px 0 36px',
                background: 'var(--v8-bg-surface)', border: '1px solid var(--v8-bd-default)',
                borderRadius: 8, fontFamily: 'Inter, sans-serif', fontSize: 13,
                color: 'var(--v8-fg-strong)', outline: 'none',
              }}
            />
          </div>
          <V8Select value={filterType} onChange={setFilterType} options={ACTION_TYPE_OPTIONS} />
          <V8Select value={filterState} onChange={setFilterState} options={STATE_OPTIONS} />
          <V8Select value={filterVia} onChange={setFilterVia} options={VIA_OPTIONS} />
        </div>

        <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderBottom: '1px solid var(--v8-bd-default)',
            background: 'var(--v8-bg-surface-2)',
          }}>
            <span className="v8-eyebrow">
              TIMELINE · {filteredHistory.length + filteredLegacy.length} eventos
            </span>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 11, color: 'var(--v8-fg-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12} style={{ color: 'var(--v8-fg-success)' }} />confirmado
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <XCircle size={12} style={{ color: 'var(--v8-fg-muted)' }} />desfeito
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} style={{ color: 'var(--v8-fg-danger)' }} />erro
              </span>
            </div>
          </div>

          {filteredHistory.length === 0 && filteredLegacy.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--v8-fg-muted)' }}>
              <FilterIcon size={28} style={{ marginBottom: 12, opacity: 0.4 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--v8-fg-strong)', marginBottom: 4 }}>
                Nenhum evento encontrado
              </div>
              <div style={{ fontSize: 12 }}>Ajuste filtros ou busca para ver resultados.</div>
            </div>
          ) : (
            <>
              {filteredHistory.map(action => (
                <UndoActionTimelineItem key={action.event_id} action={action} />
              ))}
              {filteredLegacy.length > 0 && (
                <>
                  <div style={{
                    padding: '8px 16px', background: 'var(--v8-bg-surface-2)',
                    borderTop: '1px solid var(--v8-bd-default)',
                    borderBottom: '1px solid var(--v8-bd-default)',
                  }}>
                    <span className="v8-eyebrow" style={{ color: 'var(--v8-fg-subtle)' }}>
                      EVENTOS CLÁSSICOS (legado)
                    </span>
                  </div>
                  {filteredLegacy.map(event => (
                    <LegacyEventRow key={event.id} event={event} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}