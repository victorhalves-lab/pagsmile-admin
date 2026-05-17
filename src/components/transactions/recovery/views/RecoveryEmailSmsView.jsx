import React from 'react';
import { Mail, Smartphone } from 'lucide-react';

function ChannelStatsCard({ icon: Icon, title, eyebrow, stats, color }) {
  return (
    <div className="v8-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}18`, color,
          display: 'grid', placeItems: 'center',
        }}>
          <Icon size={16} />
        </div>
        <div>
          <span className="v8-eyebrow" style={{ fontSize: 10 }}>{eyebrow}</span>
          <h3 style={{
            fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
            marginTop: 2, margin: 0,
          }}>{title}</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            padding: '12px 14px',
            background: 'var(--v8-bg-surface-2)',
            border: '1px solid var(--v8-bd-default)',
            borderRadius: 10,
          }}>
            <div className="v8-num" style={{
              fontSize: 20, fontWeight: 700,
              color: s.highlight ? color : 'var(--v8-fg-strong)',
              letterSpacing: 'var(--tr-tighter)',
            }}>{s.value}</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--v8-fg-muted)', fontWeight: 700, marginTop: 4,
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
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16,
    }}>
      <ChannelStatsCard
        icon={Mail}
        title="E-mail · 30 dias"
        eyebrow="CANAL · E-MAIL"
        color="var(--pag-blue-700)"
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
        color="var(--sys-warn)"
        stats={[
          { label: 'Enviados', value: '320' },
          { label: 'Entregues', value: '94%' },
          { label: 'Cliques', value: '12%' },
          { label: 'Conversão', value: '18%', highlight: true },
        ]}
      />

      <div className="v8-card" style={{ padding: 18, gridColumn: '1 / -1' }}>
        <span className="v8-eyebrow">RECOMENDAÇÃO DA IA</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
          marginTop: 4, marginBottom: 10,
        }}>Quando usar E-mail e quando usar SMS</h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: 'var(--v8-fg-default)', lineHeight: 1.8 }}>
          <li><strong>E-mail</strong> é ideal para <strong>cartão vencido</strong> e <strong>3DS falhou</strong> — conteúdo longo, link com atualização de dados.</li>
          <li><strong>SMS</strong> entrega rápido (94%) mas conversão é baixa (18%). Usar apenas como <strong>3ª tentativa</strong> ou cliente sem WhatsApp.</li>
          <li>Custo SMS: R$ 0,08/msg. Custo E-mail: R$ 0,003/msg. Priorizar e-mail sempre que possível.</li>
        </ul>
      </div>
    </div>
  );
}