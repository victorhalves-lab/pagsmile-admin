import React, { useState } from 'react';
import { Users, TrendingUp, Filter } from 'lucide-react';
import CohortAnalysisPanel from './crm/CohortAnalysisPanel';
import CohortPresetSelector from './crm/CohortPresetSelector';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Aba CRM — começa com Cohort Analysis.
 * Estrutura preparada para receber futuras features de CRM (segmentação, campanhas).
 */
export default function CRMView() {
  const [activePreset, setActivePreset] = useState('first_purchase');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">CRM & Cohort Analysis</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Segmente clientes e analise retenção, LTV e comportamento por coorte.</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-white"
          onClick={() => toast.info('Filtro de transações aplicado a partir desta coorte')}
        >
          <Filter className="w-4 h-4 mr-1.5" />
          Aplicar como filtro
        </Button>
      </div>

      <CohortPresetSelector active={activePreset} onChange={setActivePreset} />
      <CohortAnalysisPanel preset={activePreset} />

      {/* Placeholder para futuras features */}
      <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
        <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Mais features de CRM em breve</p>
        <p className="text-xs text-slate-400 mt-1">
          Segmentação avançada · Campanhas de e-mail · Win-back automático · NPS · Lifetime value preditivo
        </p>
      </div>
    </div>
  );
}