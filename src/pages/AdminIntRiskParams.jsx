import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, AlertTriangle, CreditCard, BarChart3, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminIntRiskParams() {
    const [editModal, setEditModal] = useState(null);

    const cbRatioParams = {
        warningThreshold: 0.65,
        criticalThreshold: 0.80,
        programThreshold: 0.90,
        autoSuspendThreshold: 1.50,
        evaluationPeriod: 'Últimos 3 meses',
        minTransactions: 100,
    };

    const fraudParams = {
        maxScoreBlock: 85,
        maxScoreReview: 60,
        velocityLimit: 3,
        velocityWindow: '1 hora',
        maxAmountNewCustomer: 5000,
        maxDailyAttempts: 10,
    };

    const limitsParams = {
        maxTransactionCard: 100000,
        maxTransactionPix: 100000,
        maxDailyMerchant: 1000000,
        maxMonthlyMerchant: 10000000,
        requireApprovalAbove: 50000,
    };

    const monitoringParams = {
        alertOnVolumeSpike: true,
        volumeSpikeThreshold: 200,
        alertOnDenialRateHigh: true,
        denialRateThreshold: 15,
        alertOnNewMerchantHighVolume: true,
        newMerchantVolumeLimit: 50000,
    };

    const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
    const formatPercent = (v) => `${v.toFixed(2)}%`;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Parâmetros de Risco"
                breadcrumbs={[{ label: 'Administração' }, { label: 'Risco' }]}
            />

            {/* CB Ratio Thresholds */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Thresholds de Chargeback Ratio
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('cb')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-slate-500">⚠️ Alerta (Atenção)</p>
                            <p className="text-xl font-bold text-yellow-700">{formatPercent(cbRatioParams.warningThreshold)}</p>
                        </div>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-slate-500">🔶 Crítico</p>
                            <p className="text-xl font-bold text-orange-700">{formatPercent(cbRatioParams.criticalThreshold)}</p>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-slate-500">🔴 Entrada em Programa</p>
                            <p className="text-xl font-bold text-red-700">{formatPercent(cbRatioParams.programThreshold)}</p>
                        </div>
                        <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                            <p className="text-slate-500">⛔ Suspensão Automática</p>
                            <p className="text-xl font-bold text-red-800">{formatPercent(cbRatioParams.autoSuspendThreshold)}</p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Período de avaliação:</span> <strong>{cbRatioParams.evaluationPeriod}</strong></div>
                        <div><span className="text-slate-500">Mín. transações para avaliar:</span> <strong>{cbRatioParams.minTransactions}</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Fraud Parameters */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Parâmetros de Antifraude
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('fraud')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Score para bloqueio automático:</span> <strong>≥ {fraudParams.maxScoreBlock}</strong></div>
                        <div><span className="text-slate-500">Score para análise manual:</span> <strong>≥ {fraudParams.maxScoreReview}</strong></div>
                        <div><span className="text-slate-500">Limite de tentativas (velocidade):</span> <strong>{fraudParams.velocityLimit} tentativas em {fraudParams.velocityWindow}</strong></div>
                        <div><span className="text-slate-500">Valor máx. cliente novo:</span> <strong>{formatCurrency(fraudParams.maxAmountNewCustomer)}</strong></div>
                        <div><span className="text-slate-500">Máx. tentativas diárias por cartão:</span> <strong>{fraudParams.maxDailyAttempts}</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction Limits */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Limites de Transação Globais
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('limits')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Máx. por transação (Cartão):</span> <strong>{formatCurrency(limitsParams.maxTransactionCard)}</strong></div>
                        <div><span className="text-slate-500">Máx. por transação (PIX):</span> <strong>{formatCurrency(limitsParams.maxTransactionPix)}</strong></div>
                        <div><span className="text-slate-500">Máx. diário por merchant:</span> <strong>{formatCurrency(limitsParams.maxDailyMerchant)}</strong></div>
                        <div><span className="text-slate-500">Máx. mensal por merchant:</span> <strong>{formatCurrency(limitsParams.maxMonthlyMerchant)}</strong></div>
                        <div><span className="text-slate-500">Aprovação manual acima de:</span> <strong>{formatCurrency(limitsParams.requireApprovalAbove)}</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Monitoring Alerts */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" /> Alertas de Monitoramento
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('monitoring')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">Alerta de pico de volume</p>
                                <p className="text-sm text-slate-500">Alertar quando volume aumentar {monitoringParams.volumeSpikeThreshold}% em relação à média</p>
                            </div>
                            <Switch checked={monitoringParams.alertOnVolumeSpike} />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">Alerta de taxa de negação alta</p>
                                <p className="text-sm text-slate-500">Alertar quando negação ultrapassar {monitoringParams.denialRateThreshold}%</p>
                            </div>
                            <Switch checked={monitoringParams.alertOnDenialRateHigh} />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">Alerta de merchant novo com alto volume</p>
                                <p className="text-sm text-slate-500">Alertar merchants novos com volume acima de {formatCurrency(monitoringParams.newMerchantVolumeLimit)}/dia</p>
                            </div>
                            <Switch checked={monitoringParams.alertOnNewMerchantHighVolume} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={!!editModal} onOpenChange={() => setEditModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Parâmetros</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-slate-500">Formulário de edição seria exibido aqui.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModal(null)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Parâmetros atualizados!'); setEditModal(null); }}>
                            💾 Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}