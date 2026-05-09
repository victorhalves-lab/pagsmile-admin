import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowRightLeft, ShieldCheck, KeyRound, Lock, AlertTriangle, ChevronRight, ChevronLeft,
  CheckCircle2, Clock, Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * Mentor F0277–F0299 — Fluxo formal de troca de settlement com:
 *  - cross-validation SPB/DICT
 *  - same-ownership check
 *  - OTP do operador
 *  - alçada dupla (segundo aprovador)
 *  - cool-down 24-48h após aplicação
 */
const STEPS = [
  { id: 1, label: 'Identificação', icon: Wallet },
  { id: 2, label: 'Nova conta', icon: ArrowRightLeft },
  { id: 3, label: 'Validação SPB/DICT', icon: KeyRound },
  { id: 4, label: 'OTP + alçada dupla', icon: ShieldCheck },
  { id: 5, label: 'Confirmação', icon: CheckCircle2 },
];

export default function AdminIntSettlementChangeFlow() {
  const [params] = useSearchParams();
  const merchantId = params.get('id') || '12345';
  const [step, setStep] = useState(1);
  const [newAccount, setNewAccount] = useState({
    method: 'pix', pix_key_type: '', pix_key: '', bank_code: '', agency: '', account_number: '', account_digit: '', account_type: 'checking',
  });
  const [validation, setValidation] = useState({ spb: null, dict: null, sameOwnership: null });
  const [otp, setOtp] = useState('');
  const [secondApprover, setSecondApprover] = useState('');
  const [reason, setReason] = useState('');

  const merchant = { id: merchantId, business_name: 'E-commerce XYZ', document: '12.345.678/0001-90' };
  const currentAccount = { method: 'pix', pix_key_type: 'cnpj', pix_key: '12.345.678/0001-90', bank_name: 'Itaú', agency: '0001', account: '12345-6' };

  const runValidation = () => {
    setStep(3);
    setTimeout(() => {
      setValidation({ spb: true, dict: true, sameOwnership: true });
    }, 1500);
  };

  const submit = () => {
    toast.success('Troca de settlement aplicada. Cool-down ativo por 48h.');
    setStep(5);
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Troca de Conta de Liquidação"
        subtitle={`${merchant.business_name} · ${merchant.document}`}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Merchants', page: 'AdminIntMerchantsList' },
          { label: merchant.business_name, page: `AdminIntMerchantProfile?id=${merchantId}` },
          { label: 'Trocar Settlement' },
        ]}
        icon={ArrowRightLeft}
      />

      {/* Aviso de risco */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-900">
            <p className="font-bold">Operação altamente sensível</p>
            <p className="text-xs mt-1 text-red-800">
              Troca de conta de liquidação é o vetor #1 de fraude em payments. Esta operação exige OTP do operador,
              aprovação de um segundo analista (alçada dupla) e cross-validation com SPB/DICT. Após aplicada,
              novas alterações ficam bloqueadas por 48h (cool-down).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stepper */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                      isDone ? 'bg-emerald-500 text-white' :
                      isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' :
                      'bg-slate-200 text-slate-400'
                    )}>
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <p className={cn('text-[11px] font-bold text-center',
                      isActive ? 'text-purple-700' : isDone ? 'text-emerald-700' : 'text-slate-400'
                    )}>{s.label}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn('h-0.5 flex-1 -mt-5', isDone ? 'bg-emerald-500' : 'bg-slate-200')} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Conta atual</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50">
              <Field label="Método" value={currentAccount.method.toUpperCase()} />
              <Field label="Banco" value={currentAccount.bank_name} />
              <Field label="Chave Pix" value={currentAccount.pix_key} />
              <Field label="Agência/Conta" value={`${currentAccount.agency} / ${currentAccount.account}`} />
            </div>
            <div>
              <Label>Motivo da troca *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_request">Solicitação do cliente</SelectItem>
                  <SelectItem value="bank_change">Troca de banco</SelectItem>
                  <SelectItem value="ownership_change">Mudança societária</SelectItem>
                  <SelectItem value="judicial_order">Ordem judicial</SelectItem>
                  <SelectItem value="operational">Operacional / correção de cadastro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!reason}>
                Continuar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Nova conta de liquidação</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Método *</Label>
                <Select value={newAccount.method} onValueChange={(v) => setNewAccount({ ...newAccount, method: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="ted">TED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newAccount.method === 'pix' && (
                <>
                  <div>
                    <Label>Tipo de chave *</Label>
                    <Select value={newAccount.pix_key_type} onValueChange={(v) => setNewAccount({ ...newAccount, pix_key_type: v })}>
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
                  <div className="md:col-span-2">
                    <Label>Chave Pix *</Label>
                    <Input value={newAccount.pix_key} onChange={(e) => setNewAccount({ ...newAccount, pix_key: e.target.value })} />
                  </div>
                </>
              )}
              {newAccount.method === 'ted' && (
                <>
                  <div><Label>Banco *</Label><Input value={newAccount.bank_code} onChange={(e) => setNewAccount({ ...newAccount, bank_code: e.target.value })} placeholder="Código" /></div>
                  <div><Label>Agência *</Label><Input value={newAccount.agency} onChange={(e) => setNewAccount({ ...newAccount, agency: e.target.value })} /></div>
                  <div><Label>Conta *</Label><Input value={newAccount.account_number} onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })} /></div>
                  <div><Label>Dígito *</Label><Input value={newAccount.account_digit} onChange={(e) => setNewAccount({ ...newAccount, account_digit: e.target.value })} /></div>
                </>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="w-4 h-4 mr-1" /> Voltar</Button>
              <Button onClick={runValidation}>Validar SPB/DICT <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Cross-validation SPB/DICT</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ValidationRow label="Cross-validation SPB" status={validation.spb} description="Conta existe no Sistema Brasileiro de Pagamentos" />
            <ValidationRow label="Validação DICT" status={validation.dict} description="Chave Pix ativa e vinculada ao titular" />
            <ValidationRow label="Same-ownership check" status={validation.sameOwnership} description="Documento do titular bate com o cadastro do lojista" />
            {validation.spb && validation.dict && validation.sameOwnership && (
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)}><ChevronLeft className="w-4 h-4 mr-1" /> Voltar</Button>
                <Button onClick={() => setStep(4)}>Continuar <ChevronRight className="w-4 h-4 ml-1" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader><CardTitle>OTP + Alçada dupla</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>Código OTP do operador (token de 6 dígitos) *</Label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" maxLength={6} className="font-mono text-center text-xl tracking-widest" />
              <p className="text-[11px] text-slate-500 mt-1">Enviado via SMS para o número cadastrado do operador</p>
            </div>
            <div>
              <Label>Segundo aprovador (alçada dupla) *</Label>
              <Select value={secondApprover} onValueChange={setSecondApprover}>
                <SelectTrigger><SelectValue placeholder="Selecione um analista" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ana@pagsmile.com">ana@pagsmile.com (Compliance Sr.)</SelectItem>
                  <SelectItem value="bruno@pagsmile.com">bruno@pagsmile.com (Risco Sr.)</SelectItem>
                  <SelectItem value="carla@pagsmile.com">carla@pagsmile.com (Operações)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-slate-500 mt-1">O segundo aprovador receberá uma notificação para validar esta operação antes da aplicação</p>
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(3)}><ChevronLeft className="w-4 h-4 mr-1" /> Voltar</Button>
              <Button onClick={submit} disabled={otp.length !== 6 || !secondApprover}>
                <Lock className="w-4 h-4 mr-1" /> Aplicar troca
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-black text-emerald-900">Troca aplicada com sucesso</p>
            <p className="text-sm text-emerald-800 mt-2">A nova conta está ativa para liquidações futuras.</p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-800">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold">Cool-down ativo até {new Date(Date.now() + 48 * 3600 * 1000).toLocaleString('pt-BR')}</span>
            </div>
            <div className="mt-6">
              <Link to={createPageUrl(`AdminIntMerchantProfile?id=${merchantId}&tab=liquidacao`)}>
                <Button>Voltar à ficha do lojista</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <p className="text-sm text-slate-900 font-medium">{value}</p>
    </div>
  );
}

function ValidationRow({ label, status, description }) {
  const isLoading = status === null;
  const isOk = status === true;
  return (
    <div className={cn(
      'p-4 rounded-lg border flex items-center justify-between',
      isLoading ? 'bg-slate-50 border-slate-200' : isOk ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
    )}>
      <div>
        <p className="font-bold text-sm text-slate-900">{label}</p>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
      ) : (
        <Badge className={isOk ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}>
          {isOk ? '✓ Validado' : '✗ Falha'}
        </Badge>
      )}
    </div>
  );
}