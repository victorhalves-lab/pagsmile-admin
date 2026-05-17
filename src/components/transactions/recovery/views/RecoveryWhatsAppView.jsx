import React from 'react';
import { MessageSquare, CheckCheck, Eye, Reply, Target, Clock } from 'lucide-react';
import { WHATSAPP_STATS } from '../mocks/recoveryAgentMocks';

function StatRow({ icon: Icon, label, value, pct, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 14px',
      background: 'var(--v8-bg-surface-2)',
      border: '1px solid var(--v8-bd-default)',
      borderRadius: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: color ? `${color}18` : 'var(--v8-bg-surface)',
          color: color || 'var(--v8-fg-muted)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Icon size={14} strokeWidth={1.9} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)' }}>{label}</div>
          <div className="v8-num" style={{ fontSize: 10, color: 'var(--v8-fg-muted)' }}>
            {value} mensagens
          </div>
        </div>
      </div>
      <div className="v8-num" style={{
        fontSize: 18, fontWeight: 700,
        color: color || 'var(--v8-fg-strong)',
        letterSpacing: 'var(--tr-tighter)',
      }}>
        {pct}%
      </div>
    </div>
  );
}

export default function RecoveryWhatsAppView() {
  const s = WHATSAPP_STATS;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16,
    }}>
      {/* Funil WhatsApp */}
      <div className="v8-card" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--pag-mint-50)',
            color: 'var(--pag-mint-700)',
            display: 'grid', placeItems: 'center',
          }}>
            <MessageSquare size={16} />
          </div>
          <div>
            <span className="v8-eyebrow">FUNIL WHATSAPP · 30 DIAS</span>
            <h3 style={{
              fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
              marginTop: 2, margin: 0,
            }}>Entrega → leitura → resposta → conversão</h3>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StatRow icon={MessageSquare} label="Enviadas" value={s.sent_30d} pct={100} color="var(--v8-fg-muted)" />
          <StatRow icon={CheckCheck} label="Entregues" value={s.delivered_30d} pct={s.delivery_rate} color="var(--pag-mint-700)" />
          <StatRow icon={Eye} label="Lidas" value={s.read_30d} pct={s.read_rate} color="var(--pag-mint-700)" />
          <StatRow icon={Reply} label="Respondidas" value={s.replied_30d} pct={s.reply_rate} color="var(--pag-blue-700)" />
          <StatRow icon={Target} label="Convertidas em pagamento" value={s.converted_30d} pct={s.conversion_rate} color="var(--pag-mint-500)" />
        </div>
      </div>

      {/* Insights */}
      <div className="v8-card" style={{ padding: 18 }}>
        <span className="v8-eyebrow">INSIGHTS WHATSAPP</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
          marginTop: 4, marginBottom: 14,
        }}>Janela ótima e comportamento do cliente</h3>

        <div style={{
          padding: 16, marginBottom: 12,
          background: 'var(--grad-hero)',
          border: '1px solid var(--v8-bd-brand)',
          borderRadius: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Clock size={14} style={{ color: 'var(--pag-mint-700)' }} />
            <span className="v8-eyebrow">MELHOR JANELA</span>
          </div>
          <div className="v8-num" style={{
            fontSize: 26, fontWeight: 700,
            color: 'var(--pag-mint-700)',
            letterSpacing: 'var(--tr-tighter)',
          }}>
            {s.best_time_window}
          </div>
          <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)', marginTop: 4 }}>
            Taxa 28% maior do que a média do dia. Agente prioriza envios nesta janela.
          </div>
        </div>

        <div style={{
          padding: '12px 14px',
          background: 'var(--v8-bg-surface-2)',
          border: '1px solid var(--v8-bd-default)',
          borderRadius: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)' }}>
              Tempo médio de resposta
            </span>
            <span className="v8-num" style={{ fontSize: 16, fontWeight: 700, color: 'var(--v8-fg-strong)' }}>
              {s.avg_response_time_min}min
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)' }}>
            Clientes respondem em média em 12 minutos. Segunda mensagem só após 1h.
          </div>
        </div>
      </div>
    </div>
  );
}