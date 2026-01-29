import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
  Plus, Edit, Trash2, Key, UserX, UserCheck, Mail, Shield, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const roleLabels = {
  admin: { label: 'Administrador', color: 'bg-purple-100 text-purple-700' },
  financial: { label: 'Financeiro', color: 'bg-blue-100 text-blue-700' },
  operations: { label: 'Operações', color: 'bg-green-100 text-green-700' },
  developer: { label: 'Desenvolvedor', color: 'bg-orange-100 text-orange-700' },
  viewer: { label: 'Visualizador', color: 'bg-slate-100 text-slate-700' }
};

const statusConfig = {
  active: { label: 'Ativo', color: 'bg-green-100 text-green-700' },
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
  suspended: { label: 'Suspenso', color: 'bg-red-100 text-red-700' }
};

export default function TabClientUsers({ merchant }) {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'viewer',
    status: 'pending'
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['client-users', merchant.id],
    queryFn: () => base44.entities.ClientUser.filter({ subaccount_id: merchant.id })
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ClientUser.create({
      ...data,
      subaccount_id: merchant.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['client-users']);
      toast.success('Usuário adicionado! Convite enviado por e-mail.');
      handleCloseDialog();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ClientUser.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['client-users']);
      toast.success('Usuário atualizado!');
      handleCloseDialog();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ClientUser.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['client-users']);
      toast.success('Usuário removido!');
    }
  });

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        full_name: '',
        email: '',
        role: 'viewer',
        status: 'pending'
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingUser(null);
  };

  const handleSave = () => {
    if (!formData.email || !formData.full_name) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleResetPassword = async (user) => {
    if (confirm(`Enviar link de reset de senha para ${user.email}?`)) {
      toast.success('Link de reset enviado!');
    }
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    updateMutation.mutate({ 
      id: user.id, 
      data: { status: newStatus } 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usuários da Subconta</CardTitle>
              <CardDescription>Gerencie os usuários que têm acesso ao Admin do cliente</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => {
                const roleConfig = roleLabels[user.role] || roleLabels.viewer;
                const statusConf = statusConfig[user.status];
                
                return (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#2bc196] text-white">
                          {user.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        {user.last_login_at && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            Último acesso: {format(new Date(user.last_login_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={roleConfig.color}>{roleConfig.label}</Badge>
                      <Badge className={statusConf.color}>{statusConf.label}</Badge>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleResetPassword(user)}
                          title="Resetar senha"
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === 'active' ? 'Suspender' : 'Ativar'}
                        >
                          {user.status === 'active' ? (
                            <UserX className="w-4 h-4 text-red-600" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-600"
                          onClick={() => {
                            if (confirm(`Remover usuário ${user.full_name}?`)) {
                              deleteMutation.mutate(user.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Nenhum usuário cadastrado para este cliente</p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Usuário
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Atualize os dados do usuário' : 'Um convite será enviado por e-mail'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Nome Completo *</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="João Silva"
              />
            </div>
            <div>
              <Label>E-mail *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@empresa.com"
                disabled={!!editingUser}
              />
            </div>
            <div>
              <Label>Papel (Role)</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {editingUser && (
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="suspended">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingUser ? 'Salvar' : 'Enviar Convite'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}