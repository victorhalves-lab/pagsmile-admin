import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ArrowLeft, Loader2, Receipt, Mail, MessageCircle, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function StepReviewAndCharge({ sale, updateSale, onBack, onReset }) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const processSale = async () => {
    setProcessing(true);
    setError(null);
    try {
      // Garante que cliente exista (se for novo, cria)
      let customerId = sale.customer?.id;
      if (sale.customer?.isNew && !customerId) {
        const created = await base44.entities.Customer.create({
          name: sale.customer.name,
          document: sale.customer.document,
          email: sale.customer.email,
          phone: sale.customer.phone,
          address: sale.customer.address,
        });
        customerId = created.id;
      }

      const parentSaleId = `MOTO-${Date.now()}`;
      const txns = [];

      // Cria 1 Transaction por parte de pagamento
      for (let i = 0; i < sale.payments.length; i++) {
        const p = sale.payments[i];
        const tx = await base44.entities.Transaction.create({
          transaction_id: `${parentSaleId}-${i + 1}`,
          subaccount_id: 'merchant_default',
          merchant_name: 'Telemarketing Sale',
          type: 'payment',
          method: p.method === 'card' ? 'credit_card' : p.method === 'pix' ? 'pix' : 'boleto',
          status: p.method === 'pix' || p.method === 'boleto' ? 'pending' : 'approved',
          amount: Number(p.amount),
          currency: 'BRL',
          installments: p.installments || 1,
          capture_method: 'pos',
          customer: {
            id: customerId,
            name: sale.customer.name,
            email: sale.customer.email,
            document: sale.customer.document,
            phone: sale.customer.phone,
          },
          card: p.method === 'card' ? {
            brand: p.brand,
            first6: (p.card_number || '').replace(/\s/g, '').slice(0, 6),
            last4: p.last4,
            holder_name: p.holder_name,
            expiry_month: (p.expiry || '').split('/')[0],
            expiry_year: (p.expiry || '').split('/')[1],
          } : undefined,
          items: sale.items.map((it) => ({
            name: it.name,
            quantity: it.qty,
            unit_price: it.unit_price,
            description: it.sku,
          })),
          metadata: {
            channel: 'phone_sale',
            parent_sale_id: parentSaleId,
            split_index: i + 1,
            split_total: sale.payments.length,
            operator_notes: sale.operator_notes,
            consent_token: sale.consent_token,
            consent_channel: sale.consent_channel,
            consent_sent_at: sale.consent_sent_at,
            consent_confirmed_at: sale.consent_confirmed_at,
          },
        });
        txns.push(tx);
      }

      setResult({ parentSaleId, txns });
    } catch (e) {
      setError(e.message || 'Erro ao processar venda.');
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    return (
      <Card>
        <CardHeader className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-t-xl">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Venda processada com sucesso!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-700">{formatBRL(sale.total)}</div>
            <div className="text-xs text-slate-500 mt-1">ID da venda: <code>{result.parentSaleId}</code></div>
            <div className="text-xs text-slate-500">{result.txns.length} transação(ões) criada(s)</div>
          </div>

          <div className="border rounded-lg divide-y">
            {result.txns.map((tx) => (
              <div key={tx.id} className="p-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-mono text-xs text-slate-600">{tx.transaction_id}</div>
                  <div className="text-xs">{tx.method} · {formatBRL(tx.amount)}</div>
                </div>
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                  tx.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{tx.status}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="text-xs"><MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp</Button>
            <Button variant="outline" className="text-xs"><Mail className="w-3.5 h-3.5 mr-1" /> E-mail</Button>
            <Button variant="outline" className="text-xs"><Receipt className="w-3.5 h-3.5 mr-1" /> Comprovante</Button>
          </div>

          <Button onClick={onReset} className="w-full bg-[#2bc196] hover:bg-[#25a880]">
            <RotateCcw className="w-4 h-4 mr-2" /> Iniciar nova venda
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Etapa 5 · Fechar venda</CardTitle>
        <p className="text-xs text-slate-500">Revise os dados e processe o pagamento.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sale.consent_confirmed_at && (
          <div className="border border-emerald-300 bg-emerald-50 rounded-lg p-3 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-800">
              Compra confirmada pelo cliente em {new Date(sale.consent_confirmed_at).toLocaleString('pt-BR')} via {sale.consent_channel === 'whatsapp' ? 'WhatsApp' : sale.consent_channel === 'sms' ? 'SMS' : 'e-mail'}
            </span>
          </div>
        )}

        <div className="border rounded-lg p-4 space-y-3 bg-slate-50">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Cliente</div>
            <div className="text-sm font-semibold">{sale.customer?.name}</div>
            <div className="text-xs text-slate-600">{sale.customer?.document} · {sale.customer?.phone}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Itens ({sale.items?.length})</div>
            <div className="space-y-0.5 text-sm">
              {sale.items.map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span>{it.qty}× {it.name}</span>
                  <span className="font-mono">{formatBRL(it.qty * it.unit_price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Pagamentos</div>
            <div className="space-y-0.5 text-sm">
              {sale.payments.map((p, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {p.method === 'pix' ? '📱 PIX' : p.method === 'card' ? `💳 Cartão ••${p.last4 || '----'}${p.installments > 1 ? ` (${p.installments}x)` : ''}` : '🧾 Boleto'}
                  </span>
                  <span className="font-mono">{formatBRL(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-2 flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-[#2bc196] font-mono">{formatBRL(sale.total)}</span>
          </div>
        </div>

        <div>
          <Label className="text-xs">Observações (opcional)</Label>
          <Textarea
            value={sale.operator_notes || ''}
            onChange={(e) => updateSale({ operator_notes: e.target.value })}
            placeholder="Ex.: Cliente solicitou entrega expressa…"
            rows={2}
          />
        </div>

        {error && (
          <div className="border border-red-300 bg-red-50 text-red-800 rounded-lg p-3 text-sm">{error}</div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} disabled={processing}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <Button onClick={processSale} disabled={processing} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-base h-12">
            {processing ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processando…</>
            ) : (
              <>✓ Processar venda de {formatBRL(sale.total)}</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}