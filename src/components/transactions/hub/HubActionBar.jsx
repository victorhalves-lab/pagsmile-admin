import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Sparkles } from 'lucide-react';
import ExportDropdown from './ExportDropdown';
import LastUpdatedIndicator from './LastUpdatedIndicator';
import NewManualTransactionModal from './NewManualTransactionModal';
import ImportCSVModal from './ImportCSVModal';

/**
 * Barra de ações principal do hub.
 * Agrupa: Nova tx manual, Importar CSV, Exportar, Última atualização, abrir DIA.
 */
export default function HubActionBar({ onToggleDia }) {
  const [newOpen, setNewOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <LastUpdatedIndicator />

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)} className="gap-2">
            <Upload className="w-4 h-4" />
            Importar CSV
          </Button>
          <Button size="sm" onClick={() => setNewOpen(true)} className="gap-2 bg-[#2bc196] hover:bg-[#25a880] text-white">
            <Plus className="w-4 h-4" />
            Nova transação
          </Button>
          <ExportDropdown />
          <Button variant="outline" size="sm" onClick={onToggleDia} className="gap-2 border-[#2bc196]/30 text-[#2bc196] hover:bg-[#2bc196]/10">
            <Sparkles className="w-4 h-4" />
            DIA
          </Button>
        </div>
      </div>

      <NewManualTransactionModal open={newOpen} onOpenChange={setNewOpen} />
      <ImportCSVModal open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}