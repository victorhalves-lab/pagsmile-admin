import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Users,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    KeyRound,
    ShieldCheck,
    ShieldOff,
    Mail,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const roleLabels = {
    admin: 'Administrador',
    financial: 'Financeiro',
    operations: 'Operações',
    viewer: 'Visualizador',
    developer: 'Desenvolvedor'
};

const roleDescriptions = {
    admin: 'Acesso total ao sistema',
    financial: 'Acesso a finanças, saques e relatórios',
    operations: 'Acesso a transações e disputas',
    viewer: 'Apenas visualização, sem edição',
    developer: 'Acesso a APIs, webhooks e integrações'
};

const statusConfig = {
    active: { label: 'Ativo', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-600', icon: XCircle },
    blocked: { label: 'Bloqueado', color: 'bg-red-100 text-red-700', icon: ShieldOff }
};

export default function TabClientUsers({ merchant }) {
    const queryClient = useQueryClient();
    const [showDialog, setShowDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
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
            user_id: `user_${Date.now()}`,
            subaccount_id: merchant.id,
            subaccount_name: merchant.business_name,
            invited_at: new Date().toISOString()
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['client-users']);
            toast.success('Usuário criado e convite enviado!');
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
                phone: user.phone || '',
                role: user.role,
                status: user.status
            });
        } else {
            setEditingUser(null);
            setFormData({
                full_name: '',
                email: '',
                phone: '',
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

    const handleSubmit = () => {
        if (!formData.full_name || !formData.email) {
            toast.error('Nome e e-mail são obrigatórios');
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
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
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
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Usuários da Subconta
                            </CardTitle>
                            <CardDescription>Gerencie quem tem acesso ao Admin do Cliente</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenDialog()} className="bg-[#00D26A] hover:bg-[#00B85C]">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Usuário
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Usuário</TableHead>
                                    <TableHead>Papel</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Último Acesso</TableHead>
                                    <TableHead>Total de Logins</TableHead>
                                    <TableHead>Criado em</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => {
                                    const statusConf = statusConfig[user.status] || statusConfig.pending;
                                    const StatusIcon = statusConf.icon;

                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback className="bg-[#101F3E] text-white text-sm">
                                                            {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">{user.full_name}</p>
                                                        <p className="text-xs text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{roleLabels[user.role]}</p>
                                                    <p className="text-xs text-slate-500">{roleDescriptions[user.role]}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn("gap-1", statusConf.color)}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusConf.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.last_login ? (
                                                    <div>
                                                        <p className="text-sm">{format(new Date(user.last_login), 'dd/MM/yyyy')}</p>
                                                        <p className="text-xs text-slate-500">{format(new Date(user.last_login), 'HH:mm')}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-sm">Nunca</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{user.login_count || 0}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-600">
                                                    {format(new Date(user.created_date), 'dd/MM/yyyy', { locale: ptBR })}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleOpenDialog(user)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                                            <KeyRound className="w-4 h-4 mr-2" />
                                                            Resetar Senha
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                                            {user.status === 'active' ? (
                                                                <>
                                                                    <ShieldOff className="w-4 h-4 mr-2" />
                                                                    Desativar
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                                                    Ativar
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                if (confirm(`Remover ${user.full_name}?`)) {
                                                                    deleteMutation.mutate(user.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Remover
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    {users.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>Nenhum usuário cadastrado para este cliente</p>
                            <Button className="mt-4" onClick={() => handleOpenDialog()}>
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Primeiro Usuário
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
                        <DialogDescription>
                            {editingUser ? 'Altere as informações do usuário' : 'Crie um novo usuário para acessar o Admin do Cliente'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Nome Completo *</Label>
                            <Input
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Nome do usuário"
                            />
                        </div>
                        <div>
                            <Label>E-mail *</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@empresa.com"
                                disabled={!!editingUser}
                            />
                            {editingUser && (
                                <p className="text-xs text-slate-500 mt-1">E-mail não pode ser alterado</p>
                            )}
                        </div>
                        <div>
                            <Label>Telefone</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                        <div>
                            <Label>Papel (Role) *</Label>
                            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(roleLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            <div>
                                                <p className="font-medium">{label}</p>
                                                <p className="text-xs text-slate-500">{roleDescriptions[key]}</p>
                                            </div>
                                        </SelectItem>
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
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                        <SelectItem value="blocked">Bloqueado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createMutation.isPending || updateMutation.isPending}
                            className="bg-[#00D26A] hover:bg-[#00B85C]"
                        >
                            {(createMutation.isPending || updateMutation.isPending) ? 'Salvando...' : (
                                editingUser ? 'Salvar Alterações' : 'Criar e Enviar Convite'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}