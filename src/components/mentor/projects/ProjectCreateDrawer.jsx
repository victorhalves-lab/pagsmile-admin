import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers } from 'lucide-react';
import { EntityFormDrawer } from '@/components/common/drawers';
import { PROJECT_TYPES, REGULATORY_REGIONS } from '../mocks/projectsMock';
import { toast } from 'sonner';

export default function ProjectCreateDrawer({ open, onOpenChange }) {
  const [data, setData] = useState({ project_type: 'acquiring', region: 'br' });

  const handleSubmit = () => {
    onOpenChange(false);
    toast.success(`Projeto "${data.trade || 'Novo projeto'}" criado em homologação · provisioning iniciado`);
  };

  return (
    <EntityFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Novo projeto · Multi-tenant"
      description="Cria projeto isolado com Keycloak realm + storage dedicados"
      icon={Layers}
      size="md"
      onSubmit={handleSubmit}
      submitLabel="Criar projeto"
    >
      <div className="space-y-4">
        <div>
          <Label>Nome técnico (slug)</Label>
          <Input value={data.project_name || ''} onChange={(e) => setData({ ...data, project_name: e.target.value })} placeholder="ex: pagsmile_br_acquiring_v3" />
        </div>
        <div>
          <Label>Nome comercial (trade)</Label>
          <Input value={data.trade || ''} onChange={(e) => setData({ ...data, trade: e.target.value })} placeholder="ex: PagSmile Brasil · Cartões" />
        </div>
        <div>
          <Label>Cliente corporativo</Label>
          <Input value={data.company_name || ''} onChange={(e) => setData({ ...data, company_name: e.target.value })} placeholder="ex: PagSmile Pagamentos S.A." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tipo</Label>
            <Select value={data.project_type} onValueChange={(v) => setData({ ...data, project_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PROJECT_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Região regulatória</Label>
            <Select value={data.region} onValueChange={(v) => setData({ ...data, region: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(REGULATORY_REGIONS).map(([k, v]) => <SelectItem key={k} value={k}>{v.flag} {v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </EntityFormDrawer>
  );
}