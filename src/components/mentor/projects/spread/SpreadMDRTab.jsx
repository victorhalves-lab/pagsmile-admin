import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { MOCK_SPREAD_MDR, MOCK_PLANS_BELOW_MINIMUM } from '@/components/mentor/mocks/spreadMDRMock';
import SpreadMDRKPIBar from './SpreadMDRKPIBar';
import SpreadMDRMatrix from './SpreadMDRMatrix';
import SpreadMDRDecomposer from './SpreadMDRDecomposer';
import SpreadMDREvolutionChart from './SpreadMDREvolutionChart';
import SpreadMDRWhatIfSimulator from './SpreadMDRWhatIfSimulator';
import SpreadMDRBenchmark from './SpreadMDRBenchmark';
import SpreadMDRPlansBelowAlert from './SpreadMDRPlansBelowAlert';
import SpreadMDREditDrawer from './SpreadMDREditDrawer';
import SpreadMDRExportPanel from './SpreadMDRExportPanel';
import { CommunicationDispatcherDrawer } from '@/components/mentor';
import { toast } from 'sonner';

/**
 * Aba completa de Spread MDR — F1521-F1565
 */
export default function SpreadMDRTab({ projectId }) {
  const [matrix] = useState(MOCK_SPREAD_MDR.filter((m) => m.project_id === projectId || projectId === undefined));
  const [selected, setSelected] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commOpen, setCommOpen] = useState(false);
  const [commTarget, setCommTarget] = useState(null);

  const handleCellClick = (cell, creating) => {
    setSelected(cell);
    setIsCreating(creating);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setSelected({ brand: '', modality: '', channel: 'ecommerce', mdr_base: 0, spread: 0 });
    setIsCreating(true);
    setDrawerOpen(true);
  };

  const handleApplyWhatIf = ({ scope, scopeValue, delta }) => {
    toast.info(`Aplicação em massa: ${scope === 'all' ? 'todas combinações' : `${scope} ${scopeValue}`} · ${delta > 0 ? '+' : ''}${delta.toFixed(2)}pp · revisar uma por uma`);
  };

  const handleCommunicate = (plan) => {
    setCommTarget(plan);
    setCommOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border-violet-200">
        <CardContent className="p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <div className="text-xs text-violet-900 dark:text-violet-200">
            <strong>Matriz tridimensional Spread MDR.</strong> Define o piso de margem cobrado pela PagSmile em cada combinação
            <strong> bandeira × modalidade × canal</strong>. Planos comerciais não podem ter MDR abaixo deste mínimo.
            Mudanças requerem trilha auditável e podem disparar comunicação aos lojistas afetados.
          </div>
        </CardContent>
      </Card>

      <SpreadMDRKPIBar matrix={matrix} plansBelow={MOCK_PLANS_BELOW_MINIMUM} />

      <SpreadMDRPlansBelowAlert plans={MOCK_PLANS_BELOW_MINIMUM} onCommunicate={handleCommunicate} />

      <SpreadMDRMatrix matrix={matrix} onCellClick={handleCellClick} onAdd={handleAdd} />

      {selected && !drawerOpen && !isCreating && <SpreadMDRDecomposer cell={selected} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpreadMDREvolutionChart />
        <SpreadMDRBenchmark />
      </div>

      <SpreadMDRWhatIfSimulator matrix={matrix} onApply={handleApplyWhatIf} />

      <SpreadMDRExportPanel />

      <SpreadMDREditDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        cell={selected}
        isCreating={isCreating}
        onSaved={() => {}}
      />

      <CommunicationDispatcherDrawer
        open={commOpen}
        onOpenChange={setCommOpen}
        recipients={commTarget ? [{ name: `${commTarget.merchants} lojistas do plano ${commTarget.plan_name}`, category: 'plano abaixo do mínimo' }] : []}
        defaultTemplate="rate_change"
        context={commTarget ? `Plano "${commTarget.plan_name}" precisa ser revisado · MDR atual ${commTarget.current_mdr}% < novo mínimo ${commTarget.new_min}%` : ''}
      />
    </div>
  );
}