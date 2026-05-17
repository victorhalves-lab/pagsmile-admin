import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Phone, Mail, Zap, Smartphone, Save, Beaker } from 'lucide-react';

const CHANNEL_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'sms', label: 'SMS', icon: Smartphone },
  { id: 'email', label: 'E-mail', icon: Mail },
  { id: 'phone', label: 'Ligação', icon: Phone },
  { id: 'auto_retry', label: 'Auto-retry', icon: Zap },
];

const TEMPLATE_BODIES = {
  cvv_invalid: 'Olá, {{customer_name}}! Tentamos processar seu pagamento de {{amount}} mas o código de segurança (CVV) do cartão estava incorreto. Os 3 dígitos ficam no verso do cartão. Quer tentar novamente agora? 👉 {{retry_link}}',
  invalid_card_data: 'Oi, {{customer_name}}! Não conseguimos concluir sua compra de {{amount}}. Parece que algum dado do cartão estava errado (número, validade ou nome). Toque aqui para revisar e finalizar: {{retry_link}}',
  cardholder_name_mismatch: '{{customer_name}}, o nome digitado no checkout não bate com o impresso no cartão. Confirme exatamente como está no plástico: {{retry_link}}',
  insufficient_funds: 'Olá, {{customer_name}}! Seu cartão não tinha limite ou saldo disponível para {{amount}}. Que tal pagar via PIX? É instantâneo e o desconto continua válido. 📲 QR Code aqui: {{pix_qr_link}}',
  limit_exceeded: '{{customer_name}}, o limite do cartão não foi suficiente. Posso dividir em mais parcelas ou você prefere pagar via PIX à vista? Parcelar: {{installments_link}} · PIX: {{pix_qr_link}}',
  card_expired: 'Olá, {{customer_name}}. Seu cartão terminado em ****{{last4}} está vencido. Atualize com um cartão novo ou pague via PIX neste link: {{retry_link}}',
  issuer_timeout: '[Automático] Banco não respondeu a tempo. Repetir transação em 2h pelo roteador alternativo. Cliente NÃO recebe mensagem.',
  not_authorized: 'Oi {{customer_name}}, seu banco não autorizou a compra de {{amount}} (sem motivo específico). Recomendamos tentar outro cartão ou pagar com PIX. Vai cair na hora: {{pix_qr_link}}',
  fraud_block: 'Script da ligação: "Olá {{customer_name}}, aqui é da {{merchant_name}}. Detectamos uma compra recusada pelo seu banco por segurança. Você reconhece essa tentativa? Posso te ajudar a finalizar agora?"',
  lost_stolen: 'Oi {{customer_name}}, sua tentativa de pagamento foi recusada. O cartão pode estar marcado como perdido. Recomendamos PIX para finalizar com segurança: {{pix_qr_link}}',
  '3ds_failed': '{{customer_name}}, a autenticação 3D Secure do seu cartão falhou. Tente novamente ou use PIX (sem etapa de autenticação): {{pix_qr_link}}',
};

export default function DeclineReasonDrawer({ reason, onClose }) {
  const [body, setBody] = useState('');
  const [cadence, setCadence] = useState([]);
  const [pixFallback, setPixFallback] = useState(false);
  const [installmentsFallback, setInstallmentsFallback] = useState(false);
  const [phoneEnabled, setPhoneEnabled] = useState(false);

  useEffect(() => {
    if (!reason) return;
    setBody(TEMPLATE_BODIES[reason.id] || '');
    setCadence(reason.cadence || []);
    setPixFallback(reason.pix_fallback);
    setInstallmentsFallback(reason.installments_fallback);
    setPhoneEnabled(reason.phone_call_enabled);
  }, [reason]);

  if (!reason) return null;

  const updateStep = (idx, patch) => {
    setCadence(prev => prev.map((s, i) => i === idx ? { ...s, ...patch } : s));
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)',
          zIndex: 9990, backdropFilter: 'blur(2px)',
        }}
      />
      <div
        data-ds="v8"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 560, maxWidth: '94vw', zIndex: 9991,
          background: 'var(--v8-bg-surface)',
          boxShadow: 'var(--sh-2xl)',
          display: 'flex', flexDirection: 'column',
          animation: 'v8-drawer-in 0.3s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--v8-bd-default)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <code style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700,
                color: 'var(--v8-fg-strong)',
                background: 'var(--v8-bg-surface-2)',
                padding: '2px 8px', borderRadius: 6,
                border: '1px solid var(--v8-bd-default)',
              }}>{reason.code}</code>
              <span className="v8-eyebrow">EDITAR REGRA DE RECUPERAÇÃO</span>
            </div>
            <h2 style={{
              fontSize: 19, fontWeight: 700, letterSpacing: 'var(--tr-tight)',
              color: 'var(--v8-fg-strong)', margin: 0,
            }}>{reason.label}</h2>
            <p style={{ fontSize: 12, color: 'var(--v8-fg-muted)', marginTop: 4, margin: 0 }}>
              {reason.volume_30d} recusas nos últimos 30 dias · taxa atual de recuperação{' '}
              <strong style={{ color: 'var(--v8-fg-success)' }}>{reason.recovery_rate}%</strong>
            </p>
          </div>
          <button
            type="button" onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'transparent', border: '1px solid var(--v8-bd-default)',
              cursor: 'pointer', display: 'grid', placeItems: 'center',
              color: 'var(--v8-fg-muted)', flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px' }}>
          {/* Mensagem */}
          <section style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 13, fontWeight: 700, letterSpacing: 'var(--tr-tight)',
              color: 'var(--v8-fg-strong)', marginBottom: 8, margin: 0,
            }}>Mensagem enviada ao cliente</h3>
            <p style={{ fontSize: 11, color: 'var(--v8-fg-muted)', marginBottom: 10, marginTop: 4 }}>
              Variáveis: <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{'{{customer_name}}'}</code>{' '}
              <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{'{{amount}}'}</code>{' '}
              <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{'{{retry_link}}'}</code>{' '}
              <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{'{{pix_qr_link}}'}</code>
            </p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              style={{
                width: '100%', padding: 12,
                background: 'var(--v8-bg-surface-2)',
                border: '1px solid var(--v8-bd-default)',
                borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: 12,
                color: 'var(--v8-fg-strong)', resize: 'vertical', outline: 'none',
                lineHeight: 1.5,
              }}
            />
          </section>

          {/* Cadência */}
          <section style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 13, fontWeight: 700, letterSpacing: 'var(--tr-tight)',
              color: 'var(--v8-fg-strong)', marginBottom: 10, margin: 0,
            }}>Cadência de tentativas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cadence.map((step, idx) => {
                const ChMeta = CHANNEL_OPTIONS.find(c => c.id === step.channel) || CHANNEL_OPTIONS[0];
                const ChIcon = ChMeta.icon;
                return (
                  <div key={idx} style={{
                    display: 'grid',
                    gridTemplateColumns: '24px 90px 1fr 60px',
                    gap: 10, alignItems: 'center',
                    padding: '10px 12px',
                    background: 'var(--v8-bg-surface-2)',
                    border: '1px solid var(--v8-bd-default)',
                    borderRadius: 10,
                  }}>
                    <span className="v8-num" style={{
                      fontSize: 13, fontWeight: 700, color: 'var(--pag-mint-700)',
                    }}>#{step.step}</span>
                    <input
                      type="text"
                      value={step.when}
                      onChange={(e) => updateStep(idx, { when: e.target.value })}
                      style={{
                        height: 30, padding: '0 10px', borderRadius: 6,
                        background: 'var(--v8-bg-surface)',
                        border: '1px solid var(--v8-bd-default)',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                        color: 'var(--v8-fg-strong)', outline: 'none',
                      }}
                    />
                    <select
                      value={step.channel}
                      onChange={(e) => updateStep(idx, { channel: e.target.value })}
                      style={{
                        height: 30, padding: '0 10px', borderRadius: 6,
                        background: 'var(--v8-bg-surface)',
                        border: '1px solid var(--v8-bd-default)',
                        fontFamily: 'Inter, sans-serif', fontSize: 12,
                        color: 'var(--v8-fg-strong)', outline: 'none', cursor: 'pointer',
                      }}
                    >
                      {CHANNEL_OPTIONS.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={step.enabled}
                        onChange={(e) => updateStep(idx, { enabled: e.target.checked })}
                        style={{ width: 14, height: 14, accentColor: 'var(--pag-mint-500)' }}
                      />
                      <span style={{ fontSize: 11, color: 'var(--v8-fg-muted)' }}>ativo</span>
                    </label>
                    {/* eslint-disable-next-line no-unused-vars */}
                    {ChIcon && null}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Fallbacks */}
          <section style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 13, fontWeight: 700, letterSpacing: 'var(--tr-tight)',
              color: 'var(--v8-fg-strong)', marginBottom: 10, margin: 0,
            }}>Alternativas oferecidas ao cliente</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <ToggleRow
                label="Oferecer PIX como fallback"
                desc="Quando recusa for por saldo/limite/dado errado, sugerir PIX no link"
                checked={pixFallback}
                onChange={setPixFallback}
              />
              <ToggleRow
                label="Oferecer parcelamento adicional"
                desc="Sugerir parcelar em mais vezes quando o limite estourar"
                checked={installmentsFallback}
                onChange={setInstallmentsFallback}
              />
              <ToggleRow
                label="Acionar agente humano (telefone)"
                desc="Após N tentativas sem resposta, enviar para fila de calls"
                checked={phoneEnabled}
                onChange={setPhoneEnabled}
              />
            </div>
          </section>

          {/* A/B */}
          <section style={{
            padding: 14,
            background: 'var(--pag-mint-50)',
            border: '1px solid var(--v8-bd-brand)',
            borderRadius: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'var(--pag-mint-500)', color: '#fff',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Beaker size={15} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--v8-fg-strong)',
                }}>Sugestão da IA</div>
                <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)', marginTop: 2 }}>
                  Variante B com tom mais informal aumentou conversão em 8pp para este motivo. Quer testar?
                </div>
              </div>
              <button
                type="button"
                style={{
                  height: 28, padding: '0 12px', borderRadius: 8,
                  background: 'var(--pag-mint-500)', color: '#fff',
                  border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Iniciar A/B
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid var(--v8-bd-default)',
          background: 'var(--v8-bg-surface-2)',
          display: 'flex', gap: 10, justifyContent: 'flex-end',
        }}>
          <button
            type="button" onClick={onClose}
            style={{
              height: 36, padding: '0 16px', borderRadius: 10,
              background: 'transparent', border: '1px solid var(--v8-bd-default)',
              color: 'var(--v8-fg-strong)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 36, padding: '0 18px', borderRadius: 10,
              background: 'var(--grad-brand)', color: '#fff',
              border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: 'var(--sh-brand)',
            }}
          >
            <Save size={14} />
            Salvar regra
          </button>
        </div>
      </div>

      <style>{`
        @keyframes v8-drawer-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px',
      background: 'var(--v8-bg-surface-2)',
      border: '1px solid var(--v8-bd-default)',
      borderRadius: 10, cursor: 'pointer',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: 'var(--pag-mint-500)', flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)' }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)', marginTop: 2 }}>{desc}</div>
      </div>
    </label>
  );
}