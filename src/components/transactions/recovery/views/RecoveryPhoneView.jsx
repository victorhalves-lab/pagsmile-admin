import React from 'react';
import { Phone, PhoneCall, PhoneOff, Coffee, User, Clock, Target, Sparkles } from 'lucide-react';
import { PHONE_AGENTS, PHONE_QUEUE, PHONE_STATS_TODAY } from '../mocks/recoveryAgentMocks';

const STATUS_META = {
  available: { label: 'Disponível', color: '#007A5C', bg: '#E0F8F1', icon: PhoneCall },
  in_call:   { label: 'Em ligação', color: '#B45309', bg: '#FEF3C7', icon: Phone },
  paused:    { label: 'Pausa',      color: '#64748B', bg: '#F1F5F9', icon: Coffee },
  offline:   { label: 'Offline',    color: '#B91C1C', bg: '#FEE2E2', icon: PhoneOff },
};

const PRIORITY_META = {
  high:   { label: 'Alta',  color: '#B91C1C', bg: '#FEE2E2', accent: '#DC2626' },
  medium: { label: 'Média', color: '#B45309', bg: '#FEF3C7', accent: '#D97706' },
  low:    { label: 'Baixa', color: '#64748B', bg: '#F1F5F9', accent: '#94A3B8' },
};

const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v || 0);

const fmtDuration = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}min ${s.toString().padStart(2, '0')}s`;
};

function PhoneKpi({ eyebrow, value, sub, icon: Icon, variant = 'default' }) {
  let bg = '#FFFFFF', border = '1px solid #E2E8F0', valueColor = '#0F172A', labelColor = '#94A3B8', footColor = '#64748B';
  let dotColor = '#00C194', dotGlow = '0 0 0 3px rgba(0,193,148,0.18)';
  let extraStyle = {};

  if (variant === 'mint') {
    extraStyle = { background: 'linear-gradient(135deg, #00C194 0%, #007A5C 100%)', borderColor: 'transparent' };
    valueColor = '#fff';
    labelColor = 'rgba(255,255,255,0.82)';
    footColor = 'rgba(255,255,255,0.82)';
    dotColor = '#fff';
    dotGlow = '0 0 0 3px rgba(255,255,255,0.22)';
  } else if (variant === 'hero') {
    extraStyle = {
      background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
      borderColor: 'rgba(92,247,207,0.22)',
    };
    valueColor = '#fff';
    labelColor = 'rgba(255,255,255,0.62)';
    footColor = 'rgba(255,255,255,0.65)';
    dotColor = '#5CF7CF';
    dotGlow = '0 0 8px #5CF7CF, 0 0 0 3px rgba(92,247,207,0.18)';
  } else if (variant === 'accent') {
    extraStyle = { borderTop: '3px solid #00C194', paddingTop: 17 };
  }

  return (
    <div style={{
      padding: '14px 16px', borderRadius: 14,
      ...extraStyle, background: extraStyle.background || bg, border: extraStyle.borderColor ? `1px solid ${extraStyle.borderColor}` : border,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: labelColor,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, boxShadow: dotGlow }} />
        {eyebrow}
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800,
        color: valueColor, letterSpacing: '-0.025em',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.05,
      }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 11, color: footColor, marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function PhoneQueueRow({ call, isLast }) {
  const pri = PRIORITY_META[call.priority];

  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
      borderLeft: `3px solid ${pri.accent}`,
      display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'background .14s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 9px', borderRadius: 999,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          background: pri.bg, color: pri.color,
          border: `1px solid ${pri.color}33`,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: pri.color }} />
          {pri.label}
        </span>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.012em' }}>
          {call.customer_name}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#64748B',
        }}>{call.customer_phone}</span>
        <code style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
          color: '#475569', background: '#F1F5F9',
          padding: '2px 6px', borderRadius: 4,
          letterSpacing: '0.04em',
        }}>{call.decline_code}</code>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 800,
          color: '#0F172A', fontVariantNumeric: 'tabular-nums',
        }}>
          {fmtBRL(call.amount)}
        </span>
      </div>

      <div style={{
        padding: '12px 14px',
        background: 'linear-gradient(180deg, #E0F8F1 0%, #F4FCF8 100%)',
        border: '1px solid rgba(0,193,148,0.32)',
        borderRadius: 10,
        fontSize: 12.5, color: '#1E293B', lineHeight: 1.55,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.14em',
          color: '#007A5C', marginBottom: 4,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <Sparkles size={10} strokeWidth={2.5} />
          SCRIPT SUGERIDO PELA IA
        </div>
        {call.suggested_script}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: '#64748B' }}>
          <span>
            Janela: <strong style={{ color: '#0F172A', fontFamily: 'JetBrains Mono, monospace' }}>{call.best_window}</strong>
          </span>
          <span>
            Prob: <strong style={{ color: '#007A5C', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>{call.success_prob}%</strong>
          </span>
          <span>
            Segmento: <strong style={{ color: '#0F172A' }}>{call.customer_segment}</strong>
          </span>
        </div>
        <button type="button" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 32, padding: '0 16px', borderRadius: 10,
          background: 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)',
          color: '#fff', border: '1px solid #009E78',
          fontFamily: 'Inter, sans-serif',
          fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 12px -2px rgba(0,193,148,0.42)',
        }}>
          <Phone size={13} strokeWidth={2.2} />
          Discar
        </button>
      </div>
    </div>
  );
}

export default function RecoveryPhoneView() {
  const stats = PHONE_STATS_TODAY;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPIs do dia */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <PhoneKpi eyebrow="CALLS HOJE" value={stats.calls_total} sub={`${stats.calls_connected} conectadas`} icon={Phone} variant="accent" />
        <PhoneKpi eyebrow="RECUPERADAS" value={stats.calls_recovered} sub={`${stats.conversion_rate}% conversão`} variant="mint" />
        <PhoneKpi eyebrow="VALOR RECUPERADO" value={fmtBRL(stats.total_recovered_value)} sub="hoje · acumulado" variant="hero" />
        <PhoneKpi eyebrow="DURAÇÃO MÉDIA" value={fmtDuration(stats.avg_call_duration_sec)} sub="por chamada" variant="accent" />
        <PhoneKpi eyebrow="MELHOR AGENTE" value={stats.best_agent} sub="hoje" variant="accent" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: 16 }}>
        {/* Agentes humanos */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        }}>
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
            borderBottom: '1px solid #E2E8F0',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>AGENTES HUMANOS</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.012em' }}>
              {PHONE_AGENTS.filter(a => a.status !== 'offline').length}/{PHONE_AGENTS.length} online
            </div>
          </div>
          <div>
            {PHONE_AGENTS.map((a, idx) => {
              const meta = STATUS_META[a.status];
              const StatusIcon = meta.icon;
              const isLast = idx === PHONE_AGENTS.length - 1;
              return (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                  transition: 'background .14s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1ECB9D 0%, #007A5C 100%)',
                    color: '#fff',
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12, fontWeight: 800, flexShrink: 0,
                    boxShadow: '0 4px 10px -2px rgba(0,193,148,0.32)',
                  }}>{a.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{a.name}</div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3,
                      padding: '2px 7px', borderRadius: 999,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                      background: meta.bg, color: meta.color,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      border: `1px solid ${meta.color}33`,
                    }}>
                      <StatusIcon size={9} strokeWidth={2.5} />
                      {meta.label}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 800,
                      color: '#0F172A', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                    }}>{a.calls_today}</div>
                    <div style={{
                      fontSize: 9.5, color: '#007A5C', marginTop: 3,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
                    }}>{a.conversion_rate}% conv</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fila de calls */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        }}>
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
            borderBottom: '1px solid #E2E8F0',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>FILA DE LIGAÇÕES · PRIORIZADA POR IA</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.012em' }}>
              {PHONE_QUEUE.length} clientes aguardando contato humano
            </div>
          </div>
          <div>
            {PHONE_QUEUE.map((call, idx) => (
              <PhoneQueueRow key={call.id} call={call} isLast={idx === PHONE_QUEUE.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}