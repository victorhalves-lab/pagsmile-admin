import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Barra de filtros globais que se aplica a todos os widgets do dashboard.
 */
export default function GlobalFiltersBar({
  period, onPeriodChange,
  subaccount, onSubaccountChange, subaccounts = [],
  method, onMethodChange,
  country, onCountryChange,
  extraActions,
  activeFilters = 0,
  onClearAll,
}) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filtros globais
          {activeFilters > 0 && (
            <Badge className="bg-[#2bc196] text-white h-4 text-[10px] px-1.5">{activeFilters}</Badge>
          )}
        </div>

        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today" className="text-xs">Hoje</SelectItem>
            <SelectItem value="7d" className="text-xs">Últimos 7 dias</SelectItem>
            <SelectItem value="30d" className="text-xs">Últimos 30 dias</SelectItem>
            <SelectItem value="90d" className="text-xs">Últimos 90 dias</SelectItem>
            <SelectItem value="ytd" className="text-xs">Ano até hoje</SelectItem>
            <SelectItem value="custom" className="text-xs">Personalizado...</SelectItem>
          </SelectContent>
        </Select>

        {subaccounts.length > 0 && (
          <Select value={subaccount || 'all'} onValueChange={onSubaccountChange}>
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue placeholder="Todas subcontas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todas subcontas</SelectItem>
              {subaccounts.map(s => (
                <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {onMethodChange && (
          <Select value={method || 'all'} onValueChange={onMethodChange}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Método" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todos métodos</SelectItem>
              <SelectItem value="card" className="text-xs">Cartão</SelectItem>
              <SelectItem value="pix" className="text-xs">PIX</SelectItem>
              <SelectItem value="boleto" className="text-xs">Boleto</SelectItem>
            </SelectContent>
          </Select>
        )}

        {onCountryChange && (
          <Select value={country || 'all'} onValueChange={onCountryChange}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="País" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todos países</SelectItem>
              <SelectItem value="BR" className="text-xs">🇧🇷 Brasil</SelectItem>
              <SelectItem value="MX" className="text-xs">🇲🇽 México</SelectItem>
              <SelectItem value="AR" className="text-xs">🇦🇷 Argentina</SelectItem>
            </SelectContent>
          </Select>
        )}

        {activeFilters > 0 && onClearAll && (
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={onClearAll}>
            <X className="w-3.5 h-3.5" /> Limpar
          </Button>
        )}

        <div className="ml-auto flex gap-2">{extraActions}</div>
      </div>
    </Card>
  );
}