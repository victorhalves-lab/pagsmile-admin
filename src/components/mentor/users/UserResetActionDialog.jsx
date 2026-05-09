import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { KeyRound, RotateCcw, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function UserResetActionDialog({ open, onOpenChange, user, action, onConfirmed }) {
  const [reason, setReason] = useState('');
  useEffect(() => { if (!open) setReason(''); }, [open]);

  if (!user || !action) return null;

  const config = {
    reset_password: {
      icon: KeyRound,
      title: 'Reset de senha',
      desc: 'Um e-mail com link de redefinição será enviado para o usuário. O link expira em 30 minutos.',
      label: 'Razão do reset (opcional)',
      btn: 'Enviar link de reset',
      successMsg: `Link de reset enviado para ${user.email}`,
      color: 'blue',
    },
    reset_mfa: {
      icon: RotateCcw,
      title: 'Reset de MFA',
      desc: 'O segundo fator atual será removido. O usuário deverá reconfigurar MFA no próximo login. Esta ação é considerada de alto risco.',
      label: 'Razão do reset MFA (obrigatório)',
      btn: 'Resetar MFA',
      successMsg: `MFA de ${user.name} resetado · usuário deverá reconfigurar no próximo login`,
      color: 'amber',
    },
    unlock: {
      icon: ShieldCheck,
      title: 'Desbloquear conta',
      desc: 'A conta foi bloqueada por tentativas falhas de login. Desbloquear restaura o acesso imediatamente.',
      label: 'Razão do desbloqueio',
      btn: 'Desbloquear conta',
      successMsg: `Conta de ${user.name} desbloqueada · contador de tentativas zerado`,
      color: 'emerald',
    },
  }[action];

  if (!config) return null;
  const Icon = config.icon;
  const requiresReason = action === 'reset_mfa';
  const canConfirm = !requiresReason || reason.length >= 20;

  const handleConfirm = () => {
    if (requiresReason && reason.length < 20) {
      toast.error('Razão precisa de ao menos 20 caracteres');
      return;
    }
    onConfirmed?.({ user, action, reason });
    onOpenChange(false);
    toast.success(config.successMsg);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`w-5 h-5 text-${config.color}-600`} />{config.title}
          </DialogTitle>
          <DialogDescription>{config.desc}</DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="p-3 text-xs">
            <p className="font-bold">{user.name}</p>
            <p className="text-slate-500 mt-0.5 flex items-center gap-1">
              <Mail className="w-3 h-3" />{user.email}
            </p>
          </CardContent>
        </Card>

        <div>
          <Label>{config.label}</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={requiresReason ? 'Ex: Usuário perdeu dispositivo MFA · ticket SUP-12345' : 'Opcional'}
            className="min-h-[60px]"
          />
          {requiresReason && <p className="text-[10px] text-slate-500 mt-1">{reason.length}/20</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>{config.btn}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}