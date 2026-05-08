import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save } from 'lucide-react';

const BR_STATES = ['SP','RJ','MG','RS','PR','SC','BA','PE','CE','GO','DF'];

export default function CustomersAdvancedFilters({ filters, onChange, onClear, onSaveView }) {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">Filtros Avançados</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSaveView} className="gap-1 text-xs">
            <Save className="w-3 h-3" /> Salvar como view
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1 text-xs text-slate-500">
            <X className="w-3 h-3" /> Limpar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div>
          <Label className="text-xs">Segmento</Label>
          <Select value={filters.segment} onValueChange={(v) => update('segment', v)}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="new">Novos</SelectItem>
              <SelectItem value="recurring">Recorrentes</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="at_risk">Em Risco</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Estado</Label>
          <Select value={filters.state || 'all'} onValueChange={(v) => update('state', v)}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {BR_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Método preferido</Label>
          <Select value={filters.paymentMethod || 'all'} onValueChange={(v) => update('paymentMethod', v)}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="card">Cartão</SelectItem>
              <SelectItem value="pix">Pix</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Risk Score</Label>
          <Select value={filters.riskRange || 'all'} onValueChange={(v) => update('riskRange', v)}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="low">Baixo (0-29)</SelectItem>
              <SelectItem value="medium">Médio (30-59)</SelectItem>
              <SelectItem value="high">Alto (60-100)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">LTV Mínimo</Label>
          <Input type="number" placeholder="R$ 0" className="h-9" value={filters.minLTV} onChange={(e) => update('minLTV', e.target.value)} />
        </div>

        <div>
          <Label className="text-xs">LTV Máximo</Label>
          <Input type="number" placeholder="Sem limite" className="h-9" value={filters.maxLTV} onChange={(e) => update('maxLTV', e.target.value)} />
        </div>

        <div>
          <Label className="text-xs">Compras Mínimas</Label>
          <Input type="number" placeholder="0" className="h-9" value={filters.minPurchases} onChange={(e) => update('minPurchases', e.target.value)} />
        </div>

        <div>
          <Label className="text-xs">Tag</Label>
          <Input placeholder="Ex: Premium" className="h-9" value={filters.tag || ''} onChange={(e) => update('tag', e.target.value)} />
        </div>
      </div>
    </Card>
  );
}