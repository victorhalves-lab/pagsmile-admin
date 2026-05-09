import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SideDrawer from '@/components/common/SideDrawer';
import { CheckCircle2, AlertTriangle, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ConfirmActionDrawer — Drawer especializado para ações tipo "Publicar / Promover / Aprovar / Aplicar sugestão".
 *
 * Props principais:
 *  - title, description, icon
 *  - tone: 'default' | 'success' | 'warning' | 'destructive'
 *  - checklist: [{ label, ok, hint? }]   — pré-condições
 *  - impactBefore / impactAfter         — cards comparativos opcionais
 *  - infoBlock                          — markdown ou string extra
 *  - confirmLabel (default: 'Confirmar')
 *  - confirmDisabled (boolean)
 *  - onConfirm: () => void | Promise<void>
 *  - submitting
 *  - children                          — conteúdo customizado adicional
 */
export default function ConfirmActionDrawer({
  open,
  onOpenChange,
  title,
  description,
  icon,
  tone = 'default',
  checklist,
  impactBefore,
  impactAfter,
  infoBlock,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmDisabled = false,
  onConfirm,
  submitting = false,
  size = 'md',
  children,
}) {
  const blocking = checklist?.some((c) => c.ok === false) || false;
  const finalDisabled = confirmDisabled || blocking || submitting;

  const toneClasses = {
    default: 'bg-[#2bc196]/10 text-[#2bc196]',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    destructive: 'bg-red-100 text-red-700',
  };

  const submitVariant = tone === 'destructive' ? 'destructive' : 'default';

  const handleConfirm = async () => {
    if (finalDisabled) return;
    if (onConfirm) await onConfirm();
  };

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-slate-500">
        {blocking && (
          <span className="flex items-center gap-1 text-amber-600">
            <AlertTriangle className="w-3 h-3" />
            Resolva os itens pendentes para continuar
          </span>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
          {cancelLabel}
        </Button>
        <Button onClick={handleConfirm} disabled={finalDisabled} variant={submitVariant}>
          {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {confirmLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      icon={icon}
      iconClassName={toneClasses[tone]}
      size={size}
      footer={footer}
    >
      <div className="space-y-5">
        {/* Checklist de pré-condições */}
        {checklist && checklist.length > 0 && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Checklist de validação</p>
            {checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {item.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <span className={cn(item.ok ? 'text-slate-700 dark:text-slate-200' : 'text-amber-700 font-medium')}>
                    {item.label}
                  </span>
                  {item.hint && <p className="text-xs text-slate-500 mt-0.5">{item.hint}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comparação antes/depois */}
        {(impactBefore || impactAfter) && (
          <div className="grid grid-cols-2 gap-3">
            {impactBefore && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3">
                <p className="text-[10px] uppercase text-slate-500 font-semibold mb-2">Antes</p>
                <div className="text-sm">{impactBefore}</div>
              </div>
            )}
            {impactAfter && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 p-3">
                <p className="text-[10px] uppercase text-emerald-700 font-semibold mb-2">Depois</p>
                <div className="text-sm">{impactAfter}</div>
              </div>
            )}
          </div>
        )}

        {/* Info block */}
        {infoBlock && (
          <div className="flex gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>{infoBlock}</div>
          </div>
        )}

        {/* Conteúdo livre */}
        {children}
      </div>
    </SideDrawer>
  );
}