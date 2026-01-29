import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminIntBatchProcessing() {
    const [operationType, setOperationType] = useState('');
    const [file, setFile] = useState(null);

    const batches = [
        { id: 'LOT-001', date: '28/01/2026', operation: 'Estorno', total: 150, success: 148, failed: 2, status: 'completed' },
        { id: 'LOT-002', date: '27/01/2026', operation: 'Webhook', total: 500, success: 500, failed: 0, status: 'completed' },
        { id: 'LOT-003', date: '26/01/2026', operation: 'Captura', total: 75, success: 75, failed: 0, status: 'completed' },
        { id: 'LOT-004', date: '25/01/2026', operation: 'Estorno', total: 200, success: 195, failed: 5, status: 'completed' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Processamento em Lote"
                breadcrumbs={[
                    { label: 'Transações' },
                    { label: 'Processamento em Lote' }
                ]}
            />

            {/* New Batch */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Nova Operação em Lote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Tipo de Operação:</label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input type="radio" name="operation" value="refund" onChange={(e) => setOperationType(e.target.value)} />
                                Estorno em Lote
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="radio" name="operation" value="capture" onChange={(e) => setOperationType(e.target.value)} />
                                Captura em Lote
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="radio" name="operation" value="cancel" onChange={(e) => setOperationType(e.target.value)} />
                                Cancelamento em Lote
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="radio" name="operation" value="webhook" onChange={(e) => setOperationType(e.target.value)} />
                                Reenvio de Webhooks
                            </div>
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                        <p className="font-medium mb-1">📁 Arraste o arquivo CSV aqui</p>
                        <p className="text-sm text-slate-500 mb-3">ou clique para selecionar</p>
                        <p className="text-xs text-slate-400 mb-2">
                            {operationType === 'refund' && 'Formato: transaction_id,amount (opcional),reason'}
                            {operationType === 'capture' && 'Formato: transaction_id,amount (opcional)'}
                            {operationType === 'cancel' && 'Formato: transaction_id,reason'}
                            {operationType === 'webhook' && 'Formato: transaction_id'}
                            {!operationType && 'Selecione um tipo de operação'}
                        </p>
                        <Button variant="outline" size="sm" disabled={!operationType}>
                            <Download className="w-4 h-4 mr-1" /> Baixar Template
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" disabled={!file}>Validar Arquivo</Button>
                        <Button disabled={!file || !operationType} onClick={() => toast.success('Lote processado!')}>
                            Processar Lote
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Batch History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Histórico de Lotes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Operação</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Total</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Sucesso</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Falha</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {batches.map(batch => (
                                    <tr key={batch.id} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3 font-mono text-xs">{batch.id}</td>
                                        <td className="py-3 px-3">{batch.date}</td>
                                        <td className="py-3 px-3">{batch.operation}</td>
                                        <td className="py-3 px-3 text-center font-medium">{batch.total}</td>
                                        <td className="py-3 px-3 text-center text-green-600 font-medium">{batch.success}</td>
                                        <td className="py-3 px-3 text-center text-red-600 font-medium">{batch.failed}</td>
                                        <td className="py-3 px-3">
                                            <Badge className="bg-green-100 text-green-700 border-0"><CheckCircle className="w-3 h-3 mr-1" /> Concluído</Badge>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}