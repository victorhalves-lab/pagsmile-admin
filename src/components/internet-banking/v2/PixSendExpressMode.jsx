import React, { useState } from 'react';
import { Zap, Send, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

/**
 * Modo Express: 1-page form para usuários frequentes.
 * Toggle aparece no Step 0 — wizard original (5 steps) permanece intacto.
 */
export default function PixSendExpressMode({ onModeToggle }) {
  const [enabled, setEnabled] = useState(false);
  const [key, setKey] = useState('');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800/40 overflow-hidden bg-gradient-to-r from-purple-50/40 to-white dark:from-purple-950/20 dark:to-slate-900">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                Modo Express
                <Sparkles className="w-3 h-3 text-purple-500" />
              </p>
              <p className="text-[11px] text-slate-500">Para usuários frequentes — envio em 1 tela</p>
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={(v) => {
              setEnabled(v);
              onModeToggle?.(v);
            }}
          />
        </div>

        {enabled && (
          <div className="space-y-3 pt-3 border-t border-purple-100 dark:border-purple-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Chave Pix</Label>
                <Input
                  placeholder="CPF/CNPJ, e-mail, telefone, aleatória ou Copia-e-Cola"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-xs">Valor</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">R$</span>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9 h-10 font-bold"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs">Descrição (opcional)</Label>
              <Input
                placeholder="Ex: Pagamento NF 4567"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="h-10"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:opacity-90"
              disabled={!key || !amount}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar agora (autenticação biométrica)
            </Button>
            <p className="text-[10px] text-center text-slate-500">
              Modo Express é só para usuários verificados — fricção mínima, segurança máxima.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}