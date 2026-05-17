import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Sparkles, Settings2, ArrowRight, Clock } from 'lucide-react';
import ExpressLinkDrawer from './drawers/ExpressLinkDrawer';
import AILinkDrawer from './drawers/AILinkDrawer';
import SideDrawer from '@/components/common/SideDrawer';
import { cn } from '@/lib/utils';

/**
 * Botão Criar Link · explícito (sem "setinha escondida")
 * - Botão principal "Novo Link" abre um picker (modal/drawer) com 3 opções claras:
 *   Express · IA · Editor Completo
 * - O usuário SEMPRE faz a escolha consciente.
 */
export default function CreateLinkSplitButton() {
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expressOpen, setExpressOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const handlePick = (mode) => {
    setPickerOpen(false);
    if (mode === 'express') setExpressOpen(true);
    else if (mode === 'ai') setAiOpen(true);
    else if (mode === 'full') navigate(createPageUrl('PaymentLinkCreate'));
  };

  return (
    <>
      <Button
        onClick={() => setPickerOpen(true)}
        className="bg-[#2bc196] hover:bg-[#239b7a]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Novo Link
      </Button>

      <SideDrawer
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Como você quer criar?"
        description="Escolha a opção que combina com sua pressa e nível de customização"
        icon={Plus}
        size="lg"
      >
        <div className="space-y-3 py-2">
          <PickerCard
            icon={Zap}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            label="Link Express"
            tagline="Rápido · 30 segundos"
            description="Preencha 3 campos essenciais (nome, valor, métodos) e tenha o link pronto. Combos com 2 cartões ou cartão + PIX disponíveis."
            features={['Nome + valor', 'Combos Cartão / PIX / Cartão+PIX / 2 Cartões', 'Parcelamento padrão']}
            highlight="Mais usado"
            duration="~30s"
            onClick={() => handlePick('express')}
          />

          <PickerCard
            icon={Sparkles}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            label="Criar com IA"
            tagline="Descreva, IA cria tudo"
            description='Digite "vou vender consultoria de marketing por R$ 500" e a IA propõe nome, imagem, descrição, métodos e valor.'
            features={['Sugestões automáticas', 'Imagem + texto otimizados', 'Você revisa antes de criar']}
            duration="~1min"
            onClick={() => handlePick('ai')}
          />

          <PickerCard
            icon={Settings2}
            iconBg="bg-slate-100"
            iconColor="text-slate-700"
            label="Editor Completo"
            tagline="Controle total · todas as opções"
            description="Cor da marca, logo, ordem dos campos, order bumps, upsell, cupons, recorrência, rastreamento UTM, vitrine e mais."
            features={['Personalização visual completa', 'Order bumps & upsell', 'Recorrência & cupons', 'Tracking UTM & pixels']}
            duration="~5min"
            onClick={() => handlePick('full')}
          />
        </div>
      </SideDrawer>

      <ExpressLinkDrawer open={expressOpen} onOpenChange={setExpressOpen} />
      <AILinkDrawer open={aiOpen} onOpenChange={setAiOpen} />
    </>
  );
}

function PickerCard({ icon: Icon, iconBg, iconColor, label, tagline, description, features, highlight, duration, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2bc196] hover:shadow-md transition-all bg-white dark:bg-slate-900 group relative"
    >
      {highlight && (
        <span className="absolute -top-2 right-4 bg-[#2bc196] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          {highlight}
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{label}</h3>
            {duration && (
              <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {duration}
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-[#2bc196] mb-2">{tagline}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{description}</p>
          <div className="flex flex-wrap gap-1">
            {features.map((f) => (
              <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {f}
              </span>
            ))}
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#2bc196] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
      </div>
    </button>
  );
}