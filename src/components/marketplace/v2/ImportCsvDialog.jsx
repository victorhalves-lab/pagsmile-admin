import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, Download, CheckCircle2, X, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ImportCsvDialog({ open, onOpenChange }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
      toast.error('Por favor, selecione um arquivo CSV ou XLSX');
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleImport = () => {
    if (!file) {
      toast.error('Selecione um arquivo');
      return;
    }
    toast.success(`Importação iniciada: ${file.name}. Você receberá um e-mail quando concluir.`);
    onOpenChange(false);
    setTimeout(() => setFile(null), 200);
  };

  const handleDownloadTemplate = () => {
    const csv = 'business_name,document,email,phone,mcc\nEmpresa Exemplo LTDA,12345678000100,contato@exemplo.com,11999999999,5411';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_subcontas.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template baixado!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            Importar Subcontas via CSV
          </DialogTitle>
          <DialogDescription>
            Importe múltiplas subcontas de uma vez através de um arquivo CSV ou XLSX.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-700 text-xs">
              Use o template para garantir o formato correto. Limite: 500 subcontas por importação.
            </AlertDescription>
          </Alert>

          <Button variant="outline" onClick={handleDownloadTemplate} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Baixar Template CSV
          </Button>

          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
              dragOver ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            )}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  <X className="w-3 h-3 mr-1" />
                  Remover
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Clique ou arraste o arquivo aqui</p>
                <p className="text-xs text-slate-500 mt-1">CSV, XLSX até 5MB</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-700">Campos obrigatórios:</p>
            <p>• business_name, document, email, phone, mcc</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file}>
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}