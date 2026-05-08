import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, GitBranch, Sparkles } from 'lucide-react';

/**
 * Confirmação rica antes de publicar — diff preview + checklist.
 * Reduz risco de operador "matar" produção sem querer.
 */
export default function PublishConfirmDialog({ open, onOpenChange, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);

  const changes = [
    { type: 'modified', label: 'Cor do botão CTA: #00D26A → #2bc196' },
    { type: 'added', label: 'Adicionado bloco "Trust badges"' },
    { type: 'modified', label: 'Layout: 1-step → 2-steps' },
    { type: 'removed', label: 'Removido campo "Telefone (opcional)"' },
  ];

  const checks = [
    { ok: true, label: 'Webhook configurado' },
    { ok: true, label: 'PIX e Cartão habilitados' },
    { ok: true, label: 'Mobile responsivo (testado)' },
    { ok: false, label: '3DS desabilitado em cartão (atenção)' },
  ];

  const tones = {
    added: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    modified: 'text-amber-700 bg-amber-50 border-amber-200',
    removed: 'text-red-700 bg-red-50 border-red-200',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-600" />
            Publicar checkout em produção?
          </DialogTitle>
          <DialogDescription>
            Esta ação afeta <strong>100% dos novos clientes</strong>. Revise as mudanças.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
              Mudanças desde a versão em produção ({changes.length})
            </p>
            <div className="space-y-1 max-h-40 overflow-auto">
              {changes.map((c, i) => (
                <div key={i} className={`text-xs px-2 py-1.5 rounded border ${tones[c.type]}`}>
                  <span className="font-mono text-[10px] mr-2">
                    {c.type === 'added' ? '+' : c.type === 'removed' ? '−' : '~'}
                  </span>
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
              Pré-flight check
            </p>
            <div className="space-y-1">
              {checks.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {c.ok ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 text-[9px] flex items-center justify-center font-bold">✓</span>
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className={c.ok ? "text-slate-700" : "text-amber-700 font-medium"}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Checkbox checked={confirmed} onCheckedChange={setConfirmed} className="mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Confirmo que revisei as mudanças e quero publicar imediatamente em produção.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            disabled={!confirmed}
            className="bg-[#2bc196] hover:bg-[#25a880] gap-2"
            onClick={() => { onConfirm?.(); onOpenChange(false); setConfirmed(false); }}
          >
            <Sparkles className="w-4 h-4" />
            Publicar agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}