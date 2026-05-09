import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RotateKeyDialog({ open, onOpenChange, apiKey }) {
  const [grace, setGrace] = useState('7');
  const [done, setDone] = useState(false);

  const handleRotate = () => {
    setDone(true);
    toast.success(`Chave rotacionada. Antiga válida por ${grace} dias.`);
  };

  const handleClose = () => {
    setDone(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" /> Rotacionar Chave
          </DialogTitle>
          <DialogDescription>
            Gera uma nova chave e mantém a antiga válida por um período de transição (zero downtime).
          </DialogDescription>
        </DialogHeader>

        {!done ? (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-50 border text-xs space-y-1">
              <p><strong>Chave atual:</strong> {apiKey?.name}</p>
              <p><strong>Criada em:</strong> 14/02/2026 (há 90 dias)</p>
              <p><strong>Recomendação:</strong> rotação a cada 90 dias</p>
            </div>

            <div>
              <Label>Período de overlap (chave antiga válida por)</Label>
              <Select value={grace} onValueChange={setGrace}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem overlap (revogar imediatamente)</SelectItem>
                  <SelectItem value="1">1 dia</SelectItem>
                  <SelectItem value="7">7 dias (recomendado)</SelectItem>
                  <SelectItem value="14">14 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-800">
                Atualize seus sistemas com a nova chave durante o período de overlap. Após {grace} dias a chave antiga será revogada automaticamente.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-800">Chave rotacionada com sucesso!</p>
            </div>
            <div className="text-xs space-y-2">
              <p><strong>Nova chave gerada</strong> — copie e atualize seus sistemas.</p>
              <code className="block p-3 bg-slate-100 rounded font-mono text-xs break-all">
                pk_live_•••••••••••••••••aB3xK9
              </code>
              <p className="text-slate-500">Chave antiga válida até {new Date(Date.now() + parseInt(grace) * 86400000).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {!done ? (
            <>
              <Button variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleRotate} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" /> Rotacionar agora
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="bg-[#2bc196] hover:bg-[#239b7a]">Fechar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}