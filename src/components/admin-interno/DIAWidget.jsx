import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, X, ChevronRight, MessageSquare, 
  Lightbulb, AlertTriangle, TrendingUp, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function DIAWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setMinimized(false);
  };

  const insights = [
    { type: 'risk', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', text: '3 merchants com ratio acima de 0.7% - ação recomendada' },
    { type: 'opportunity', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', text: 'TPV 15% acima da média para este horário - tendência positiva' },
    { type: 'operational', icon: Search, color: 'text-blue-500', bg: 'bg-blue-50', text: '12 KYCs pendentes há mais de 48h - verificar fila' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">DIA Copilot</h3>
                  <p className="text-[10px] text-emerald-100">Assistente Inteligente</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-white/20 text-white" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-4">
                  {/* Welcome */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg rounded-tl-none border border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Olá! Analisei a operação e encontrei alguns pontos de atenção hoje.
                    </p>
                  </div>

                  {/* Insights */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Insights Ativos</p>
                    {insights.map((insight, i) => (
                      <div key={i} className={cn("p-3 rounded-xl border flex gap-3 cursor-pointer hover:shadow-md transition-all", 
                        "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                      )}>
                        <div className={cn("p-2 rounded-lg h-fit", insight.bg)}>
                          <insight.icon className={cn("w-4 h-4", insight.color)} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{insight.text}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 self-center" />
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Sugestões</p>
                     <Button variant="outline" className="w-full justify-start text-xs h-9 font-normal text-slate-600 dark:text-slate-400">
                        <TrendingUp className="w-3.5 h-3.5 mr-2" />
                        Ver análise de queda de aprovação
                     </Button>
                     <Button variant="outline" className="w-full justify-start text-xs h-9 font-normal text-slate-600 dark:text-slate-400">
                        <Lightbulb className="w-3.5 h-3.5 mr-2" />
                        Criar alerta para pré-chargebacks
                     </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Input */}
            <div className="p-3 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="relative">
                <Input placeholder="Pergunte algo..." className="pr-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-emerald-500 hover:bg-emerald-600">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="pointer-events-auto h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl flex items-center justify-center relative group"
      >
        {isOpen ? (
            <MessageSquare className="w-6 h-6" />
        ) : (
            <Sparkles className="w-6 h-6" />
        )}
        
        {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">3</span>
            </span>
        )}
      </motion.button>
    </div>
  );
}