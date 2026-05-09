import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, FileText, Plus, Lock, ShieldCheck } from 'lucide-react';
import { mockBilletLayouts } from '@/components/mentor/mocks/billetsBackofficeMock';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export default function AdminIntBilletCreate() {
  const [step, setStep] = useState(1);
  const [payer, setPayer] = useState({ name: '', document: '', email: '', phone: '', street: '', number: '', neighborhood: '', city: '', state: '', zip: '' });
  const [financial, setFinancial] = useState({ amount: '', due_date: '', fees: '1.0', penalty: '2.0', discount_value: '', discount_until: '' });
  const [bank, setBank] = useState({ layout_id: 'LYT-ITAU-109', our_number_mode: 'auto', our_number: '' });
  const [instructions, setInstructions] = useState('');
  const [otp, setOtp] = useState('');

  const numericAmount = parseFloat(financial.amount.replace(/\D/g, '')) / 100 || 0;
  const isHighValue = numericAmount > 100_000;

  const submit = () => {
    if (otp.length !== 6) { toast.error('OTP inválido'); return; }
    toast.success(`Boleto criado · registrado no banco · PDF gerado · pagador notificado por e-mail`);
    setStep(1);
    setPayer({ name: '', document: '', email: '', phone: '', street: '', number: '', neighborhood: '', city: '', state: '', zip: '' });
    setFinancial({ amount: '', due_date: '', fees: '1.0', penalty: '2.0', discount_value: '', discount_until: '' });
    setOtp('');
  };

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Novo Boleto"
        subtitle="Wizard Mentor para cadastro de boleto · pagador, financeiro, bancário"
        icon={Plus}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Boletos', page: 'AdminIntBilletsList' },
          { label: 'Novo' },
        ]}
        actions={
          <Badge className="bg-violet-100 text-violet-700 gap-1">
            <Sparkles className="w-3 h-3" /> Mentor · Wave I.10
          </Badge>
        }
      />

      {/* Stepper */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { n: 1, label: 'Pagador' },
          { n: 2, label: 'Financeiro' },
          { n: 3, label: 'Bancário' },
          { n: 4, label: 'Instruções e confirmação' },
        ].map((s, i, arr) => (
          <React.Fragment key={s.n}>
            <button onClick={() => setStep(s.n)} className="flex items-center gap-2">
              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                step >= s.n ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500')}>{s.n}</div>
              <span className={cn('text-[11px]', step >= s.n ? 'text-violet-700 font-bold' : 'text-slate-500')}>{s.label}</span>
            </button>
            {i < arr.length - 1 && <div className={cn('flex-1 h-0.5 min-w-[20px]', step > s.n ? 'bg-violet-600' : 'bg-slate-200')} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">1. Dados do pagador</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Nome / Razão social</Label><Input value={payer.name} onChange={(e) => setPayer({ ...payer, name: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">CPF / CNPJ</Label><Input value={payer.document} onChange={(e) => setPayer({ ...payer, document: e.target.value })} className="h-9 text-xs font-mono" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">E-mail (recomendado)</Label><Input type="email" value={payer.email} onChange={(e) => setPayer({ ...payer, email: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Telefone (opcional)</Label><Input value={payer.phone} onChange={(e) => setPayer({ ...payer, phone: e.target.value })} className="h-9 text-xs" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">CEP</Label><Input value={payer.zip} onChange={(e) => setPayer({ ...payer, zip: e.target.value })} className="h-9 text-xs font-mono" placeholder="00000-000" /></div>
              <div className="col-span-2"><Label className="text-[10px] uppercase font-bold text-slate-500">Rua</Label><Input value={payer.street} onChange={(e) => setPayer({ ...payer, street: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Número</Label><Input value={payer.number} onChange={(e) => setPayer({ ...payer, number: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Bairro</Label><Input value={payer.neighborhood} onChange={(e) => setPayer({ ...payer, neighborhood: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Cidade</Label><Input value={payer.city} onChange={(e) => setPayer({ ...payer, city: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">UF</Label><Input value={payer.state} onChange={(e) => setPayer({ ...payer, state: e.target.value })} className="h-9 text-xs uppercase" maxLength={2} /></div>
            </div>
            <Button onClick={() => setStep(2)} className="bg-violet-600 hover:bg-violet-700">Próximo · Financeiro</Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">2. Configuração financeira</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Valor</Label><Input value={financial.amount} onChange={(e) => setFinancial({ ...financial, amount: e.target.value })} className="h-9 text-base font-bold font-mono" placeholder="R$ 0,00" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Vencimento</Label><Input type="date" value={financial.due_date} onChange={(e) => setFinancial({ ...financial, due_date: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Juros após vencimento (% mês · máx 1%)</Label><Input type="number" step="0.1" max="1" value={financial.fees} onChange={(e) => setFinancial({ ...financial, fees: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Multa (% · máx 2% CDC)</Label><Input type="number" step="0.1" max="2" value={financial.penalty} onChange={(e) => setFinancial({ ...financial, penalty: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Desconto por antecipação (R$)</Label><Input type="number" value={financial.discount_value} onChange={(e) => setFinancial({ ...financial, discount_value: e.target.value })} className="h-9 text-xs" /></div>
              <div><Label className="text-[10px] uppercase font-bold text-slate-500">Desconto válido até</Label><Input type="date" value={financial.discount_until} onChange={(e) => setFinancial({ ...financial, discount_until: e.target.value })} className="h-9 text-xs" /></div>
            </div>
            {isHighValue && (
              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[11px] text-amber-900">
                ⚠️ Valor alto ({fmt(numericAmount)}) · alçada dupla obrigatória
              </div>
            )}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
              <Button onClick={() => setStep(3)} className="bg-violet-600 hover:bg-violet-700">Próximo · Bancário</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">3. Configuração bancária</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-[10px] uppercase font-bold text-slate-500">Layout · Banco · Carteira</Label>
              <Select value={bank.layout_id} onValueChange={(v) => setBank({ ...bank, layout_id: v })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockBilletLayouts.filter(l => l.status === 'active').map((l) => (
                    <SelectItem key={l.layout_id} value={l.layout_id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-slate-500">Nosso número</Label>
              <Select value={bank.our_number_mode} onValueChange={(v) => setBank({ ...bank, our_number_mode: v })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático (sequencial da carteira)</SelectItem>
                  <SelectItem value="manual">Manual (continuidade externa)</SelectItem>
                </SelectContent>
              </Select>
              {bank.our_number_mode === 'manual' && (
                <Input className="mt-2 h-9 text-xs font-mono" placeholder="00000/0001" value={bank.our_number} onChange={(e) => setBank({ ...bank, our_number: e.target.value })} />
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
              <Button onClick={() => setStep(4)} className="bg-violet-600 hover:bg-violet-700">Próximo · Instruções</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-violet-600" /> 4. Instruções e confirmação</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-[10px] uppercase font-bold text-slate-500">Instruções ao pagador (impressas no boleto)</Label>
              <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} className="text-xs" placeholder="Identifique o motivo da cobrança e contato em caso de dúvidas..." />
            </div>
            <div className="bg-slate-50 rounded p-3 text-xs space-y-1">
              <p><strong>Pagador:</strong> {payer.name || '—'} · {payer.document || '—'}</p>
              <p><strong>Valor:</strong> {fmt(numericAmount)} · Venc {financial.due_date || '—'}</p>
              <p><strong>Layout:</strong> {mockBilletLayouts.find(l => l.layout_id === bank.layout_id)?.name}</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <Lock className="w-4 h-4 text-violet-600" />
              <Input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="font-mono text-center w-32" maxLength={6} />
              <Button onClick={submit} className="bg-violet-600 hover:bg-violet-700">
                <FileText className="w-3.5 h-3.5 mr-1" /> Cadastrar e registrar no banco
              </Button>
              <Button variant="outline" onClick={() => setStep(3)}>Voltar</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}