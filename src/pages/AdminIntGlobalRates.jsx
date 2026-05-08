import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, FileText, Zap, ArrowUpFromLine, Calendar, Edit, Save } from 'lucide-react';
import { toast } from 'sonner';
import MdrRateGrid from '@/components/admin-interno/rates/MdrRateGrid';
import { createDefaultRateTable } from '@/lib/mdrCalculator';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const formatPercent = (v) => `${v.toFixed(2)}%`;

export default function AdminIntGlobalRates() {
    const [editModal, setEditModal] = useState(null);
    const [globalMdr, setGlobalMdr] = useState(createDefaultRateTable());
    const [globalAnticipation, setGlobalAnticipation] = useState(1.99);

    const handleSaveMdr = () => {
        toast.success('Tabela de MDR Global salva com sucesso! (simulação)');
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Taxas Globais"
                breadcrumbs={[{ label: 'Administração' }, { label: 'Taxas' }]}
                actions={
                    <Button onClick={handleSaveMdr}>
                        <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                    </Button>
                }
            />

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                ⚠️ Estas são as taxas padrão aplicadas a novos merchants. Hierarquia: <strong>Merchant Override → MCC → Plano → Global (esta tabela)</strong>. Merchants existentes podem ter taxas personalizadas em seus perfis.
            </div>

            {/* Tabela MDR Global - novo grid unificado */}
            <MdrRateGrid
                value={globalMdr}
                onChange={setGlobalMdr}
                anticipationRate={globalAnticipation}
                onAnticipationChange={setGlobalAnticipation}
                title="Cartão de Crédito - MDR Padrão por Bandeira e Faixa"
                description="Estas são as taxas globais default. Use Auto para calcular taxas parceladas a partir do MDR à vista + antecipação, ou Manual para sobrescrever."
            />

            {/* Debit Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Cartão de Débito - MDR Padrão
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('debit')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Taxa única (todas as bandeiras):</span> <strong>1,99%</strong></div>
                        <div><span className="text-slate-500">Internacional:</span> <strong>2,99%</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* PIX */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Smartphone className="w-5 h-5" /> PIX
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('pix')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div><span className="text-slate-500">Taxa por transação:</span> <strong>0,99%</strong></div>
                        <div><span className="text-slate-500">Taxa mínima:</span> <strong>{formatCurrency(0)}</strong></div>
                        <div><span className="text-slate-500">Taxa máxima:</span> <strong>{formatCurrency(50)}</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Boleto */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Boleto
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('boleto')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Taxa por boleto emitido:</span> <strong>{formatCurrency(0)}</strong></div>
                        <div><span className="text-slate-500">Taxa por boleto pago:</span> <strong>{formatCurrency(2.90)}</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Anticipation */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-5 h-5" /> Antecipação
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('anticipation')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="text-sm">
                        <span className="text-slate-500">Taxa de antecipação:</span> <strong>1,99% ao mês (pró-rata)</strong>
                    </div>
                </CardContent>
            </Card>

            {/* Withdrawal */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <ArrowUpFromLine className="w-5 h-5" /> Saque
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('withdrawal')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div><span className="text-slate-500">Taxa por saque (TED):</span> <strong>{formatCurrency(5)}</strong></div>
                        <div><span className="text-slate-500">Taxa por saque (PIX):</span> <strong>{formatCurrency(0)}</strong></div>
                        <div><span className="text-slate-500">Saque mínimo:</span> <strong>{formatCurrency(100)}</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Settlement */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> Liquidação Padrão
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('settlement')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div><span className="text-slate-500">Cartão de crédito:</span> <strong>D+30</strong></div>
                        <div><span className="text-slate-500">Cartão de débito:</span> <strong>D+1</strong></div>
                        <div><span className="text-slate-500">PIX:</span> <strong>D+1</strong></div>
                        <div><span className="text-slate-500">Boleto:</span> <strong>D+1</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={!!editModal} onOpenChange={() => setEditModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Taxas</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-slate-500">Formulário de edição de taxas seria exibido aqui.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModal(null)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Taxas atualizadas!'); setEditModal(null); }}>
                            💾 Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}