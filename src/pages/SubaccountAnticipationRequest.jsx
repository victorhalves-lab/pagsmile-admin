import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Lock, AlertTriangle, Calculator } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Solicitar antecipação spot, considerando travas/efeitos de contrato.
 */
export default function SubaccountAnticipationRequest() {
  const totalReceivable = 234500;
  const committedThirdParty = 47000; // CIP/B3/Judicial
  const available = totalReceivable - committedThirdParty;

  const [amount, setAmount] = useState(available * 0.5);
  const spotRate = 2.45; // % a.m.
  const days = 21;
  const cost = amount * (spotRate / 100) * (days / 30);
  const netReceived = amount - cost;

  const submit = () => {
    toast.success(`Antecipação de R$ ${amount.toLocaleString('pt-BR')} solicitada`);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <PageHeader
        title="Solicitar Antecipação"
        subtitle="Antecipe seus recebíveis com taxa spot em tempo real"
        icon={TrendingUp}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-4"><p className="text-[10px] uppercase font-bold text-slate-500">Total a receber</p><p className="text-2xl font-black mt-1">R$ {totalReceivable.toLocaleString('pt-BR')}</p></Card>
        <Card className="p-4 border-amber-200">
          <p className="text-[10px] uppercase font-bold text-amber-700 flex items-center gap-1"><Lock className="w-3 h-3" /> Comprometido</p>
          <p className="text-2xl font-black mt-1 text-amber-700">R$ {committedThirdParty.toLocaleString('pt-BR')}</p>
          <p className="text-[11px] text-amber-600 mt-1">Cessões CIP/B3 + gravames</p>
        </Card>
        <Card className="p-4 border-emerald-200"><p className="text-[10px] uppercase font-bold text-emerald-700">Disponível p/ antecipar</p><p className="text-2xl font-black mt-1 text-emerald-700">R$ {available.toLocaleString('pt-BR')}</p></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="w-4 h-4" /> Simular antecipação</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Quanto deseja antecipar? *</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} max={available} />
            <p className="text-[11px] text-slate-500 mt-1">Máximo disponível: R$ {available.toLocaleString('pt-BR')}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-900 text-white">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-3">Simulação</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Taxa spot</p>
                <p className="font-bold text-lg">{spotRate}% a.m.</p>
              </div>
              <div>
                <p className="text-slate-400">Prazo médio</p>
                <p className="font-bold text-lg">{days} dias</p>
              </div>
              <div>
                <p className="text-slate-400">Custo da antecipação</p>
                <p className="font-bold text-lg text-amber-300">- R$ {cost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400">Você recebe agora</p>
                <p className="font-bold text-2xl text-emerald-400">R$ {netReceived.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Observação:</strong> R$ {committedThirdParty.toLocaleString('pt-BR')} dos seus recebíveis estão comprometidos com terceiros (cessões/gravames) e foram automaticamente descontados do saldo disponível.
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={submit} disabled={!amount || amount > available}>
              <TrendingUp className="w-4 h-4 mr-1" /> Solicitar antecipação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}