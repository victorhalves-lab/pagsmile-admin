import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ADJUSTMENT_STATUS, ADJUSTMENT_REASONS } from './mocks/manualAdjustmentsMock';

export default function AdjustmentsFilters({ filters, onChange }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  return (
    <Card>
      <CardContent className="p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Buscar por ID, lojista, descrição…"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <Select value={filters.type} onValueChange={(v) => set('type', v)}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tipo: todos</SelectItem>
            <SelectItem value="credit">Crédito</SelectItem>
            <SelectItem value="debit">Débito</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(v) => set('status', v)}>
          <SelectTrigger className="w-36 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: todos</SelectItem>
            {Object.entries(ADJUSTMENT_STATUS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.reason} onValueChange={(v) => set('reason', v)}>
          <SelectTrigger className="w-44 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Motivo: todos</SelectItem>
            {Object.entries(ADJUSTMENT_REASONS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}