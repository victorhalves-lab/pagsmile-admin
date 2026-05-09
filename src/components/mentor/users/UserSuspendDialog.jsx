import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function UserSuspendDialog({ open, onOpenChange, user, onConfirmed }) {
  const [reason, setReason] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('reason');

  useEffect(() => { if (!open) { setReason(''); setOtp(''); setStep('reason'); } }, [open]);

  if (!user) return null;

  const handleNext = () => {
    if (reason.length < 30) {
      toast.error('Razão precisa de ao menos 30 caracteres (compliance)');
      return;
    }
    setStep('otp');
  };

  const handleConfirm = () => {
    if (otp.length !== 6) {
      toast.error('Insira código OTP de 6 dígitos');
      return;
    }
    onConfirmed?.({ user, reason, otp });
    onOpenChange(false);
    toast.success(`${user.name} suspenso · ${user.sessions_count || 0} sessão(ões) ativa(s) encerrada(s) · trilha auditável criada`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-700">
            <ShieldOff className="w-5 h-5" />Suspender usuário?
          </DialogTitle>
          <DialogDescription>
            Suspensão é <strong>reversível</strong>. Sessões ativas serão encerradas imediatamente. Usuário não conseguirá fazer login até reativação.
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-300">
          <CardContent className="p-3 text-xs">
            <p className="font-bold">{user.name}</p>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              {user.email} · {user.role} · {user.sessions_count || 0} sessão(ões) ativa(s)
            </p>
          </CardContent>
        </Card>

        {step === 'reason' && (
          <>
            <div>
              <Label>Razão da suspensão (mín 30 caracteres · obrigatório por compliance)</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Investigação preventiva conforme ticket SEC-7821 · acesso suspeito detectado"
                className="min-h-[80px]"
              />
              <p className="text-[10px] text-slate-500 mt-1">{reason.length}/30</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button onClick={handleNext} className="bg-amber-600 hover:bg-amber-700">Continuar</Button>
            </DialogFooter>
          </>
        )}

        {step === 'otp' && (
          <>
            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200">
              <CardContent className="p-3 flex gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Insira o código OTP do seu autenticador para confirmar a suspensão.</span>
              </CardContent>
            </Card>
            <div>
              <Label>Código OTP</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="text-center text-lg font-mono tracking-widest"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('reason')}>Voltar</Button>
              <Button onClick={handleConfirm} disabled={otp.length !== 6} className="bg-amber-600 hover:bg-amber-700">
                Suspender agora
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}