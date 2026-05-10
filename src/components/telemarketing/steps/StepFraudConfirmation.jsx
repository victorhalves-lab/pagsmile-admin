import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const CHECKLIST = [
  { key: 'value', label: 'Cliente confirmou o valor total da compra' },
  { key: 'items', label: 'Cliente confirmou os itens/produtos adquiridos' },
  { key: 'installments', label: 'Cliente confirmou o número de parcelas (se houver)' },
  { key: 'card_holder', label: 'Cliente confirmou ser o titular do(s) cartão(ões) informado(s)' },
  { key: 'authorize', label: 'Cliente autorizou expressamente a cobrança' },
];

export default function StepFraudConfirmation({ sale, updateSale, onNext, onBack }) {
  const [checks, setChecks] = useState(sale.fraud_checks || {});
  const [notes, setNotes] = useState(sale.operator_notes || '');

  const allChecked = CHECKLIST.every((c) => checks[c.key]);
  const hasCard = sale.payments?.some((p) => p.method === 'card');

  // Score de risco simulado
  const totalCents = (sale.total || 0) * 100;
  const newCust = sale.customer?.isNew;
  let score = 20;
  if (totalCents > 100000) score += 25; // > R$ 1.000
  if (totalCents > 500000) score += 20; // > R$ 5.000
  if (newCust) score += 15;
  if (sale.payments?.length > 1) score += 10;
  const riskLabel = score < 40 ? 'baixo' : score < 65 ? 'médio' : 'alto';
  const riskColor = score < 40 ? 'emerald' : score < 65 ? 'amber' : 'red';

  const toggle = (k) => setChecks((p) => ({ ...p, [k]: !p[k] }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="w-4 h-4 text-[#2bc196]" /> Etapa 4 · Antifraude e Confirmação Verbal
        </CardTitle>
        <p className="text-xs text-slate-500">Antes de processar, leia o checklist em voz alta para o cliente.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score */}
        <div className={`border rounded-lg p-3 bg-${riskColor}-50 border-${riskColor}-200`}>
          <div className="text-xs uppercase font-bold opacity-70">Score de risco MOTO</div>
          <div className={`text-2xl font-bold text-${riskColor}-700`}>
            {riskLabel.toUpperCase()} <span className="text-sm font-normal">({score}/100)</span>
          </div>
          {hasCard && (
            <p className="text-xs mt-1 opacity-80">
              Pagamento via cartão por telefone (MOTO) — autenticação CVV reforçada.
            </p>
          )}
        </div>

        {/* Checklist */}
        <div className="border rounded-lg p-4 bg-amber-50/40 border-amber-200">
          <h4 className="text-sm font-bold text-amber-900 mb-3">Checklist de confirmação verbal</h4>
          <div className="space-y-2">
            {CHECKLIST.map((c) => (
              <label key={c.key} className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-amber-100/50">
                <Checkbox checked={!!checks[c.key]} onCheckedChange={() => toggle(c.key)} className="mt-0.5" />
                <span className="text-sm text-amber-900">{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">Observações do operador</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex.: Cliente solicitou entrega expressa, tem urgência…"
            rows={2}
            className="mt-1"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <Button
            onClick={() => { updateSale({ fraud_checks: checks, operator_notes: notes, risk_score: score }); onNext(); }}
            disabled={!allChecked}
            className="flex-1 bg-[#2bc196] hover:bg-[#25a880]"
          >
            Ir para revisão final →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}