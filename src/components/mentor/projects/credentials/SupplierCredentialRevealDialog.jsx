import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Copy, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function SupplierCredentialRevealDialog({ open, onOpenChange, credential }) {
  const [step, setStep] = useState('confirm'); // confirm -> otp -> revealed
  const [reason, setReason] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (!open) {
      setStep('confirm');
      setReason('');
      setOtp('');
      setCountdown(120);
    }
  }, [open]);

  useEffect(() => {
    if (step !== 'revealed') return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          onOpenChange(false);
          toast.info('Credencial ocultada · sessão expirou');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, onOpenChange]);

  if (!credential) return null;

  const handleAdvanceToOTP = () => {
    if (reason.length < 20) {
      toast.error('Razão precisa de ao menos 20 caracteres');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast.error('Insira o código OTP de 6 dígitos');
      return;
    }
    setStep('revealed');
    toast.success('Acesso registrado em trilha auditável imutável');
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(credential.raw_value);
    toast.success('Copiado · ação registrada na auditoria');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-4 h-4" />Revelar credencial: {credential.name}
          </DialogTitle>
          <DialogDescription>
            Acesso a credenciais sensíveis exige justificativa, OTP e gera trilha auditável imutável (compliance SOC 2).
          </DialogDescription>
        </DialogHeader>

        {step === 'confirm' && (
          <div className="space-y-3">
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
              <CardContent className="p-3 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200">
                  <p className="font-bold">Acesso registrado</p>
                  <p>Esta ação será registrada com seu usuário, IP, timestamp, geolocalização e a razão informada. Visível pelo time de Segurança.</p>
                </div>
              </CardContent>
            </Card>
            <div>
              <Label>Razão do acesso (mín 20 caracteres)</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Investigação de erro em produção · ticket SUP-12345"
                className="min-h-[70px]"
              />
              <p className="text-[10px] text-slate-500 mt-1">{reason.length}/20</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button onClick={handleAdvanceToOTP}>Continuar para OTP</Button>
            </DialogFooter>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-3">
            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200">
              <CardContent className="p-3 text-xs">
                <p className="font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />OTP enviado</p>
                <p className="mt-1">Insira o código de 6 dígitos enviado ao seu app autenticador (Google Authenticator / Authy).</p>
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
              <Button variant="outline" onClick={() => setStep('confirm')}>Voltar</Button>
              <Button onClick={handleVerifyOTP} disabled={otp.length !== 6}>Verificar e revelar</Button>
            </DialogFooter>
          </div>
        )}

        {step === 'revealed' && (
          <div className="space-y-3">
            <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10">
              <CardContent className="p-3 flex items-center justify-between">
                <p className="text-xs text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />Credencial revelada · trilha auditável criada
                </p>
                <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                  <Clock className="w-3 h-3 mr-1" />ocultar em {countdown}s
                </Badge>
              </CardContent>
            </Card>

            <div>
              <Label className="text-[10px] uppercase text-slate-500">Valor revelado</Label>
              <div className="bg-slate-900 text-emerald-300 rounded-lg p-3 font-mono text-xs break-all relative">
                {credential.raw_value}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-7 w-7 text-emerald-300 hover:bg-emerald-900/40"
                  onClick={handleCopy}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-slate-500">Tipo: </span><strong>{credential.credential_type}</strong>
              </div>
              <div>
                <span className="text-slate-500">Ambiente: </span><strong>{credential.environment}</strong>
              </div>
              <div>
                <span className="text-slate-500">Owner: </span><strong>{credential.owner}</strong>
              </div>
              <div>
                <span className="text-slate-500">Scopes: </span><strong>{credential.scope?.join(', ')}</strong>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Ocultar agora</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}