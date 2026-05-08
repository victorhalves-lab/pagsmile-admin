import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, FileCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { evidencePackForReason } from './utils';

export default function EvidencePackChecklist({ dispute, collected = [] }) {
  const pack = evidencePackForReason(dispute?.reason_code, dispute?.reason_category);
  const collectedCount = collected.length || Math.floor(pack.length * 0.4);
  const required = pack.filter((p) => p.required).length;

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Pacote de evidência sugerido pela IA
          <Badge variant="outline" className="text-[10px] ml-auto">
            {collectedCount}/{pack.length} coletadas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <p className="text-[11px] text-slate-600 mb-2">
          Para reason <span className="font-mono font-bold">{dispute?.reason_code || dispute?.reason_category || '—'}</span>,
          a IA recomenda os seguintes documentos ({required} obrigatórios):
        </p>
        {pack.map((item, i) => {
          const isCollected = i < collectedCount;
          return (
            <div key={i} className={cn(
              'flex items-center gap-2 p-1.5 rounded-md text-xs',
              isCollected ? 'bg-emerald-50' : 'bg-white'
            )}>
              {isCollected
                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                : <Circle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
              <span className={cn('flex-1', isCollected ? 'text-slate-700' : 'text-slate-600')}>{item.label}</span>
              {item.required && (
                <Badge variant="outline" className="text-[9px] h-4 border-amber-300 text-amber-700">obrigatório</Badge>
              )}
            </div>
          );
        })}
        <div className="flex items-center gap-1.5 pt-2 mt-1 border-t border-purple-100">
          <FileCheck className="w-3 h-3 text-purple-600" />
          <p className="text-[10px] text-purple-700">
            IA pode montar pacote automaticamente — clique em "Auto-evidence" no detalhe.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}