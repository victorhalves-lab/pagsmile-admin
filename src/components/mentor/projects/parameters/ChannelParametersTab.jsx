import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Plus, Sparkles } from 'lucide-react';
import { MOCK_CHANNEL_PARAMETERS, MOCK_PARAMETER_CHANGES_TIMELINE } from '@/components/mentor/mocks/channelParametersMock';
import ChannelParametersKPIBar from './ChannelParametersKPIBar';
import ChannelParametersTable from './ChannelParametersTable';
import ChannelParametersDrawer from './ChannelParametersDrawer';
import ChannelParametersTimeline from './ChannelParametersTimeline';

/**
 * Aba completa de Parâmetros Financeiros por Canal — F1481-F1520
 * Para usar dentro de AdminIntProjectDetail (Tab "Parâmetros por Canal")
 */
export default function ChannelParametersTab({ projectId }) {
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const parameters = MOCK_CHANNEL_PARAMETERS.filter((p) => p.project_id === projectId || projectId === undefined);
  const events = MOCK_PARAMETER_CHANGES_TIMELINE;

  const handleEdit = (p) => {
    setSelected(p);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border-blue-200">
        <CardContent className="p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-900 dark:text-blue-200">
            <strong>Núcleo financeiro do projeto.</strong> Estes parâmetros definem prazos mínimos de liquidação,
            spread cobrado pela PagSmile sobre processamento e configuração de antecipação. Cada canal tem seu conjunto próprio.
            Mudanças geram trilha auditável e podem demandar comunicação prévia aos lojistas vinculados.
          </div>
        </CardContent>
      </Card>

      <ChannelParametersKPIBar parameters={parameters} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />Parâmetros configurados por canal
            </span>
            <Button size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />Novo canal
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChannelParametersTable parameters={parameters} onEdit={handleEdit} />
        </CardContent>
      </Card>

      <ChannelParametersTimeline events={events} />

      <ChannelParametersDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        parameter={selected}
        onSaved={() => {
          setDrawerOpen(false);
        }}
      />
    </div>
  );
}