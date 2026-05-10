import React, { useState, useMemo } from 'react';
import { CheckCircle2, ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Link, useNavigate } from 'react-router-dom';
import { CHECKUP_MOCKS, CHECKUP_TYPES, CHECKUP_SEVERITIES } from '@/components/checkup/mocks/checkupMock';

function StepIndicator({ step, current }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${current >= step.num ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${current > step.num ? 'bg-emerald-500 text-white' : current === step.num ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
        {current > step.num ? '✓' : step.num}
      </div>
      <span className="text-sm font-medium">{step.label}</span>
    </div>
  );
}

export default function AdminIntCheckupAuthorizeFlow() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const ids = (params.get('ids') || '').split(',').filter(Boolean);
  const items = useMemo(() => CHECKUP_MOCKS.filter(c => ids.includes(c.id)), [ids]);
  const totalValue = items.reduce((s, c) => s + c.amount, 0);

  const [step, setStep] = useState(1);
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('');
  const [attachment, setAttachment] = useState('');
  const [executing, setExecuting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const requiresExecutiveLevel = totalValue > 1_000_000;
  const requiresAttachment = totalValue > 500_000;

  const validation = useMemo(() => {
    const errors = [];
    const warnings = [];
    items.forEach(item => {
      if (item.type !== 'authorization_orphan' && item.type !== 'capture_orphan') {
        errors.push({ id: item.id, msg: `Tipo "${CHECKUP_TYPES[item.type].label}" não é elegível para autorização forçada` });
      }
      if (item.tags.includes('pld_ft')) {
        warnings.push({ id: item.id, msg: 'Tag PLD-FT — exige análise diferenciada' });
      }
    });
    return { errors, warnings, eligibleCount: items.length - errors.length };
  }, [items]);

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setCompleted(true);
    }, 2000);
  };

  if (completed) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Autorização Concluída</h2>
          <p className="text-slate-600 mb-4">
            {validation.eligibleCount} transações autorizadas com sucesso · Valor agregado: R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="text-xs text-slate-500 mb-6 font-mono">
            ID Auditoria: aud_{Math.random().toString(36).slice(2, 12)}
          </div>
          <div className="flex justify-center gap-2">
            <Button onClick={() => navigate('/AdminIntCheckupHub')}>Voltar à Fila</Button>
            <Button variant="outline" onClick={() => navigate('/AdminIntHistoryHub')}>Ver Trilha Auditável</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        icon={CheckCircle2}
        title="Autorização Forçada via Diagnóstico"
        subtitle="Mentor API · ORIGEM 195 · Operação Sensível · Requer OTP + alçada + justificativa"
        breadcrumbs={[
          { label: 'Diagnósticos', page: 'AdminIntCheckupHub' },
          { label: 'Autorização em Lote' },
        ]}
        actions={
          <Link to="/AdminIntCheckupHub">
            <Button variant="ghost" className="gap-1"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
          </Link>
        }
      />

      {/* Steps */}
      <div className="flex flex-wrap gap-2">
        <StepIndicator step={{ num: 1, label: 'Validação' }} current={step} />
        <StepIndicator step={{ num: 2, label: 'Justificativa' }} current={step} />
        <StepIndicator step={{ num: 3, label: 'OTP & Confirmação' }} current={step} />
      </div>

      {/* Resumo */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-blue-700 font-bold">Lote a Autorizar</div>
            <div className="text-2xl font-black mt-1">{items.length} transação(ões)</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase text-slate-600 font-bold">Valor Agregado</div>
            <div className="text-2xl font-black text-blue-700">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </Card>

      {step === 1 && (
        <>
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600" /> Validações Automáticas</h3>
            <div className="space-y-2">
              {validation.errors.length > 0 && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <div className="ml-2">
                    <div className="font-semibold text-red-800">{validation.errors.length} item(ns) inelegíveis serão rejeitados:</div>
                    <ul className="text-xs mt-1 space-y-0.5">
                      {validation.errors.map((e, i) => <li key={i}>• {e.id}: {e.msg}</li>)}
                    </ul>
                  </div>
                </Alert>
              )}
              {validation.warnings.length > 0 && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <div className="ml-2">
                    <div className="font-semibold text-amber-800">{validation.warnings.length} alerta(s):</div>
                    <ul className="text-xs mt-1 space-y-0.5">
                      {validation.warnings.map((w, i) => <li key={i}>• {w.id}: {w.msg}</li>)}
                    </ul>
                  </div>
                </Alert>
              )}
              {requiresExecutiveLevel && (
                <Alert className="bg-purple-50 border-purple-200">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <div className="ml-2 text-sm">
                    <strong>Alçada Executiva exigida</strong> — valor agregado &gt; R$ 1M requer aprovação de Diretoria.
                  </div>
                </Alert>
              )}
              {validation.errors.length === 0 && validation.warnings.length === 0 && (
                <div className="flex items-center gap-2 text-emerald-700 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Todas as validações passaram. {validation.eligibleCount} elegíveis para autorização.
                </div>
              )}
            </div>
          </Card>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={validation.eligibleCount === 0}>Próximo</Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Card className="p-4 space-y-3">
            <div>
              <Label>Justificativa textual <span className="text-red-500">*</span></Label>
              <Textarea 
                placeholder="Mínimo 50 caracteres. Ex: Regularização após confirmação formal do adquirente Cielo via ofício 2026/0042 sobre indisponibilidade ocorrida em 09/05/2026 das 14h às 15h..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={4}
              />
              <div className="text-xs text-slate-500 mt-1">{justification.length}/50 caracteres mínimos</div>
            </div>
            <div>
              <Label>Anexar evidência documental {requiresAttachment && <span className="text-red-500">* obrigatório</span>}</Label>
              <Input 
                placeholder="URL do documento anexo ou ID de arquivo no sistema"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
              />
              <div className="text-xs text-slate-500 mt-1">
                {requiresAttachment ? '⚠ Valor agregado > R$ 500k exige evidência documental' : 'Opcional, mas recomendado em casos sensíveis'}
              </div>
            </div>
          </Card>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
            <Button 
              onClick={() => setStep(3)} 
              disabled={justification.length < 50 || (requiresAttachment && !attachment)}
            >Próximo</Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-semibold">
              <ShieldCheck className="w-5 h-5" /> Confirmação Final · Operação Sensível
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-slate-500">Lote:</span> <strong>{validation.eligibleCount} transações</strong></div>
              <div><span className="text-slate-500">Valor:</span> <strong>R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
              <div><span className="text-slate-500">Justificativa:</span> <em>"{justification.slice(0, 80)}..."</em></div>
            </div>
            <div className="border-t pt-3">
              <Label>Token OTP (6 dígitos do app autenticador)</Label>
              <Input 
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="font-mono text-2xl text-center tracking-widest"
              />
            </div>
          </Card>
          <Card className="p-3 bg-amber-50 border-amber-200">
            <div className="text-xs text-amber-800">
              ⚠ Esta operação modifica estado financeiro: gera pagamentos ao lojista, aplica MDR, atualiza registradora, dispara webhooks. Auditável em <Link to="/AdminIntHistoryHub" className="underline">Trilha Universal</Link>.
            </div>
          </Card>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 gap-1"
              onClick={handleExecute} 
              disabled={otp.length !== 6 || executing}
            >
              {executing ? '⏳ Executando...' : <><CheckCircle2 className="w-4 h-4" /> Executar Autorização</>}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}