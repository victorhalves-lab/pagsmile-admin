import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Copy, Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Botão "Compartilhar com sócio/contador" — gera link mockado para continuar o cadastro.
 */
export default function ShareInviteButton({ variant = 'outline' }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const fakeLink = 'https://app.pagsmile.com/continuar?token=onb_a8f3d29';

  const handleCopy = () => {
    navigator.clipboard.writeText(fakeLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copiado!');
  };

  const handleSendEmail = () => {
    if (!email) return;
    toast.success(`Convite enviado para ${email}`);
    setOpen(false);
    setEmail('');
  };

  return (
    <>
      <Button variant={variant} size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Share2 className="w-4 h-4" />
        Compartilhar com sócio
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#2bc196]" />
              Convidar sócio ou contador
            </DialogTitle>
            <DialogDescription>
              Envie um link para que outra pessoa termine o cadastro no seu lugar.
              O progresso já preenchido fica salvo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Link único (válido por 72h)</Label>
              <div className="flex gap-2">
                <Input value={fakeLink} readOnly className="text-xs font-mono bg-slate-50" />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400">ou enviar por email</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Email do destinatário</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="socio@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleSendEmail} disabled={!email}>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}