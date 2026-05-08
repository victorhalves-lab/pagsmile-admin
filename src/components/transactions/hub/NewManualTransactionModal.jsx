import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

/**
 * Modal "Nova transação manual".
 * Permite registrar venda fora do checkout (PDV físico, vendas externas, ajuste).
 */
export default function NewManualTransactionModal({ open, onOpenChange }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_document: '',
    amount: '',
    method: 'card',
    description: '',
    external_reference: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Transação manual registrada com sucesso');
    onOpenChange(false);
    setForm({
      customer_name: '', customer_email: '', customer_document: '',
      amount: '', method: 'card', description: '', external_reference: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#2bc196]" />
            Nova transação manual
          </DialogTitle>
          <DialogDescription>
            Registre uma venda fora do checkout (PDV físico, externa ou ajuste manual).
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-xs text-amber-700">
            Transações manuais não passam pelo antifraude e ficam marcadas como "manual" na auditoria.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Nome do cliente *</Label>
              <Input value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} required />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input type="email" value={form.customer_email} onChange={e => setForm({...form, customer_email: e.target.value})} />
            </div>
            <div>
              <Label>CPF/CNPJ</Label>
              <Input value={form.customer_document} onChange={e => setForm({...form, customer_document: e.target.value})} />
            </div>
            <div>
              <Label>Valor (R$) *</Label>
              <Input type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
            </div>
            <div>
              <Label>Método</Label>
              <Select value={form.method} onValueChange={v => setForm({...form, method: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Cartão</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Referência externa (ID do pedido)</Label>
              <Input value={form.external_reference} onChange={e => setForm({...form, external_reference: e.target.value})} placeholder="opcional" />
            </div>
            <div className="col-span-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#2bc196] hover:bg-[#25a880] text-white">
              Registrar transação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}