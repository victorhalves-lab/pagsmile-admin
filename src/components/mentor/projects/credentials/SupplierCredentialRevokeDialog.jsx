import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';
import { toast } from 'sonner';

export default function SupplierCredentialRevokeDialog({ open, onOpenChange, credential, onConfirmed }) {
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');

  if (!credential) return null;

  const expectedText = credential.name.split(' · ')[0] || credential.name;
  const canConfirm = confirmText === expectedText && reason.length >= 20;

  const handleConfirm = () => {
    if (!canConfirm) {
      toast.error('Confirme o nome e a razão (mín 20 caracteres)');
      return;
    }
    onConfirmed?.(credential);
    onOpenChange(false);
    toast.success(`Credencial "${credential.name}" revogada · trilha auditável criada`);
    setConfirmText('');
    setReason('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-700">
            <ShieldX className="w-5 h-5" />Revogar credencial?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ação <strong>destrutiva e irreversível</strong>. A credencial deixará de funcionar imediatamente. Integrações que dependem dela falharão até cadastrar nova.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-300">
          <CardContent className="p-3 text-xs">
            <p className="font-bold">{credential.name}</p>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              {credential.supplier} · {credential.usage_count_30d.toLocaleString('pt-BR')} usos nos últimos 30d
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div>
            <Label>Razão da revogação (mín 20 caracteres)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Substituída por nova credencial após rotação programada"
              className="min-h-[60px]"
            />
            <p className="text-[10px] text-slate-500 mt-1">{reason.length}/20</p>
          </div>
          <div>
            <Label>Digite <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{expectedText}</code> para confirmar</Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedText}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => { setConfirmText(''); setReason(''); }}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={!canConfirm}
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Revogar definitivamente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}