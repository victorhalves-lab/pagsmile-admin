import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function OTPConfirmDialog({ open, onOpenChange, onConfirm, submitting, description }) {
  const [code, setCode] = useState('');
  const valid = code.length === 6;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" />Confirmação por OTP</DialogTitle>
          <DialogDescription>{description || 'Operação sensível · informe o código OTP enviado ao seu dispositivo'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <Label className="text-xs">Código OTP (6 dígitos)</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="text-center text-2xl tracking-[0.5em] font-mono" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancelar</Button>
          <Button onClick={onConfirm} disabled={!valid || submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}