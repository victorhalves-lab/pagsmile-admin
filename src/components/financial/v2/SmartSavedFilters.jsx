import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Plus, X, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

// Smart saved filters — PayPal inspired
export default function SmartSavedFilters({ onApply }) {
  const [active, setActive] = useState(null);

  // Pre-defined smart filters
  const presets = [
    { id: 'today_pix', label: 'Hoje · PIX', filters: { period: 'today', category: 'sale', method: 'pix' } },
    { id: 'cb_30', label: 'Chargebacks 30d', filters: { period: '30days', category: 'chargeback' } },
    { id: 'high_value', label: '> R$ 1.000', filters: { minAmount: 1000 } },
    { id: 'fees_month', label: 'Taxas do mês', filters: { period: 'thisMonth', category: 'fee' } },
  ];

  const handleApply = (p) => {
    setActive(p.id);
    onApply?.(p.filters);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
        <Star className="w-3 h-3" />
        Filtros rápidos:
      </span>
      {presets.map(p => (
        <Badge
          key={p.id}
          variant={active === p.id ? 'default' : 'outline'}
          className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
          onClick={() => handleApply(p)}
        >
          {p.label}
          {active === p.id && (
            <X
              className="w-3 h-3 ml-1"
              onClick={(e) => {
                e.stopPropagation();
                setActive(null);
                onApply?.({});
              }}
            />
          )}
        </Badge>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <Bookmark className="w-3 h-3 mr-1" />
            Meus filtros
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs">Salvos</DropdownMenuLabel>
          <DropdownMenuItem className="text-xs text-slate-500" disabled>
            Nenhum filtro salvo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs">
            <Plus className="w-3 h-3 mr-2" />
            Salvar filtro atual
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}