import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminIntReconciliation() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Conciliação"
                subtitle="Conferência Financeira"
                breadcrumbs={[{ label: 'Financeiro', page: '#' }, { label: 'Conciliação', page: 'AdminIntReconciliation' }]}
                actions={<Button><Upload className="w-4 h-4 mr-2" /> Importar Extrato</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Bancária</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-green-600">R$ 0,00</span>
                            <CheckCircle className="text-green-500" />
                        </div>
                        <p className="text-sm text-slate-500">Diferença acumulada</p>
                        <Button variant="outline" size="sm" className="w-full mt-4">Detalhes</Button>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2"><CardTitle className="text-base">Adquirentes</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-amber-600">- R$ 15.230</span>
                            <AlertTriangle className="text-amber-500" />
                        </div>
                        <p className="text-sm text-slate-500">Diferença acumulada (Adyen)</p>
                        <Button variant="outline" size="sm" className="w-full mt-4">Investigar</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Pix (Bacen)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-green-600">R$ 0,00</span>
                            <CheckCircle className="text-green-500" />
                        </div>
                        <p className="text-sm text-slate-500">Diferença acumulada</p>
                        <Button variant="outline" size="sm" className="w-full mt-4">Detalhes</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Diferenças Pendentes (Adyen)</CardTitle></CardHeader>
                <CardContent>
                    <DataTable 
                        data={[
                            { id: 'TXN-1234567', our_val: 1250, acq_val: 0, diff: 1250, reason: 'Não encontrada no arquivo' },
                            { id: 'TXN-1234890', our_val: 890, acq_val: 0, diff: 890, reason: 'Não encontrada no arquivo' }
                        ]}
                        columns={[
                            { header: 'Transação', accessorKey: 'id' },
                            { header: 'Nosso Valor', accessorKey: 'our_val', cell: i => `R$ ${i.getValue()}` },
                            { header: 'Adquirente', accessorKey: 'acq_val', cell: i => `R$ ${i.getValue()}` },
                            { header: 'Diferença', accessorKey: 'diff', cell: i => <span className="text-red-600 font-bold">R$ {i.getValue()}</span> },
                            { header: 'Motivo Provável', accessorKey: 'reason' },
                            { header: 'Ações', id: 'actions', cell: () => <Button size="sm" variant="ghost">Resolver</Button> }
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}