import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLAN_STATUS } from '@/components/mentor/mocks/salesPlansMock';

export default function SalesPlansFilters({ filters, onChange }) {
  const update = (k, v) => onChange({ ...filters, [k]: v });
  const clearAll = () => onChange({ search: '', status: 'all', project: 'all', channel: 'all', brand: 'all', health: 'all' });
  const hasFilters = filters.search || ['status', 'project', 'channel', 'brand', 'health'].some((k) => filters[k] && filters[k] !== 'all');

  return (
    <div className="flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-2 rounded-lg border">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <Input
          placeholder="Buscar por nome ou código (SP-XX-YYYY-NNN)..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="h-9 pl-7 text-xs"
        />
      </div>
      <Select value={filters.status} onValueChange={(v) => update('status', v)}>
        <SelectTrigger className="h-9 w-36 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos status</SelectItem>
          {Object.entries(PLAN_STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.project} onValueChange={(v) => update('project', v)}>
        <SelectTrigger className="h-9 w-44 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos projetos</SelectItem>
          <SelectItem value="prj_001">Brasil · Master</SelectItem>
          <SelectItem value="prj_002">México · Pix Internacional</SelectItem>
          <SelectItem value="prj_003">Colômbia · Phase 1</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.channel} onValueChange={(v) => update('channel', v)}>
        <SelectTrigger className="h-9 w-32 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos canais</SelectItem>
          <SelectItem value="ecommerce">E-commerce</SelectItem>
          <SelectItem value="pos">POS</SelectItem>
          <SelectItem value="recurrence">Recorrência</SelectItem>
          <SelectItem value="marketplace">Marketplace</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.brand} onValueChange={(v) => update('brand', v)}>
        <SelectTrigger className="h-9 w-32 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas marcas</SelectItem>
          <SelectItem value="visa">Visa</SelectItem>
          <SelectItem value="mastercard">Mastercard</SelectItem>
          <SelectItem value="elo">Elo</SelectItem>
          <SelectItem value="amex">Amex</SelectItem>
          <SelectItem value="hiper">Hiper</SelectItem>
          <SelectItem value="pix">Pix</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.health} onValueChange={(v) => update('health', v)}>
        <SelectTrigger className="h-9 w-32 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Saúde: todos</SelectItem>
          <SelectItem value="healthy">Saudável (90+)</SelectItem>
          <SelectItem value="attention">Atenção (75-89)</SelectItem>
          <SelectItem value="risk">Risco (&lt;75)</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <X className="w-3 h-3 mr-1" />Limpar
        </Button>
      )}
    </div>
  );
}