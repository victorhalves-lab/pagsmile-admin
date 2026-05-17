import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Ban, AlertTriangle, FileText, ShieldCheck, Upload, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useActionWithUndo } from '@/components/common/useActionWithUndo';

/**
 * Mentor F0288–F0316 — Fluxo formal de aplicar bloqueio.
 * Tipo + alçada + documento anexo + OTP + validação CNJ se judicial.
 */
const BLOCKAGE_TYPES = [
  { value: 'antifraud', label: 'Antifraude', desc: 'Padrão suspeito detectado', alcada: ['Risco', 'Compliance'] },
  { value: 'regulatory', label: 'Regulatório', desc: 'Ofício BCB / COAF', alcada: ['Compliance'], requires_doc: true },
  { value: 'judicial', label: 'Judicial', desc: 'Ordem judicial', alcada: ['Compliance', 'Jurídico'], requires_doc: true, requires_cnj: true },
  { value: 'financial', label: 'Financeiro', desc: 'Pendência em aberto', alcada: ['Financeiro', 'Operações'] },
  { value: 'operational', label: 'Operacional', desc: 'Falha técnica / contratual', alcada: ['Operações'] },
  { value: 'commercial', label: 'Comercial', desc: 'Decisão estratégica', alcada: ['Comercial Sr.'] },
];

export default function AdminIntBlockageFlow() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const merchantId = params.get('id') || '12345';

  const [step, setStep] = useState(1);
  const [type, setType] = useState('');
  const [reason, setReason] = useState('');
  const [cnj, setCnj] = useState('');
  const [docUploaded, setDocUploaded] = useState(false);
  const [reviewDate, setReviewDate] = useState('');
  const [otp, setOtp] = useState('');

  const cfg = BLOCKAGE_TYPES.find(t => t.value === type);
  const { triggerAction } = useActionWithUndo();

  const submit = () => {
    triggerAction({
      actionType: 'merchant.block',
      actionLabel: `Bloqueio · ${cfg?.label}`,
      targetSummary: `Merchant #${merchantId} · ${reason.slice(0, 80)}${reason.length > 80 ? '…' : ''}`,
      tone: 'destructive',
      undoWindowSeconds: 60,
      pinnable: true,
      entityId: merchantId,
      payload: {
        type,
        reason,
        cnj: cnj || null,
        doc_uploaded: docUploaded,
        review_date: reviewDate || null,
        otp_verified: true,
      },
    });
    navigate(createPageUrl(`AdminIntMerchantProfile?id=${merchantId}&tab=bloqueios`));
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Aplicar Bloqueio"
        subtitle="Fluxo formal — exige tipo, alçada, documento anexo e OTP"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Lojista', page: `AdminIntMerchantProfile?id=${merchantId}` },
          { label: 'Aplicar Bloqueio' },
        ]}
        icon={Ban}
      />

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-900">
            <p className="font-bold">Ação irreversível sem desbloqueio formal</p>
            <p className="text-xs mt-1">Bloqueios suspendem capturas, saques e antecipações imediatamente. Para reverter, é preciso passar pelo fluxo de desbloqueio.</p>
          </div>
        </CardContent>
      </Card>

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Tipo de bloqueio</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {BLOCKAGE_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={cn(
                  'w-full text-left p-3 rounded-lg border-2 transition-all',
                  type === t.value ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">{t.label}</p>
                    <p className="text-xs text-slate-600">{t.desc}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-slate-500">Alçada:</span>
                      {t.alcada.map(a => <Badge key={a} variant="outline" className="text-[10px]">{a}</Badge>)}
                    </div>
                  </div>
                  {t.requires_doc && <Badge className="bg-amber-100 text-amber-700 text-[10px]">Doc obrigatório</Badge>}
                </div>
              </button>
            ))}
            <div className="flex justify-end pt-3">
              <Button onClick={() => setStep(2)} disabled={!type}>Continuar <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Detalhes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Justificativa *</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Descreva o motivo do bloqueio em detalhe..." rows={4} />
            </div>

            {cfg?.requires_cnj && (
              <div>
                <Label>Número CNJ da ordem judicial *</Label>
                <Input value={cnj} onChange={(e) => setCnj(e.target.value)} placeholder="0000000-00.0000.0.00.0000" className="font-mono" />
                <p className="text-[11px] text-slate-500 mt-1">Formato CNJ obrigatório (20 dígitos)</p>
              </div>
            )}

            {cfg?.requires_doc && (
              <div>
                <Label>Documento anexo *</Label>
                <button
                  onClick={() => setDocUploaded(true)}
                  className={cn(
                    'w-full p-4 border-2 border-dashed rounded-lg text-center transition-colors',
                    docUploaded ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-slate-400'
                  )}
                >
                  {docUploaded ? (
                    <div className="text-emerald-700">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-sm font-bold">oficio_bcb_2026_0145.pdf</p>
                      <p className="text-xs">Documento anexado</p>
                    </div>
                  ) : (
                    <div className="text-slate-500">
                      <Upload className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-sm font-bold">Clique para anexar</p>
                      <p className="text-xs">PDF, JPG ou PNG — até 10MB</p>
                    </div>
                  )}
                </button>
              </div>
            )}

            <div>
              <Label>Data de revisão programada (opcional)</Label>
              <Input type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
              <p className="text-[11px] text-slate-500 mt-1">Sem data = revisão automática em 90 dias</p>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="w-4 h-4 mr-1" /> Voltar</Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!reason || (cfg?.requires_cnj && !cnj) || (cfg?.requires_doc && !docUploaded)}
              >
                Continuar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Confirmação com OTP</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 space-y-1 text-sm">
              <p><strong>Tipo:</strong> {cfg?.label}</p>
              <p><strong>Justificativa:</strong> {reason}</p>
              {cnj && <p><strong>CNJ:</strong> <code>{cnj}</code></p>}
              {docUploaded && <p><strong>Documento:</strong> anexado ✓</p>}
              <p><strong>Revisão:</strong> {reviewDate || 'Automática em 90 dias'}</p>
            </div>
            <div>
              <Label>Código OTP do operador *</Label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="000000" className="font-mono text-center text-xl tracking-widest" />
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)}><ChevronLeft className="w-4 h-4 mr-1" /> Voltar</Button>
              <Button onClick={submit} variant="destructive" disabled={otp.length !== 6}>
                <Ban className="w-4 h-4 mr-1" /> Aplicar bloqueio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}