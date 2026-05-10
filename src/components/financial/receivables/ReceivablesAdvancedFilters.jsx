import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { RECEIVABLE_STATUS, CERC_STATUS } from './mocks/receivablesLedgerMock';

export default function ReceivablesAdvancedFilters({ filters, onChange }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  return (
    <Card>
      <CardContent className="p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Buscar por ID, NSU, ARN, lojista, transação…"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <Select value={filters.status} onValueChange={(v) => set('status', v)}>
          <SelectTrigger className="w-36 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {Object.entries(RECEIVABLE_STATUS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.brand} onValueChange={(v) => set('brand', v)}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas bandeiras</SelectItem>
            <SelectItem value="visa">Visa</SelectItem>
            <SelectItem value="mastercard">Mastercard</SelectItem>
            <SelectItem value="elo">Elo</SelectItem>
            <SelectItem value="amex">Amex</SelectItem>
            <SelectItem value="hipercard">Hipercard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.cerc_status} onValueChange={(v) => set('cerc_status', v)}>
          <SelectTrigger className="w-36 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">CERC: todos</SelectItem>
            {Object.entries(CERC_STATUS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Filter className="w-3 h-3" /> Filtros avançados
        </div>
      </CardContent>
    </Card>
  );
}