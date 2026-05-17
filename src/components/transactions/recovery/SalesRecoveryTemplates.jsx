import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, Copy, Check, Edit2, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Biblioteca de templates de mensagens da IA Sales Recovery.
 * Mostra exatamente o que o agente envia em cada cenário de recusa.
 * V7: cards brancos, ícones slate, accent emerald sutil.
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
  whatsapp: { label: 'WhatsApp', icon: MessageSquare, accent: 'text-emerald-700 dark:text-emerald-400' },
  phone: { label: 'Ligação', icon: Phone, accent: 'text-sky-700 dark:text-sky-400' },
  email: { label: 'E-mail', icon: Mail, accent: 'text-slate-700 dark:text-slate-300' },
  auto_retry: { label: 'Auto-retry', icon: Zap, accent: 'text-amber-700 dark:text-amber-400' },
};

export default function SalesRecoveryTemplates() {
  const [copiedId, setCopiedId] = useState(null);

  const copy = (tpl) => {
    navigator.clipboard?.writeText(tpl.body);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-v7-card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-300" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Templates do Sales Recovery
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 mt-0.5">
              Mensagens que a IA envia · WhatsApp · ligação · e-mail · auto retry
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800">
        {TEMPLATES.map((tpl) => {
          const ch = CHANNEL_META[tpl.channel] || CHANNEL_META.whatsapp;
          const ChIcon = ch.icon;
          return (
            <div
              key={tpl.id}
              className={cn(
                'bg-white dark:bg-slate-900 p-4 flex flex-col gap-3',
                tpl.highlight && 'ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/30'
              )}
            >
              {/* Cabeçalho do template */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ChIcon className={cn('w-3.5 h-3.5', ch.accent)} strokeWidth={1.75} />
                    <span className={cn('font-mono text-[10px] uppercase tracking-[0.12em] font-medium', ch.accent)}>
                      {ch.label}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">·</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
                      cod {tpl.code}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {tpl.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Motivo: {tpl.declineReason}</p>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 font-mono text-[10px] tabular-nums font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap',
                    tpl.successRate >= 60
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
                      : tpl.successRate >= 45
                      ? 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'
                      : 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  )}
                >
                  {tpl.successRate}% sucesso
                </span>
              </div>

              {/* Corpo do template (preview) */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                <p className="text-[12px] leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {tpl.body}
                </p>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-[0.1em] gap-1 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                  {tpl.cta}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-slate-500 hover:text-slate-700"
                    onClick={() => copy(tpl)}
                  >
                    {copiedId === tpl.id ? (
                      <>
                        <Check className="w-3 h-3 mr-1" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" /> Copiar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-slate-500 hover:text-slate-700"
                  >
                    <Edit2 className="w-3 h-3 mr-1" /> Editar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}