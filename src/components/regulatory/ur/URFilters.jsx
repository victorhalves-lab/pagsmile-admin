import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, AlertTriangle } from 'lucide-react';
import { UR_STATUS, REGISTRARS, PAYMENT_ARRANGEMENTS, REGISTRATION_STATUS } from '../mocks/urMock';

export default function URFilters({ filters, onChange, quickFilters = [], onQuickFilter }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Buscar por ID UR, ID registradora, NSU, ARN, lojista, CNPJ…"
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Select value={filters.registrar} onValueChange={(v) => set('registrar', v)}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas registradoras</SelectItem>
              {Object.entries(REGISTRARS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(v) => set('status', v)}>
            <SelectTrigger className="w-44 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {Object.entries(UR_STATUS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.arrangement} onValueChange={(v) => set('arrangement', v)}>
            <SelectTrigger className="w-40 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos arranjos</SelectItem>
              {Object.entries(PAYMENT_ARRANGEMENTS).map(([k, v]) => (
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
          <Select value={filters.acquirer} onValueChange={(v) => set('acquirer', v)}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos adquirentes</SelectItem>
              <SelectItem value="Cielo">Cielo</SelectItem>
              <SelectItem value="Stone">Stone</SelectItem>
              <SelectItem value="Adyen">Adyen</SelectItem>
              <SelectItem value="Rede">Rede</SelectItem>
              <SelectItem value="Getnet">Getnet</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.registration_status} onValueChange={(v) => set('registration_status', v)}>
            <SelectTrigger className="w-40 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Reg.: todos</SelectItem>
              {Object.entries(REGISTRATION_STATUS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {quickFilters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t">
            <span className="text-[10px] text-slate-500 self-center mr-1">Filtros rápidos:</span>
            {quickFilters.map((qf) => (
              <Badge
                key={qf.key}
                onClick={() => onQuickFilter?.(qf.key)}
                className={`cursor-pointer text-[10px] ${filters.quickFilter === qf.key ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {qf.icon && <qf.icon className="w-3 h-3 mr-0.5" />}
                {qf.label}
                {qf.count !== undefined && <span className="ml-1 opacity-70">({qf.count})</span>}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}