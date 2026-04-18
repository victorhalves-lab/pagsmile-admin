import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SideDrawer from '@/components/common/SideDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminIntPreChargebacks() {
    const [selectedAlert, setSelectedAlert] = useState(null);
    // Mock Data
    const alerts = [
        { id: 'PCB-001', amount: 2350, provider: 'Ethoca', deadline: '4h', merchant: 'Loja ABC', txn: '12345678', reason: '10.4 Fraude', urgency: 'critical' },
        { id: 'PCB-002', amount: 890, provider: 'Verifi', deadline: '5h', merchant: 'Tech Solutions', txn: '12345679', reason: '13.1 Não recebeu', urgency: 'critical' },
        { id: 'PCB-003', amount: 1500, provider: 'Ethoca', deadline: '10h', merchant: 'Moda Express', txn: '12345680', reason: '4837 Fraude', urgency: 'high' },
    ];

    const columns = [
        { 
            header: '', 
            accessorKey: 'urgency', 
            cell: info => (
                <div className={`w-3 h-3 rounded-full ${info.getValue() === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
            )
        },
        { header: 'ID', accessorKey: 'id' },
        { header: 'Valor', accessorKey: 'amount', cell: i => `R$ ${i.getValue()}` },
        { header: 'Provedor', accessorKey: 'provider' },
        { header: 'Prazo', accessorKey: 'deadline', cell: i => <span className="font-bold text-red-600">{i.getValue()}</span> },
        { header: 'Merchant', accessorKey: 'merchant' },
        { header: 'Reason Code', accessorKey: 'reason' },
        {
            header: 'Ações',
            id: 'actions',
            cell: (info) => (
                <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8" onClick={() => setSelectedAlert(info.row.original)}><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" className="h-8 w-8 bg-green-600 hover:bg-green-700 p-0" title="Reembolsar" onClick={() => setSelectedAlert(info.row.original)}><CheckCircle className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" className="h-8 w-8 p-0" title="Ignorar" onClick={() => toast.info('Alerta ignorado')}><XCircle className="w-4 h-4" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Pré-Chargebacks" 
                subtitle="Fila de Alertas (Ethoca/Verifi)"
                breadcrumbs={[{ label: 'Risco', page: 'AdminIntRisk' }, { label: 'Pré-Chargebacks', page: 'AdminIntPreChargebacks' }]}
            />

            <Card>
                <CardContent className="pt-6">
                    <DataTable columns={columns} data={alerts} />
                </CardContent>
            </Card>

            {/* Pre-Chargeback Action Side Drawer */}
            <SideDrawer
                open={!!selectedAlert}
                onOpenChange={() => setSelectedAlert(null)}
                title="Ação no Pré-Chargeback"
                description={selectedAlert?.id}
                icon={AlertTriangle}
                iconClassName="bg-red-100 text-red-600"
                size="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setSelectedAlert(null)}>Cancelar</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => { toast.success('Reembolso processado!'); setSelectedAlert(null); }}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Reembolsar
                        </Button>
                        <Button variant="outline" onClick={() => { toast.success('Contestação proativa iniciada!'); setSelectedAlert(null); }}>
                            Contestar Proativamente
                        </Button>
                    </div>
                }
            >
                {selectedAlert && (
                    <div className="space-y-5">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-red-600" />
                                <span className="font-bold text-red-700">Prazo: {selectedAlert.deadline}</span>
                            </div>
                            <p className="text-sm text-red-600">Provedor: {selectedAlert.provider}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500">Valor</p>
                                <p className="text-xl font-bold">R$ {selectedAlert.amount?.toLocaleString('pt-BR')}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500">Merchant</p>
                                <p className="font-medium">{selectedAlert.merchant}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500">Transação</p>
                                <p className="font-mono text-sm">{selectedAlert.txn}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500">Reason Code</p>
                                <p className="font-medium">{selectedAlert.reason}</p>
                            </div>
                        </div>

                        <div>
                            <Label>Ação Recomendada</Label>
                            <Select defaultValue="refund">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="refund">Reembolso total</SelectItem>
                                    <SelectItem value="partial_refund">Reembolso parcial</SelectItem>
                                    <SelectItem value="contest">Contestar proativamente</SelectItem>
                                    <SelectItem value="contact">Contactar cliente</SelectItem>
                                    <SelectItem value="ignore">Ignorar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Valor do Reembolso</Label>
                            <Input className="mt-1" type="number" defaultValue={selectedAlert.amount} />
                        </div>

                        <div>
                            <Label>Observações</Label>
                            <Textarea className="mt-1" placeholder="Notas internas sobre esta ação..." rows={3} />
                        </div>
                    </div>
                )}
            </SideDrawer>
        </div>
    );
}