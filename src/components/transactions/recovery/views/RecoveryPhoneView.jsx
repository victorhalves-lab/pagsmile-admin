import React from 'react';
import { Phone, PhoneCall, PhoneOff, Coffee, User, Clock, Target } from 'lucide-react';
import { PHONE_AGENTS, PHONE_QUEUE, PHONE_STATS_TODAY } from '../mocks/recoveryAgentMocks';

const STATUS_META = {
  available: { label: 'Disponível', color: 'var(--pag-mint-700)', bg: 'var(--pag-mint-50)', icon: PhoneCall },
  in_call: { label: 'Em ligação', color: 'var(--sys-warn)', bg: 'var(--sys-warn-soft)', icon: Phone },
  paused: { label: 'Pausa', color: 'var(--v8-fg-muted)', bg: 'var(--v8-bg-surface-2)', icon: Coffee },
  offline: { label: 'Offline', color: 'var(--sys-danger)', bg: 'var(--sys-danger-soft)', icon: PhoneOff },
};

const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v || 0);

const fmtDuration = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}min ${s.toString().padStart(2, '0')}s`;
};

export default function RecoveryPhoneView() {
  const stats = PHONE_STATS_TODAY;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPIs do dia */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <PhoneKpi eyebrow="CALLS HOJE" value={stats.calls_total} sub={`${stats.calls_connected} conectadas`} icon={Phone} />
        <PhoneKpi eyebrow="RECUPERADAS" value={stats.calls_recovered} sub={`${stats.conversion_rate}% conversão`} icon={Target} accent="var(--pag-mint-500)" />
        <PhoneKpi eyebrow="VALOR RECUPERADO" value={fmtBRL(stats.total_recovered_value)} sub="hoje · acumulado" accent="var(--pag-mint-500)" />
        <PhoneKpi eyebrow="DURAÇÃO MÉDIA" value={fmtDuration(stats.avg_call_duration_sec)} sub="por chamada" icon={Clock} />
        <PhoneKpi eyebrow="MELHOR AGENTE" value={stats.best_agent} sub="hoje" icon={User} accent="var(--pag-blue-700)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: 16 }}>
        {/* Agentes */}
        <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--v8-bd-default)',
            background: 'var(--v8-bg-surface-2)',
          }}>
            <span className="v8-eyebrow">AGENTES HUMANOS</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
              {PHONE_AGENTS.filter(a => a.status !== 'offline').length}/{PHONE_AGENTS.length} online
            </div>
          </div>
          <div>
            {PHONE_AGENTS.map(a => {
              const meta = STATUS_META[a.status];
              const StatusIcon = meta.icon;
              return (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--v8-bd-subtle)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--grad-brand)', color: '#fff',
                    display: 'grid', placeItems: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{a.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v8-fg-strong)' }}>{a.name}</div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 2,
                      fontSize: 10, fontWeight: 600,
                      color: meta.color,
                    }}>
                      <StatusIcon size={10} strokeWidth={2} />
                      {meta.label}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="v8-num" style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)' }}>
                      {a.calls_today}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--v8-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                      {a.conversion_rate}% conv
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fila de calls */}
        <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--v8-bd-default)',
            background: 'var(--v8-bg-surface-2)',
          }}>
            <span className="v8-eyebrow">FILA DE LIGAÇÕES · PRIORIZADA POR IA</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
              {PHONE_QUEUE.length} clientes aguardando contato humano
            </div>
          </div>
          <div>
            {PHONE_QUEUE.map(call => (
              <PhoneQueueRow key={call.id} call={call} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneKpi({ eyebrow, value, sub, icon: Icon, accent }) {
  return (
    <div className="v8-card" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="v8-eyebrow" style={{ fontSize: 9 }}>{eyebrow}</span>
        {Icon && <Icon size={12} style={{ color: accent || 'var(--v8-fg-muted)' }} />}
      </div>
      <div className="v8-num" style={{
        fontSize: 20, fontWeight: 700, letterSpacing: 'var(--tr-tighter)',
        color: accent || 'var(--v8-fg-strong)', lineHeight: 1.05,
      }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--v8-fg-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function PhoneQueueRow({ call }) {
  const priorityMeta = {
    high: { label: 'Alta', color: 'var(--sys-danger)', bg: 'var(--sys-danger-soft)' },
    medium: { label: 'Média', color: 'var(--sys-warn)', bg: 'var(--sys-warn-soft)' },
    low: { label: 'Baixa', color: 'var(--v8-fg-muted)', bg: 'var(--v8-bg-surface-2)' },
  }[call.priority];

  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: '1px solid var(--v8-bd-subtle)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 8px', borderRadius: 999,
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
          background: priorityMeta.bg, color: priorityMeta.color,
        }}>{priorityMeta.label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)' }}>
          {call.customer_name}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          color: 'var(--v8-fg-muted)',
        }}>{call.customer_phone}</span>
        <code style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
          color: 'var(--v8-fg-muted)',
          background: 'var(--v8-bg-surface-3)',
          padding: '1px 5px', borderRadius: 4,
        }}>{call.decline_code}</code>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
          color: 'var(--v8-fg-strong)',
        }}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(call.amount)}
        </span>
      </div>

      <div style={{
        padding: '10px 12px',
        background: 'var(--v8-bg-surface-2)',
        border: '1px solid var(--v8-bd-default)',
        borderRadius: 8,
        fontSize: 11, color: 'var(--v8-fg-default)', lineHeight: 1.5,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: 'var(--pag-mint-700)', marginBottom: 4,
        }}>SCRIPT SUGERIDO PELA IA</div>
        {call.suggested_script}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--v8-fg-muted)' }}>
          <span>
            Janela: <strong style={{ color: 'var(--v8-fg-strong)', fontFamily: 'JetBrains Mono, monospace' }}>{call.best_window}</strong>
          </span>
          <span>
            Prob.: <strong style={{ color: 'var(--pag-mint-700)', fontFamily: 'JetBrains Mono, monospace' }}>{call.success_prob}%</strong>
          </span>
          <span>
            Segmento: <strong style={{ color: 'var(--v8-fg-strong)' }}>{call.customer_segment}</strong>
          </span>
        </div>
        <button
          type="button"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 30, padding: '0 14px', borderRadius: 8,
            background: 'var(--grad-brand)', color: '#fff',
            border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            boxShadow: 'var(--sh-brand)',
          }}
        >
          <Phone size={12} />
          Discar
        </button>
      </div>
    </div>
  );
}