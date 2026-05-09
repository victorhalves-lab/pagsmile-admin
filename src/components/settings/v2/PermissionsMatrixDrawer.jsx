import React, { useState } from 'react';
import SideDrawer from '@/components/common/SideDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Plus, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const RESOURCES = [
  { id: 'transactions', label: 'Transações', actions: ['Ver', 'Reembolsar', 'Exportar'] },
  { id: 'customers', label: 'Clientes', actions: ['Ver', 'Editar', 'Deletar'] },
  { id: 'subscriptions', label: 'Assinaturas', actions: ['Ver', 'Cancelar', 'Alterar plano'] },
  { id: 'disputes', label: 'Disputas', actions: ['Ver', 'Contestar', 'Aceitar'] },
  { id: 'financial', label: 'Financeiro', actions: ['Ver saldo', 'Sacar', 'Aprovar saques'] },
  { id: 'settings', label: 'Configurações', actions: ['Ver', 'Editar', 'Convidar users'] },
  { id: 'integrations', label: 'API & Webhooks', actions: ['Ver chaves', 'Criar chaves', 'Revogar'] },
  { id: 'fiscal', label: 'Fiscal/Tributário', actions: ['Ver', 'Editar regime'] },
];

const PRESETS = {
  admin: { name: 'Administrador', allow: 'all' },
  financial: { name: 'Financeiro', allow: ['transactions', 'financial', 'subscriptions'] },
  operations: { name: 'Operações', allow: ['transactions', 'customers', 'disputes'] },
  viewer: { name: 'Visualizador', allow: 'view-only' },
};

export default function PermissionsMatrixDrawer({ open, onOpenChange }) {
  const [activeRole, setActiveRole] = useState('admin');

  const isChecked = (roleId, resourceId, action) => {
    const preset = PRESETS[roleId];
    if (!preset) return false;
    if (preset.allow === 'all') return true;
    if (preset.allow === 'view-only') return action === 'Ver' || action === 'Ver saldo' || action === 'Ver chaves';
    if (Array.isArray(preset.allow)) {
      if (!preset.allow.includes(resourceId)) return action === 'Ver' || action === 'Ver saldo';
      return true;
    }
    return false;
  };

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Matriz de Permissões"
      description="RBAC granular: custom roles + per-resource + per-feature"
      icon={Shield}
      size="xl"
      footer={
        <div className="flex justify-between gap-2 w-full">
          <Button variant="outline" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Criar Custom Role
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => { toast.success('Permissões salvas'); onOpenChange(false); }}>
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-purple-900">Stripe-style permissions</p>
            <p className="text-[11px] text-purple-700">Per-resource × per-action. Compliance SOC 2 / ISO 27001.</p>
          </div>
        </div>

        <Tabs value={activeRole} onValueChange={setActiveRole}>
          <TabsList className="w-full grid grid-cols-4 h-9">
            <TabsTrigger value="admin" className="text-xs">Administrador</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs">Financeiro</TabsTrigger>
            <TabsTrigger value="operations" className="text-xs">Operações</TabsTrigger>
            <TabsTrigger value="viewer" className="text-xs">Visualizador</TabsTrigger>
          </TabsList>

          {Object.keys(PRESETS).map((roleId) => (
            <TabsContent key={roleId} value={roleId} className="mt-3 space-y-2">
              {RESOURCES.map((r) => (
                <div key={r.id} className="border rounded-lg p-3 bg-white">
                  <p className="text-xs font-bold text-slate-800 mb-2">{r.label}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {r.actions.map((action) => (
                      <div key={action} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-[11px] text-slate-700">{action}</span>
                        <Switch checked={isChecked(roleId, r.id, action)} className="scale-75" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="border-t pt-4">
          <p className="text-xs font-bold text-slate-700 mb-2">Avançado</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <div>
                <p className="text-xs font-medium">Just-in-time access</p>
                <p className="text-[10px] text-slate-500">Elevação temporária por X horas</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <div>
                <p className="text-xs font-medium">Two-person rule (changes críticos)</p>
                <p className="text-[10px] text-slate-500">Delete user, change bank, disable 2FA</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <div>
                <p className="text-xs font-medium">Field-level permissions</p>
                <p className="text-[10px] text-slate-500">Mascarar tax_id, bank_account por role</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}