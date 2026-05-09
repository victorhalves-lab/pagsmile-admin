import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Wallet, ShieldCheck, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Mentor F0277–F0286 (visão lojista) — Solicitar mudança de conta de liquidação.
 * Lojista solicita; back valida e aplica via fluxo formal. UI traz transparência sobre cool-down e validações.
 */
export default function SubaccountSettlementChangeRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [reason, setReason] = useState('');
  const [data, setData] = useState({ pix_key_type: '', pix_key: '', notes: '' });

  const submit = () => {
    toast.success('Solicitação enviada — análise em até 24h');
    setStep(3);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      <PageHeader
        title="Solicitar Troca de Conta de Recebimento"
        subtitle="Por segurança, esta operação requer OTP e tem cool-down de 48h após aplicada"
        icon={Wallet}
      />

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-bold">Operação altamente sensível</p>
            <p className="text-xs mt-1">A nova conta passa por validação SPB/DICT e checagem de mesma titularidade. Após aplicada, novas trocas ficam bloqueadas por 48h.</p>
          </div>
        </CardContent>
      </Card>

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Nova chave Pix</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo da chave *</Label>
              <Select value={data.pix_key_type} onValueChange={(v) => setData({ ...data, pix_key_type: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cnpj">CNPJ</SelectItem>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="random">Aleatória</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Chave Pix *</Label>
              <Input value={data.pix_key} onChange={(e) => setData({ ...data, pix_key: e.target.value })} placeholder="Informe a chave" />
              <p className="text-[11px] text-slate-500 mt-1">Deve estar registrada no DICT em nome do mesmo titular do cadastro</p>
            </div>
            <div>
              <Label>Motivo *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_change">Troquei de banco</SelectItem>
                  <SelectItem value="ownership_change">Mudança societária</SelectItem>
                  <SelectItem value="operational">Correção de cadastro</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Observações (opcional)</Label>
              <Textarea value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!data.pix_key_type || !data.pix_key || !reason}>Continuar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Confirmar com OTP</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">Enviamos um código por SMS para <strong>(11) ****-9876</strong>. Cole abaixo:</p>
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="000000" className="font-mono text-center text-2xl tracking-widest" />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
              <Button onClick={submit} disabled={otp.length !== 6}>
                <ShieldCheck className="w-4 h-4 mr-1" /> Confirmar solicitação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
            <p className="text-2xl font-black text-emerald-900">Solicitação enviada</p>
            <p className="text-sm text-emerald-800 mt-2">Análise em até 24 horas. Você receberá uma notificação quando aplicarmos a mudança.</p>
            <Button className="mt-6" onClick={() => navigate(-1)}>Voltar</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}