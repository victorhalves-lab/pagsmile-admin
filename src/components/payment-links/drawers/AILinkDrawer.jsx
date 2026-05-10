import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SideDrawer from '@/components/common/SideDrawer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Loader2, CheckCircle2, RefreshCw, Edit3, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

/**
 * AI Link Drawer — descreva o produto, IA gera tudo (nome, descrição, preço, imagem, métodos).
 */
export default function AILinkDrawer({ open, onOpenChange }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [createdLink, setCreatedLink] = useState(null);

  const reset = () => {
    setDescription(''); setSuggestion(null); setCreatedLink(null); setGenerating(false);
  };

  const handleGenerate = () => {
    if (!description.trim()) return;
    setGenerating(true);
    // Mock — em prod chama InvokeLLM
    setTimeout(() => {
      setSuggestion({
        name: description.slice(0, 40).replace(/^./, (c) => c.toUpperCase()),
        description: `Aproveite agora: ${description.toLowerCase()}. Pagamento seguro via PIX ou cartão em até 12x.`,
        long_description: `**${description}**\n\nO que você recebe:\n• Acesso completo\n• Suporte dedicado\n• Garantia de 7 dias`,
        amount: 297,
        priceRange: 'R$ 197 - R$ 497',
        priceJustification: 'Produtos similares no seu segmento vendem nesta faixa.',
        methods: ['pix', 'card'],
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      });
      setGenerating(false);
    }, 1500);
  };

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PaymentLink.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries(['payment-links']);
      setCreatedLink(res);
      toast.success('Link criado pela IA!');
    },
    onError: () => toast.error('Erro ao criar link'),
  });

  const handleCreateNow = () => {
    const ts = Date.now();
    createMutation.mutate({
      name: suggestion.name,
      description: suggestion.description,
      long_description: suggestion.long_description,
      amount: suggestion.amount,
      payment_methods: suggestion.methods,
      method_order: suggestion.methods,
      main_image_url: suggestion.imageUrl,
      value_type: 'fixed',
      status: 'active',
      max_installments: 12,
      link_id: `link_${ts}`,
      url: `https://pay.pagsmile.com/${ts}`,
      short_url: `https://pag.sm/${ts.toString(36)}`,
      currency: 'BRL',
    });
  };

  const handleRefine = () => {
    // Aplica sugestão e abre modo completo para refinar
    const params = new URLSearchParams({
      ai_name: suggestion.name,
      ai_desc: suggestion.description,
      ai_amount: suggestion.amount,
      ai_image: suggestion.imageUrl,
    });
    navigate(createPageUrl('PaymentLinkCreate') + '?' + params.toString());
    onOpenChange(false);
  };

  const handleClose = (val) => {
    if (!val) reset();
    onOpenChange(val);
  };

  return (
    <SideDrawer
      open={open}
      onOpenChange={handleClose}
      title={createdLink ? 'Link criado pela IA 🎉' : 'Criar link com IA'}
      description={createdLink ? 'Pronto para compartilhar' : 'Descreva o produto, a IA cuida do resto'}
      icon={createdLink ? CheckCircle2 : Sparkles}
      iconClassName={createdLink ? 'bg-emerald-100' : 'bg-blue-100'}
      size="md"
      footer={
        createdLink ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} className="flex-1">Criar outro</Button>
            <Button
              onClick={() => navigate(createPageUrl('PaymentLinkDetail') + `?id=${createdLink.id}`)}
              className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]"
            >
              Ver detalhes <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        ) : suggestion ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefine} className="flex-1">
              <Edit3 className="w-3.5 h-3.5 mr-1" /> Refinar
            </Button>
            <Button
              onClick={handleCreateNow}
              disabled={createMutation.isPending}
              className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {createMutation.isPending ? 'Criando...' : 'Criar agora'}
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={!description.trim() || generating}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" /> Gerar sugestões</>
            )}
          </Button>
        )
      }
    >
      {createdLink ? (
        <div className="space-y-4 py-2">
          <img src={suggestion.imageUrl} alt="" className="w-full h-32 object-cover rounded-lg" />
          <div>
            <p className="font-semibold">{suggestion.name}</p>
            <p className="text-sm text-slate-500 mt-1">{suggestion.description}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="text-xs uppercase font-semibold text-emerald-700">Link</p>
            <p className="font-mono text-sm break-all">{createdLink.short_url}</p>
          </div>
        </div>
      ) : !suggestion ? (
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Descreva seu produto</label>
            <Textarea
              placeholder='Ex: "curso online de marketing digital para iniciantes, 8h de vídeo + comunidade no Discord"'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] text-sm"
              disabled={generating}
              autoFocus
            />
            <p className="text-[11px] text-slate-500">
              Quanto mais detalhes, melhor a sugestão. A IA define nome, descrição, preço sugerido e imagem.
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Exemplos rápidos</p>
            {[
              '🧠 Curso de inglês online, 30 dias de acesso',
              '💪 Mentoria 1:1 de carreira, 4 sessões',
              '📦 E-book "Como vender mais no Instagram"',
            ].map((ex) => (
              <button
                key={ex}
                onClick={() => setDescription(ex.replace(/^[^\s]+ /, ''))}
                className="w-full text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3 py-2">
          <div className="rounded-lg overflow-hidden border">
            <img src={suggestion.imageUrl} alt="" className="w-full h-32 object-cover" />
            <div className="p-3 space-y-2">
              <Badge className="bg-blue-100 text-blue-700 text-[9px]">SUGESTÃO IA</Badge>
              <p className="font-semibold text-sm">{suggestion.name}</p>
              <p className="text-xs text-slate-500">{suggestion.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <p className="text-[10px] uppercase font-semibold text-emerald-700">Preço sugerido</p>
              <p className="text-lg font-bold">R$ {suggestion.amount}</p>
              <p className="text-[10px] text-emerald-600">{suggestion.priceRange}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <p className="text-[10px] uppercase font-semibold text-purple-700">Métodos</p>
              <p className="text-sm font-semibold">PIX + Cartão</p>
              <p className="text-[10px] text-purple-600">Até 12x</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic p-2 bg-slate-50 rounded">
            💡 {suggestion.priceJustification}
          </p>

          <Button variant="ghost" size="sm" onClick={() => setSuggestion(null)} className="w-full text-xs">
            <RefreshCw className="w-3 h-3 mr-1" /> Refazer sugestão
          </Button>
        </div>
      )}
    </SideDrawer>
  );
}