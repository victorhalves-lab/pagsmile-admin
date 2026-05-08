import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Stepper visual aprimorado com:
 * - Estados: pendente / em progresso / completo / erro / com aviso
 * - Indicador de tempo estimado por etapa
 * - Click para navegar entre etapas concluídas
 * - Indicador "rascunho salvo"
 */
export default function OnboardingStepper({ 
  steps = [], 
  currentStep, 
  errors = {},
  onStepClick,
  estimatedMinutes = 8,
  draftSavedAt = null
}) {
  const progress = (currentStep / steps.length) * 100;

  const getStepStatus = (stepId) => {
    if (errors[stepId]) return 'error';
    if (currentStep > stepId) return 'completed';
    if (currentStep === stepId) return 'current';
    return 'pending';
  };

  const statusConfig = {
    completed: { 
      bg: 'bg-emerald-500 text-white', 
      ring: 'ring-emerald-100',
      line: 'bg-emerald-500',
      labelColor: 'text-emerald-700 font-semibold'
    },
    current: { 
      bg: 'bg-blue-500 text-white', 
      ring: 'ring-blue-100 ring-4',
      line: 'bg-slate-200',
      labelColor: 'text-blue-700 font-bold'
    },
    error: { 
      bg: 'bg-red-500 text-white', 
      ring: 'ring-red-100',
      line: 'bg-slate-200',
      labelColor: 'text-red-700 font-semibold'
    },
    pending: { 
      bg: 'bg-slate-200 text-slate-500', 
      ring: '',
      line: 'bg-slate-200',
      labelColor: 'text-slate-500'
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">
              ~{estimatedMinutes} min para concluir
            </span>
          </div>
          {draftSavedAt && (
            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
              <Save className="w-2.5 h-2.5" />
              Rascunho salvo {draftSavedAt}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const config = statusConfig[status];
            const StepIcon = step.icon;
            const isClickable = onStepClick && currentStep > step.id;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-all relative",
                    config.bg,
                    config.ring,
                    isClickable && "cursor-pointer hover:scale-110",
                    !isClickable && "cursor-default"
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : status === 'error' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </button>
                <span className={cn(
                  "ml-2 text-sm hidden md:block",
                  config.labelColor
                )}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    config.line
                  )} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />

        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="text-slate-500">
            Etapa {currentStep} de {steps.length}
          </span>
          <span className="text-slate-700 font-medium">{progress.toFixed(0)}% completo</span>
        </div>
      </CardContent>
    </Card>
  );
}