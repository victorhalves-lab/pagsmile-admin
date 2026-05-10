import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, MessageCircle, Mail, Copy, RefreshCw, CheckCircle2, Clock, ArrowLeft, Send } from 'lucide-react';

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const buildConsentMessage = (sale, link) => {
  const itemsTxt = (sale.items || [])
    .map((it) => `• ${it.qty}x ${it.name} — ${formatBRL(it.qty * it.unit_price)}`)
    .join('\n');
  const paymentsTxt = (sale.payments || [])
    .map((p) => {
      if (p.method === 'pix') return `• PIX — ${formatBRL(p.amount)}`;
      if (p.method === 'card') return `• Cartão final ${p.last4 || '••••'} (${p.installments || 1}x) — ${formatBRL(p.amount)}`;
      if (p.method === 'boleto') return `• Boleto — ${formatBRL(p.amount)}`;
      return `• ${p.method} — ${formatBRL(p.amount)}`;
    })
    .join('\n');

  return [
    `Olá ${sale.customer?.name?.split(' ')[0] || ''}, segue o resumo da sua compra:`,
    '',
    '🛍️ Itens:',
    itemsTxt || '—',
    '',
    '💳 Pagamento:',
    paymentsTxt || '—',
    '',
    `💰 Total: ${formatBRL(sale.total)}`,
    '',
    'Confirme a compra clicando no link abaixo:',
    link,
    '',
    'Esse link é seguro e confirma que você autoriza a cobrança.',
  ].join('\n');
};

export default function StepConsentLink({ sale, updateSale, onNext, onBack }) {
  const [link, setLink] = useState(sale.consent_link || '');
  const [token, setToken] = useState(sale.consent_token || '');
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(!!sale.consent_confirmed_at);
  const [waiting, setWaiting] = useState(!!sale.consent_sent_at && !sale.consent_confirmed_at);

  // Gera o link/token na primeira render
  useEffect(() => {
    if (!token) {
      const t = `CNS-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      const l = `${window.location.origin}/confirm/${t}`;
      setToken(t);
      setLink(l);
      updateSale({ consent_token: t, consent_link: l });
    }
    // eslint-disable-next-line
  }, []);

  const phoneDigits = (sale.customer?.phone || '').replace(/\D/g, '');
  const message = buildConsentMessage(sale, link);
  const waLink = `https://wa.me/55${phoneDigits}?text=${encodeURIComponent(message)}`;

  const handleSendWhatsApp = () => {
    window.open(waLink, '_blank');
    const now = new Date().toISOString();
    updateSale({ consent_sent_at: now, consent_channel: 'whatsapp' });
    setWaiting(true);
  };

  const handleSendEmail = () => {
    if (!sale.customer?.email) return;
    setSending(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      updateSale({ consent_sent_at: now, consent_channel: 'email' });
      setWaiting(true);
      setSending(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  const handleResend = () => {
    setConfirmed(false);
    setWaiting(false);
    updateSale({ consent_sent_at: null, consent_confirmed_at: null });
  };

  // Simula confirmação do cliente (em prod virá via webhook/realtime)
  const handleSimulateConfirm = () => {
    const now = new Date().toISOString();
    updateSale({ consent_confirmed_at: now });
    setConfirmed(true);
    setWaiting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="w-4 h-4 text-[#2bc196]" /> Etapa 4 · Confirmação do Cliente
        </CardTitle>
        <p className="text-xs text-slate-500">
          Envie um link de confirmação para o cliente. Ele revisa o resumo e autoriza a compra antes do processamento.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Link gerado */}
        <div>
          <Label className="text-xs">Link de confirmação</Label>
          <div className="flex gap-2 mt-1">
            <Input value={link} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={handleCopy} title="Copiar link">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Token: <code>{token}</code> · expira em 30 minutos</p>
        </div>

        {/* Canais de envio */}
        {!confirmed && (
          <div className="border rounded-lg p-4 bg-slate-50 space-y-3">
            <h4 className="text-sm font-bold text-slate-700">Enviar para o cliente</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                onClick={handleSendWhatsApp}
                disabled={!phoneDigits}
                className="bg-emerald-600 hover:bg-emerald-700 h-12"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Enviar via WhatsApp
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={!sale.customer?.email || sending}
                variant="outline"
                className="h-12"
              >
                <Mail className="w-4 h-4 mr-2" />
                {sending ? 'Enviando…' : 'Enviar por e-mail'}
              </Button>
            </div>

            <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4">
              <span>📞 {sale.customer?.phone || '—'}</span>
              <span>✉️ {sale.customer?.email || '—'}</span>
            </div>
          </div>
        )}

        {/* Aguardando confirmação */}
        {waiting && !confirmed && (
          <div className="border-2 border-amber-300 bg-amber-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1">
                <div className="font-semibold text-amber-900 text-sm">Aguardando confirmação do cliente…</div>
                <p className="text-xs text-amber-800 mt-1">
                  Link enviado via {sale.consent_channel === 'whatsapp' ? 'WhatsApp' : 'e-mail'}. O status atualiza automaticamente quando o cliente confirma.
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={handleResend}>
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reenviar
              </Button>
              <Button size="sm" variant="ghost" onClick={handleSimulateConfirm} className="text-xs text-slate-500">
                (Simular confirmação — apenas teste)
              </Button>
            </div>
          </div>
        )}

        {/* Confirmado */}
        {confirmed && (
          <div className="border-2 border-emerald-300 bg-emerald-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-emerald-900 text-sm">Cliente confirmou a compra ✓</div>
                <p className="text-xs text-emerald-800 mt-1">
                  Confirmado em {sale.consent_confirmed_at && new Date(sale.consent_confirmed_at).toLocaleString('pt-BR')} · canal: {sale.consent_channel === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <Button
            onClick={onNext}
            disabled={!confirmed}
            className="flex-1 bg-[#2bc196] hover:bg-[#25a880]"
          >
            <Send className="w-4 h-4 mr-1" /> Prosseguir para cobrança →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}