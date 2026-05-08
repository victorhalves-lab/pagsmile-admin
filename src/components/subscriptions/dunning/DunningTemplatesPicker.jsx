import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const templates = [
  { id: 'gentle', name: 'Gentil', retries: 4, days: 21, channels: ['email'], desc: 'Foco em retenção' },
  { id: 'standard', name: 'Padrão', retries: 5, days: 30, channels: ['email', 'sms'], desc: 'Equilíbrio' },
  { id: 'aggressive', name: 'Agressivo', retries: 7, days: 45, channels: ['email', 'sms', 'whatsapp'], desc: 'Máximo recovery' },
];

export default function DunningTemplatesPicker({ onApply }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-600" /> Templates pré-prontos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {templates.map((t) => (
            <div key={t.id} className="border rounded-lg p-3 hover:border-[#2bc196] transition-all">
              <p className="text-sm font-bold">{t.name}</p>
              <p className="text-[10px] text-slate-500 mb-2">{t.desc}</p>
              <div className="text-[10px] space-y-0.5 mb-2">
                <p>{t.retries} retries em {t.days}d</p>
                <p>Canais: {t.channels.join(', ')}</p>
              </div>
              <Button size="sm" variant="outline" className="h-7 w-full text-[10px]" onClick={() => onApply(t)}>Aplicar</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}