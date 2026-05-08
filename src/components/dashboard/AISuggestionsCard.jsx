import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * AI Suggestions Card [#14] — DIA Copilot proativo no Dashboard.
 * Diferencial: ninguém tem AI nativo no dashboard de adquirente.
 * Reaproveita backend `merchant/getDiaInsights`.
 *
 * Anima entrada com Framer Motion [#58].
 */
export default function AISuggestionsCard({ suggestions = [] }) {
  const [dismissed, setDismissed] = React.useState([]);

  const defaults = [
    {
      id: 's1',
      icon: '🎯',
      title: 'Aumente aprovação em 3.2pp',
      message: 'Detectei queda na aprovação Mastercard às quintas-feiras à noite. Considere ajustar regras de antifraude.',
      action: 'Ver análise',
      to: createPageUrl('DeclineAnalysis'),
      priority: 'high',
    },
    {
      id: 's2',
      icon: '💸',
      title: 'R$ 12.480 em risco de churn',
      message: '47 assinantes têm cartão expirando em 30 dias. Ative Account Updater pra evitar perda.',
      action: 'Ativar',
      to: createPageUrl('Subscriptions'),
      priority: 'high',
    },
    {
      id: 's3',
      icon: '⚡',
      title: 'Antecipação com taxa promocional',
      message: 'Você tem R$ 212k em recebíveis. Taxa de antecipação está 18% abaixo do padrão hoje.',
      action: 'Ver oferta',
      to: createPageUrl('Anticipation'),
      priority: 'medium',
    },
  ];

  const list = (suggestions.length > 0 ? suggestions : defaults).filter(
    (s) => !dismissed.includes(s.id)
  );

  if (list.length === 0) return null;

  const priorityColor = {
    high:   'border-l-red-500 bg-red-50/30 dark:bg-red-950/10',
    medium: 'border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/10',
    low:    'border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10',
  };

  return (
    <Card className="border-2 border-violet-200 dark:border-violet-900 shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-sm shadow-violet-500/30">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">DIA Copilot sugere</h3>
              <p className="text-[10px] text-slate-500">{list.length} insight{list.length !== 1 ? 's' : ''} ativo{list.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <Link to={createPageUrl('DIACopilot')}>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-violet-600">
              Ver todos
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {list.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border-l-4 border border-slate-200 dark:border-slate-800',
                  priorityColor[s.priority]
                )}
              >
                <div className="text-2xl flex-shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.title}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{s.message}</p>
                  <Link to={s.to}>
                    <Button size="sm" variant="outline" className="mt-2 h-7 text-xs border-violet-300 text-violet-600 hover:bg-violet-50">
                      {s.action}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
                <button
                  onClick={() => setDismissed((prev) => [...prev, s.id])}
                  className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                  aria-label="Dispensar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}