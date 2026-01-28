import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminIntUserDetail() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Usuário: Ana Silva" 
                subtitle="Detalhes e Permissões"
                breadcrumbs={[
                    { label: 'Usuários', page: 'AdminIntUsers' }, 
                    { label: 'Ana Silva', page: '#' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline">Resetar Senha</Button>
                        <Button variant="destructive">Desativar</Button>
                        <Button>Salvar</Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Dados Cadastrais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Nome Completo</label>
                                <Input defaultValue="Ana Silva" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">E-mail</label>
                                <Input defaultValue="ana@pagsmile.com" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Perfil</label>
                                <Select defaultValue="admin">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="comercial">Comercial</SelectItem>
                                        <SelectItem value="suporte">Suporte</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Equipe</label>
                                <Select defaultValue="ops">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ops">Operações</SelectItem>
                                        <SelectItem value="sales">Vendas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <h3 className="font-medium mb-3">Permissões Especiais</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="p1" defaultChecked />
                                <label htmlFor="p1" className="text-sm">Aprovar alterações de taxas</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="p2" defaultChecked />
                                <label htmlFor="p2" className="text-sm">Suspender/Bloquear Merchants</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="p3" />
                                <label htmlFor="p3" className="text-sm">Acesso a Logs de Sistema</label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Info de Acesso</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-slate-500">Status</span>
                            <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-slate-500">2FA</span>
                            <Badge className="bg-green-100 text-green-700">Ativado</Badge>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-slate-500">Último Login</span>
                            <span>27/01/2026 14:32</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-slate-500">Criado em</span>
                            <span>15/01/2025</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}