import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Eye, FileText, Download, Clock } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const medStatusConfig = {
    open: { label: 'Aberto', color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' },
    in_dispute: { label: 'Em Contestação', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🟡' },
    returned: { label: 'Devolvido', color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' },
    kept: { label: 'Mantido', color: 'bg-green-100 text-green-700 border-green-200', icon: '🟢' },
    partial: { label: 'Parcial', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🟠' },
    expired: { label: 'Expirado', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '⚫' },
};

export default function TabMEDs({ merchant }) {
    const [contestModal, setContestModal] = useState(false);
    const [selectedMED, setSelectedMED] = useState(null);

    const stats = { open: 2, inDispute: 1, returned: 3, kept: 2, blockedValue: 1500 };

    const meds = [
        { id: 'MED-001234', date: '2026-01-28', pixDate: '2026-01-28 10:30', amount: 500, payerDoc: '***.***. 123-00', payerBank: 'Itaú', reason: 'Fraude - Conta invadida', status: 'open', deadline: '2026-02-04', blockedAmount: 500 },
        { id: 'MED-001232', date: '2026-01-20', pixDate: '2026-01-20 14:00', amount: 400, payerDoc: '***.***. 456-00', payerBank: 'Bradesco', reason: 'Fraude - Golpe', status: 'in_dispute', deadline: '2026-01-27', blockedAmount: 400 },
        { id: 'MED-001230', date: '2026-01-15', pixDate: '2026-01-15 09:00', amount: 600, payerDoc: '***.***. 789-00', payerBank: 'Nubank', reason: 'Fraude', status: 'returned', blockedAmount: 0 },
        { id: 'MED-001228', date: '2026-01-10', pixDate: '2026-01-10 16:30', amount: 300, payerDoc: '***.***. 012-00', payerBank: 'Santander', reason: 'Erro operacional', status: 'kept', blockedAmount: 0 },
    ];

    const pendingMEDs = meds.filter(m => m.status === 'open');

    const openContest = (med) => { setSelectedMED(med); setContestModal(true); };

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Abertos</p>
                    <p className="text-2xl font-bold text-red-600">{stats.open}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(850)}</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Em Contestação</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.inDispute}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(400)}</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Devolvidos</p>
                    <p className="text-2xl font-bold text-red-600">{stats.returned}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(1200)}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Mantidos</p>
                    <p className="text-2xl font-bold text-green-600">{stats.kept}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(750)}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Valor Bloqueado</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.blockedValue)}</p>
                </div>
            </div>

            {/* Pending Action */}
            {pendingMEDs.length > 0 && (
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            MEDs Pendentes de Ação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingMEDs.map(med => (
                            <div key={med.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold">🔴 {med.id} | {formatCurrency(med.amount)} | PIX {med.pixDate}</p>
                                        <p className="text-sm text-slate-600">Pagador: {med.payerDoc} | Banco: {med.payerBank}</p>
                                        <p className="text-sm text-slate-600">Motivo: {med.reason}</p>
                                        <p className="text-sm text-red-600 font-medium mt-1">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            Prazo para contestação: {new Date(med.deadline).toLocaleDateString('pt-BR')} ({Math.ceil((new Date(med.deadline) - new Date()) / (1000 * 60 * 60 * 24))} dias)
                                        </p>
                                        <p className="text-sm text-purple-600">Valor bloqueado: {formatCurrency(med.blockedAmount)}</p>
                                    </div>
                                    <Button size="sm" onClick={() => openContest(med)}>
                                        <FileText className="w-4 h-4 mr-1" /> Contestar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Lista de MEDs</CardTitle>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data PIX</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Motivo</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meds.map(med => {
                                    const status = medStatusConfig[med.status];
                                    return (
                                        <tr key={med.id} className="border-b hover:bg-slate-50">
                                            <td className="py-3 px-3 font-mono text-xs">{med.id}</td>
                                            <td className="py-3 px-3">{new Date(med.date).toLocaleDateString('pt-BR')}</td>
                                            <td className="py-3 px-3 text-right font-medium">{formatCurrency(med.amount)}</td>
                                            <td className="py-3 px-3">{med.reason}</td>
                                            <td className="py-3 px-3">
                                                <Badge className={`${status.color} border`}>{status.icon} {status.label}</Badge>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                                {med.status === 'open' && <Button variant="ghost" size="sm" onClick={() => openContest(med)}><FileText className="w-4 h-4" /></Button>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Contest Modal */}
            <Dialog open={contestModal} onOpenChange={setContestModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Contestar MED - {selectedMED?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedMED && (
                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                                <p className="font-medium text-red-700">⚠️ Prazo: {new Date(selectedMED.deadline).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1">
                                <p><strong>Valor:</strong> {formatCurrency(selectedMED.amount)}</p>
                                <p><strong>Pagador:</strong> {selectedMED.payerDoc} - {selectedMED.payerBank}</p>
                                <p><strong>Motivo:</strong> {selectedMED.reason}</p>
                                <p><strong>Valor bloqueado:</strong> {formatCurrency(selectedMED.blockedAmount)}</p>
                            </div>
                            <div>
                                <Label>Argumentação da Contestação *</Label>
                                <Textarea className="mt-1 min-h-[120px]" placeholder="Descreva por que a devolução não procede..." />
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                                <p className="text-blue-700">💡 Anexe comprovantes de entrega, conversas com cliente, ou qualquer evidência de que a transação foi legítima.</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setContestModal(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={() => { toast.success('MED aceito'); setContestModal(false); }}>Aceitar MED</Button>
                        <Button onClick={() => { toast.success('Contestação enviada!'); setContestModal(false); }}>Enviar Contestação</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}