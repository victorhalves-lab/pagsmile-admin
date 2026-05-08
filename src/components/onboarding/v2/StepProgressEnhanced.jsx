import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Clock, User, Building2, ShieldCheck } from 'lucide-react';

/**
 * Progress bar aprimorado com labels descritivos e tempo estimado total.
 * Substitui os 3 dots minimalistas por um stepper rico mas compacto.
 */
const defaultSteps = [
  { id: 1, label: 'Dados', icon: User, time: '2 min' },
  { id: 2, label: 'Plano', icon: Clock, time: '1 min' },
  { id: 3, label: 'Empresa', icon: Building2, time: '3 min' },
  { id: 4, label: 'Compliance', icon: ShieldCheck, time: '5-15 min' },
];

export default function StepProgressEnhanced({ 
  currentStep = 1, 
  steps = defaultSteps,
  totalTimeLabel = '~5-10 min total'
}) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500">
          Etapa {currentStep} de {steps.length}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {totalTimeLabel}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isFuture = currentStep < step.id;
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all border-2",
                  isCompleted && "bg-[#2bc196] border-[#2bc196] text-white",
                  isCurrent && "bg-white border-[#2bc196] text-[#2bc196] shadow-[0_0_0_4px_rgba(43,193,150,0.15)]",
                  isFuture && "bg-white border-slate-200 text-slate-300"
                )}>
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="text-center">
                  <div className={cn(
                    "text-xs font-bold leading-tight",
                    isCompleted && "text-[#2bc196]",
                    isCurrent && "text-slate-900",
                    isFuture && "text-slate-400"
                  )}>
                    {step.label}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">{step.time}</div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={cn(
                  "h-0.5 flex-1 rounded-full -mt-6 transition-colors",
                  isCompleted ? "bg-[#2bc196]" : "bg-slate-200"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}