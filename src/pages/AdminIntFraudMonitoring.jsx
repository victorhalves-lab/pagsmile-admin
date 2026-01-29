import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Check, X, FileText, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const suspiciousTransactions = [
    { id: 'TXN-123456', amount: 2500, brand: 'Visa', last4: '1234', score: 15, merchant: 'Tech Store', customer: 'João Silva', ip: '189.45.123.200', alerts: ['Valor alto', 'Novo cliente', 'IP diferente'], status: 'under_review' },
    { id: 'TXN-123457', amount: 890, brand: 'Master', last4: '5678', score: 35, merchant: 'Loja do João', customer: 'Maria Santos', ip: '177.80.45.100', alerts: ['Múltiplas tentativas', 'Device novo'], status: 'under_review' },
    { id: 'TXN-123458', amount: 1200, brand: 'Elo', last4: '9012', score: 45, merchant: 'Moda Fashion', customer: 'Carlos Pereira', ip: '200.15.78.90', alerts: ['Horário atípico'], status: 'under_review' },
];

const fraudStats = [
    { label: 'Em Análise', value: 23, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Bloqueadas', value: 45, color: 'bg-red-100 text-red-700' },
    { label: 'Aprovadas', value: 12, color: 'bg-green-100 text-green-700' },
    { label: 'Confirmadas', value: 8, color: 'bg-red-200 text-red-800' },
    { label: 'Valor Total', value: 'R$ 23.400', color: 'bg-slate-100 text-slate-700' },
];

const fraudTypes = [
    { type: 'Cartão roubado/clonado', percentage: 45, count: 36 },
    { type: 'Fraude amigável', percentage: 28, count: 22 },
    { type: 'Account takeover', percentage: 15, count: 12 },
    { type: 'Teste de cartão', percentage: 10, count: 8 },
    { type: 'Outros', percentage: 2, count: 2 },
];

export default function AdminIntFraudMonitoring() {
    const [analyzeModal, setAnalyzeModal] = useState(null);
    const [decision, setDecision] = useState('block');

    const getScoreColor = (score) => {
        if (score <= 30) return 'text-red-600 bg-red-100';
        if (score <= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    const getScoreLabel = (score) => {
        if (score <= 30) return 'Alto Risco';
        if (score <= 60) return 'Médio Risco';
        return 'Baixo Risco';
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Monitoramento de Fraudes"
                breadcrumbs={[{ label: 'Risco e Compliance' }, { label: 'Fraudes' }]}
            />

            {/* Stats */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">📊 Resumo</CardTitle>
                    <Select defaultValue="today">
                        <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hoje</SelectItem>
                            <SelectItem value="7d">7 dias</SelectItem>
                            <SelectItem value="30d">30 dias</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-5 gap-4">
                        {fraudStats.map((stat, idx) => (
                            <div key={idx} className={`p-3 rounded-lg text-center ${stat.color}`}>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Select defaultValue="today">
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Hoje</SelectItem>
                                <SelectItem value="7d">7 dias</SelectItem>
                                <SelectItem value="30d">30 dias</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos Status</SelectItem>
                                <SelectItem value="under_review">Em Análise</SelectItem>
                                <SelectItem value="blocked">Bloqueadas</SelectItem>
                                <SelectItem value="approved">Aprovadas</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Merchant" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="12345">Tech Store</SelectItem>
                                <SelectItem value="12346">Loja do João</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Score" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="high">Alto Risco (&lt;30)</SelectItem>
                                <SelectItem value="medium">Médio (30-60)</SelectItem>
                                <SelectItem value="low">Baixo (&gt;60)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">🔍 Filtrar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Transactions List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        Transações em Análise ({suspiciousTransactions.length})
                    </CardTitle>
                    <Select defaultValue="score">
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="score">Ordenar: Score</SelectItem>
                            <SelectItem value="amount">Ordenar: Valor</SelectItem>
                            <SelectItem value="date">Ordenar: Data</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="space-y-4">
                    {suspiciousTransactions.map(tx => (
                        <div key={tx.id} className="border rounded-lg p-4 hover:bg-slate-50">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getScoreColor(tx.score)}`}>
                                            {tx.score <= 30 ? '🔴' : tx.score <= 60 ? '🟠' : '🟡'} Score: {tx.score}/100 ({getScoreLabel(tx.score)})
                                        </span>
                                    </div>
                                    <p className="font-mono text-sm font-medium">{tx.id} | {formatCurrency(tx.amount)} | {tx.brand} ****{tx.last4}</p>
                                    <p className="text-sm text-slate-500">Merchant: {tx.merchant} | Cliente: {tx.customer} | IP: {tx.ip}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tx.alerts.map((alert, idx) => (
                                    <Badge key={idx} className={`border-0 ${idx === 0 || idx === 1 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {idx === 0 || idx === 1 ? '🔴' : '🟡'} {alert}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setAnalyzeModal(tx)}>
                                    <Eye className="w-4 h-4 mr-1" /> Analisar
                                </Button>
                                <Button size="sm" variant="outline" className="text-green-600" onClick={() => toast.success('Transação aprovada!')}>
                                    <Check className="w-4 h-4 mr-1" /> Aprovar
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600" onClick={() => toast.success('Transação bloqueada!')}>
                                    <X className="w-4 h-4 mr-1" /> Bloquear
                                </Button>
                                <Button size="sm" variant="ghost">
                                    <FileText className="w-4 h-4 mr-1" /> Ver regras acionadas
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Fraud Types */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📊 Fraudes Confirmadas (Últimos 30 dias)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 mb-4">Por tipo:</p>
                    <div className="space-y-3">
                        {fraudTypes.map((ft, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{ft.type}</span>
                                    <span>{ft.percentage}% ({ft.count} casos)</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${ft.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Analyze Modal */}
            <Dialog open={!!analyzeModal} onOpenChange={() => setAnalyzeModal(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" /> Análise de Fraude - {analyzeModal?.id}
                        </DialogTitle>
                    </DialogHeader>
                    {analyzeModal && (
                        <div className="space-y-4">
                            {/* Score */}
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm">📊 Score de Risco</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="flex-1 bg-slate-200 rounded-full h-4">
                                            <div className="bg-red-500 h-4 rounded-full" style={{ width: `${100 - analyzeModal.score}%` }} />
                                        </div>
                                        <span className="font-bold text-lg">{analyzeModal.score}/100</span>
                                    </div>
                                    <p className={`text-sm font-medium ${getScoreColor(analyzeModal.score)}`}>{getScoreLabel(analyzeModal.score)}</p>
                                </CardContent>
                            </Card>

                            {/* Risk Factors */}
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm">Fatores de Risco</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between text-sm"><span className="text-red-600">🔴 Valor acima do ticket médio (250% maior)</span><span>-20 pts</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-red-600">🔴 Primeiro pedido deste cliente</span><span>-15 pts</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-red-600">🔴 IP em região diferente do endereço</span><span>-10 pts</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-yellow-600">🟡 Cartão emitido há menos de 6 meses</span><span>-5 pts</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-green-600">🟢 3D Secure autenticado</span><span>+10 pts</span></div>
                                </CardContent>
                            </Card>

                            {/* Decision */}
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm">⚡ Decisão</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="decision" value="approve" checked={decision === 'approve'} onChange={(e) => setDecision(e.target.value)} />
                                            Aprovar transação
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="decision" value="block" checked={decision === 'block'} onChange={(e) => setDecision(e.target.value)} />
                                            Bloquear transação
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="decision" value="info" checked={decision === 'info'} onChange={(e) => setDecision(e.target.value)} />
                                            Solicitar mais informações ao merchant
                                        </label>
                                    </div>

                                    <div>
                                        <Label>Motivo</Label>
                                        <Select>
                                            <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cloned">Suspeita de cartão clonado</SelectItem>
                                                <SelectItem value="atypical">Comportamento atípico</SelectItem>
                                                <SelectItem value="multiple">Múltiplos fatores de risco</SelectItem>
                                                <SelectItem value="other">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Observações</Label>
                                        <Textarea className="mt-1" placeholder="Detalhes adicionais..." />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2"><Checkbox id="bl_card" /><label htmlFor="bl_card" className="text-sm">Adicionar cartão à blacklist</label></div>
                                        <div className="flex items-center gap-2"><Checkbox id="bl_cpf" /><label htmlFor="bl_cpf" className="text-sm">Adicionar CPF à blacklist</label></div>
                                        <div className="flex items-center gap-2"><Checkbox id="bl_device" /><label htmlFor="bl_device" className="text-sm">Adicionar device à blacklist</label></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAnalyzeModal(null)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Decisão salva!'); setAnalyzeModal(null); }}>
                            💾 Salvar Decisão
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}