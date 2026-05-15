import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Code2, Copy, Download, ArrowDownToLine, ArrowUpFromLine, Webhook, Server,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Request / Response Body — payloads brutos da API: o que o cliente enviou,
 * o que respondemos, os payloads do adquirente e dos webhooks.
 */
export default function ApiPayloadsCard({ transaction }) {
  const [tab, setTab] = useState('request');

  // Payloads simulados/reais
  const requestPayload = {
    amount: Math.round((transaction.amount || 100) * 100),
    currency: transaction.currency || 'BRL',
    payment_method: transaction.method || 'credit_card',
    installments: transaction.installments || 1,
    capture: true,
    customer: {
      name: transaction.customer?.name || transaction.customer_name || 'Cliente',
      email: transaction.customer?.email || transaction.customer_email || 'cliente@exemplo.com',
      document: transaction.customer?.document || transaction.customer_document || '12345678900',
      phone: transaction.customer?.phone || '+5511999999999',
    },
    card: transaction.card ? {
      brand: transaction.card.brand,
      first6: transaction.card.first6,
      last4: transaction.card.last4,
      holder_name: transaction.card.holder_name,
      expiry_month: transaction.card.expiry_month,
      expiry_year: transaction.card.expiry_year,
    } : undefined,
    items: transaction.items || [
      { name: 'Produto Premium', quantity: 1, unit_price: Math.round((transaction.amount || 100) * 100), category: 'digital' },
    ],
    metadata: transaction.metadata || { order_id: transaction.external_id || 'ORD-123456' },
    external_id: transaction.external_id || 'ORD-123456',
  };

  const responsePayload = {
    transaction_id: transaction.transaction_id || 'tx_abc123',
    status: transaction.status || 'approved',
    amount: Math.round((transaction.amount || 100) * 100),
    currency: transaction.currency || 'BRL',
    fee_amount: Math.round((transaction.fee_amount || (transaction.amount || 100) * 0.0349) * 100),
    net_amount: Math.round((transaction.net_amount || (transaction.amount || 100) * 0.9651) * 100),
    created_at: transaction.created_date,
    updated_at: transaction.updated_date,
    acquirer: transaction.acquirer_data || {
      name: 'Cielo',
      nsu: '789456123',
      authorization_code: '123456',
      tid: '1234567890123456789',
      return_code: '00',
    },
    antifraud: transaction.antifraud_data || {
      provider: 'Konduto',
      score: 18,
      recommendation: 'approve',
    },
    three_ds: transaction.three_ds_data || {
      status: 'authenticated',
      version: '2.2.0',
      eci: '05',
    },
    settlement: {
      expected_date: transaction.expected_settle_date || null,
      term: 'D+30',
    },
  };

  const acquirerRawRequest = {
    MerchantOrderId: transaction.external_id || 'ORD-123456',
    Customer: { Name: transaction.customer?.name || 'Cliente', Identity: transaction.customer?.document || '12345678900', IdentityType: 'CPF' },
    Payment: {
      Type: 'CreditCard',
      Amount: Math.round((transaction.amount || 100) * 100),
      Installments: transaction.installments || 1,
      Capture: true,
      Authenticate: true,
      CreditCard: { CardNumber: '4111****1111', Holder: 'CLIENTE TESTE', ExpirationDate: '12/2028', Brand: 'Visa' },
    },
  };

  const acquirerRawResponse = {
    MerchantOrderId: transaction.external_id || 'ORD-123456',
    Payment: {
      ProofOfSale: '789456',
      Tid: '1234567890123456789',
      AuthorizationCode: '123456',
      Status: 2,
      ReturnCode: '00',
      ReturnMessage: 'Operation Successful',
      Amount: Math.round((transaction.amount || 100) * 100),
      Currency: 'BRL',
      Country: 'BRA',
      PaymentId: 'pmt_a1b2c3d4',
      ReceivedDate: transaction.created_date,
    },
  };

  const webhookPayload = {
    event: 'payment.approved',
    api_version: '2024-01-15',
    created_at: transaction.updated_date,
    delivery_id: 'whk_evt_xyz789',
    data: {
      transaction_id: transaction.transaction_id,
      status: 'approved',
      amount: Math.round((transaction.amount || 100) * 100),
      external_id: transaction.external_id || 'ORD-123456',
    },
  };

  const copyJson = (obj, label) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    toast.success(`${label} copiado`);
  };

  const downloadJson = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const payloads = {
    request: { data: requestPayload, label: 'Request do Cliente', icon: ArrowDownToLine, color: 'text-blue-600 bg-blue-50' },
    response: { data: responsePayload, label: 'Response PagSmile', icon: ArrowUpFromLine, color: 'text-emerald-600 bg-emerald-50' },
    acquirer_req: { data: acquirerRawRequest, label: 'Request Adquirente', icon: Server, color: 'text-indigo-600 bg-indigo-50' },
    acquirer_res: { data: acquirerRawResponse, label: 'Response Adquirente', icon: Server, color: 'text-violet-600 bg-violet-50' },
    webhook: { data: webhookPayload, label: 'Webhook enviado', icon: Webhook, color: 'text-cyan-600 bg-cyan-50' },
  };

  const current = payloads[tab];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <Code2 className="w-4 h-4 text-slate-500" />
            API · Request / Response
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => copyJson(current.data, current.label)}
            >
              <Copy className="w-3 h-3 mr-1" /> Copiar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => downloadJson(current.data, `${tab}-${transaction.transaction_id || 'tx'}.json`)}
            >
              <Download className="w-3 h-3 mr-1" /> Baixar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-5 w-full h-auto">
            {Object.entries(payloads).map(([k, p]) => {
              const Icon = p.icon;
              return (
                <TabsTrigger key={k} value={k} className="text-[10px] py-1.5 px-1 flex flex-col gap-0.5 h-auto data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline truncate">{p.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={tab} className="mt-3">
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className={`w-7 h-7 rounded-md flex items-center justify-center ${current.color}`}>
                <current.icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{current.label}</p>
                <p className="text-[10px] text-slate-500 font-mono">application/json · UTF-8</p>
              </div>
              <Badge variant="outline" className="ml-auto text-[10px]">
                {Object.keys(current.data).length} campos
              </Badge>
            </div>
            <pre className="text-[11px] font-mono bg-slate-900 text-emerald-300 p-4 rounded-lg overflow-auto max-h-[500px] leading-relaxed">
{JSON.stringify(current.data, null, 2)}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}