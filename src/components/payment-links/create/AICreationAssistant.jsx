import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, ImageIcon, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AICreationAssistant({ onApply }) {
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const handleGenerate = () => {
    if (!description.trim()) return;
    setGenerating(true);

    // Mock generation
    setTimeout(() => {
      setSuggestion({
        name: description.slice(0, 40).replace(/^./, (c) => c.toUpperCase()),
        description: `Aproveite agora: ${description.toLowerCase()}. Pagamento seguro via PIX ou cartão em até 12x.`,
        long_description: `**${description}**\n\nO que você recebe:\n• Acesso completo\n• Suporte dedicado\n• Garantia de 7 dias\n\nPagamento 100% seguro pelo PagSmile.`,
        amount: 297,
        priceRange: 'R$ 197 - R$ 497',
        priceJustification: 'Cursos similares ao seu vendem nesta faixa.',
        methods: ['pix', 'card'],
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      });
      setGenerating(false);
    }, 1800);
  };

  const handleApply = () => {
    onApply?.(suggestion);
    toast.success('Sugestões aplicadas ao formulário');
  };

  return (
    <Card className="border-blue-500/30 bg-gradient-to-br from-blue-50/40 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          Criar com IA
          <Badge className="bg-blue-500 text-white text-[9px]">NOVO</Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Descreva seu produto em uma frase. A IA gera nome, descrição, sugestão de preço e imagem.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder='Ex: "curso online de marketing digital para iniciantes, 8h de vídeo + comunidade no Discord"'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[60px] resize-none text-sm"
          disabled={generating}
        />

        {!suggestion && (
          <Button
            onClick={handleGenerate}
            disabled={!description.trim() || generating}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" /> Gerar sugestões
              </>
            )}
          </Button>
        )}

        {suggestion && (
          <div className="space-y-3 p-3 bg-white dark:bg-slate-900 rounded-lg border">
            <div className="flex gap-3">
              <img src={suggestion.imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-semibold text-slate-500">Nome sugerido</p>
                <p className="font-semibold text-sm truncate">{suggestion.name}</p>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{suggestion.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                <p className="text-[10px] uppercase font-semibold text-emerald-700 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Preço sugerido
                </p>
                <p className="font-semibold">R$ {suggestion.amount}</p>
                <p className="text-[10px] text-emerald-600">{suggestion.priceRange}</p>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                <p className="text-[10px] uppercase font-semibold text-purple-700 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Imagem
                </p>
                <p className="font-semibold text-[11px]">Gerada por IA</p>
                <p className="text-[10px] text-purple-600">Pode regenerar</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              💡 {suggestion.priceJustification}
            </p>

            <div className="flex gap-2">
              <Button onClick={handleApply} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Aplicar tudo
              </Button>
              <Button variant="outline" onClick={() => setSuggestion(null)}>
                Refazer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}