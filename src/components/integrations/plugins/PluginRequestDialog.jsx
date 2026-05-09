import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function PluginRequestDialog({ open, onOpenChange, prefill = '' }) {
  const [name, setName] = useState(prefill);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { toast.error('Nome do plugin é obrigatório'); return; }
    toast.success(`Solicitação enviada! Vamos avaliar a integração com ${name}.`);
    setName(''); setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" /> Solicitar nova integração
          </DialogTitle>
          <DialogDescription>
            Não encontrou o plugin que precisa? Solicite e nós priorizamos por demanda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Nome da plataforma *</Label>
            <Input
              placeholder="Ex: SAP Concur, Pagar.me, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Por que você precisa? (opcional)</Label>
            <Textarea
              placeholder="Conte como você usaria essa integração..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="p-3 rounded-lg bg-violet-50 border border-violet-200 text-xs text-violet-800">
            💡 As integrações mais solicitadas entram no roadmap em até 90 dias. Você será notificado quando estiver disponível.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" /> Enviar solicitação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}