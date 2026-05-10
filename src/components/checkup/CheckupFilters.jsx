import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { CHECKUP_TYPES, CHECKUP_SEVERITIES, CHECKUP_STATUS } from './mocks/checkupMock';

export default function CheckupFilters({ filters, onFilterChange, onReset }) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="ID checkup, transação, NSU, auth code..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>

        <Select value={filters.type} onValueChange={(v) => onFilterChange({ type: v })}>
          <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {Object.entries(CHECKUP_TYPES).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.severity} onValueChange={(v) => onFilterChange({ severity: v })}>
          <SelectTrigger><SelectValue placeholder="Severidade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas severidades</SelectItem>
            {Object.entries(CHECKUP_SEVERITIES).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => onFilterChange({ status: v })}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {Object.entries(CHECKUP_STATUS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Select value={filters.sla} onValueChange={(v) => onFilterChange({ sla: v })}>
            <SelectTrigger><SelectValue placeholder="SLA" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="breached">SLA estourado</SelectItem>
              <SelectItem value="approaching">Aproximando</SelectItem>
              <SelectItem value="ok">Dentro do prazo</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={onReset} title="Limpar filtros">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <Button 
          size="sm" 
          variant={filters.tag === 'regulatorio' ? 'default' : 'outline'}
          onClick={() => onFilterChange({ tag: filters.tag === 'regulatorio' ? null : 'regulatorio' })}
        >
          🏛️ Implicações Regulatórias
        </Button>
        <Button 
          size="sm" 
          variant={filters.tag === 'pld_ft' ? 'default' : 'outline'}
          onClick={() => onFilterChange({ tag: filters.tag === 'pld_ft' ? null : 'pld_ft' })}
        >
          🚨 PLD-FT (Fraude Potencial)
        </Button>
        <Button 
          size="sm" 
          variant={filters.unassigned ? 'default' : 'outline'}
          onClick={() => onFilterChange({ unassigned: !filters.unassigned })}
        >
          👤 Não Atribuídos
        </Button>
        <Button 
          size="sm" 
          variant={filters.multiple_attempts ? 'default' : 'outline'}
          onClick={() => onFilterChange({ multiple_attempts: !filters.multiple_attempts })}
        >
          🔄 Múltiplas Tentativas
        </Button>
      </div>
    </Card>
  );
}