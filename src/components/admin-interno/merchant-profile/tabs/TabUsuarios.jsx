import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Lock, Unlock, Trash2, Mail, Shield, ShieldCheck, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';

const profileConfig = {
    admin: { label: 'Administrador', color: 'bg-purple-100 text-purple-700' },
    financial: { label: 'Financeiro', color: 'bg-green-100 text-green-700' },
    operator: { label: 'Operador', color: 'bg-blue-100 text-blue-700' },
    viewer: { label: 'Visualizador', color: 'bg-gray-100 text-gray-700' },
    technical: { label: 'Técnico', color: 'bg-orange-100 text-orange-700' },
};

export default function TabUsuarios({ merchant }) {
    const [userModal, setUserModal] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const users = [
        { id: 1, name: 'João da Silva', email: 'joao@lojadojoao.com.br', profile: 'admin', status: 'active', createdAt: '2024-03-15', lastAccess: '2026-01-28 14:30', twoFa: true },
        { id: 2, name: 'Maria Santos', email: 'financeiro@lojadojoao.com.br', profile: 'financial', status: 'active', createdAt: '2024-03-15', lastAccess: '2026-01-27 16:45', twoFa: true },
        { id: 3, name: 'Carlos Oliveira', email: 'carlos@lojadojoao.com.br', profile: 'operator', status: 'active', createdAt: '2024-06-01', lastAccess: '2026-01-28 09:00', twoFa: false },
        { id: 4, name: 'Ana Paula', email: 'ana@lojadojoao.com.br', profile: 'viewer', status: 'active', createdAt: '2024-09-15', lastAccess: '2026-01-20 11:00', twoFa: false },
        { id: 5, name: 'Pedro Souza', email: 'pedro@lojadojoao.com.br', profile: 'operator', status: 'blocked', createdAt: '2024-08-01', lastAccess: '2025-12-15', twoFa: false, blockReason: 'Funcionário desligado', blockDate: '2025-12-15' },
    ];

    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.filter(u => u.status !== 'active').length;
    const lastAccess = users.filter(u => u.status === 'active').sort((a, b) => new Date(b.lastAccess) - new Date(a.lastAccess))[0];

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500">Ativos</p>
                    <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500">Inativos</p>
                    <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500">Último acesso</p>
                    <p className="text-sm font-medium">{lastAccess?.lastAccess}</p>
                    <p className="text-xs text-slate-500">({lastAccess?.name})</p>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={() => { setEditUser(null); setUserModal(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Criar Usuário
                </Button>
            </div>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">👥 Lista de Usuários</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {users.map(user => {
                        const profile = profileConfig[user.profile];
                        return (
                            <div key={user.id} className={`p-4 border rounded-lg ${user.status === 'blocked' ? 'bg-red-50 border-red-200' : 'border-slate-200'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                            👤
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name} ({user.email})</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className={`${profile.color} border-0`}>{profile.label}</Badge>
                                                {user.status === 'active' ? (
                                                    <Badge className="bg-green-100 text-green-700 border-0">✅ Ativo</Badge>
                                                ) : (
                                                    <Badge className="bg-red-100 text-red-700 border-0">❌ Inativo (bloqueado)</Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')} | 
                                                Último acesso: {user.lastAccess}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs">2FA:</span>
                                                {user.twoFa ? (
                                                    <Badge className="bg-green-100 text-green-700 border-0 text-xs"><ShieldCheck className="w-3 h-3 mr-1" /> Habilitado</Badge>
                                                ) : (
                                                    <Badge className="bg-gray-100 text-gray-700 border-0 text-xs"><ShieldOff className="w-3 h-3 mr-1" /> Desabilitado</Badge>
                                                )}
                                            </div>
                                            {user.blockReason && (
                                                <p className="text-xs text-red-600 mt-1">
                                                    Motivo bloqueio: "{user.blockReason}" (bloqueado em {user.blockDate})
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => { setEditUser(user); setUserModal(true); }}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        {user.status === 'active' ? (
                                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success('Usuário bloqueado!')}>
                                                <Lock className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" className="text-green-600" onClick={() => toast.success('Usuário desbloqueado!')}>
                                                <Unlock className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success('Usuário removido!')}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">⚡ Ações em Massa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('E-mails reenviados!')}>
                        <Mail className="w-4 h-4 mr-2" /> Reenviar e-mail de ativação para todos pendentes
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('Senhas resetadas!')}>
                        <Lock className="w-4 h-4 mr-2" /> Forçar alteração de senha para todos
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('2FA exigido!')}>
                        <Shield className="w-4 h-4 mr-2" /> Exigir 2FA para todos os usuários
                    </Button>
                </CardContent>
            </Card>

            {/* User Modal */}
            <Dialog open={userModal} onOpenChange={setUserModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editUser ? 'Editar Usuário' : 'Criar Usuário'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nome Completo *</Label>
                            <Input className="mt-1" defaultValue={editUser?.name} />
                        </div>
                        <div>
                            <Label>E-mail *</Label>
                            <Input type="email" className="mt-1" defaultValue={editUser?.email} />
                        </div>
                        <div>
                            <Label>Perfil *</Label>
                            <Select defaultValue={editUser?.profile || 'operator'}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="financial">Financeiro</SelectItem>
                                    <SelectItem value="operator">Operador</SelectItem>
                                    <SelectItem value="viewer">Visualizador</SelectItem>
                                    <SelectItem value="technical">Técnico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUserModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Usuário salvo!'); setUserModal(false); }}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}