import React from 'react';
import { MessageSquare, Phone, Mail, Zap, RefreshCw, Send, User } from 'lucide-react';
import { LIVE_QUEUE, DECLINE_REASONS } from '../mocks/recoveryAgentMocks';

const CHANNEL_META = {
  whatsapp:   { icon: MessageSquare, label: 'WhatsApp', bg: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' },
  phone:      { icon: Phone,         label: 'Telefone', bg: 'linear-gradient(135deg, #002443 0%, #001124 100%)' },
  email:      { icon: Mail,          label: 'E-mail',   bg: 'linear-gradient(135deg, #013766 0%, #002443 100%)' },
  auto_retry: { icon: Zap,           label: 'Auto-retry', bg: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)' },
};

const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v || 0);

export default function RecoveryLiveQueueView() {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#007A5C',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#00C194',
              boxShadow: '0 0 0 3px rgba(0,193,148,0.18)',
              animation: 'rq-pulse 1.6s ease-in-out infinite',
            }} />
            FILA AO VIVO · {LIVE_QUEUE.length} TRANSAÇÕES
          </div>
          <div style={{
            fontSize: 15, fontWeight: 700, color: '#0F172A',
            marginTop: 4, letterSpacing: '-0.012em',
          }}>
            Transações em recuperação agora
          </div>
        </div>
        <button type="button" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 34, padding: '0 14px', borderRadius: 10,
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          fontSize: 12, fontWeight: 700, color: '#0F172A',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          transition: 'border-color .14s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00C194'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          <RefreshCw size={13} strokeWidth={2} />
          Atualizar
        </button>
      </div>

      {/* Lista */}
      <div>
        {LIVE_QUEUE.map((item, idx) => {
          const reason = DECLINE_REASONS.find(r => r.id === item.reason);
          const ch = CHANNEL_META[item.channel] || CHANNEL_META.whatsapp;
          const ChIcon = ch.icon;
          const isLast = idx === LIVE_QUEUE.length - 1;
          const probColor = item.prob >= 60 ? '#007A5C' : item.prob >= 40 ? '#B45309' : '#B91C1C';
          const probBg = item.prob >= 60 ? '#E0F8F1' : item.prob >= 40 ? '#FEF3C7' : '#FEE2E2';

          return (
            <div key={item.id} style={{
              display: 'grid',
              gridTemplateColumns: '40px minmax(160px, 1.2fr) 120px minmax(180px, 1.5fr) 130px 130px auto',
              gap: 14, alignItems: 'center',
              padding: '14px 18px',
              borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
              transition: 'background .14s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #E0F8F1 0%, #C5F3E0 100%)',
                color: '#007A5C',
                display: 'grid', placeItems: 'center',
                flexShrink: 0,
                border: '1px solid rgba(0,193,148,0.22)',
              }}>
                <User size={17} strokeWidth={1.9} />
              </div>

              {/* Cliente + valor */}
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13.5, fontWeight: 700, color: '#0F172A',
                  letterSpacing: '-0.01em',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{item.customer}</div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 800,
                  color: '#0F172A', marginTop: 2,
                  fontVariantNumeric: 'tabular-nums',
                }}>{fmtBRL(item.amount)}</div>
              </div>

              {/* Motivo */}
              <div style={{ minWidth: 0 }}>
                <code style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                  color: '#475569', background: '#F1F5F9',
                  padding: '2px 6px', borderRadius: 4,
                  letterSpacing: '0.04em',
                }}>{item.code}</code>
                <div style={{
                  fontSize: 11.5, color: '#475569', marginTop: 4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {reason?.label || item.reason}
                </div>
              </div>

              {/* Canal + tentativa */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: ch.bg, color: '#fff',
                  display: 'grid', placeItems: 'center',
                  boxShadow: '0 3px 8px -2px rgba(0,0,0,0.2)',
                  flexShrink: 0,
                }}>
                  <ChIcon size={14} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{ch.label}</div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#64748B',
                    textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
                  }}>tentativa #{item.step}</div>
                </div>
              </div>

              {/* Probabilidade */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{
                    flex: 1, height: 6, borderRadius: 999,
                    background: '#F1F5F9', overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${item.prob}%`, height: '100%',
                      background: item.prob >= 60
                        ? 'linear-gradient(90deg, #1ECB9D 0%, #007A5C 100%)'
                        : item.prob >= 40
                          ? 'linear-gradient(90deg, #F59E0B 0%, #B45309 100%)'
                          : 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)',
                      borderRadius: 999,
                    }} />
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 800,
                    color: probColor, fontVariantNumeric: 'tabular-nums',
                  }}>{item.prob}%</span>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '2px 7px', borderRadius: 999,
                  background: probBg, color: probColor,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>{item.prob >= 60 ? 'Alta' : item.prob >= 40 ? 'Média' : 'Baixa'}</div>
              </div>

              {/* ETA */}
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                color: '#64748B', fontWeight: 600,
              }}>
                <div style={{
                  fontSize: 9, color: '#94A3B8', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2,
                }}>ETA</div>
                {item.eta}
              </div>

              {/* Ação */}
              <button type="button" style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)',
                color: '#fff', border: '1px solid #009E78',
                cursor: 'pointer',
                display: 'grid', placeItems: 'center',
                boxShadow: '0 3px 8px -2px rgba(0,193,148,0.4)',
              }}>
                <Send size={13} strokeWidth={2.2} />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes rq-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}