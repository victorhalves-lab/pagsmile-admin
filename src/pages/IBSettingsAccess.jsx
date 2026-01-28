import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Users,
  Plus,
  MoreVertical,
  Shield,
  CheckCircle2,
  XCircle,
  Mail,
  Trash2,
  Edit2,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import PageHeader from '@/components/common/PageHeader';
import { cn } from '@/lib/utils';

export default function IBSettingsAccess() {
  const queryClient = useQueryClient();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    user_email: '',
    user_name: '',
    role: 'viewer',
    permissions: {
      can_view_balance: true,
      can_view_extract: true,
      can_send_pix: false,
      can_manage_keys: false,
      can_manage_profiles: false
    }
  });

  // Fetch current user
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  // Fetch access profiles
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['accessProfiles'],
    queryFn: () => base44.entities.IBAccessProfile.list(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.IBAccessProfile.create({
      ...data,
      granted_by_user_id: currentUser?.id,
      status: 'pending'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['accessProfiles']);
      setShowInviteDialog(false);
      resetForm();
      toast.success('Convite enviado com sucesso!');
    },
    onError: () => toast.error('Erro ao enviar convite')
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.IBAccessProfile.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['accessProfiles']);
      setShowInviteDialog(false);
      setEditingProfile(null);
      resetForm();
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar perfil')
  });

  // Delete/Revoke mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.IBAccessProfile.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['accessProfiles']);
      toast.success('Acesso revogado com sucesso!');
    },
    onError: () => toast.error('Erro ao revogar acesso')
  });

  const resetForm = () => {
    setFormData({
      user_email: '',
      user_name: '',
      role: 'viewer',
      permissions: {
        can_view_balance: true,
        can_view_extract: true,
        can_send_pix: false,
        can_manage_keys: false,
        can_manage_profiles: false
      }
    });
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setFormData({
      user_email: profile.user_email,
      user_name: profile.user_name,
      role: profile.role,
      permissions: profile.permissions || {}
    });
    setShowInviteDialog(true);
  };

  const handleSubmit = () => {
    if (!formData.user_email) {
      toast.error('O e-mail é obrigatório');
      return;
    }

    if (editingProfile) {
      updateMutation.mutate({ id: editingProfile.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const roleConfig = {
    viewer: { label: 'Visualizador', color: 'bg-blue-100 text-blue-700' },
    operator: { label: 'Operador', color: 'bg-purple-100 text-purple-700' },
    admin: { label: 'Administrador', color: 'bg-emerald-100 text-emerald-700' }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfis de Acesso"
        subtitle="Gerencie quem pode acessar sua conta digital"
        breadcrumbs={[
          { label: 'Configurações', page: 'IBSettings' },
          { label: 'Perfis de Acesso', page: 'IBSettingsAccess' }
        ]}
        actions={
          <Button 
            className="bg-[#00D26A] hover:bg-[#00A854]"
            onClick={() => {
              setEditingProfile(null);
              resetForm();
              setShowInviteDialog(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Convidar Usuário
          </Button>
        }
      />

      {/* Access List */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários com Acesso</CardTitle>
          <CardDescription>
            Lista de usuários autorizados a acessar o Internet Banking desta conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {/* Owner Profile (Static) */}
            <div className="flex items-center justify-between p-4 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">Proprietário da Conta</p>
                    <Badge variant="outline" className="text-xs">Dono</Badge>
                  </div>
                  <p className="text-sm text-slate-500">{currentUser?.email}</p>
                </div>
              </div>
              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Acesso Total</Badge>
            </div>

            {/* Granted Profiles */}
            {profiles.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>Nenhum perfil adicional cadastrado.</p>
                <Button 
                  variant="link" 
                  className="text-[#00D26A]"
                  onClick={() => setShowInviteDialog(true)}
                >
                  Convidar alguém agora
                </Button>
              </div>
            ) : (
              profiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{profile.user_name || 'Usuário convidado'}</p>
                      <p className="text-sm text-slate-500">{profile.user_email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge className={roleConfig[profile.role]?.color}>
                      {roleConfig[profile.role]?.label}
                    </Badge>
                    
                    {profile.status === 'pending' && (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        Pendente
                      </Badge>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(profile)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar Permissões
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => deleteMutation.mutate(profile.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revogar Acesso
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invite/Edit Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProfile ? 'Editar Acesso' : 'Convidar Usuário'}</DialogTitle>
            <DialogDescription>
              Defina as permissões de acesso para este usuário.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>E-mail do Usuário</Label>
              <Input 
                placeholder="exemplo@email.com" 
                value={formData.user_email}
                onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                disabled={!!editingProfile}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Nome (Opcional)</Label>
              <Input 
                placeholder="Nome do colaborador" 
                value={formData.user_name}
                onChange={(e) => setFormData({...formData, user_name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Perfil de Acesso</Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({...formData, role: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Visualizador (Apenas Leitura)</SelectItem>
                  <SelectItem value="operator">Operador (Transações)</SelectItem>
                  <SelectItem value="admin">Administrador (Acesso Total)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <Label className="text-xs text-slate-500 uppercase tracking-wider">Permissões Detalhadas</Label>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Ver Saldo</Label>
                </div>
                <Switch 
                  checked={formData.permissions.can_view_balance}
                  onCheckedChange={(checked) => setFormData({
                    ...formData, 
                    permissions: {...formData.permissions, can_view_balance: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Ver Extrato</Label>
                </div>
                <Switch 
                  checked={formData.permissions.can_view_extract}
                  onCheckedChange={(checked) => setFormData({
                    ...formData, 
                    permissions: {...formData.permissions, can_view_extract: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Realizar Pix/Pagamentos</Label>
                </div>
                <Switch 
                  checked={formData.permissions.can_send_pix}
                  onCheckedChange={(checked) => setFormData({
                    ...formData, 
                    permissions: {...formData.permissions, can_send_pix: checked}
                  })}
                  disabled={formData.role === 'viewer'}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Gerenciar Chaves Pix</Label>
                </div>
                <Switch 
                  checked={formData.permissions.can_manage_keys}
                  onCheckedChange={(checked) => setFormData({
                    ...formData, 
                    permissions: {...formData.permissions, can_manage_keys: checked}
                  })}
                  disabled={formData.role === 'viewer'}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancelar</Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : (editingProfile ? 'Atualizar' : 'Enviar Convite')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}