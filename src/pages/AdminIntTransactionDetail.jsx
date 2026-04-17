import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Copy, Download, RefreshCw, RotateCcw, X, CheckCircle, XCircle, Eye, Clock, Zap, AlertTriangle, CreditCard, QrCode } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import StatusBadge from '@/components/common/StatusBadge';
import { mockTransactions } from '@/components/mockData/adminInternoMocks';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function AdminIntTransactionDetail() {
    const [searchParams] = useSearchParams();
    const txId = searchParams.get('id');
    const tx = mockTransactions.find(t => t.id === txId) || mockTransactions[0];

    const [refundModal, setRefundModal] = useState(false);
    const [refundType, setRefundType] = useState('full');
    const [refundAmount, setRefundAmount] = useState('');
    const [revealModal, setRevealModal] = useState(false);

    const timeline = [
        { time: '14:32:45.123', event: 'TRANSACTION_CREATED', icon: '🆕', desc: 'Transação criada', details: 'Origem: API v2 | IP: 189.123.456.789' },
        { time: '14:32:45.456', event: 'ANTIFRAUD_STARTED', icon: '🔍', desc: 'Antifraude iniciado', details: 'Provider: ClearSale' },
        { time: '14:32:46.789', event: 'ANTIFRAUD_APPROVED', icon: '✅', desc: 'Antifraude aprovado', details: 'Score: 15 | Tempo: 1.2s' },
        { time: '14:32:47.012', event: 'SENT_TO_ACQUIRER', icon: '📤', desc: 'Enviado para adquirente', details: 'Adquirente: Cielo' },
        { time: '14:32:48.345', event: 'AUTHORIZATION_RECEIVED', icon: '📥', desc: 'Autorização recebida', details: 'Código: ABC123 | NSU: 123456789 | 00 - Aprovada' },
        { time: '14:32:48.678', event: 'STATUS_CHANGED', icon: '🔄', desc: 'Status atualizado', details: 'PENDING → APPROVED' },
        { time: '14:32:49.000', event: 'WEBHOOK_SENT', icon: '📧', desc: 'Webhook enviado', details: 'URL: https://api.merchant.com/webhooks | 200 OK | 0.3s' },
        { time: '14:33:00.000', event: 'CAPTURE_CONFIRMED', icon: '✅', desc: 'Captura automática', details: 'Valor: R$ 299,00' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title={tx.id}
                subtitle="Detalhes da Transação"
                breadcrumbs={[
                    { label: 'Transações' },
                    { label: 'Lista', page: 'AdminIntTransactionsList' },
                    { label: tx.id }
                ]}
                actionElement={
                    <Link to={createPageUrl('AdminIntTransactionsList')}>
                        <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar à Lista</Button>
                    </Link>
                }
            />

            {/* Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{tx.id}</h2>
                            <p className="text-slate-500">
                                {new Date(tx.date).toLocaleDateString('pt-BR')} às {new Date(tx.date).toLocaleTimeString('pt-BR')}
                            </p>
                        </div>
                        <StatusBadge status={tx.status} />
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">VALOR</p>
                            <p className="text-xl font-bold">{formatCurrency(tx.amount)}</p>
                            {tx.installments > 1 && <p className="text-xs text-slate-500">{tx.installments}x {formatCurrency(tx.amount / tx.installments)}</p>}
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">MÉTODO</p>
                            <p className="text-base font-medium">{tx.method === 'pix' ? '◉ PIX' : tx.method === 'credit_card' ? '💳 ' + tx.brand : tx.method === 'debit_card' ? '💳 ' + tx.brand : tx.method}</p>
                            <p className="text-xs text-slate-500">{tx.method === 'credit_card' ? 'Crédito' : tx.method === 'debit_card' ? 'Débito' : ''}</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">MERCHANT</p>
                            <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + tx.merchant_id} className="text-base font-medium text-blue-600 hover:underline">
                                {tx.merchant_name}
                            </Link>
                            <p className="text-xs text-slate-500">ID: {tx.merchant_id}</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">PAGADOR</p>
                            <p className="text-base font-medium">{tx.customer?.name || 'N/A'}</p>
                            <p className="text-xs text-slate-500 font-mono">***. ***.***-**</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tx.status === 'approved' && <Button variant="outline" onClick={() => setRefundModal(true)}><RotateCcw className="w-4 h-4 mr-2" /> Estornar</Button>}
                        <Button variant="outline" onClick={() => { navigator.clipboard.writeText(tx.id); toast.success('ID copiado!'); }}>
                            <Copy className="w-4 h-4 mr-2" /> Copiar Dados
                        </Button>
                        <Button variant="outline" onClick={() => toast.success('Webhook reenviado!')}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Reenviar Webhook
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Mais Ações</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>📄 Gerar Comprovante</DropdownMenuItem>
                                <DropdownMenuItem>🔗 Abrir no Merchant</DropdownMenuItem>
                                <DropdownMenuItem>📝 Adicionar Nota</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="dados" className="w-full">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="dados">Dados</TabsTrigger>
                    <TabsTrigger value="pagador">Pagador</TabsTrigger>
                    <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
                    <TabsTrigger value="antifraud">Antifraude</TabsTrigger>
                    <TabsTrigger value="processing">Processamento</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="notas">Notas</TabsTrigger>
                </TabsList>

                <TabsContent value="dados">
                    <div className="grid grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Identificadores</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div><span className="text-slate-500">ID Transação:</span> <span className="font-mono font-medium">{tx.id}</span></div>
                                <div><span className="text-slate-500">Ref. Externa:</span> <span className="font-mono">{tx.external_reference || 'N/A'}</span></div>
                                <div><span className="text-slate-500">ID Merchant:</span> <span className="font-mono">{tx.merchant_id}</span></div>
                                <div><span className="text-slate-500">Criado em:</span> {new Date(tx.date).toLocaleString('pt-BR')}</div>
                                <div><span className="text-slate-500">Atualizado:</span> {new Date(tx.date).toLocaleString('pt-BR')}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-base">Valores</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div><span className="text-slate-500">Valor Bruto:</span> <span className="font-bold">{formatCurrency(tx.amount)}</span></div>
                                <div><span className="text-slate-500">Taxa PagSmile:</span> <span className="text-red-600">{formatCurrency(tx.fee_amount)} ({((tx.fee_amount/tx.amount)*100).toFixed(2)}%)</span></div>
                                <div><span className="text-slate-500">Valor Líquido:</span> <span className="font-bold text-green-600">{formatCurrency(tx.net_amount)}</span></div>
                                <div><span className="text-slate-500">Parcelas:</span> {tx.installments > 1 ? `${tx.installments}x de ${formatCurrency(tx.amount / tx.installments)}` : 'À vista'}</div>
                                <div><span className="text-slate-500">Moeda:</span> BRL</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="pagador">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Dados do Pagador</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setRevealModal(true)}>
                                <Eye className="w-4 h-4 mr-2" /> Revelar Dados
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><Label className="text-slate-500">Nome</Label><p className="font-medium mt-1">{tx.customer?.name || 'N/A'}</p></div>
                                <div><Label className="text-slate-500">CPF/CNPJ</Label><p className="font-mono mt-1">***. ***.***-**</p></div>
                                <div><Label className="text-slate-500">E-mail</Label><p className="font-mono mt-1">j***@email.com</p></div>
                                <div><Label className="text-slate-500">Telefone</Label><p className="font-mono mt-1">(11) 9****-1234</p></div>
                                <div className="col-span-2"><Label className="text-slate-500">IP</Label><p className="font-mono mt-1">{tx.customer?.ip || '189.123.456.789'}</p></div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pagamento">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Dados do Pagamento</CardTitle></CardHeader>
                        <CardContent>
                            {tx.method === 'credit_card' || tx.method === 'debit_card' ? (
                                <div className="space-y-3 text-sm">
                                    <div><Label className="text-slate-500">Método</Label><p className="mt-1">Cartão de {tx.method === 'credit_card' ? 'Crédito' : 'Débito'}</p></div>
                                    <div><Label className="text-slate-500">Bandeira</Label><p className="mt-1">{tx.brand}</p></div>
                                    <div><Label className="text-slate-500">Últimos 4 dígitos</Label><p className="font-mono mt-1">**** **** **** {tx.card_last4}</p></div>
                                    <div><Label className="text-slate-500">Portador</Label><p className="mt-1">JOAO DA SILVA</p></div>
                                    <div><Label className="text-slate-500">Parcelas</Label><p className="mt-1">{tx.installments}x</p></div>
                                </div>
                            ) : tx.method === 'pix' ? (
                                <div className="space-y-3 text-sm">
                                    <div><Label className="text-slate-500">Método</Label><p className="mt-1">PIX</p></div>
                                    <div><Label className="text-slate-500">End-to-End ID</Label><p className="font-mono mt-1">{tx.pix?.end_to_end_id || 'E12345678...'}</p></div>
                                    <div><Label className="text-slate-500">Data Pagamento</Label><p className="mt-1">{new Date(tx.date).toLocaleString('pt-BR')}</p></div>
                                </div>
                            ) : (
                                <p className="text-slate-500">Dados do pagamento não disponíveis</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="antifraud">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Análise de Antifraude</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="font-semibold">Status: 🟢 APROVADO</p>
                                    <p>Score de Risco: <span className="text-2xl font-bold text-green-600">15</span>/100 (Baixo)</p>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }} />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>Baixo</span><span>Médio</span><span>Alto</span><span>Crítico</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><Label className="text-slate-500">Provider</Label><p className="mt-1">ClearSale</p></div>
                                <div><Label className="text-slate-500">ID Análise</Label><p className="font-mono mt-1">CS-987654321</p></div>
                                <div><Label className="text-slate-500">Tempo de resposta</Label><p className="mt-1">1.2s</p></div>
                                <div><Label className="text-slate-500">Decisão automática</Label><p className="mt-1">Sim</p></div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3">Dados da Análise</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b"><span className="text-slate-500">IP do Comprador</span><span>189.123.456.789 (São Paulo, BR)</span></div>
                                    <div className="flex justify-between py-2 border-b"><span className="text-slate-500">Device ID</span><span className="font-mono">a1b2c3d4e5f6...</span></div>
                                    <div className="flex justify-between py-2 border-b"><span className="text-slate-500">Device Score</span><span>Confiável (usado 15x antes)</span></div>
                                    <div className="flex justify-between py-2 border-b"><span className="text-slate-500">Histórico do CPF</span><span>5 compras nos últimos 30 dias</span></div>
                                    <div className="flex justify-between py-2"><span className="text-slate-500">Velocidade</span><span>1 transação/hora (normal)</span></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="processing">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Dados de Processamento</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><Label className="text-slate-500">Adquirente</Label><p className="mt-1">{tx.acquirer_data?.name || 'Cielo'}</p></div>
                                <div><Label className="text-slate-500">NSU</Label><p className="font-mono mt-1">{tx.acquirer_data?.nsu || '123456789'}</p></div>
                                <div><Label className="text-slate-500">Código Autorização</Label><p className="font-mono mt-1">{tx.acquirer_data?.authorization_code || 'ABC123'}</p></div>
                                <div><Label className="text-slate-500">TID</Label><p className="font-mono mt-1">{tx.acquirer_data?.tid || '1234567890123456'}</p></div>
                                <div><Label className="text-slate-500">Código Resposta</Label><p className="mt-1">{tx.acquirer_data?.return_code || '00'}</p></div>
                                <div><Label className="text-slate-500">Mensagem</Label><p className="mt-1">{tx.acquirer_data?.return_message || 'Transação aprovada'}</p></div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="timeline">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Timeline de Eventos</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {timeline.map((event, idx) => (
                                    <div key={idx} className="flex gap-3 py-2 border-b border-slate-100 last:border-0">
                                        <span className="text-xs font-mono text-slate-500 w-24">{event.time}</span>
                                        <div className="flex items-start gap-2">
                                            <span className="text-lg">{event.icon}</span>
                                            <div>
                                                <p className="font-medium text-sm">{event.desc}</p>
                                                <p className="text-xs text-slate-500">{event.details}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notas">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Notas Internas</CardTitle>
                            <Button size="sm">+ Adicionar Nota</Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 text-center py-8">Nenhuma nota registrada</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Refund Modal */}
            <Dialog open={refundModal} onOpenChange={setRefundModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Estornar Transação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600">Transação: <span className="font-mono">{tx.id}</span></p>
                        <p className="text-sm text-slate-600">Valor disponível: <span className="font-bold">{formatCurrency(tx.amount)}</span></p>
                        
                        <div>
                            <Label>Tipo de Estorno</Label>
                            <div className="space-y-2 mt-2">
                                <div className="flex items-center gap-2">
                                    <input type="radio" name="refund" value="full" checked={refundType === 'full'} onChange={(e) => setRefundType(e.target.value)} />
                                    Estorno Total ({formatCurrency(tx.amount)})
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="radio" name="refund" value="partial" checked={refundType === 'partial'} onChange={(e) => setRefundType(e.target.value)} />
                                    Estorno Parcial: {refundType === 'partial' && <Input type="number" className="w-32 ml-2" placeholder="R$ 0,00" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} />}
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label>Motivo do Estorno</Label>
                            <Select><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="customer_request">Solicitação do cliente</SelectItem>
                                    <SelectItem value="not_delivered">Produto não entregue</SelectItem>
                                    <SelectItem value="defect">Produto com defeito</SelectItem>
                                    <SelectItem value="fraud">Fraude confirmada</SelectItem>
                                    <SelectItem value="operational">Erro operacional</SelectItem>
                                    <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                            ⚠️ Esta ação não pode ser desfeita.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRefundModal(false)}>Cancelar</Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={() => { toast.success('Estorno processado!'); setRefundModal(false); }}>
                            Confirmar Estorno
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reveal Modal */}
            <Dialog open={revealModal} onOpenChange={setRevealModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            Revelar Dados do Pagador
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-700">
                            ⚠️ Esta ação será registrada em auditoria.
                        </div>
                        <div>
                            <Label>Motivo para revelar dados</Label>
                            <Select><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="support">Atendimento ao cliente</SelectItem>
                                    <SelectItem value="fraud">Investigação de fraude</SelectItem>
                                    <SelectItem value="legal">Solicitação judicial</SelectItem>
                                    <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRevealModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Dados revelados e ação registrada'); setRevealModal(false); }}>
                            Revelar e Registrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}