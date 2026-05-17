import React, { useState } from 'react';
import {
  MessageSquare, Phone, Mail, Copy, Check, Edit2, Zap, ArrowRight,
  Sparkles, TrendingUp,
} from 'lucide-react';

/**
 * Biblioteca de templates de mensagens da IA Sales Recovery.
 * V8 · cards brancos com header colorido por canal, métrica grande de sucesso,
 * preview da mensagem realista (estilo balão de chat) e ações claras.
 */

const TEMPLATES = [
  {
    id: 'cvv',
    declineReason: 'CVV inválido',
    code: 'N7',
    channel: 'whatsapp',
    successRate: 58,
    title: 'CVV digitado errado',
    body:
      'Olá, {{customer_name}}! Tentamos processar seu pagamento de {{amount}} mas o código de segurança (CVV) do cartão estava incorreto. ' +
      'Os 3 dígitos ficam no verso do cartão. Quer tentar novamente agora? 👉 {{retry_link}}',
    cta: 'Tentar de novo',
  },
  {
    id: 'invalid_card',
    declineReason: 'Dados do cartão inválidos',
    code: '14',
    channel: 'whatsapp',
    successRate: 51,
    title: 'Dados do cartão incorretos',
    body:
      'Oi, {{customer_name}}! Não conseguimos concluir sua compra de {{amount}}. Parece que algum dado do cartão estava errado ' +
      '(número, validade ou nome). Toque aqui para revisar e finalizar: {{retry_link}}',
    cta: 'Corrigir dados',
  },
  {
    id: 'insufficient_funds',
    declineReason: 'Saldo insuficiente',
    code: '51',
    channel: 'whatsapp',
    successRate: 64,
    title: 'Saldo insuficiente, oferecer PIX',
    body:
      'Olá, {{customer_name}}! Seu cartão não tinha limite ou saldo disponível para {{amount}}. ' +
      'Que tal pagar via PIX? É instantâneo e o desconto continua válido. 📲 QR Code aqui: {{pix_qr_link}}',
    cta: 'Pagar com PIX',
    highlight: true,
  },
  {
    id: 'limit_exceeded',
    declineReason: 'Limite do cartão excedido',
    code: '61',
    channel: 'whatsapp',
    successRate: 49,
    title: 'Limite estourou, parcelar ou PIX',
    body:
      '{{customer_name}}, o limite do cartão não foi suficiente. Posso dividir em mais parcelas ou você prefere pagar via PIX à vista? ' +
      'Parcelar: {{installments_link}} · PIX: {{pix_qr_link}}',
    cta: 'Ver opções',
  },
  {
    id: 'issuer_timeout',
    declineReason: 'Timeout do emissor',
    code: '91',
    channel: 'auto_retry',
    successRate: 72,
    title: 'Falha técnica, retry automático',
    body:
      '[Automático] Banco não respondeu a tempo. Repetir transação em 2h pelo roteador alternativo. ' +
      'Cliente não recebe mensagem. Agente apenas reprocessa silenciosamente.',
    cta: 'Reprocessar agora',
  },
  {
    id: 'fraud_block',
    declineReason: 'Bloqueio antifraude',
    code: 'FR',
    channel: 'phone',
    successRate: 38,
    title: 'Ligação humana, antifraude',
    body:
      'Script da ligação: "Olá {{customer_name}}, aqui é da {{merchant_name}}. Detectamos uma compra recusada pelo seu banco por segurança. ' +
      'Você reconhece essa tentativa? Posso te ajudar a finalizar agora?"',
    cta: 'Discar',
  },
  {
    id: 'card_expired',
    declineReason: 'Cartão vencido',
    code: '54',
    channel: 'email',
    successRate: 44,
    title: 'Cartão vencido, usar outro',
    body:
      'Olá, {{customer_name}}. Seu cartão terminado em ****{{last4}} está vencido. ' +
      'Atualize com um cartão novo ou pague via PIX neste link: {{retry_link}}',
    cta: 'Atualizar cartão',
  },
  {
    id: 'not_authorized',
    declineReason: 'Não autorizado pelo emissor',
    code: '05',
    channel: 'whatsapp',
    successRate: 41,
    title: 'Emissor recusou, sugerir outro método',
    body:
      'Oi {{customer_name}}, seu banco não autorizou a compra de {{amount}} (sem motivo específico). ' +
      'Recomendamos tentar outro cartão ou pagar com PIX. Vai cair na hora: {{pix_qr_link}}',
    cta: 'Outro método',
  },
];

const CHANNEL_META = {
  whatsapp: {
    label: 'WhatsApp', icon: MessageSquare,
    accent: '#25D366', accentSoft: '#DCFCE7', accentDark: '#15803D',
    bubbleBg: '#DCFCE7', bubbleColor: '#0F172A',
  },
  phone: {
    label: 'Ligação', icon: Phone,
    accent: '#0EA5E9', accentSoft: '#DBEAFE', accentDark: '#0369A1',
    bubbleBg: '#EFF6FF', bubbleColor: '#0F172A',
  },
  email: {
    label: 'E-mail', icon: Mail,
    accent: '#64748B', accentSoft: '#F1F5F9', accentDark: '#334155',
    bubbleBg: '#F8FAFC', bubbleColor: '#0F172A',
  },
  auto_retry: {
    label: 'Auto-retry', icon: Zap,
    accent: '#B45309', accentSoft: '#FEF3C7', accentDark: '#92400E',
    bubbleBg: '#FEF3C7', bubbleColor: '#451A03',
  },
};

const successColor = (rate) =>
  rate >= 60 ? { bg: '#E0F8F1', color: '#007A5C', bd: '#80E5C6' }
  : rate >= 45 ? { bg: '#FEF3C7', color: '#92400E', bd: '#FDE68A' }
  : { bg: '#FEE2E2', color: '#B91C1C', bd: '#FCA5A5' };

export default function SalesRecoveryTemplates() {
  const [copiedId, setCopiedId] = useState(null);

  const copy = (tpl) => {
    navigator.clipboard?.writeText(tpl.body);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
    }}>
      {/* Header da seção · gradient navy compacto */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        padding: '18px 22px',
        background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
        color: '#fff',
      }}>
        <div style={{
          position: 'absolute', right: -60, top: -60, width: 180, height: 180,
          background: 'radial-gradient(closest-side, rgba(92,247,207,0.18), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #5CF7CF 0%, #00C194 100%)',
            color: '#002443',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 4px 14px rgba(92,247,207,0.32)',
          }}>
            <Sparkles size={17} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#5CF7CF',
            }}>BIBLIOTECA DE TEMPLATES · {TEMPLATES.length} CENÁRIOS</span>
            <h3 style={{
              fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em',
              color: '#fff', margin: '2px 0 0',
            }}>
              Mensagens que a IA envia em cada motivo de recusa
            </h3>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(92,247,207,0.16)',
            color: '#5CF7CF',
            border: '1px solid rgba(92,247,207,0.42)',
            fontSize: 11, fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <TrendingUp size={11} strokeWidth={2.5} />
            Otimizados por IA
          </span>
        </div>
      </div>

      {/* Grid de templates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: 1,
        background: '#E2E8F0',
      }}>
        {TEMPLATES.map((tpl) => {
          const ch = CHANNEL_META[tpl.channel] || CHANNEL_META.whatsapp;
          const ChIcon = ch.icon;
          const sc = successColor(tpl.successRate);

          return (
            <div
              key={tpl.id}
              style={{
                background: '#FFFFFF',
                padding: 16,
                display: 'flex', flexDirection: 'column', gap: 12,
                position: 'relative',
                borderTop: tpl.highlight ? `3px solid ${ch.accent}` : '3px solid transparent',
              }}
            >
              {tpl.highlight && (
                <span style={{
                  position: 'absolute', top: 10, right: 10,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9, fontWeight: 800,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: ch.accentDark,
                  background: ch.accentSoft,
                  padding: '3px 8px', borderRadius: 999,
                  border: `1px solid ${ch.accent}40`,
                }}>★ Top performer</span>
              )}

              {/* Header do card · canal + título */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: ch.accentSoft,
                  color: ch.accentDark,
                  display: 'grid', placeItems: 'center',
                  border: `1px solid ${ch.accent}30`,
                  flexShrink: 0,
                }}>
                  <ChIcon size={17} strokeWidth={2.1} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: ch.accentDark,
                    }}>{ch.label}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 9.5, fontWeight: 700,
                      color: '#64748B',
                      background: '#F1F5F9',
                      padding: '2px 6px', borderRadius: 4,
                      letterSpacing: '0.04em',
                    }}>COD {tpl.code}</span>
                  </div>
                  <h4 style={{
                    fontSize: 14.5, fontWeight: 700,
                    color: '#0F172A', margin: 0,
                    letterSpacing: '-0.015em', lineHeight: 1.25,
                  }}>{tpl.title}</h4>
                  <p style={{
                    fontSize: 11.5, color: '#64748B',
                    margin: '3px 0 0', lineHeight: 1.35,
                  }}>Motivo: {tpl.declineReason}</p>
                </div>
              </div>

              {/* Métrica de sucesso · barra grande */}
              <div style={{
                padding: '10px 12px', borderRadius: 10,
                background: sc.bg,
                border: `1px solid ${sc.bd}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 9.5, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: sc.color,
                  }}>TAXA DE SUCESSO</div>
                  <div style={{
                    height: 5, marginTop: 5,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.6)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${tpl.successRate}%`, height: '100%',
                      background: sc.color,
                      borderRadius: 999,
                      transition: 'width .6s ease',
                    }} />
                  </div>
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 22, fontWeight: 800,
                  fontVariantNumeric: 'tabular-nums',
                  color: sc.color,
                  letterSpacing: '-0.025em',
                  lineHeight: 1,
                }}>
                  {tpl.successRate}<span style={{ fontSize: 13, fontWeight: 600 }}>%</span>
                </div>
              </div>

              {/* Preview balão estilo chat */}
              <div style={{
                background: ch.bubbleBg,
                border: `1px solid ${ch.accent}25`,
                borderRadius: 12,
                padding: '12px 14px',
                position: 'relative',
              }}>
                <p style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: ch.bubbleColor,
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Inter, sans-serif',
                }}>{tpl.body}</p>
              </div>

              {/* Footer · CTA + ações */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                paddingTop: 4,
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 999,
                  background: ch.accentSoft,
                  color: ch.accentDark,
                  border: `1px solid ${ch.accent}30`,
                  fontSize: 11, fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  <ArrowRight size={11} strokeWidth={2.8} />
                  {tpl.cta}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => copy(tpl)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      height: 30, padding: '0 10px',
                      background: copiedId === tpl.id ? '#E0F8F1' : '#FFFFFF',
                      border: `1px solid ${copiedId === tpl.id ? '#80E5C6' : '#E2E8F0'}`,
                      borderRadius: 8,
                      color: copiedId === tpl.id ? '#007A5C' : '#475569',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 11.5, fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all .15s',
                    }}
                  >
                    {copiedId === tpl.id ? (
                      <><Check size={12} strokeWidth={2.5} /> Copiado</>
                    ) : (
                      <><Copy size={12} strokeWidth={2.2} /> Copiar</>
                    )}
                  </button>
                  <button
                    type="button"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      height: 30, padding: '0 10px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0', borderRadius: 8,
                      color: '#475569', fontFamily: 'Inter, sans-serif',
                      fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <Edit2 size={12} strokeWidth={2.2} /> Editar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}