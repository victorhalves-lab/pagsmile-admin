import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SideDrawer from '@/components/common/SideDrawer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, Unlock, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminIntBlockages() {
    const [showNewBlockage, setShowNewBlockage] = useState(false);
    const data = [
        { merchant: 'Fashion Mall', type: 'risk', amount: '85000', reason: 'VDMP Program', date: '15/12/2025' },
        { merchant: 'Games Online', type: 'risk', amount: '25000', reason: 'High CB Ratio', date: '20/12/2025' },
        { merchant: 'Loja XYZ', type: 'chargeback', amount: '12350', reason: 'CB-00456', date: '10/01/2026' },
    ];

    const columns = [
        { header: 'Merchant', accessorKey: 'merchant' },
        { header: 'Tipo', accessorKey: 'type', cell: i => <StatusBadge status={i.getValue()} /> },
        { header: 'Valor', accessorKey: 'amount', cell: i => `R$ ${parseInt(i.getValue()).toLocaleString('pt-BR')}` },
        { header: 'Motivo', accessorKey: 'reason' },
        { header: 'Desde', accessorKey: 'date' },
        { header: 'Ações', id: 'actions', cell: () => (
            <div className="flex gap-1">
                <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700"><Unlock className="w-4 h-4 mr-1" /> Liberar</Button>
            </div>
        ) }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Bloqueios Ativos" 
                subtitle="Gestão de Bloqueios e Holdbacks"
                breadcrumbs={[{ label: 'Retenção', page: 'AdminIntRetention' }, { label: 'Bloqueios', page: '#' }]}
                actions={<Button className="bg-red-600 hover:bg-red-700" onClick={() => setShowNewBlockage(true)}><Lock className="w-4 h-4 mr-2" /> Novo Bloqueio</Button>}
            />

            <Card>
                <CardContent className="pt-6">
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>

            {/* New Blockage Side Drawer */}
            <SideDrawer
                open={showNewBlockage}
                onOpenChange={setShowNewBlockage}
                title="Novo Bloqueio"
                description="Criar bloqueio de saldo para um merchant"
                icon={Lock}
                iconClassName="bg-red-100 text-red-600"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowNewBlockage(false)}>Cancelar</Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={() => { toast.success('Bloqueio criado!'); setShowNewBlockage(false); }}>
                            <Lock className="w-4 h-4 mr-2" /> Criar Bloqueio
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <Label>Merchant *</Label>
                        <Select>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o merchant..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fashion">Fashion Mall</SelectItem>
                                <SelectItem value="games">Games Online</SelectItem>
                                <SelectItem value="loja">Loja XYZ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Tipo de Bloqueio *</Label>
                        <Select>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="risk">Risco</SelectItem>
                                <SelectItem value="chargeback">Chargeback</SelectItem>
                                <SelectItem value="fraud">Fraude</SelectItem>
                                <SelectItem value="compliance">Compliance</SelectItem>
                                <SelectItem value="judicial">Judicial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Valor a Bloquear (R$) *</Label>
                        <Input className="mt-1" type="number" placeholder="0,00" />
                    </div>
                    <div>
                        <Label>Motivo / Referência *</Label>
                        <Input className="mt-1" placeholder="Ex: CB-00456, VDMP Program..." />
                    </div>
                    <div>
                        <Label>Justificativa Detalhada *</Label>
                        <Textarea className="mt-1" placeholder="Descreva o motivo do bloqueio..." rows={4} />
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        ⚠️ O valor será retido do saldo disponível do merchant imediatamente.
                    </div>
                </div>
            </SideDrawer>
        </div>
    );
}