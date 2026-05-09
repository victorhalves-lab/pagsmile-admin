import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building, Plus, X, Search } from 'lucide-react';
import { toast } from 'sonner';

const suggestedFiliais = [
  { id: '12345', name: 'Farmácia ABC — Matriz Centro', doc: '12.345.678/0001-90' },
  { id: '12346', name: 'Farmácia ABC — Vila Mariana', doc: '12.345.678/0002-71' },
  { id: '12347', name: 'Farmácia ABC — Pinheiros', doc: '12.345.678/0003-52' },
  { id: '12348', name: 'Farmácia ABC — Moema', doc: '12.345.678/0004-33' },
];

export default function AdminIntMerchantGroupCreate() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [radical, setRadical] = useState('');
  const [holding, setHolding] = useState('');
  const [contractMaster, setContractMaster] = useState('');
  const [consolidatedMgmt, setConsolidatedMgmt] = useState(true);
  const [selected, setSelected] = useState([]);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const submit = () => {
    toast.success(`Grupo "${groupName}" criado com ${selected.length} filiais`);
    navigate(createPageUrl('AdminIntMerchantGroups'));
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Novo Grupo de Lojistas"
        subtitle="Cadastre uma rede com matriz e filiais"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Grupos', page: 'AdminIntMerchantGroups' },
          { label: 'Novo Grupo' },
        ]}
        icon={Building}
      />

      <Card>
        <CardHeader><CardTitle>Dados do grupo</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome do grupo *</Label>
              <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Ex: Rede Farmácias ABC" />
            </div>
            <div>
              <Label>Radical do CNPJ (8 dígitos)</Label>
              <Input value={radical} onChange={(e) => setRadical(e.target.value)} placeholder="12.345.678" />
            </div>
            <div>
              <Label>Empresa controladora (opcional)</Label>
              <Input value={holding} onChange={(e) => setHolding(e.target.value)} placeholder="Holding ABC Saúde S.A." />
            </div>
            <div>
              <Label>Contrato master (opcional)</Label>
              <Input value={contractMaster} onChange={(e) => setContractMaster(e.target.value)} placeholder="CTR-MASTER-2025-0001" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={consolidatedMgmt} onCheckedChange={setConsolidatedMgmt} />
            <span className="text-sm">Habilitar gestão consolidada (admin de grupo vê todas as filiais)</span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Filiais sugeridas pelo radical
            {radical && <span className="text-xs font-normal text-slate-500">({suggestedFiliais.length} encontradas)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {suggestedFiliais.map((f) => (
            <label key={f.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <Checkbox checked={selected.includes(f.id)} onCheckedChange={() => toggle(f.id)} />
              <Building className="w-4 h-4 text-slate-400" />
              <div className="flex-1">
                <p className="font-bold text-sm">{f.name}</p>
                <p className="text-[11px] text-slate-500">{f.doc} · ID {f.id}</p>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
        <Button onClick={submit} disabled={!groupName}>
          Criar grupo com {selected.length} filiais
        </Button>
      </div>
    </div>
  );
}