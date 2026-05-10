import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, DollarSign, FileText, CheckCircle, ArrowRight, ArrowLeft, Upload, Shield } from 'lucide-react';
import { ADJUSTMENT_REASONS, formatCurrency } from './mocks/manualAdjustmentsMock';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Lojista', icon: Building2 },
  { id: 2, title: 'Tipo & valor', icon: DollarSign },
  { id: 3, title: 'Motivo & evidência', icon: FileText },
  { id: 4, title: 'Revisão', icon: CheckCircle },
];

export default function CreateAdjustmentWizard({ open, onOpenChange, prefillMerchant }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    merchant: prefillMerchant || null,
    type: 'credit',
    amount: '',
    reason: '',
    description: '',
    visible_to_merchant: true,
  });

  React.useEffect(() => {
    if (open && prefillMerchant) {
      setData((d) => ({ ...d, merchant: prefillMerchant }));
      setStep(prefillMerchant ? 2 : 1);
    }
  }, [open, prefillMerchant]);

  const reset = () => {
    setStep(1);
    setData({ merchant: prefillMerchant || null, type: 'credit', amount: '', reason: '', description: '', visible_to_merchant: true });
  };

  const handleSubmit = () => {
    const amount = parseFloat(data.amount);
    if (amount > 1000) {
      toast.success(`Ajuste enviado para aprovação L2 (4-eyes) — ${formatCurrency(amount)}`);
    } else {
      toast.success(`Ajuste aplicado com sucesso — ${formatCurrency(amount)}`);
    }
    reset();
    onOpenChange(false);
  };

  const set = (k, v) => setData({ ...data, [k]: v });
  const amountNum = parseFloat(data.amount) || 0;
  const requires4eyes = amountNum > 1000;

  return (
    <Sheet open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Novo ajuste manual</SheetTitle>
        </SheetHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between mt-4 mb-6">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex flex-col items-center gap-1 ${step >= s.id ? 'text-violet-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= s.id ? 'border-violet-600 bg-violet-50' : 'border-slate-200 bg-slate-50'}`}>
                  <s.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${step > s.id ? 'bg-violet-600' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <Label className="text-xs">Buscar lojista</Label>
              <Input placeholder="CNPJ ou nome…" value={data.merchant?.name || ''} onChange={(e) => set('merchant', { id: 'mer_xxx', name: e.target.value, cnpj: '00.000.000/0001-00' })} />
              {data.merchant && (
                <div className="p-3 border rounded-lg bg-slate-50">
                  <p className="font-bold text-sm">{data.merchant.name}</p>
                  <p className="text-[10px] text-slate-500">{data.merchant.cnpj}</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label className="text-xs">Tipo</Label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => set('type', 'credit')} className={`p-3 border-2 rounded-lg text-sm font-bold ${data.type === 'credit' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200'}`}>
                  + Crédito
                </button>
                <button onClick={() => set('type', 'debit')} className={`p-3 border-2 rounded-lg text-sm font-bold ${data.type === 'debit' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200'}`}>
                  − Débito
                </button>
              </div>
              <Label className="text-xs">Valor (R$)</Label>
              <Input type="number" placeholder="0,00" value={data.amount} onChange={(e) => set('amount', e.target.value)} />
              {requires4eyes && (
                <div className="bg-amber-50 border border-amber-200 rounded p-2 flex items-start gap-2 text-xs">
                  <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
                  <span>Valor &gt; R$ 1.000 — exige aprovação dual (4-eyes)</span>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <Label className="text-xs">Motivo</Label>
              <Select value={data.reason} onValueChange={(v) => set('reason', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ADJUSTMENT_REASONS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="text-xs">Descrição</Label>
              <Textarea value={data.description} onChange={(e) => set('description', e.target.value)} placeholder="Detalhe o motivo do ajuste e ticket de origem…" />
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                <p className="text-xs text-slate-500">Anexar evidências (PDF/imagem)</p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">Selecionar arquivo</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                <Field label="Lojista" value={data.merchant?.name} />
                <Field label="Tipo" value={<Badge className={data.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>{data.type === 'credit' ? 'Crédito' : 'Débito'}</Badge>} />
                <Field label="Valor" value={<strong>{formatCurrency(amountNum)}</strong>} />
                <Field label="Motivo" value={ADJUSTMENT_REASONS[data.reason]?.label || '—'} />
                <Field label="Descrição" value={data.description || '—'} />
                <Field label="Visível ao lojista" value={data.visible_to_merchant ? 'Sim' : 'Não'} />
              </div>
              {requires4eyes && (
                <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs">
                  Após criação, irá para fila de aprovação L2.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : onOpenChange(false)}>
            <ArrowLeft className="w-3 h-3 mr-1" /> {step === 1 ? 'Cancelar' : 'Voltar'}
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-violet-600 hover:bg-violet-700" disabled={(step === 1 && !data.merchant) || (step === 2 && !amountNum) || (step === 3 && !data.reason)}>
              Próximo <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700">
              {requires4eyes ? 'Enviar para aprovação' : 'Aplicar ajuste'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex justify-between items-start py-0.5">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-right ml-2">{value}</span>
    </div>
  );
}