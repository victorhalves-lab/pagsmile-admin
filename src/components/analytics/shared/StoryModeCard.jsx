import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Volume2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * "Story Mode" — narrativa gerada por IA explicando o que aconteceu no período.
 * Inspirado em Stone Insights + Mercado Pago Stories.
 */
export default function StoryModeCard({ title = '📖 O que aconteceu este mês', paragraphs = [], highlights = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [reading, setReading] = useState(false);

  const handleListen = () => {
    if (!('speechSynthesis' in window)) return;
    const text = paragraphs.join('. ');
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.rate = 1.05;
    utter.onstart = () => setReading(true);
    utter.onend = () => setReading(false);
    window.speechSynthesis.speak(utter);
  };

  const visible = expanded ? paragraphs : paragraphs.slice(0, 2);

  return (
    <Card className="bg-gradient-to-br from-[#2bc196]/5 via-white to-blue-50/30 dark:from-[#2bc196]/10 dark:via-slate-900 dark:to-blue-950/30 border-[#2bc196]/20">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#2bc196]/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                <Badge className="bg-gradient-to-r from-[#2bc196] to-emerald-500 text-white text-[10px] gap-1 h-5">
                  <Sparkles className="w-2.5 h-2.5" /> Helena IA
                </Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1 text-xs"
                onClick={handleListen}
                disabled={reading}
              >
                <Volume2 className={cn('w-3.5 h-3.5', reading && 'animate-pulse text-[#2bc196]')} />
                {reading ? 'Lendo...' : 'Ouvir'}
              </Button>
            </div>

            <div className="space-y-2">
              {visible.map((p, i) => (
                <p key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{p}</p>
              ))}
            </div>

            {highlights.length > 0 && expanded && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                {highlights.map((h, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] uppercase font-bold text-slate-500">{h.label}</p>
                    <p className={cn('text-lg font-black', h.color || 'text-slate-900 dark:text-slate-100')}>
                      {h.value}
                    </p>
                    <p className="text-[10px] text-slate-500">{h.context}</p>
                  </div>
                ))}
              </div>
            )}

            {paragraphs.length > 2 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-xs font-semibold text-[#2bc196] hover:underline inline-flex items-center gap-1"
              >
                {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Mostrar menos</> : <><ChevronDown className="w-3.5 h-3.5" /> Continuar lendo</>}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}