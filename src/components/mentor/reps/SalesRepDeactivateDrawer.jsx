import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { UserMinus, AlertTriangle } from 'lucide-react';
import { ConfirmActionDrawer } from '@/components/common/drawers';
import { OTPConfirmDialog } from '../index';
import { toast } from 'sonner';

export default function SalesRepDeactivateDrawer({ open, onOpenChange, rep }) {
  const [reason, setReason] = useState('');
  const [reassignTo, setReassignTo] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => setShowOTP(true);
  const handleOTPConfirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setShowOTP(false);
    onOpenChange(false);
    toast.success(`${rep?.name} desligado · ${rep?.accounts_count || 0} contas reatribuídas`);
  };

  return (
    <>
      <ConfirmActionDrawer
        open={open}
        onOpenChange={onOpenChange}
        title="Desligar representante comercial"
        description={`Desligamento de ${rep?.name} requer reatribuição da carteira`}
        icon={UserMinus}
        variant="destructive"
        onConfirm={handleSubmit}
        confirmLabel="Prosseguir com desligamento"
      >
        <div className="space-y-3">
          <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-xs text-amber-800">
                <strong>{rep?.accounts_count || 0} contas</strong> serão reatribuídas. Comissões em aberto ({(rep?.monthly_commission || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) serão liquidadas conforme contrato.
              </div>
            </CardContent>
          </Card>

          <div>
            <Label>Motivo do desligamento</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance abaixo da meta</SelectItem>
                <SelectItem value="resignation">Pedido de demissão</SelectItem>
                <SelectItem value="restructuring">Reestruturação organizacional</SelectItem>
                <SelectItem value="contract_end">Fim de contrato</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reatribuir carteira para</Label>
            <Select value={reassignTo} onValueChange={setReassignTo}>
              <SelectTrigger><SelectValue placeholder="Selecione representante" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Distribuir automaticamente por região</SelectItem>
                <SelectItem value="rep_001">Ricardo Almeida</SelectItem>
                <SelectItem value="rep_002">Mariana Costa</SelectItem>
                <SelectItem value="rep_003">Carlos Pereira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Notas internas</Label>
            <Textarea placeholder="Detalhes do desligamento (opcional)..." className="min-h-[60px]" />
          </div>
        </div>
      </ConfirmActionDrawer>

      <OTPConfirmDialog open={showOTP} onOpenChange={setShowOTP} onConfirm={handleOTPConfirm} submitting={submitting}
        description="Desligamento de representante é operação irreversível · OTP requerido" />
    </>
  );
}