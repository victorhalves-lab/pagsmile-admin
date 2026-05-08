import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

/**
 * Modal "Importar CSV de transações".
 * Fluxo: upload → mapeamento de colunas → preview → importar.
 */
export default function ImportCSVModal({ open, onOpenChange }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [mapping, setMapping] = useState({
    customer_name: 'col_1',
    customer_email: 'col_2',
    amount: 'col_3',
    method: 'col_4',
    status: 'col_5',
  });

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setStep(2);
    }
  };

  const handleImport = () => {
    toast.success('Importação iniciada — você será notificado ao concluir');
    onOpenChange(false);
    setTimeout(() => { setStep(1); setFile(null); }, 300);
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(() => { setStep(1); setFile(null); }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#2bc196]" />
            Importar transações via CSV
          </DialogTitle>
          <DialogDescription>
            Importe transações em lote a partir de um arquivo CSV ou Excel.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-700">
                Aceitamos arquivos .csv, .xlsx até 10 MB. <a href="#" className="underline">Baixar modelo</a>
              </AlertDescription>
            </Alert>
            <label className="block border-2 border-dashed border-slate-300 rounded-lg p-10 text-center cursor-pointer hover:border-[#2bc196] hover:bg-[#2bc196]/5 transition-colors">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Clique para selecionar ou arraste o arquivo aqui</p>
              <p className="text-xs text-slate-400 mt-1">CSV, XLSX (máx. 10 MB)</p>
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFile} />
            </label>
          </div>
        )}

        {step === 2 && file && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB · 247 linhas detectadas</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Mapeamento de colunas</p>
              <div className="space-y-2">
                {Object.entries({
                  customer_name: 'Nome do cliente',
                  customer_email: 'E-mail',
                  amount: 'Valor',
                  method: 'Método',
                  status: 'Status',
                }).map(([key, label]) => (
                  <div key={key} className="grid grid-cols-2 gap-3 items-center">
                    <Label className="text-xs">{label}</Label>
                    <Select value={mapping[key]} onValueChange={v => setMapping({...mapping, [key]: v})}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="col_1">Coluna 1 (nome)</SelectItem>
                        <SelectItem value="col_2">Coluna 2 (email)</SelectItem>
                        <SelectItem value="col_3">Coluna 3 (valor)</SelectItem>
                        <SelectItem value="col_4">Coluna 4 (método)</SelectItem>
                        <SelectItem value="col_5">Coluna 5 (status)</SelectItem>
                        <SelectItem value="ignore">Ignorar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={close}>Cancelar</Button>
          {step === 2 && (
            <Button onClick={handleImport} className="bg-[#2bc196] hover:bg-[#25a880] text-white">
              Importar 247 transações
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}