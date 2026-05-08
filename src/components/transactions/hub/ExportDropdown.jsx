import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Printer, Clock, FileSpreadsheet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

/**
 * Dropdown Exportar/Imprimir/Agendar (paridade Stripe).
 */
export default function ExportDropdown() {
  const handle = (kind) => {
    toast.success(`Ação "${kind}" iniciada`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs uppercase text-slate-500">Exportar agora</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handle('Exportar CSV')}>
          <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle('Exportar Excel')}>
          <FileSpreadsheet className="w-4 h-4 mr-2 text-blue-600" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle('Exportar PDF')}>
          <FileText className="w-4 h-4 mr-2 text-red-600" />
          PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handle('Imprimir')}>
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs uppercase text-slate-500">Automatizar</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handle('Agendar relatório')}>
          <Clock className="w-4 h-4 mr-2 text-[#2bc196]" />
          Agendar relatório
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}