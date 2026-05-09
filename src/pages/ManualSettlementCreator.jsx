import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Upload, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { mockPaymentTypes } from '@/components/mentor/mocks/settlementGovernanceMock';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export default function ManualSettlementCreator() {
  const [paymentType, setPaymentType] = useState('card_credit');
  const [merchantId, setMerchantId] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('extraordinary_settlement');
  const [justification, setJustification] = useState('');
  const [docs, setDocs] = useState([]);
  const [accountOption, setAccountOption] = useState('default');
  const [executionMode, setExecutionMode] = useState('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [otp, setOtp] = useState('');
  const [needsDoubleApproval, setNeedsDoubleApproval] = useState(false);
  const [otpExec, setOtpExec] = useState('');

  const numericAmount = parseFloat(amount.replace(/\D/g, '')) / 100 || 0;
  const isHighValue = numericAmount > 50_000;
  const isAbsurd = numericAmount > 1_000_000;

  useEffect(() => {
    setNeedsDoubleApproval(isHighValue || reason === 'other');
  }, [isHighValue, reason]);

  const submit = () => {
    if (!merchantId || !merchantName) { toast.error('Selecione um lojista'); return; }
    if (numericAmount < 0.01) { toast.error('Valor inválido'); return; }
    if (isAbsurd) { toast.error('Valor absurdamente alto · revisar com gerência antes'); return; }
    if (justification.length < 100) { toast.error('Justificativa precisa ter no mínimo 100 caracteres'); return; }
    if (otp.length !== 6) { toast.error('OTP inválido'); return; }
    if (needsDoubleApproval && otpExec.length !== 6) { toast.error('Aprovação executiva obrigatória'); return; }

    toast.success(`Liquidação manual criada · ${fmt(numericAmount)} para ${merchantName} · pagamento entra na fila normal de execução`);
    setMerchantId(''); setMerchantName(''); setAmount(''); setJustification(''); setOtp(''); setOtpExec(''); setDocs([]);
  };

  const selectedType = mockPaymentTypes.find((t) => t.type_id === paymentType);

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Liquidação Manual"
        subtitle="Criar liquidação extraordinária · operação restrita com governança"
        icon={Send}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Liquidações', page: 'AdminIntSettlements' },
          { label: 'Manual' },
        ]}
      />

      <Card className="bg-blue-50/30 border-blue-200">
        <CardContent className="p-3 text-xs text-blue-900">
          📤 <strong>Liquidação Manual</strong> · use apenas em casos de exceção legítimos: liquidação extraordinária acordada, correção de pagamento falhado, crédito especial, programa de fidelidade, ajuste administrativo.
          Não é fluxo casual — é mecanismo controlado com auditoria robusta.
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">1. Tipo e lojista</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-[10px] uppercase font-bold text-slate-500">Tipo de pagamento</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {mockPaymentTypes.filter(t => t.status === 'active').map((t) => (
                      <SelectItem key={t.type_id} value={t.type_id}>{t.name} · {t.settlement_term} · {t.method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-500">Merchant ID</Label>
                  <Input value={merchantId} onChange={(e) => setMerchantId(e.target.value)} placeholder="M-..." className="h-9 text-xs font-mono" />
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-500">Nome / Razão social</Label>
                  <Input value={merchantName} onChange={(e) => setMerchantName(e.target.value)} placeholder="Buscar lojista..." className="h-9 text-xs" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">2. Valor e motivo</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-[10px] uppercase font-bold text-slate-500">Valor da liquidação</Label>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="R$ 0,00" className="h-9 text-base font-bold font-mono" />
                {isHighValue && !isAbsurd && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded p-1.5">
                    <AlertTriangle className="w-3 h-3" /> Valor alto ({fmt(numericAmount)}) · alçada dupla obrigatória
                  </div>
                )}
                {isAbsurd && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-red-700 bg-red-50 border border-red-200 rounded p-1.5">
                    <AlertTriangle className="w-3 h-3" /> Valor absurdo · revisar com Diretoria antes
                  </div>
                )}
              </div>
              <div>
                <Label className="text-[10px] uppercase font-bold text-slate-500">Motivo categorizado</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="extraordinary_settlement">Liquidação extraordinária acordada</SelectItem>
                    <SelectItem value="failed_payment_correction">Correção de pagamento falhado</SelectItem>
                    <SelectItem value="special_credit">Crédito especial</SelectItem>
                    <SelectItem value="loyalty_program">Programa de fidelidade</SelectItem>
                    <SelectItem value="admin_adjustment">Ajuste administrativo</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] uppercase font-bold text-slate-500">Justificativa (mín. 100 caracteres)</Label>
                <Textarea value={justification} onChange={(e) => setJustification(e.target.value)} rows={4} className="text-xs" />
                <p className={cn('text-[10px] mt-0.5', justification.length >= 100 ? 'text-emerald-600' : 'text-slate-400')}>
                  {justification.length}/100 caracteres mínimos
                </p>
              </div>
              <div>
                <Label className="text-[10px] uppercase font-bold text-slate-500">Documentação justificativa</Label>
                <Button variant="outline" size="sm" className="w-full h-9 text-xs border-dashed"
                  onClick={() => { setDocs([...docs, `doc_${docs.length + 1}.pdf`]); toast.success('Documento anexado'); }}>
                  <Upload className="w-3 h-3 mr-1" /> Anexar acordo, e-mails, ata, decisão executiva
                </Button>
                {docs.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {docs.map((d, i) => <Badge key={i} variant="outline" className="text-[10px]">📎 {d}</Badge>)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">3. Conta destino e execução</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-[10px] uppercase font-bold text-slate-500">Conta destino</Label>
                <Select value={accountOption} onValueChange={setAccountOption}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Conta padrão do lojista (recomendado)</SelectItem>
                    <SelectItem value="specific">Conta específica (acordo comercial)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] uppercase font-bold text-slate-500">Modo de execução</Label>
                <Select value={executionMode} onValueChange={setExecutionMode}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Imediato (próximo ciclo de execução)</SelectItem>
                    <SelectItem value="scheduled">Agendado (data específica)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {executionMode === 'scheduled' && (
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-500">Data agendada</Label>
                  <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="h-9 text-xs" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar resumo + submit */}
        <div className="space-y-4">
          <Card className="border-violet-300 bg-violet-50/30 sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-600" /> Resumo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="bg-white rounded p-2 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">Tipo</p>
                <p className="font-semibold">{selectedType?.name}</p>
                <p className="text-[10px] text-slate-500">{selectedType?.settlement_term} · {selectedType?.method} · {selectedType?.accounting}</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Valor</p>
                <p className="text-2xl font-black text-emerald-700">{fmt(numericAmount)}</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Lojista</p>
                <p className="font-semibold truncate">{merchantName || '—'}</p>
                <code className="text-[10px] text-slate-500">{merchantId}</code>
              </div>

              <div className="border-t pt-2 mt-2 space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Confirmação</p>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-violet-600" />
                  <Input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="font-mono text-center h-8 text-xs" maxLength={6} />
                </div>
                {needsDoubleApproval && (
                  <>
                    <p className="text-[10px] text-amber-700 font-bold">⚠️ Alçada dupla necessária</p>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <Input placeholder="OTP gerente" value={otpExec} onChange={(e) => setOtpExec(e.target.value.replace(/\D/g, '').slice(0, 6))} className="font-mono text-center h-8 text-xs" maxLength={6} />
                    </div>
                  </>
                )}
                <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={submit}>
                  <Send className="w-3.5 h-3.5 mr-1" /> Criar liquidação manual
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}