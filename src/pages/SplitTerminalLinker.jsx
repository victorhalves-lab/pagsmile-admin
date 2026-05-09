import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Sparkles, Save, X as XIcon, ShieldCheck, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mockTargetSplit, mockTerminalsPool } from '@/components/mentor/mocks/splitTerminalLinkerMock';
import SplitTerminalEligibilityList from '@/components/mentor/split/SplitTerminalEligibilityList';
import SplitTerminalDiffPanel from '@/components/mentor/split/SplitTerminalDiffPanel';
import SplitTerminalImpactProjection from '@/components/mentor/split/SplitTerminalImpactProjection';
import { toast } from 'sonner';

export default function SplitTerminalLinker() {
  const split = mockTargetSplit;
  const pool = mockTerminalsPool;

  // IDs originais (já vinculados)
  const originalIds = useMemo(() => pool.filter((t) => t.linked_to_current).map((t) => t.terminal_id), [pool]);
  const [selectedIds, setSelectedIds] = useState(originalIds);
  const [showConfirm, setShowConfirm] = useState(false);
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('');

  // Mapa de terminais
  const terminalsMap = useMemo(() => {
    const m = {};
    pool.forEach((t) => { m[t.terminal_id] = t; });
    return m;
  }, [pool]);

  // Métricas derivadas
  const tpvBefore = useMemo(() => originalIds.reduce((s, id) => s + (terminalsMap[id]?.tpv_30d || 0), 0), [originalIds, terminalsMap]);
  const tpvAfter = useMemo(() => selectedIds.reduce((s, id) => s + (terminalsMap[id]?.tpv_30d || 0), 0), [selectedIds, terminalsMap]);
  const inactivesSelected = useMemo(
    () => selectedIds.filter((id) => terminalsMap[id]?.status === 'inactive').length,
    [selectedIds, terminalsMap]
  );
  const conflictsCount = useMemo(() => pool.filter((t) => t.conflict_split_id).length, [pool]);

  const hasChanges = JSON.stringify(originalIds.slice().sort()) !== JSON.stringify(selectedIds.slice().sort());

  const handleApply = () => {
    if (!justification.trim() || justification.length < 20) {
      toast.error('Justificativa precisa de no mínimo 20 caracteres');
      return;
    }
    if (otp.length !== 6) {
      toast.error('OTP de 6 dígitos é obrigatório');
      return;
    }
    toast.success('Vínculos atualizados com sucesso · evento adicionado ao histórico do split');
    setShowConfirm(false);
    setJustification('');
    setOtp('');
  };

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Vincular Terminais ao Split"
        subtitle="Gerenciar quais terminais participam deste split · diff visual + impacto + validação"
        icon={Terminal}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Splits', page: 'SplitManagement' },
          { label: 'Ficha 360', page: 'SplitDetail360' },
          { label: 'Vincular terminais' },
        ]}
        actions={
          <Badge className="bg-violet-100 text-violet-700 gap-1">
            <Sparkles className="w-3 h-3" /> Mentor · Wave H.3
          </Badge>
        }
      />

      {/* Split alvo */}
      <Card className="border-l-4 border-l-violet-500">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Split alvo</p>
            <p className="font-bold text-slate-900 dark:text-white">{split.split_name}</p>
            <code className="text-[10px] font-mono text-slate-500">{split.split_id}</code>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700">Owner: {split.owner_share}%</Badge>
            <Badge className="bg-emerald-100 text-emerald-700">Merchant: {split.merchant_share}%</Badge>
            <Badge variant="outline">Vigente até {new Date(split.vigency_end).toLocaleDateString('pt-BR')}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Diff + Impacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SplitTerminalDiffPanel
          original={originalIds}
          next={selectedIds}
          terminalsMap={terminalsMap}
        />
        <SplitTerminalImpactProjection
          ownerSharePct={split.owner_share}
          tpvBefore={tpvBefore}
          tpvAfter={tpvAfter}
          conflictsCount={conflictsCount}
          inactivesCount={inactivesSelected}
        />
      </div>

      {/* Lista de terminais */}
      <SplitTerminalEligibilityList
        terminals={pool}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />

      {/* Action bar fixa */}
      <Card className="sticky bottom-4 shadow-xl border-2 border-violet-200">
        <CardContent className="p-3 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {hasChanges ? (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-600" />
                <strong>{Math.abs(selectedIds.length - originalIds.length)}</strong> mudança(s) pendente(s)
              </span>
            ) : (
              <span className="text-slate-400">Nenhuma mudança · ajuste a seleção acima</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(originalIds)}
              disabled={!hasChanges}
            >
              <XIcon className="w-3.5 h-3.5 mr-1" /> Descartar mudanças
            </Button>
            <Button
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={!hasChanges}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Save className="w-3.5 h-3.5 mr-1" /> Aplicar mudanças
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmação com justificativa + OTP */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet-600" /> Confirmar mudança nos vínculos
            </DialogTitle>
            <DialogDescription>
              Esta operação será registrada no histórico do split com seu nome e timestamp.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Justificativa (mínimo 20 caracteres) *</Label>
              <Textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
                placeholder="Ex: Inclusão de novo terminal mobile após aprovação comercial pelo time da TechStore…"
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
              <p className="text-[10px] text-slate-500 mt-0.5">Enviado para o e-mail e telefone cadastrados</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
            <Button onClick={handleApply} className="bg-violet-600 hover:bg-violet-700">
              Confirmar e aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}