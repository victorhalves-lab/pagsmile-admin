import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Star, ExternalLink, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function ShowcaseLinksGrid({ links = [], onPin, onReorder }) {
  if (links.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-slate-500">Nenhum link na vitrine. Adicione links abaixo.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Links da vitrine ({links.length})</h3>
        <p className="text-xs text-slate-500">Arraste para reordenar • Pin no topo</p>
      </div>

      <div className="space-y-2">
        {links.map((link, idx) => (
          <div
            key={link.id || idx}
            className={cn(
              'flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group',
              link.pinned && 'border-amber-300 bg-amber-50/40'
            )}
          >
            <GripVertical className="w-4 h-4 text-slate-400 cursor-move opacity-0 group-hover:opacity-100" />

            {/* Image */}
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
              {link.main_image_url ? (
                <img src={link.main_image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">?</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{link.name}</p>
                {link.pinned && <Pin className="w-3 h-3 text-amber-500" />}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {link.value_type === 'fixed' ? formatBRL(link.amount) : 'Valor variável'}
                {' • '}
                {link.usage_count || 0} vendas
              </p>
            </div>

            <Badge
              className={
                link.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700 text-[10px]'
                  : 'bg-slate-100 text-slate-600 text-[10px]'
              }
            >
              {link.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>

            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 opacity-0 group-hover:opacity-100"
              onClick={() => onPin?.(link)}
              title={link.pinned ? 'Desfixar' : 'Fixar no topo'}
            >
              <Star className={cn('w-3.5 h-3.5', link.pinned && 'fill-amber-400 text-amber-400')} />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}