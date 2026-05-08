import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportLinksModal({ open, onOpenChange }) {
  const [step, setStep] = useState('upload'); // upload | preview | done
  const [parsedRows, setParsedRows] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Mock parse
    setParsedRows([
      { name: 'Curso de Marketing', amount: 297, methods: 'pix,card' },
      { name: 'Mentoria 1h', amount: 450, methods: 'pix' },
      { name: 'E-book Vendas', amount: 47, methods: 'pix,card' },
    ]);
    setStep('preview');
  };

  const handleImport = () => {
    setStep('done');
    toast.success(`${parsedRows.length} links criados com sucesso`);
    setTimeout(() => {
      onOpenChange(false);
      setStep('upload');
      setParsedRows([]);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Links em Massa
          </DialogTitle>
          <DialogDescription>
            Envie um CSV com colunas: nome, valor, descrição, métodos. Crie até 100 links de uma vez.
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-3">Arraste o CSV ou clique para selecionar</p>
              <input type="file" accept=".csv" id="csv-upload" className="hidden" onChange={handleFile} />
              <label htmlFor="csv-upload">
                <Button variant="outline" asChild>
                  <span className="cursor-pointer">Selecionar arquivo</span>
                </Button>
              </label>
            </div>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => toast.info('Modelo CSV baixado')}>
              <Download className="w-4 h-4 mr-2" />
              Baixar modelo CSV
            </Button>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Pré-visualização — {parsedRows.length} link(s):</p>
            <div className="border rounded-lg max-h-60 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                  <tr>
                    <th className="text-left p-2">Nome</th>
                    <th className="text-right p-2">Valor</th>
                    <th className="text-left p-2">Métodos</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{r.name}</td>
                      <td className="p-2 text-right">R$ {r.amount}</td>
                      <td className="p-2 text-xs text-slate-500">{r.methods}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold">Links criados!</p>
          </div>
        )}

        <DialogFooter>
          {step === 'upload' && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          )}
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>Voltar</Button>
              <Button onClick={handleImport} className="bg-[#2bc196] hover:bg-[#239b7a]">
                Criar {parsedRows.length} links
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}