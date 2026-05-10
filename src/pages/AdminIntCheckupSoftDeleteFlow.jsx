import React, { useState, useMemo } from 'react';
import { Trash2, ShieldCheck, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Link, useNavigate } from 'react-router-dom';
import { CHECKUP_MOCKS } from '@/components/checkup/mocks/checkupMock';

export default function AdminIntCheckupSoftDeleteFlow() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const ids = (params.get('ids') || '').split(',').filter(Boolean);
  const items = useMemo(() => CHECKUP_MOCKS.filter(c => ids.includes(c.id)), [ids]);
  const totalValue = items.reduce((s, c) => s + c.amount, 0);

  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('false_positive');
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('');
  const [executing, setExecuting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const cascadeImpact = useMemo(() => {
    return {
      payments_to_cancel: items.filter(i => i.status === 'in_treatment').length,
      urs_to_cancel: items.filter(i => i.amount > 1000).length,
      anticipations_to_revert: items.filter(i => i.installments > 1).length,
    };
  }, [items]);

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => { setExecuting(false); setCompleted(true); }, 2000);
  };

  if (completed) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card className="p-8 text-center bg-gradient-to-br from-rose-50 to-purple-50 border-rose-200">
          <Trash2 className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Soft Delete Concluído</h2>
          <p className="text-slate-600 mb-4">
            {items.length} transações removidas logicamente · Dados preservados para conformidade regulatória
          </p>
          <div className="text-xs text-slate-500 mb-6 font-mono">
            ID Auditoria: aud_{Math.random().toString(36).slice(2, 12)}
          </div>
          <div className="flex justify-center gap-2">
            <Button onClick={() => navigate('/AdminIntCheckupHub')}>Voltar à Fila</Button>
            <Button variant="outline" onClick={() => navigate('/AdminIntHistoryHub')}>Ver Trilha</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        icon={Trash2}
        title="Soft Delete via Diagnóstico"
        subtitle="Mentor API · ORIGEM 196 · Remoção lógica preservando dados (BCB 4.595)"
        breadcrumbs={[
          { label: 'Diagnósticos', page: 'AdminIntCheckupHub' },
          { label: 'Soft Delete em Lote' },
        ]}
        actions={
          <Link to="/AdminIntCheckupHub">
            <Button variant="ghost" className="gap-1"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
          </Link>
        }
      />

      <Card className="p-4 bg-rose-50 dark:bg-rose-900/20 border-rose-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-rose-700 font-bold">Lote a Remover Logicamente</div>
            <div className="text-2xl font-black mt-1">{items.length} transação(ões)</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase text-slate-600 font-bold">Valor Agregado</div>
            <div className="text-2xl font-black text-rose-700">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-rose-700 italic">
          🛡️ Soft Delete preserva integralmente os dados — auditorias podem consultar registros removidos. NUNCA executa hard delete.
        </div>
      </Card>

      {step === 1 && (
        <>
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-600" /> Cascata de Impactos Downstream</h3>
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 bg-amber-50 border-amber-200">
                <div className="text-xs uppercase font-bold text-amber-700">Pagamentos a Cancelar</div>
                <div className="text-2xl font-black">{cascadeImpact.payments_to_cancel}</div>
              </Card>
              <Card className="p-3 bg-purple-50 border-purple-200">
                <div className="text-xs uppercase font-bold text-purple-700">URs a Cancelar (Registradora)</div>
                <div className="text-2xl font-black">{cascadeImpact.urs_to_cancel}</div>
              </Card>
              <Card className="p-3 bg-blue-50 border-blue-200">
                <div className="text-xs uppercase font-bold text-blue-700">Antecipações a Reverter</div>
                <div className="text-2xl font-black">{cascadeImpact.anticipations_to_revert}</div>
              </Card>
            </div>
            <Alert className="mt-3 bg-blue-50 border-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <div className="ml-2 text-sm">
                Sistema executará reversão automática em todos os sistemas downstream após confirmação.
              </div>
            </Alert>
          </Card>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)}>Próximo</Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Card className="p-4 space-y-3">
            <div>
              <Label>Motivo do soft delete <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { v: 'false_positive', label: 'Falso positivo confirmado' },
                  { v: 'duplicate', label: 'Transação duplicada (bug)' },
                  { v: 'invalid', label: 'Transação inválida' },
                  { v: 'incident_cleanup', label: 'Limpeza pós-incidente técnico' },
                ].map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => setReason(opt.v)}
                    className={`p-2 rounded-lg border text-left text-sm ${reason === opt.v ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Justificativa detalhada <span className="text-red-500">*</span></Label>
              <Textarea 
                placeholder="Mínimo 50 caracteres. Explique claramente por que estas transações devem ser removidas. Esta justificativa será preservada na trilha auditável e consultada em auditorias futuras..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={4}
              />
              <div className="text-xs text-slate-500 mt-1">{justification.length}/50 caracteres mínimos</div>
            </div>
          </Card>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
            <Button onClick={() => setStep(3)} disabled={justification.length < 50}>Próximo</Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-semibold">
              <ShieldCheck className="w-5 h-5" /> Confirmação Final · Operação Sensível
            </div>
            <Label>Token OTP (6 dígitos)</Label>
            <Input 
              type="text" inputMode="numeric" maxLength={6} placeholder="000000"
              value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="font-mono text-2xl text-center tracking-widest"
            />
          </Card>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
            <Button variant="destructive" onClick={handleExecute} disabled={otp.length !== 6 || executing} className="gap-1">
              {executing ? '⏳ Executando...' : <><Trash2 className="w-4 h-4" /> Executar Soft Delete</>}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}