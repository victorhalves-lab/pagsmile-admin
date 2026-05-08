import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Onboarding Tour [#45] — versão simplificada com modal multi-step.
 * Padrão Mercury / Stripe.
 */

const STEPS = [
  {
    title: 'Bem-vindo ao PagSmile! 👋',
    description: 'Em 90 segundos vamos te mostrar os pontos mais importantes do seu dashboard.',
    bullets: [
      'Saldo, antecipação e recebíveis sempre no topo',
      'Atividade ao vivo das suas transações',
      'Sugestões da IA pra crescer receita',
    ],
    image: '👋',
  },
  {
    title: 'Acompanhe seu dinheiro',
    description: 'A primeira seção mostra exatamente onde está cada centavo: disponível, a receber e bloqueado.',
    bullets: [
      'Card de antecipação com cálculo automático',
      'A receber decomposto em D+1, D+7, D+30',
      'Clique em qualquer valor para ver detalhes',
    ],
    image: '💰',
  },
  {
    title: 'Performance e orquestração',
    description: 'Veja aprovação por bandeira, adquirente, BIN e horário. Identifique gargalos automaticamente.',
    bullets: [
      'Drill-down universal: clique e descubra',
      'Performance por adquirente — diferencial PagSmile',
      'Recovery e dispute manager mostram ROI real',
    ],
    image: '📊',
  },
  {
    title: 'IA que trabalha por você',
    description: 'O DIA Copilot analisa seus dados 24/7 e sugere ações concretas pra aumentar receita.',
    bullets: [
      'Top 5 alavancas de receita ao seu alcance',
      'Sugestões priorizadas por impacto',
      'Atalhos pra resolver tudo em 1 clique',
    ],
    image: '✨',
  },
];

export default function OnboardingTour({ open, onClose }) {
  const [step, setStep] = React.useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => (isLast ? onClose() : setStep(step + 1));
  const prev = () => setStep(Math.max(0, step - 1));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Hero header */}
        <div className="bg-gradient-to-br from-[#2bc196] via-emerald-500 to-emerald-600 p-8 text-center text-white relative">
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase">Tour rápido</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-6xl"
            >
              {current.image}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">{current.title}</DialogTitle>
            <DialogDescription>{current.description}</DialogDescription>
          </DialogHeader>

          <ul className="space-y-2 mt-4">
            {current.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                {b}
              </li>
            ))}
          </ul>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === step ? 'w-6 bg-[#2bc196]' : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                )}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500">
              Pular
            </Button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="outline" size="sm" onClick={prev}>
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  Voltar
                </Button>
              )}
              <Button size="sm" onClick={next} className="bg-[#2bc196] hover:bg-[#239b7a]">
                {isLast ? 'Começar' : 'Próximo'}
                {!isLast && <ChevronRight className="w-3 h-3 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}