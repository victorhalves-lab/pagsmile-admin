import React from 'react';
import { Mail, Smartphone, Sparkles, DollarSign } from 'lucide-react';

function ChannelStatsCard({ icon: Icon, title, eyebrow, stats, gradient, accentColor }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      padding: 20,
      boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: gradient,
          color: '#fff',
          display: 'grid', placeItems: 'center',
          boxShadow: `0 6px 16px -4px ${accentColor}66`,
          flexShrink: 0,
        }}>
          <Icon size={18} strokeWidth={2} />
        </div>
        <div>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: accentColor,
          }}>{eyebrow}</span>
          <h3 style={{
            fontSize: 15, fontWeight: 700, color: '#0F172A',
            marginTop: 4, margin: 0, letterSpacing: '-0.012em',
          }}>{title}</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            padding: '14px 16px',
            background: s.highlight
              ? gradient
              : 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
            border: s.highlight ? '1px solid transparent' : '1px solid #E2E8F0',
            borderRadius: 12,
            color: s.highlight ? '#fff' : '#0F172A',
            boxShadow: s.highlight ? `0 6px 16px -4px ${accentColor}66` : 'none',
          }}>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 800,
              color: s.highlight ? '#fff' : '#0F172A',
              letterSpacing: '-0.025em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}>{s.value}</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.14em',
              color: s.highlight ? 'rgba(255,255,255,0.82)' : '#64748B',
              marginTop: 6,
            }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecoveryEmailSmsView() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16,
    }}>
      <ChannelStatsCard
        icon={Mail}
        title="E-mail · 30 dias"
        eyebrow="CANAL · E-MAIL"
        gradient="linear-gradient(135deg, #013766 0%, #002443 100%)"
        accentColor="#002443"
        stats={[
          { label: 'Enviados', value: '890' },
          { label: 'Abertos', value: '52%' },
          { label: 'Cliques', value: '18%' },
          { label: 'Conversão', value: '28%', highlight: true },
        ]}
      />
      <ChannelStatsCard
        icon={Smartphone}
        title="SMS · 30 dias"
        eyebrow="CANAL · SMS"
        gradient="linear-gradient(135deg, #D97706 0%, #92400E 100%)"
        accentColor="#B45309"
        stats={[
          { label: 'Enviados', value: '320' },
          { label: 'Entregues', value: '94%' },
          { label: 'Cliques', value: '12%' },
          { label: 'Conversão', value: '18%', highlight: true },
        ]}
      />

      {/* Recomendação IA */}
      <div style={{
        gridColumn: '1 / -1',
        position: 'relative',
        padding: 20,
        background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
        border: '1px solid rgba(92,247,207,0.22)',
        borderRadius: 16,
        overflow: 'hidden',
        color: '#fff',
      }}>
        <div style={{
          position: 'absolute', right: -90, top: -90, width: 280, height: 280,
          background: 'radial-gradient(closest-side, rgba(92,247,207,0.22), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #5CF7CF 0%, #00C194 100%)',
              color: '#002443',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 8px 20px -4px rgba(92,247,207,0.45)',
              flexShrink: 0,
            }}>
              <Sparkles size={18} strokeWidth={2.2} />
            </div>
            <div>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: '#5CF7CF',
              }}>RECOMENDAÇÃO DA IA</span>
              <h3 style={{
                fontSize: 16, fontWeight: 800, color: '#fff',
                marginTop: 4, margin: 0, letterSpacing: '-0.018em',
                lineHeight: 1.3,
              }}>Quando usar E-mail e quando usar SMS</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <RecommendationItem
              icon={Mail} accent="#5CF7CF"
              text={<><strong style={{ color: '#fff' }}>E-mail</strong> é ideal para <strong style={{ color: '#5CF7CF' }}>cartão vencido</strong> e <strong style={{ color: '#5CF7CF' }}>3DS falhou</strong> — conteúdo longo, link com atualização de dados.</>}
            />
            <RecommendationItem
              icon={Smartphone} accent="#F59E0B"
              text={<><strong style={{ color: '#fff' }}>SMS</strong> entrega rápido (<strong style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono, monospace' }}>94%</strong>) mas conversão é baixa (<strong style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono, monospace' }}>18%</strong>). Usar apenas como <strong>3ª tentativa</strong> ou cliente sem WhatsApp.</>}
            />
            <RecommendationItem
              icon={DollarSign} accent="#5CF7CF"
              text={<>Custo SMS: <strong style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>R$ 0,08/msg</strong>. Custo E-mail: <strong style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>R$ 0,003/msg</strong>. Priorizar e-mail sempre que possível.</>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendationItem({ icon: Icon, accent, text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 14px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: `${accent}22`, color: accent,
        display: 'grid', placeItems: 'center',
        flexShrink: 0,
      }}>
        <Icon size={14} strokeWidth={2} />
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.55 }}>
        {text}
      </div>
    </div>
  );
}