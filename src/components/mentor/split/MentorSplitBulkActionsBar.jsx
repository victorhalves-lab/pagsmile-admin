import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pause, Play, Ban, Download, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Bulk Actions Bar Mentor para SplitManagement · F2870-F2871, F2807.
 * Permite suspender/reativar/encerrar múltiplos splits + exportação.
 */
export default function MentorSplitBulkActionsBar({ rules = [], selectedIds = [], onChange, onClear }) {
  const [confirmAction, setConfirmAction] = useState(null);
  const [justification, setJustification] = useState('');

  const selectedRules = rules.filter((r) => selectedIds.includes(r.id));
  const allSelected = rules.length > 0 && selectedIds.length === rules.length;

  const toggleAll = () => {
    if (allSelected) onChange([]);
    else onChange(rules.map((r) => r.id));
  };

  const executeAction = () => {
    if ((confirmAction === 'terminate' || confirmAction === 'pause') && justification.length < 20) {
      toast.error('Justificativa precisa de no mínimo 20 caracteres');
      return;
    }
    const labels = { pause: 'pausados', resume: 'reativados', terminate: 'encerrados' };
    toast.success(`${selectedIds.length} split(s) ${labels[confirmAction]} · evento registrado no histórico`);
    setConfirmAction(null);
    setJustification('');
    onClear();
  };

  if (selectedIds.length === 0) {
    // Header fino só com toggle "Selecionar todos"
    return (
      <div className="flex items-center gap-2 px-2 text-xs text-slate-500">
        <Checkbox checked={false} onCheckedChange={toggleAll} />
        <span>Selecionar todos para ações em massa</span>
      </div>
    );
  }

  return (
    <>
      <Card className="border-2 border-violet-300 bg-violet-50 dark:bg-violet-900/20 sticky top-2 z-20 shadow-md">
        <CardContent className="p-2.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            <Badge className="bg-violet-600 text-white">
              {selectedIds.length} selecionado(s)
            </Badge>
            <span className="text-[11px] text-slate-600 hidden sm:inline">
              · TPV agregado: {selectedRules.reduce((s, r) => s + (r.total_volume || 0), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setConfirmAction('pause')}>
              <Pause className="w-3.5 h-3.5 mr-1" /> Pausar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirmAction('resume')}>
              <Play className="w-3.5 h-3.5 mr-1" /> Reativar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => setConfirmAction('terminate')}
            >
              <Ban className="w-3.5 h-3.5 mr-1" /> Encerrar
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Exportação CSV iniciada')}>
              <Download className="w-3.5 h-3.5 mr-1" /> Exportar CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação */}
      <Dialog open={!!confirmAction} onOpenChange={(o) => !o && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmAction === 'terminate' && <AlertTriangle className="w-5 h-5 text-red-600" />}
              {confirmAction === 'pause' && <Pause className="w-5 h-5 text-amber-600" />}
              {confirmAction === 'resume' && <Play className="w-5 h-5 text-emerald-600" />}
              Confirmar ação em massa
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'terminate' && (
                <span className="text-red-700 font-semibold">
                  Encerramento é IRREVERSÍVEL. Splits encerrados não podem ser reativados.
                </span>
              )}
              {confirmAction === 'pause' && 'Splits pausados não roteiam TPV até serem reativados.'}
              {confirmAction === 'resume' && 'Reativar splits previamente pausados.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="bg-slate-50 rounded-lg p-2.5 max-h-40 overflow-y-auto">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                Splits afetados ({selectedRules.length}):
              </p>
              <ul className="space-y-1">
                {selectedRules.slice(0, 8).map((r) => (
                  <li key={r.id} className="text-xs text-slate-700">
                    · {r.name}
                  </li>
                ))}
                {selectedRules.length > 8 && (
                  <li className="text-xs text-slate-500 italic">
                    + {selectedRules.length - 8} outro(s)
                  </li>
                )}
              </ul>
            </div>

            {(confirmAction === 'terminate' || confirmAction === 'pause') && (
              <div>
                <Label className="text-xs">Justificativa (mín. 20 caracteres) *</Label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={3}
                  placeholder="Descreva o motivo da ação em massa…"
                  className="mt-1"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">{justification.length} caractere(s)</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancelar
            </Button>
            <Button
              onClick={executeAction}
              className={
                confirmAction === 'terminate' ? 'bg-red-600 hover:bg-red-700' : 'bg-violet-600 hover:bg-violet-700'
              }
            >
              Confirmar {confirmAction === 'terminate' && '(irreversível)'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}