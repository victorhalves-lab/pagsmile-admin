import React from 'react';
import { MessageSquare, CheckCheck, Eye, Reply, Target, Clock } from 'lucide-react';
import { WHATSAPP_STATS } from '../mocks/recoveryAgentMocks';

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
};

function FunnelRow({ icon: Icon, label, value, pct, color, bg, maxPct }) {
  const widthPct = (pct / 100) * 100;
  return (
    <div style={{
      position: 'relative',
      padding: '14px 16px',
      background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
      border: '1px solid #E2E8F0',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Barra de fundo proporcional */}
      <div style={{
        position: 'absolute', inset: 0,
        width: `${widthPct}%`,
        background: bg,
        opacity: 0.3,
        borderRadius: 12,
      }} />
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: color, color: '#fff',
            display: 'grid', placeItems: 'center',
            boxShadow: `0 4px 10px -2px ${color}66`,
            flexShrink: 0,
          }}>
            <Icon size={16} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.012em' }}>{label}</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#64748B',
              fontVariantNumeric: 'tabular-nums', marginTop: 2,
            }}>
              {value.toLocaleString('pt-BR')} mensagens
            </div>
          </div>
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800,
          color, letterSpacing: '-0.025em',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {pct}%
        </div>
      </div>
    </div>
  );
}

export default function RecoveryWhatsAppView() {
  const s = WHATSAPP_STATS;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16,
    }}>
      {/* Funil */}
      <div style={CARD}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: '#fff',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 6px 16px -4px rgba(37,211,102,0.42)',
            flexShrink: 0,
          }}>
            <MessageSquare size={18} strokeWidth={2} />
          </div>
          <div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>FUNIL WHATSAPP · 30 DIAS</span>
            <h3 style={{
              fontSize: 15, fontWeight: 700, color: '#0F172A',
              marginTop: 4, margin: 0, letterSpacing: '-0.012em',
            }}>Entrega → leitura → resposta → conversão</h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FunnelRow icon={MessageSquare} label="Enviadas" value={s.sent_30d} pct={100} color="#64748B" bg="rgba(100,116,139,0.18)" />
          <FunnelRow icon={CheckCheck} label="Entregues" value={s.delivered_30d} pct={s.delivery_rate} color="#007A5C" bg="rgba(0,193,148,0.18)" />
          <FunnelRow icon={Eye} label="Lidas" value={s.read_30d} pct={s.read_rate} color="#00C194" bg="rgba(0,193,148,0.18)" />
          <FunnelRow icon={Reply} label="Respondidas" value={s.replied_30d} pct={s.reply_rate} color="#002443" bg="rgba(0,36,67,0.18)" />
          <FunnelRow icon={Target} label="Convertidas em pagamento" value={s.converted_30d} pct={s.conversion_rate} color="#15C79A" bg="rgba(21,199,154,0.22)" />
        </div>
      </div>

      {/* Insights */}
      <div style={CARD}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#007A5C',
        }}>INSIGHTS WHATSAPP</span>
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: '#0F172A',
          marginTop: 4, marginBottom: 16, letterSpacing: '-0.012em',
        }}>Janela ótima e comportamento do cliente</h3>

        {/* Hero: Melhor janela */}
        <div style={{
          position: 'relative',
          padding: 18, marginBottom: 12,
          background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
          border: '1px solid rgba(92,247,207,0.22)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -70, top: -70, width: 220, height: 220,
            background: 'radial-gradient(closest-side, rgba(92,247,207,0.22), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Clock size={14} style={{ color: '#5CF7CF' }} strokeWidth={2.2} />
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: '#5CF7CF',
              }}>MELHOR JANELA</span>
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 32, fontWeight: 800,
              color: '#fff', letterSpacing: '-0.025em',
              fontVariantNumeric: 'tabular-nums', lineHeight: 1,
            }}>
              {s.best_time_window}
            </div>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.72)',
              marginTop: 6, lineHeight: 1.5,
            }}>
              Taxa <strong style={{ color: '#5CF7CF', fontFamily: 'JetBrains Mono, monospace' }}>28% maior</strong> do que a média do dia. Agente prioriza envios nesta janela.
            </div>
          </div>
        </div>

        {/* Tempo de resposta */}
        <div style={{
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #E0F8F1 0%, #F4FCF8 100%)',
          border: '1px solid rgba(0,193,148,0.32)',
          borderRadius: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#007A5C',
            }}>TEMPO MÉDIO DE RESPOSTA</span>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800,
              color: '#007A5C', letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}>{s.avg_response_time_min}min</span>
          </div>
          <div style={{ fontSize: 12, color: '#1E293B', lineHeight: 1.5 }}>
            Clientes respondem em média em <strong>12 minutos</strong>. Segunda mensagem só após <strong>1h</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}