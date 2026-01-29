import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Eye, FileText, Download, Clock, Upload } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const cbStatusConfig = {
    open: { label: 'Aberto', color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' },
    in_defense: { label: 'Em Defesa', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🟡' },
    waiting: { label: 'Aguardando', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🔵' },
    won: { label: 'Ganho', color: 'bg-green-100 text-green-700 border-green-200', icon: '🟢' },
    lost: { label: 'Perdido', color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' },
    accepted: { label: 'Aceito', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '⚫' },
};

export default function TabChargebacks({ merchant }) {
    const [defenseModal, setDefenseModal] = useState(false);
    const [selectedCB, setSelectedCB] = useState(null);
    const [period, setPeriod] = useState('30d');

    const cbRatio = merchant.cb_ratio || 0.45;
    const stats = { open: 3, inDefense: 2, won: 5, lost: 2, totalValue: 2547 };

    const chargebacks = [
        { id: 'CB-12345', date: '2026-01-28', amount: 299, brand: 'Visa', last4: '1234', reason: 'Não reconhecida', reasonCode: '83', status: 'open', deadline: '2026-01-30', customer: 'João Silva' },
        { id: 'CB-12346', date: '2026-01-27', amount: 150, brand: 'Master', last4: '5678', reason: 'Produto não recebido', reasonCode: '13.1', status: 'open', deadline: '2026-02-02', customer: 'Maria Santos' },
        { id: 'CB-12340', date: '2026-01-25', amount: 199, brand: 'Visa', last4: '9012', reason: 'Não reconhecida', reasonCode: '83', status: 'in_defense', deadline: '2026-01-28', customer: 'Carlos Oliveira' },
        { id: 'CB-12335', date: '2026-01-20', amount: 89.90, brand: 'Visa', last4: '3456', reason: 'Produto diferente', reasonCode: '13.3', status: 'won', customer: 'Ana Paula' },
        { id: 'CB-12330', date: '2026-01-15', amount: 500, brand: 'Amex', last4: '7890', reason: 'Fraude', reasonCode: '10.4', status: 'lost', customer: 'Pedro Souza' },
    ];

    const reasonData = [
        { name: 'Não reconhecida', value: 45, count: 9 },
        { name: 'Prod. não recebido', value: 25, count: 5 },
        { name: 'Fraude', value: 15, count: 3 },
        { name: 'Cancelamento', value: 10, count: 2 },
        { name: 'Outros', value: 5, count: 1 },
    ];

    const pendingCBs = chargebacks.filter(cb => cb.status === 'open');

    const openDefense = (cb) => { setSelectedCB(cb); setDefenseModal(true); };

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`p-4 border rounded-lg ${cbRatio >= 1 ? 'bg-red-50 border-red-200' : cbRatio >= 0.8 ? 'bg-orange-50 border-orange-200' : cbRatio >= 0.5 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                    <p className="text-sm text-slate-500 mb-1">CB Ratio</p>
                    <p className={`text-2xl font-bold ${cbRatio >= 1 ? 'text-red-600' : cbRatio >= 0.8 ? 'text-orange-600' : cbRatio >= 0.5 ? 'text-yellow-600' : 'text-green-600'}`}>{cbRatio}%</p>
                    <p className="text-xs text-slate-500 mt-1">{cbRatio < 1 ? '🟢 OK' : '🔴 Crítico'} (limite 1%)</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Abertos</p>
                    <p className="text-2xl font-bold text-red-600">{stats.open}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(847)}</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Em Defesa</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.inDefense}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(598)}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Ganhos</p>
                    <p className="text-2xl font-bold text-green-600">{stats.won}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(1245)} (71%)</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Perdidos</p>
                    <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(449)} (29%)</p>
                </div>
            </div>

            {/* Pending Action */}
            {pendingCBs.length > 0 && (
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Chargebacks Pendentes de Ação
                            <Badge variant="destructive">{pendingCBs.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingCBs.map(cb => (
                            <div key={cb.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold">🔴 {cb.id} | {formatCurrency(cb.amount)} | {cb.brand} ****{cb.last4} | {cb.reason}</p>
                                        <p className="text-sm text-slate-600">Transação: TXN-{cb.id.replace('CB-', '')} | {new Date(cb.date).toLocaleDateString('pt-BR')} | Cliente: {cb.customer}</p>
                                        <p className="text-sm text-red-600 font-medium mt-1">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            Prazo para defesa: {new Date(cb.deadline).toLocaleDateString('pt-BR')} ({Math.ceil((new Date(cb.deadline) - new Date()) / (1000 * 60 * 60 * 24))} dias) ⏰
                                        </p>
                                    </div>
                                    <Button size="sm" onClick={() => openDefense(cb)}>
                                        <FileText className="w-4 h-4 mr-1" /> Defender
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3 items-end">
                        <div><Label>De</Label><Input type="date" className="mt-1 w-[140px]" /></div>
                        <div><Label>Até</Label><Input type="date" className="mt-1 w-[140px]" /></div>
                        <div><Label>Status</Label>
                            <Select><SelectTrigger className="mt-1 w-[130px]"><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="open">Abertos</SelectItem>
                                    <SelectItem value="in_defense">Em Defesa</SelectItem>
                                    <SelectItem value="won">Ganhos</SelectItem>
                                    <SelectItem value="lost">Perdidos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>Bandeira</Label>
                            <Select><SelectTrigger className="mt-1 w-[120px]"><SelectValue placeholder="Todas" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="visa">Visa</SelectItem>
                                    <SelectItem value="master">Mastercard</SelectItem>
                                    <SelectItem value="elo">Elo</SelectItem>
                                    <SelectItem value="amex">Amex</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button>Filtrar</Button>
                        <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* List */}
            <Card>
                <CardHeader><CardTitle className="text-base">Lista de Chargebacks</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data CB</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Bandeira</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Motivo</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chargebacks.map(cb => {
                                    const status = cbStatusConfig[cb.status];
                                    return (
                                        <tr key={cb.id} className="border-b hover:bg-slate-50">
                                            <td className="py-3 px-3 font-mono text-xs">{cb.id}</td>
                                            <td className="py-3 px-3">{new Date(cb.date).toLocaleDateString('pt-BR')}</td>
                                            <td className="py-3 px-3 text-right font-medium">{formatCurrency(cb.amount)}</td>
                                            <td className="py-3 px-3">{cb.brand}</td>
                                            <td className="py-3 px-3">{cb.reason}</td>
                                            <td className="py-3 px-3">
                                                <Badge className={`${status.color} border`}>{status.icon} {status.label}</Badge>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                                {cb.status === 'open' && <Button variant="ghost" size="sm" onClick={() => openDefense(cb)}><FileText className="w-4 h-4" /></Button>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Analysis */}
            <Card>
                <CardHeader><CardTitle className="text-base">📈 Análise de Chargebacks (últimos 90 dias)</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 mb-4">Por Motivo:</p>
                    <div className="space-y-3">
                        {reasonData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="w-32 text-sm">{item.name}</span>
                                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${item.value}%` }} />
                                </div>
                                <span className="w-20 text-sm text-right">{item.value}% ({item.count})</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Defense Modal */}
            <Dialog open={defenseModal} onOpenChange={setDefenseModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Preparar Defesa - {selectedCB?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedCB && (
                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                                <p className="font-medium text-red-700">⚠️ Prazo para envio: {new Date(selectedCB.deadline).toLocaleDateString('pt-BR')} 23:59</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <p className="text-sm"><strong>Valor:</strong> {formatCurrency(selectedCB.amount)} | <strong>Motivo:</strong> {selectedCB.reasonCode} - {selectedCB.reason} | <strong>Cliente:</strong> {selectedCB.customer}</p>
                            </div>
                            <div>
                                <Label>Tipo de Defesa</Label>
                                <div className="space-y-2 mt-2">
                                    <div className="flex items-center gap-2"><input type="radio" name="defense" defaultChecked /> Defesa Completa (contestar alegação)</div>
                                    <div className="flex items-center gap-2"><input type="radio" name="defense" /> Defesa Parcial (aceitar parte)</div>
                                    <div className="flex items-center gap-2"><input type="radio" name="defense" /> Aceitar Chargeback</div>
                                </div>
                            </div>
                            <div>
                                <Label>Argumentação *</Label>
                                <Textarea className="mt-1 min-h-[120px]" placeholder="Descreva sua defesa..." />
                                <p className="text-xs text-slate-500 mt-1">Mín: 50 caracteres | Máx: 5000</p>
                            </div>
                            <div>
                                <Label>Documentos Comprobatórios</Label>
                                <div className="mt-2 border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                                    <p className="text-sm text-slate-500">Arraste arquivos ou clique para selecionar</p>
                                    <p className="text-xs text-slate-400">PDF, JPG, PNG | Máx: 5MB cada | Máx: 10 arquivos</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm font-medium text-blue-700 mb-2">Documentos sugeridos para Fraude:</p>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-2"><Checkbox /> Comprovante de entrega com assinatura</div>
                                    <div className="flex items-center gap-2"><Checkbox /> Print da autenticação 3D Secure</div>
                                    <div className="flex items-center gap-2"><Checkbox /> Histórico de compras anteriores</div>
                                    <div className="flex items-center gap-2"><Checkbox /> Log de IP e device fingerprint</div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDefenseModal(false)}>Cancelar</Button>
                        <Button variant="outline">Salvar Rascunho</Button>
                        <Button onClick={() => { toast.success('Defesa enviada!'); setDefenseModal(false); }}>📤 Enviar Defesa</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}