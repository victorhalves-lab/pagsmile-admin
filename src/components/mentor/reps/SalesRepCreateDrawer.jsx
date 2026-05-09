import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { EntityFormDrawer } from '@/components/common/drawers';
import { REP_TYPES } from '../mocks/salesRepsMock';
import { toast } from 'sonner';

export default function SalesRepCreateDrawer({ open, onOpenChange }) {
  const [data, setData] = useState({ type: 'internal', region: 'sudeste', commission_pct: 15 });

  const handleSubmit = () => {
    onOpenChange(false);
    toast.success(`Representante "${data.name || 'Novo'}" cadastrado com sucesso`);
  };

  return (
    <EntityFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Novo representante comercial"
      description="Cadastra membro da equipe comercial e atribui carteira"
      icon={UserPlus}
      size="md"
      onSubmit={handleSubmit}
      submitLabel="Cadastrar"
    >
      <div className="space-y-3">
        <div>
          <Label>Nome completo</Label>
          <Input value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="ex: João da Silva" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>E-mail</Label>
            <Input type="email" value={data.email || ''} onChange={(e) => setData({ ...data, email: e.target.value })} />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input value={data.phone || ''} onChange={(e) => setData({ ...data, phone: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>CPF</Label>
            <Input value={data.cpf || ''} onChange={(e) => setData({ ...data, cpf: e.target.value })} placeholder="000.000.000-00" />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={data.type} onValueChange={(v) => setData({ ...data, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(REP_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Região</Label>
            <Select value={data.region} onValueChange={(v) => setData({ ...data, region: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nacional">Nacional</SelectItem>
                <SelectItem value="sudeste">Sudeste</SelectItem>
                <SelectItem value="sul">Sul</SelectItem>
                <SelectItem value="nordeste">Nordeste</SelectItem>
                <SelectItem value="centrooeste">Centro-Oeste</SelectItem>
                <SelectItem value="norte">Norte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Comissão (%)</Label>
            <Input type="number" step="0.1" value={data.commission_pct || ''} onChange={(e) => setData({ ...data, commission_pct: parseFloat(e.target.value) })} />
          </div>
        </div>
      </div>
    </EntityFormDrawer>
  );
}