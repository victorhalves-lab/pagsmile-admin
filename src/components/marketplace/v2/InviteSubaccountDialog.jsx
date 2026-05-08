import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Link2, Mail, Send, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function InviteSubaccountDialog({ open, onOpenChange }) {
  const [email, setEmail] = useState('');
  const [mcc, setMcc] = useState('');
  const [splitPercentage, setSplitPercentage] = useState('5');
  const [generated, setGenerated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const token = Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/SubaccountOnboarding?invite=${token}${mcc ? `&mcc=${mcc}` : ''}${splitPercentage ? `&split=${splitPercentage}` : ''}`;
    setGenerated(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    toast.success('Link copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (!email) {
      toast.error('Informe um e-mail');
      return;
    }
    toast.success(`Convite enviado para ${email}!`);
    onOpenChange(false);
    setTimeout(() => {
      setEmail('');
      setMcc('');
      setSplitPercentage('5');
      setGenerated(null);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-600" />
            Convidar Sub-merchant
          </DialogTitle>
          <DialogDescription>
            Gere um link de convite com dados pré-preenchidos para reduzir a fricção do onboarding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>E-mail do Sub-merchant (opcional)</Label>
            <Input
              type="email"
              placeholder="contato@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-slate-500">Se preenchido, enviaremos o convite por e-mail automaticamente</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>MCC pré-definido</Label>
              <Select value={mcc} onValueChange={setMcc}>
                <SelectTrigger>
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5411">5411 - Supermercados</SelectItem>
                  <SelectItem value="5812">5812 - Restaurantes</SelectItem>
                  <SelectItem value="5691">5691 - Vestuário</SelectItem>
                  <SelectItem value="5732">5732 - Eletrônicos</SelectItem>
                  <SelectItem value="7311">7311 - Publicidade</SelectItem>
                  <SelectItem value="5999">5999 - Varejo Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Split sugerido (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={splitPercentage}
                onChange={(e) => setSplitPercentage(e.target.value)}
              />
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Info className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-700 text-xs">
              O link expira em 7 dias. O sub-merchant entrará direto no onboarding com os dados pré-preenchidos.
            </AlertDescription>
          </Alert>

          {!generated ? (
            <Button onClick={handleGenerate} className="w-full">
              <Link2 className="w-4 h-4 mr-2" />
              Gerar Link de Convite
            </Button>
          ) : (
            <div className="space-y-2">
              <Label>Link gerado</Label>
              <div className="flex gap-2">
                <Input value={generated} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {generated && email && (
            <Button onClick={handleSendEmail}>
              <Send className="w-4 h-4 mr-2" />
              Enviar por E-mail
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}