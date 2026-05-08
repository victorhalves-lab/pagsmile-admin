import React, { useState } from 'react';
import { GitBranch, Plus, ArrowRight, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Orchestration Studio — visualização "tipo Zapier" de fluxos de recuperação.
 * DIFERENCIAL — Stripe não tem visualizador de fluxos. Mostra rules visuais editáveis.
 */
export default function OrchestrationStudio() {
  const [flows, setFlows] = useState([
    {
      id: 1,
      name: 'NSF → PIX com desconto',
      enabled: true,
      conversion: 32,
      steps: [
        { type: 'trigger', label: 'Recusa NSF (cód 51)' },
        { type: 'wait', label: 'Aguardar 30min' },
        { type: 'action', label: 'Enviar e-mail' },
        { type: 'action', label: 'Oferecer PIX 5% off' },
      ],
    },
    {
      id: 2,
      name: 'Erro emissor → Fallback',
      enabled: true,
      conversion: 68,
      steps: [
        { type: 'trigger', label: 'Erro 91 detectado' },
        { type: 'action', label: 'Reprocessar via Cielo' },
        { type: 'check', label: 'Verificar resultado' },
      ],
    },
    {
      id: 3,
      name: 'Cartão expirado → Atualização',
      enabled: false,
      conversion: 62,
      steps: [
        { type: 'trigger', label: 'Recusa cód 54' },
        { type: 'action', label: 'Account Updater' },
        { type: 'wait', label: 'Aguardar 7 dias' },
        { type: 'action', label: 'Cobrar novamente' },
      ],
    },
  ]);

  const stepTones = {
    trigger: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    wait: 'bg-amber-100 text-amber-700 border-amber-200',
    action: 'bg-blue-100 text-blue-700 border-blue-200',
    check: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const toggle = (id) => {
    setFlows(fs => fs.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    toast.success('Fluxo atualizado');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm font-semibold">Orchestration Studio</h4>
          <span className="text-[10px] uppercase tracking-wide text-purple-700 bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded-full font-bold">
            Visual
          </span>
        </div>
        <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => toast.info('Editor de fluxo aberto')}>
          <Plus className="w-3.5 h-3.5" />
          Novo fluxo
        </Button>
      </div>

      <div className="space-y-3">
        {flows.map(f => (
          <div key={f.id} className={cn(
            "rounded-lg border p-3 transition-all",
            f.enabled ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-60"
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(f.id)} className="text-slate-500 hover:text-[#2bc196]">
                  {f.enabled ? <ToggleRight className="w-5 h-5 text-[#2bc196]" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <p className="text-sm font-semibold">{f.name}</p>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="font-bold text-emerald-600">{f.conversion}%</span>
                <span className="text-slate-500">conversão</span>
              </div>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {f.steps.map((s, i) => (
                <React.Fragment key={i}>
                  <span className={cn("flex-shrink-0 px-2 py-1 rounded-md text-[10px] font-medium border whitespace-nowrap", stepTones[s.type])}>
                    {s.label}
                  </span>
                  {i < f.steps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}