import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Settings, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntPartners() {
    const [newPartnerModal, setNewPartnerModal] = useState(false);
    const partners = [
        { name: 'Adyen', type: 'Adquirente', status: 'active', tpv: '45M', cost: '2.15%', priority: 1 },
        { name: 'Stone', type: 'Adquirente', status: 'active', tpv: '28M', cost: '2.25%', priority: 2 },
        { name: 'Cielo', type: 'Adquirente', status: 'active', tpv: '12M', cost: '2.35%', priority: 3 },
        { name: 'Konduto', type: 'Antifraude', status: 'active', tpv: '-', cost: 'R$ 0.06/tx', priority: 1 },
        { name: 'Banco Central', type: 'PSP Pix', status: 'active', tpv: '32M', cost: 'R$ 0.00', priority: 1 },
    ];

    const columns = [
        { header: 'Parceiro', accessorKey: 'name', cell: i => <span className="font-bold">{i.getValue()}</span> },
        { header: 'Tipo', accessorKey: 'type' },
        { header: 'Status', accessorKey: 'status', cell: i => <Badge className="bg-green-100 text-green-700">Ativo</Badge> },
        { header: 'TPV Mês', accessorKey: 'tpv', cell: i => i.getValue() === '-' ? '-' : `R$ ${i.getValue()}` },
        { header: 'Custo Médio', accessorKey: 'cost' },
        { header: 'Prioridade', accessorKey: 'priority' },
        { 
            header: 'Ações', 
            id: 'actions', 
            cell: () => (
                <Button size="sm" variant="ghost" asChild>
                    <Link to={createPageUrl('AdminIntPartnerDetail')}>
                        <Settings className="w-4 h-4" />
                    </Link>
                </Button> 
            ) 
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Parceiros & Custos" 
                subtitle="Gestão de Provedores e Estrutura de Custos"
                breadcrumbs={[{ label: 'Administração', page: '#' }, { label: 'Parceiros', page: 'AdminIntPartners' }]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link to={createPageUrl('AdminIntGlobalCosts')}>
                                <Calculator className="w-4 h-4 mr-2" /> Custos Globais PagSmile
                            </Link>
                        </Button>
                        <Button onClick={() => setNewPartnerModal(true)}><Plus className="w-4 h-4 mr-2" /> Novo Parceiro</Button>
                    </div>
                }
            />

            <Card>
                <CardContent className="pt-6">
                    <DataTable columns={columns} data={partners} />
                </CardContent>
            </Card>

            {/* New Partner Modal */}
            <Dialog open={newPartnerModal} onOpenChange={setNewPartnerModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Novo Parceiro</DialogTitle>
                        <DialogDescription>Cadastre um novo parceiro/provedor no sistema</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nome do Parceiro *</Label>
                            <Input className="mt-1" placeholder="Ex: Stone, Cielo, Konduto..." />
                        </div>
                        <div>
                            <Label>Tipo *</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="acquirer">Adquirente</SelectItem>
                                    <SelectItem value="antifraud">Antifraude</SelectItem>
                                    <SelectItem value="psp">PSP</SelectItem>
                                    <SelectItem value="gateway">Gateway</SelectItem>
                                    <SelectItem value="processor">Processador</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Prioridade</Label>
                                <Select defaultValue="1">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 - Principal</SelectItem>
                                        <SelectItem value="2">2 - Secundário</SelectItem>
                                        <SelectItem value="3">3 - Fallback</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select defaultValue="active">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                        <SelectItem value="testing">Em Testes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>API Endpoint</Label>
                            <Input className="mt-1" placeholder="https://api.parceiro.com" />
                        </div>
                        <div>
                            <Label>API Key</Label>
                            <Input className="mt-1" type="password" placeholder="sk_live_..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewPartnerModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Parceiro cadastrado com sucesso!'); setNewPartnerModal(false); }}>
                            <Plus className="w-4 h-4 mr-2" /> Cadastrar Parceiro
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}