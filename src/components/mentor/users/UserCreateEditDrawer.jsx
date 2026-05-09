import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, Sparkles } from 'lucide-react';
import { EntityFormDrawer } from '@/components/common/drawers';
import { USER_ROLES, USER_DEPARTMENTS, ROLE_PRESETS } from '@/components/mentor/mocks/usersMock';
import UserPermissionsMatrix from './UserPermissionsMatrix';
import { toast } from 'sonner';

const PROJECTS_AVAILABLE = [
  { id: 'prj_001', name: 'Brasil · Master' },
  { id: 'prj_002', name: 'México · Pix Internacional' },
  { id: 'prj_003', name: 'Colômbia · Phase 1' },
];

export default function UserCreateEditDrawer({ open, onOpenChange, user = null, onSaved }) {
  const isEdit = !!user;
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    role: 'analyst',
    department: '',
    title: '',
    phone: '',
    projects_access: [],
    custom_permissions: ROLE_PRESETS.analyst,
    mfa_required: true,
    notes: '',
  });

  useEffect(() => {
    if (user) {
      setDraft({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        title: user.title,
        phone: user.phone || '',
        projects_access: user.projects_access || [],
        custom_permissions: user.custom_permissions || [],
        mfa_required: user.mfa_enabled,
        notes: user.notes || '',
      });
    } else {
      setDraft({
        name: '', email: '', role: 'analyst', department: '', title: '', phone: '',
        projects_access: [], custom_permissions: ROLE_PRESETS.analyst, mfa_required: true, notes: '',
      });
    }
  }, [user, open]);

  const handleRoleChange = (newRole) => {
    setDraft({ ...draft, role: newRole, custom_permissions: ROLE_PRESETS[newRole] || [] });
  };

  const toggleProject = (projectId) => {
    setDraft({
      ...draft,
      projects_access: draft.projects_access.includes(projectId)
        ? draft.projects_access.filter((p) => p !== projectId)
        : [...draft.projects_access, projectId],
    });
  };

  const handleSubmit = () => {
    if (!draft.name || !draft.email || !draft.role || !draft.department) {
      toast.error('Preencha campos obrigatórios');
      return;
    }
    if (!draft.email.includes('@')) {
      toast.error('E-mail inválido');
      return;
    }
    onSaved?.(draft);
    onOpenChange(false);
    toast.success(isEdit ? 'Usuário atualizado · auditoria registrada' : 'Convite enviado · expira em 7 dias');
  };

  const isCustom = draft.custom_permissions.length !== (ROLE_PRESETS[draft.role] || []).length ||
    !draft.custom_permissions.every((p) => (ROLE_PRESETS[draft.role] || []).includes(p));

  return (
    <EntityFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? `Editar usuário: ${user.name}` : 'Convidar novo usuário'}
      description={isEdit ? 'Alterações em perfil/permissões geram trilha auditável imutável' : 'Convite enviado por e-mail · MFA configurado no primeiro acesso'}
      icon={UserPlus}
      size="xl"
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Salvar alterações' : 'Enviar convite'}
    >
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="access">Acesso & Projetos</TabsTrigger>
          <TabsTrigger value="permissions">Permissões {isCustom && <Sparkles className="w-3 h-3 ml-1 text-amber-500" />}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nome completo *</Label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Ex: João Silva" />
            </div>
            <div>
              <Label>E-mail corporativo *</Label>
              <Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="joao@pagsmile.com" disabled={isEdit} />
            </div>
            <div>
              <Label>Departamento *</Label>
              <Select value={draft.department} onValueChange={(v) => setDraft({ ...draft, department: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {USER_DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cargo</Label>
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Ex: Senior Analyst" />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="+55 11 99999-9999" />
            </div>
            <div>
              <Label>Perfil (Role) *</Label>
              <Select value={draft.role} onValueChange={handleRoleChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(USER_ROLES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-slate-500 mt-1">{USER_ROLES[draft.role]?.description}</p>
            </div>
          </div>

          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">MFA obrigatório</p>
                <p className="text-[10px] text-slate-500">Usuários com perfis críticos devem manter MFA ativo</p>
              </div>
              <Switch checked={draft.mfa_required} onCheckedChange={(v) => setDraft({ ...draft, mfa_required: v })} />
            </CardContent>
          </Card>

          <div>
            <Label>Notas (visível apenas para admins)</Label>
            <Textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="min-h-[60px]" />
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-3 pt-3">
          <div>
            <Label className="mb-2 block">Projetos com acesso</Label>
            <div className="space-y-2">
              {PROJECTS_AVAILABLE.map((p) => (
                <Card key={p.id} className={draft.projects_access.includes(p.id) ? 'border-violet-300 bg-violet-50/30' : ''}>
                  <CardContent className="p-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{p.id}</p>
                    </div>
                    <Switch
                      checked={draft.projects_access.includes(p.id)}
                      onCheckedChange={() => toggleProject(p.id)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              {draft.projects_access.length === 0 ? '⚠ Sem projetos selecionados — usuário ficará sem acesso aos dados' : `${draft.projects_access.length} projeto(s) acessível(eis)`}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-3 pt-3">
          {isCustom && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
              <CardContent className="p-2.5 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span><strong>Permissões customizadas</strong> · diferem do preset padrão de <Badge className="text-[9px] mx-1">{USER_ROLES[draft.role]?.label}</Badge>
                <button className="text-violet-600 underline ml-1" onClick={() => setDraft({ ...draft, custom_permissions: ROLE_PRESETS[draft.role] || [] })}>
                  reverter para preset
                </button>
                </span>
              </CardContent>
            </Card>
          )}
          <UserPermissionsMatrix
            selected={draft.custom_permissions}
            onChange={(p) => setDraft({ ...draft, custom_permissions: p })}
          />
        </TabsContent>
      </Tabs>
    </EntityFormDrawer>
  );
}