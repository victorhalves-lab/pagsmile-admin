import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Sparkles, Save, X as XIcon, ShieldCheck, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockCurrentSplitState, CHANGE_SENSITIVITY } from '@/components/mentor/mocks/splitEditFlowMock';
import MentorSplitProposedConfigEditor from '@/components/mentor/split/MentorSplitProposedConfigEditor';
import MentorSplitChangeDiffViewer from '@/components/mentor/split/MentorSplitChangeDiffViewer';
import MentorSplitContractualNoticeAdvisor from '@/components/mentor/split/MentorSplitContractualNoticeAdvisor';
import MentorSplitCutoverScheduler from '@/components/mentor/split/MentorSplitCutoverScheduler';
import { toast } from 'sonner';

export default function SplitEditFlow() {
  const current = mockCurrentSplitState;
  const [proposed, setProposed] = useState({
    owner_share: current.owner_share,
    merchant_share: current.merchant_share,
    additional_share: current.additional_share,
    charge_processing_fee: current.charge_processing_fee,
    applicable_brands: current.applicable_brands,
    applicable_types: current.applicable_types,
  });
  const [cutover, setCutover] = useState({
    mode: 'scheduled',
    effective_date: '',
    effective_time: '03:00',
    notify_advance_days: 7,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('');

  const changes = useMemo(() => {
    const list = [];
    Object.keys(proposed).forEach((key) => {
      const fromVal = current[key];
      const toVal = proposed[key];
      const isArr = Array.isArray(fromVal);
      const changed = isArr ? JSON.stringify(fromVal) !== JSON.stringify(toVal) : fromVal !== toVal;
      if (!changed) return;
      const meta = CHANGE_SENSITIVITY[key] || { level: 'low', label: key, requires_notice: false };
      list.push({
        field: key,
        label: meta.label,
        level: meta.level,
        requires_notice: meta.requires_notice,
        from: isArr ? fromVal.join(', ') : String(fromVal),
        to: isArr ? toVal.join(', ') : String(toVal),
      });
    });
    return list;
  }, [proposed, current]);

  const requiresNotice = changes.some((c) => c.requires_notice);
  const noticeDays = current.contract_notice_clause?.notice_days || 30;
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + noticeDays);

  const proposedDate = cutover.effective_date ? new Date(cutover.effective_date) : null;
  const respectsNotice = !requiresNotice ? true : proposedDate && proposedDate >= minDate;

  const canApply =
    changes.length > 0 &&
    (proposed.owner_share + proposed.merchant_share + (proposed.additional_share || 0)) === 100 &&
    (cutover.mode === 'immediate' || cutover.effective_date);

  const handleSubmit = () => {
    if (!justification.trim() || justification.length < 30) {
      toast.error('Justificativa precisa de no mínimo 30 caracteres para mudanças contratuais');
      return;
    }
    if (otp.length !== 6) {
      toast.error('OTP de 6 dígitos é obrigatório');
      return;
    }
    if (requiresNotice && cutover.mode === 'immediate') {
      toast.warning('Aplicando mudança contratual sem aviso prévio · isto será registrado no histórico');
    }
    toast.success(
      cutover.mode === 'immediate'
        ? 'Mudança aplicada imediatamente · evento registrado no histórico'
        : `Cutover agendado para ${cutover.effective_date} às ${cutover.effective_time}`
    );
    setShowConfirm(false);
    setJustification('');
    setOtp('');
  };

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Editar Split"
        subtitle="Fluxo com aviso prévio contratual + cutover programado"
        icon={Edit3}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Splits', page: 'SplitManagement' },
          { label: 'Ficha 360', page: 'SplitDetail360' },
          { label: 'Editar' },
        ]}
      />

      <Card className="border-l-4 border-l-violet-500">
        <CardContent className="p-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{current.split_name}</p>
            <code className="text-[10px] font-mono text-slate-500">{current.split_id}</code>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-100 text-emerald-700">Status: Ativo</Badge>
            <Badge variant="outline">Vigente até {new Date(current.vigency_end).toLocaleDateString('pt-BR')}</Badge>
            {current.contract_notice_clause?.has_clause && (
              <Badge className="bg-violet-100 text-violet-700">
                Aviso prévio: {current.contract_notice_clause.notice_days}d
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MentorSplitProposedConfigEditor current={current} proposed={proposed} onChange={setProposed} />
        <MentorSplitChangeDiffViewer changes={changes} />
      </div>

      {changes.length > 0 && (
        <>
          <MentorSplitContractualNoticeAdvisor
            changes={changes}
            contractClause={current.contract_notice_clause}
            proposedEffectiveDate={cutover.effective_date}
          />
          <MentorSplitCutoverScheduler
            value={cutover}
            onChange={setCutover}
            minDate={requiresNotice ? minDate.toISOString().slice(0, 10) : null}
          />
        </>
      )}

      <Card className="sticky bottom-4 shadow-xl border-2 border-violet-200">
        <CardContent className="p-3 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {changes.length === 0 ? (
              <span className="text-slate-400">Nenhuma mudança · ajuste a configuração proposta acima</span>
            ) : (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-600" />
                <strong>{changes.length}</strong> mudança(s) ·{' '}
                {requiresNotice && (
                  <span className="text-amber-700 font-semibold">
                    {respectsNotice ? '✅ aviso prévio OK' : '⚠️ aviso prévio pendente'}
                  </span>
                )}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <XIcon className="w-3.5 h-3.5 mr-1" /> Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={!canApply}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              {cutover.mode === 'immediate' ? 'Aplicar agora' : 'Agendar cutover'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet-600" /> Confirmar mudança no split
            </DialogTitle>
            <DialogDescription>
              {requiresNotice
                ? 'Esta operação envolve mudanças contratuais sensíveis · será registrada com sua identidade.'
                : 'A mudança será registrada no histórico do split.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-2.5 text-xs space-y-1">
              <p>
                <strong>{changes.length}</strong> mudança(s) detectada(s)
                {changes.filter((c) => c.requires_notice).length > 0 && (
                  <span className="text-red-700"> · {changes.filter((c) => c.requires_notice).length} sensíveis</span>
                )}
              </p>
              <p>
                <strong>Cutover:</strong>{' '}
                {cutover.mode === 'immediate'
                  ? 'Imediato'
                  : `${new Date(cutover.effective_date).toLocaleDateString('pt-BR')} às ${cutover.effective_time}`}
              </p>
              {requiresNotice && cutover.mode === 'scheduled' && (
                <p>
                  <strong>Aviso prévio:</strong> {respectsNotice ? '✅ respeitado' : '⚠️ NÃO atendido'}
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs">Justificativa (mínimo 30 caracteres) *</Label>
              <Textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
                placeholder="Descreva o motivo da renegociação · referências contratuais · acordo comercial…"
                className="mt-1"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">{justification.length} caractere(s)</p>
            </div>
            <div>
              <Label className="text-xs">Código OTP de 6 dígitos *</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="mt-1 font-mono tracking-widest text-center text-lg"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700">
              Confirmar e {cutover.mode === 'immediate' ? 'aplicar' : 'agendar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}