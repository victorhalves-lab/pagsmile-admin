import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Lock, Trash2, RefreshCw, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const users = [
    { id: 1, name: 'João da Silva', email: 'joao.silva@pagsmile.com', role: 'Admin', department: 'Tecnologia', status: 'online', has2fa: true, lastAccess: 'Agora', ip: '189.45.123.100' },
    { id: 2, name: 'Maria Santos', email: 'maria.santos@pagsmile.com', role: 'Gerente', department: 'Operações', status: 'online', has2fa: true, lastAccess: 'há 15 min', ip: '177.80.45.200' },
    { id: 3, name: 'Carlos Oliveira', email: 'carlos.oliveira@pagsmile.com', role: 'Analista', department: 'Risco', status: 'offline', has2fa: true, lastAccess: '27/01/2026 18:30', ip: '200.150.50.100' },
    { id: 4, name: 'Ana Paula Lima', email: 'ana.paula@pagsmile.com', role: 'Operador', department: 'Suporte', status: 'inactive', has2fa: false, lastAccess: '15/01/2026', ip: '-' },
    { id: 5, name: 'Pedro Souza', email: 'pedro.souza@pagsmile.com', role: 'Analista', department: 'Financeiro', status: 'offline', has2fa: true, lastAccess: '28/01/2026 10:00', ip: '189.100.50.75' },
];

const statusConfig = {
    online: { label: '🟢 Online agora', color: 'bg-green-100 text-green-700' },
    offline: { label: '⚫ Offline', color: 'bg-slate-100 text-slate-700' },
    inactive: { label: '🔴 Inativo', color: 'bg-red-100 text-red-700' },
    blocked: { label: '🔴 Bloqueado', color: 'bg-red-100 text-red-700' },
    pending: { label: '🟡 Pendente', color: 'bg-yellow-100 text-yellow-700' },
};

export default function AdminIntUsers() {
    const [newUserModal, setNewUserModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRole, setFilterRole] = useState('all');

    const stats = {
        total: users.length,
        active: users.filter(u => u.status !== 'inactive').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        online: users.filter(u => u.status === 'online').length,
    };

    const filteredUsers = users.filter(u => {
        if (filterStatus !== 'all' && u.status !== filterStatus) return false;
        if (filterRole !== 'all' && u.role !== filterRole) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Gestão de Usuários"
                breadcrumbs={[{ label: 'Administração' }, { label: 'Usuários' }]}
                actionElement={
                    <Button onClick={() => setNewUserModal(true)}>
                        <UserPlus className="w-4 h-4 mr-2" /> Novo Usuário
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
                <div className="p-4 bg-white border rounded-lg text-center">
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-slate-500">Total</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-700">{stats.active}</p>
                    <p className="text-sm text-slate-500">Ativos</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-700">{stats.inactive}</p>
                    <p className="text-sm text-slate-500">Inativos</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-700">{stats.online}</p>
                    <p className="text-sm text-slate-500">Online</p>
                </div>
                <div className="p-4 bg-slate-50 border rounded-lg text-center">
                    <p className="text-sm font-medium">Último acesso</p>
                    <p className="text-xs text-slate-500">Agora (João Silva)</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="offline">Offline</SelectItem>
                                <SelectItem value="inactive">Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterRole} onValueChange={setFilterRole}>
                            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Perfil" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Gerente">Gerente</SelectItem>
                                <SelectItem value="Analista">Analista</SelectItem>
                                <SelectItem value="Operador">Operador</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input placeholder="🔍 Buscar usuário..." className="w-[250px]" />
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <div className="space-y-3">
                {filteredUsers.map(user => (
                    <Card key={user.id}>
                        <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold">
                                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{user.name}</h3>
                                            <Badge className={`${statusConfig[user.status].color} border-0 text-xs`}>
                                                {statusConfig[user.status].label}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                        <p className="text-sm text-slate-600 mt-1">
                                            Perfil: <strong>{user.role}</strong> | 
                                            Depto: <strong>{user.department}</strong> | 
                                            2FA: {user.has2fa ? '✅' : '❌'}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Último acesso: {user.lastAccess} {user.ip !== '-' && `| IP: ${user.ip}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {user.status === 'inactive' ? (
                                        <>
                                            <Button variant="outline" size="sm" onClick={() => toast.success('Usuário reativado!')}>
                                                <RefreshCw className="w-4 h-4 mr-1" /> Reativar
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600" onClick={() => toast.success('Usuário excluído!')}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4 mr-1" /> Editar
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => toast.success('Link de reset enviado!')}>
                                                <Lock className="w-4 h-4 mr-1" /> Resetar
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600" onClick={() => toast.success('Usuário desativado!')}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* New User Modal */}
            <Dialog open={newUserModal} onOpenChange={setNewUserModal}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Novo Usuário</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-3 border-b pb-4">
                            <h4 className="font-medium text-sm text-slate-700">Dados Pessoais</h4>
                            <div>
                                <Label>Nome completo *</Label>
                                <Input className="mt-1" placeholder="Nome completo do usuário" />
                            </div>
                            <div>
                                <Label>E-mail corporativo *</Label>
                                <div className="flex mt-1">
                                    <Input placeholder="usuario" className="rounded-r-none" />
                                    <span className="px-3 py-2 bg-slate-100 border border-l-0 rounded-r-md text-sm">@pagsmile.com</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>CPF</Label>
                                    <Input className="mt-1" placeholder="___.___.___-__" />
                                </div>
                                <div>
                                    <Label>Telefone</Label>
                                    <Input className="mt-1" placeholder="(__) _____-____" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 border-b pb-4">
                            <h4 className="font-medium text-sm text-slate-700">Acesso</h4>
                            <div>
                                <Label>Perfil de acesso *</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o perfil" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="viewer">Visualizador - Apenas visualização</SelectItem>
                                        <SelectItem value="operator">Operador - Operações básicas</SelectItem>
                                        <SelectItem value="analyst">Analista - Análise e ações</SelectItem>
                                        <SelectItem value="manager">Gerente - Gestão e aprovações</SelectItem>
                                        <SelectItem value="admin">Admin - Acesso total</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Departamento *</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o departamento" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tech">Tecnologia</SelectItem>
                                        <SelectItem value="ops">Operações</SelectItem>
                                        <SelectItem value="risk">Risco</SelectItem>
                                        <SelectItem value="finance">Financeiro</SelectItem>
                                        <SelectItem value="commercial">Comercial</SelectItem>
                                        <SelectItem value="support">Suporte</SelectItem>
                                        <SelectItem value="compliance">Compliance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox defaultChecked /> Exigir 2FA na primeira autenticação
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox defaultChecked /> Enviar e-mail de boas-vindas com link de ativação
                                </label>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-sm text-slate-700">Restrições Adicionais (opcional)</h4>
                            <div className="space-y-2">
                                <Label className="text-sm">Restringir a merchants específicos:</Label>
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" name="merchants" defaultChecked /> Todos os merchants
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" name="merchants" /> Apenas merchants selecionados
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Restringir IPs de acesso:</Label>
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" name="ips" defaultChecked /> Sem restrição
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" name="ips" /> Apenas IPs específicos
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewUserModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Usuário criado com sucesso!'); setNewUserModal(false); }}>
                            <UserPlus className="w-4 h-4 mr-2" /> Criar Usuário
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}