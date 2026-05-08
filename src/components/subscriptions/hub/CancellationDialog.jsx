import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

const reasons = [
  { value: 'price', label: 'Preço alto' },
  { value: 'not_using', label: 'Não está usando' },
  { value: 'competitor', label: 'Foi para concorrente' },
  { value: 'features', label: 'Faltam funcionalidades' },
  { value: 'support', label: 'Insatisfação com suporte' },
  { value: 'other', label: 'Outro' },
];

export default function CancellationDialog({ open, onOpenChange, subscription, onConfirm }) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  if (!subscription) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" /> Cancelar assinatura</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-xs">
          <p className="text-slate-600">Cliente: <span className="font-bold">{subscription.customer_name}</span></p>
          <div>
            <Label className="text-xs">Motivo do cancelamento</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Selecione um motivo" /></SelectTrigger>
              <SelectContent>
                {reasons.map((r) => <SelectItem key={r.value} value={r.value} className="text-xs">{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Notas (opcional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 text-xs" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Voltar</Button>
          <Button variant="destructive" disabled={!reason} onClick={() => onConfirm({ reason, notes })}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}