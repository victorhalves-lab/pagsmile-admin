import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Sparkles, FileSpreadsheet, FileText, Grid3x3, BarChart3, Trophy } from 'lucide-react';
import { MOCK_SPREAD_MDR, MOCK_PLANS_BELOW_MIN } from '@/components/mentor/mocks/spreadMdrMock';
import SpreadMDRKPIBar from './SpreadMDRKPIBar';
import SpreadMDRMatrix from './SpreadMDRMatrix';
import SpreadMDRDecomposer from './SpreadMDRDecomposer';
import SpreadMDREvolutionChart from './SpreadMDREvolutionChart';
import SpreadMDRWhatIfSimulator from './SpreadMDRWhatIfSimulator';
import SpreadMDRPlansBelowMin from './SpreadMDRPlansBelowMin';
import SpreadMDREditDrawer from './SpreadMDREditDrawer';
import SpreadMDRInterProjectsBenchmark from './SpreadMDRInterProjectsBenchmark';
import { toast } from 'sonner';

/**
 * Aba completa Spread MDR — F1521-F1565
 * Para usar dentro de AdminIntProjectDetail
 */
export default function SpreadMDRTab({ projectId }) {
  const [selectedRule, setSelectedRule] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const rules = MOCK_SPREAD_MDR.filter((r) => r.project_id === projectId || projectId === undefined);

  const handleCellClick = (rule) => {
    setSelectedRule(rule);
    setEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 border-violet-200">
        <CardContent className="p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <div className="text-xs text-violet-900 dark:text-violet-200">
            <strong>Matriz tridimensional MDR.</strong> Define o spread mínimo cobrado pela PagSmile em cada combinação
            <strong> bandeira × modalidade × canal</strong>. Spread + MDR base = MDR efetivo cobrado ao lojista.
            Mudanças afetam todos os lojistas vinculados ao projeto.
          </div>
        </CardContent>
      </Card>

      <SpreadMDRKPIBar rules={rules} plansBelowMin={MOCK_PLANS_BELOW_MIN} />

      <SpreadMDRPlansBelowMin plans={MOCK_PLANS_BELOW_MIN} />

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix" className="gap-1.5"><Grid3x3 className="w-3.5 h-3.5" />Matriz heatmap</TabsTrigger>
          <TabsTrigger value="evolution" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Evolução</TabsTrigger>
          <TabsTrigger value="whatif" className="gap-1.5"><Sparkles className="w-3.5 h-3.5" />Simulador</TabsTrigger>
          <TabsTrigger value="benchmark" className="gap-1.5"><Trophy className="w-3.5 h-3.5" />Benchmark</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Exportando XLSX da matriz MDR completa...')}>
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />Exportar XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info('Gerando PDF de apresentação executiva...')}>
              <FileText className="w-3.5 h-3.5 mr-1" />Exportar PDF
            </Button>
            <Button size="sm" onClick={() => toast.info('Drawer de cadastro nova combinação')}>
              <Plus className="w-3.5 h-3.5 mr-1" />Nova combinação
            </Button>
          </div>

          <SpreadMDRMatrix rules={rules} onCellClick={handleCellClick} />

          {selectedRule && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Decomposição da combinação selecionada</CardTitle>
              </CardHeader>
              <CardContent>
                <SpreadMDRDecomposer rule={selectedRule} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="evolution">
          <SpreadMDREvolutionChart />
        </TabsContent>

        <TabsContent value="whatif">
          <SpreadMDRWhatIfSimulator rules={rules} />
        </TabsContent>

        <TabsContent value="benchmark">
          <SpreadMDRInterProjectsBenchmark />
        </TabsContent>
      </Tabs>

      <SpreadMDREditDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        rule={selectedRule}
        onSaved={() => setEditOpen(false)}
      />
    </div>
  );
}