import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Plus, Minus, AlertTriangle, History } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

/**
 * Partner Adjustment — 100% baseado na Partner API Tuna oficial (§18).
 * Endpoint coberto:
 *  - POST /api/Partner/Adjustment
 *
 * Operação única: ajuste de saldo de merchant (sub-lojista) com:
 *  - adjustmentOperationType: 'AddToMerchant' (crédito) | 'SubtractFromMerchant' (débito)
 *  - adjustmentDate: não pode ser mais que 3h no passado
 *  - referenceId: único por parceiro (idempotência)
 *  - imutável após gravado · integra extrato do merchant
 *
 * Casos de uso típicos: chargeback fees, bonificações, acertos de reconciliação.
 */

const HISTORY = [
  { operationId: 'op_8f3a2e1f', referenceId: 'CHB-FEE-2026-04-2841', merchantId: 'sub_001', merchantName: 'Loja Premium SP', type: 'SubtractFromMerchant', amount: 25.00, description: 'Chargeback fee - Visa', date: '2026-05-08T14:22:00', user: 'analista@pagsmile.com' },
  { operationId: 'op_3c2e1f0b', referenceId: 'BONUS-MAY-2026-001', merchantId: 'sub_002', merchantName: 'Eletro Hub Online', type: 'AddToMerchant', amount: 500.00, description: 'Bonificação atingimento de meta', date: '2026-05-07T10:18:00', user: 'gerente@pagsmile.com' },
  { operationId: 'op_b6d4d6c8', referenceId: 'RECONCILE-04-2026-22', merchantId: 'sub_001', merchantName: 'Loja Premium SP', type: 'AddToMerchant', amount: 142.80, description: 'Acerto de reconciliação Adyen', date: '2026-05-05T16:45:00', user: 'financeiro@pagsmile.com' },
];

export default function AdminIntPartnerAdjustment() {
  const [type, setType] = useState('AddToMerchant');
  const [merchantId, setMerchantId] = useState('');
  const [amount, setAmount] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [description, setDescription] = useState('');

  const totalCredits = HISTORY.filter(h => h.type === 'AddToMerchant').reduce((s, h) => s + h.amount, 0);
  const totalDebits = HISTORY.filter(h => h.type === 'SubtractFromMerchant').reduce((s, h) => s + h.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Adjustment"
        subtitle="Ajustes de saldo em merchants · Partner API Tuna §18 · Imutável e idempotente"
        icon={Wallet}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Financeiro' }]}
      />

      <Card className="bg-amber-50 border-amber-300">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">Operação imutável · Confirme antes de executar</p>
            <p className="text-xs text-amber-800 mt-1">
              Ajustes via <code className="font-mono bg-white px-1 rounded">POST /api/Partner/Adjustment</code> são gravados de forma imutável e integram o extrato do merchant.
              <code className="font-mono bg-white px-1 rounded ml-1">adjustmentDate</code> não pode estar mais de 3 horas no passado.
              <code className="font-mono bg-white px-1 rounded ml-1">referenceId</code> deve ser único por parceiro.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Ajustes (mês)</p><p className="text-3xl font-bold">{HISTORY.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase flex items-center gap-1"><Plus className="w-3 h-3 text-emerald-500" />Créditos (AddToMerchant)</p><p className="text-3xl font-bold text-emerald-600">R$ {totalCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase flex items-center gap-1"><Minus className="w-3 h-3 text-red-500" />Débitos (SubtractFromMerchant)</p><p className="text-3xl font-bold text-red-600">R$ {totalDebits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">Novo ajuste</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">POST /api/Partner/Adjustment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Tipo de operação *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setType('AddToMerchant')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${type === 'AddToMerchant' ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <Plus className="w-5 h-5 text-emerald-600 mb-2" />
                    <p className="font-bold text-sm">AddToMerchant (crédito)</p>
                    <p className="text-xs text-slate-500 mt-1">Bonificações, acertos a favor</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('SubtractFromMerchant')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${type === 'SubtractFromMerchant' ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <Minus className="w-5 h-5 text-red-600 mb-2" />
                    <p className="font-bold text-sm">SubtractFromMerchant (débito)</p>
                    <p className="text-xs text-slate-500 mt-1">Chargeback fees, acertos contra</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>merchantId *</Label>
                  <Input
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    placeholder="sub_001"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label>amount * (sempre positivo)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>referenceId * (único)</Label>
                  <Input
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="CHB-FEE-2026-05-XXXX"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label>adjustmentDate</Label>
                  <Input type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} />
                  <p className="text-[10px] text-slate-500 mt-1">⚠ Não pode ser &gt; 3h no passado</p>
                </div>
                <div className="md:col-span-2">
                  <Label>description (memorando)</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Chargeback fee - Visa - Pedido #12345"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline">Cancelar</Button>
                <Button
                  className={type === 'AddToMerchant' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
                  disabled={!merchantId || !amount || !referenceId}
                >
                  Executar ajuste imutável
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4" />
                Histórico imutável
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-xs text-slate-500 uppercase">
                    <th className="p-3">operationId</th>
                    <th className="p-3">referenceId</th>
                    <th className="p-3">Merchant</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3 text-right">Valor</th>
                    <th className="p-3">Descrição</th>
                    <th className="p-3">Data</th>
                    <th className="p-3">Usuário</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORY.map((h) => (
                    <tr key={h.operationId} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-mono text-xs">{h.operationId}</td>
                      <td className="p-3 font-mono text-xs">{h.referenceId}</td>
                      <td className="p-3">
                        <p className="font-semibold text-xs">{h.merchantName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{h.merchantId}</p>
                      </td>
                      <td className="p-3">
                        <Badge className={h.type === 'AddToMerchant' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                          {h.type === 'AddToMerchant' ? <Plus className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                          {h.type}
                        </Badge>
                      </td>
                      <td className={`p-3 text-right font-bold ${h.type === 'AddToMerchant' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {h.type === 'AddToMerchant' ? '+' : '−'} R$ {h.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-xs">{h.description}</td>
                      <td className="p-3 text-xs text-slate-500">{new Date(h.date).toLocaleString('pt-BR')}</td>
                      <td className="p-3 text-xs">{h.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}