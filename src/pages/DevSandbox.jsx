import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Server, Zap, Copy, RefreshCw, CreditCard, QrCode, Webhook as WebhookIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const TEST_CARDS = [
  { brand: 'Visa', number: '4111 1111 1111 1111', cvv: '123', exp: '12/2030', behavior: 'Aprova', cls: 'bg-emerald-100 text-emerald-700' },
  { brand: 'Mastercard', number: '5555 5555 5555 4444', cvv: '321', exp: '12/2030', behavior: 'Aprova', cls: 'bg-emerald-100 text-emerald-700' },
  { brand: 'Visa', number: '4000 0000 0000 0002', cvv: '123', exp: '12/2030', behavior: 'Recusa (genérico)', cls: 'bg-red-100 text-red-700' },
  { brand: 'Visa', number: '4000 0000 0000 9995', cvv: '123', exp: '12/2030', behavior: 'Saldo insuficiente', cls: 'bg-amber-100 text-amber-700' },
  { brand: 'Visa', number: '4000 0000 0000 3220', cvv: '123', exp: '12/2030', behavior: 'Requer 3DS', cls: 'bg-blue-100 text-blue-700' },
  { brand: 'Amex', number: '3782 822463 10005', cvv: '1234', exp: '12/2030', behavior: 'Aprova', cls: 'bg-emerald-100 text-emerald-700' },
];

const TEST_DOCS = [
  { type: 'CPF', value: '111.444.777-35', behavior: 'Válido' },
  { type: 'CPF', value: '000.000.000-00', behavior: 'Inválido' },
  { type: 'CNPJ', value: '12.345.678/0001-95', behavior: 'Válido' },
];

export default function DevSandbox() {
  const copy = (text) => { navigator.clipboard.writeText(text); toast.success('Copiado!'); };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sandbox"
        subtitle="Ambiente de testes seguro · espelha 100% do produção · sem cobranças reais"
        icon={Server}
        breadcrumbs={[{ label: 'Developer Hub', page: 'Developers' }, { label: 'Sandbox' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1" /> Reset dados</Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]"><Zap className="w-4 h-4 mr-1" /> Gerar dados sintéticos</Button>
          </div>
        }
      />

      {/* Status banner */}
      <div className="rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-500/10 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-200 dark:bg-blue-500/20 flex items-center justify-center">
          <Server className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Você está no Sandbox</p>
          <p className="text-xs text-blue-600">Use chaves <code className="bg-blue-100 px-1 rounded">sk_test_...</code> · Webhooks são entregues normalmente · Sem cobrança real</p>
        </div>
        <Badge className="bg-blue-200 text-blue-700">SANDBOX</Badge>
      </div>

      <Tabs defaultValue="cards">
        <TabsList className="bg-white border h-9">
          <TabsTrigger value="cards" className="text-xs">💳 Cartões de teste</TabsTrigger>
          <TabsTrigger value="pix" className="text-xs">⚡ Pix sandbox</TabsTrigger>
          <TabsTrigger value="docs" className="text-xs">📄 CPF/CNPJ</TabsTrigger>
          <TabsTrigger value="webhooks" className="text-xs">🪝 Webhook tester</TabsTrigger>
          <TabsTrigger value="explorer" className="text-xs">🚀 API Explorer</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          <Card>
            <div className="px-5 py-3 border-b">
              <p className="text-sm font-bold">Cartões para diferentes cenários</p>
              <p className="text-xs text-slate-500 mt-0.5">Use estes números para simular comportamentos específicos no sandbox</p>
            </div>
            <div className="divide-y">
              {TEST_CARDS.map((c, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <code className="text-sm font-mono font-bold">{c.number}</code>
                    <p className="text-[10px] text-slate-500 mt-0.5">{c.brand} · CVV {c.cvv} · Exp {c.exp}</p>
                  </div>
                  <Badge className={c.cls}>{c.behavior}</Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copy(c.number.replace(/\s/g, ''))}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pix" className="mt-4 space-y-3">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <QrCode className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold">Gerar Pix de teste</p>
                  <p className="text-xs text-slate-500">Crie cobranças Pix instantâneas no sandbox</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label className="text-xs">Valor (R$)</Label>
                  <Input defaultValue="100.00" />
                </div>
                <div>
                  <Label className="text-xs">Comportamento</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option>Pago após 30s</option>
                    <option>Pago imediatamente</option>
                    <option>Expira em 1min</option>
                    <option>Devolvido</option>
                  </select>
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <QrCode className="w-4 h-4 mr-2" /> Gerar QR Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="mt-4">
          <Card>
            <div className="divide-y">
              {TEST_DOCS.map((d, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4">
                  <Badge variant="outline">{d.type}</Badge>
                  <code className="text-sm font-mono font-bold flex-1">{d.value}</code>
                  <span className="text-xs text-slate-500">{d.behavior}</span>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copy(d.value)}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <WebhookIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-bold">Webhook Tester local</p>
                  <p className="text-xs text-slate-500">Teste webhooks sem expor seu localhost — use o tunneling do PagSmile</p>
                </div>
              </div>
              <code className="block p-3 bg-slate-900 text-emerald-300 text-xs rounded font-mono">
                $ pagsmile listen --forward-to localhost:3000/webhook
              </code>
              <p className="text-xs text-slate-500">
                Instale o <a href="#" className="text-blue-600 hover:underline">CLI tool</a> e capture eventos diretamente no seu localhost.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explorer" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-violet-600" />
                <p className="text-sm font-bold">API Explorer (Try in browser)</p>
                <Badge className="bg-violet-100 text-violet-700 ml-auto text-[10px]">Beta</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select className="h-10 px-3 rounded-md border bg-background text-sm">
                  <option>POST</option>
                  <option>GET</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <Input className="col-span-2" defaultValue="/v1/transactions" />
              </div>
              <textarea
                className="w-full h-32 p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded border-slate-700 border"
                defaultValue={`{
  "amount": 10000,
  "currency": "BRL",
  "method": "pix",
  "customer": {
    "name": "Teste",
    "email": "test@example.com",
    "document": "111.444.777-35"
  }
}`}
              />
              <div className="flex gap-2">
                <Button className="bg-violet-600 hover:bg-violet-700"><Zap className="w-4 h-4 mr-2" /> Executar</Button>
                <Button variant="outline">Salvar como Postman</Button>
                <Button variant="outline">cURL</Button>
              </div>
              <div className="rounded-lg border bg-slate-900 p-3 mt-3">
                <p className="text-[10px] text-emerald-400 font-mono mb-1">// 200 OK · 87ms</p>
                <pre className="text-[10px] text-emerald-300 font-mono overflow-auto">
{`{
  "id": "tr_test_xyz",
  "amount": 10000,
  "status": "pending",
  "pix": { "qr_code": "00020126..." }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}