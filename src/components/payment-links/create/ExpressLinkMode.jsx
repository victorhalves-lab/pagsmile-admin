import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExpressLinkMode({ onCreate, onSwitchToAdvanced }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [pix, setPix] = useState(true);
  const [card, setCard] = useState(true);

  const handleCreate = () => {
    if (!name || !amount) {
      toast.error('Preencha nome e valor');
      return;
    }
    const methods = [];
    if (pix) methods.push('pix');
    if (card) methods.push('card');
    onCreate?.({
      name,
      amount: parseFloat(amount),
      payment_methods: methods,
      method_order: methods,
      value_type: 'fixed',
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-50/40 to-yellow-50/30 dark:from-amber-900/10 dark:to-yellow-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Express link em 30 segundos
          </CardTitle>
          <CardDescription>
            Para venda rápida — apenas 3 campos. Ideal para freelancer, MEI, venda one-off.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">O que você quer cobrar?</Label>
            <Input
              placeholder='Ex: "Consultoria de 1 hora", "Mensalidade da academia"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Valor (R$)</Label>
            <Input
              type="number"
              placeholder="297.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-base h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Aceitar pagamento via</Label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-slate-900">
                <span className="text-sm font-medium">PIX</span>
                <Switch checked={pix} onCheckedChange={setPix} />
              </div>
              <div className="flex-1 flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-slate-900">
                <span className="text-sm font-medium">Cartão</span>
                <Switch checked={card} onCheckedChange={setCard} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCreate}
              size="lg"
              className="flex-1 bg-[#2bc196] hover:bg-[#239b7a] text-base"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Gerar link agora
            </Button>
            <Button variant="outline" onClick={onSwitchToAdvanced}>
              Modo avançado
            </Button>
          </div>

          <p className="text-[11px] text-center text-slate-500 pt-2 border-t">
            Você pode editar tudo depois (estoque, expiração, cupom, branding etc.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}