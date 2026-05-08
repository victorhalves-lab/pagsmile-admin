import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Loader2 } from 'lucide-react';

const examplePrompts = [
  'Cupom para reativar clientes que não compram há 90 dias',
  'Cupom Black Friday só para clientes VIP, 25% OFF, válido 24h',
  'Cupom de 10% para primeiro pedido, mínimo de R$ 100',
  'Cupom para abandono de carrinho com timer de 1h',
];

export default function CouponAIAssistant({ onApply }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      // Mock IA: responde com config baseada em palavras-chave
      const text = prompt.toLowerCase();
      let suggestion = {
        code: 'AICOUPON',
        name: 'Cupom gerado por IA',
        description: prompt,
        type: 'percentage',
        value: 10,
        applies_to: 'all_products',
      };
      if (text.includes('reativ') || text.includes('volta') || text.includes('inativ')) {
        suggestion = { ...suggestion, code: 'VOLTA20', name: 'Reativação de cliente', value: 20, usage_limit_per_user: 1 };
      } else if (text.includes('vip') || text.includes('black')) {
        suggestion = { ...suggestion, code: 'VIPBF25', name: 'VIP Black Friday', value: 25 };
      } else if (text.includes('primeiro') || text.includes('boas-vindas') || text.includes('novo')) {
        suggestion = { ...suggestion, code: 'BEMVINDO10', name: 'Boas-vindas', value: 10, min_purchase_amount: 100, usage_limit_per_user: 1 };
      } else if (text.includes('abandono') || text.includes('carrinho')) {
        suggestion = { ...suggestion, code: 'VOLTA10', name: 'Recuperação de carrinho', value: 10 };
      }
      onApply(suggestion);
      setLoading(false);
      setPrompt('');
    }, 1200);
  };

  return (
    <Card className="border-[#2bc196]/30 bg-gradient-to-br from-[#2bc196]/5 to-blue-50/30 dark:from-[#2bc196]/10 dark:to-blue-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2bc196]" />
          Crie a partir da intenção
          <Badge className="bg-[#2bc196] text-white text-[9px] border-0">IA</Badge>
        </CardTitle>
        <p className="text-xs text-slate-500">Descreva o que você quer fazer e a IA configura tudo</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <Textarea
          placeholder="Ex: Cupom de 15% para abandono de carrinho com timer de 1h..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="text-sm min-h-[60px]"
        />
        <div className="flex flex-wrap gap-1">
          {examplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => setPrompt(p)}
              className="text-[10px] px-2 py-1 rounded-full bg-white dark:bg-slate-800 border hover:border-[#2bc196] transition-colors"
            >
              {p.slice(0, 35)}…
            </button>
          ))}
        </div>
        <Button
          className="w-full bg-[#2bc196] hover:bg-[#239b7a]"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando configuração...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Gerar cupom
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}