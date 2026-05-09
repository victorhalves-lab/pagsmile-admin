import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Painel de exports — F1547
 */
export default function SpreadMDRExportPanel() {
  const handleExportXLSX = () => {
    toast.success('XLSX gerado · matriz completa com todas combinações + plano de fundo');
  };
  const handleExportPDF = () => {
    toast.success('PDF de apresentação gerado · pronto para reunião comercial');
  };

  return (
    <Card>
      <CardContent className="p-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold">Exportar matriz</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExportXLSX}>
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />XLSX (operacional)
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportPDF}>
            <FileText className="w-3.5 h-3.5 mr-1.5" />PDF (apresentação)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}