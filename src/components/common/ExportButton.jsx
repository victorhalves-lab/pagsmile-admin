import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, FileJson, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Universal export button. UI-only prototype: triggers a toast with the chosen format.
 */
export default function ExportButton({ filename = 'export', label = 'Exportar', size = 'sm', variant = 'outline' }) {
  const { toast } = useToast();

  const handle = (format) => {
    toast({
      title: 'Exportação iniciada',
      description: `Gerando ${filename}.${format} — você receberá um e-mail quando estiver pronto.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Download className="w-4 h-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Formato</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handle('csv')}>
          <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle('xlsx')}>
          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-700" /> Excel (XLSX)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle('pdf')}>
          <FileText className="w-4 h-4 mr-2 text-red-600" /> PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle('json')}>
          <FileJson className="w-4 h-4 mr-2 text-amber-600" /> JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handle('email')}>
          <Mail className="w-4 h-4 mr-2 text-blue-600" /> Enviar por e-mail
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}