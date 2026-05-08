import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Banner de transparência mostrando quais APIs/fontes o agente está consultando.
 * Trust building através de evidência.
 */
export default function AgentTransparencyBanner({
  sources = [
    { name: 'BrasilAPI', status: 'done' },
    { name: 'Receita Federal', status: 'done' },
    { name: 'BigDataCorp', status: 'running' },
    { name: 'Listas PEP', status: 'running' },
    { name: 'OFAC', status: 'pending' },
    { name: 'Serasa', status: 'pending' },
  ]
}) {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
        Consultando:
      </div>
      <div className="flex flex-wrap gap-1.5 flex-1">
        {sources.map(s => (
          <Badge 
            key={s.name}
            variant="outline" 
            className={
              s.status === 'done' ? "bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-[10px]" :
              s.status === 'running' ? "bg-blue-50 text-blue-700 border-blue-200 gap-1 text-[10px]" :
              "bg-white text-slate-400 border-slate-200 gap-1 text-[10px]"
            }
          >
            {s.status === 'done' && <CheckCircle2 className="w-2.5 h-2.5" />}
            {s.status === 'running' && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
            {s.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}