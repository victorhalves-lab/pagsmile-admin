import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Zap, DollarSign, TrendingDown, CheckCircle, Settings, Edit, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export default function TabAntecipacao({ merchant }) {
    const [simAmount, setSimAmount] = useState('50000');
    const [showAutoConfig, setShowAutoConfig] = useState(false);
    const [autoConfig, setAutoConfig] = useState({
        enabled: false,
        percentage: 50,
        frequency: 'daily',
        min_amount: 1000,
        rate_discount: 0
    });

    const stats = {
        available: 89432,
        thisMonth: 45000,
        avgRate: 1.89,
        totalCost: 8500,
    };

    const anticipationHistory = [
        { id: 'ANT-456', date: '25/01/2026', gross: 30000, fee: 420, net: 29580, status: 'credited' },
        { id: 'ANT-455', date: '15/01/2026', gross: 15000, fee: 210, net: 14790, status: 'credited' },
        { id: 'ANT-454', date: '05/01/2026', gross: 20000, fee: 280, net: 19720, status: 'credited' },
    ];

    const amount = parseFloat(simAmount) || 0;
    const avgDays = 22;
    const rate = (1.89 * (avgDays / 30)) / 100;
    const cost = amount * rate;
    const netAmount = amount - cost;

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Disponível p/ antecipar</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(stats.available)}</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Antecipado este mês</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.thisMonth)}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Taxa média</p>
                    <p className="text-xl font-bold text-purple-600">{stats.avgRate}% a.m.</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Custo total</p>
                    <p className="text-xl font-bold text-red-600">-{formatCurrency(stats.totalCost)}</p>
                    <p className="text-xs text-slate-500 mt-1">(custo de antecipações)</p>
                </div>
            </div>

            {/* Auto-Anticipation Config */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Settings className="w-5 h-5" /> Auto-Antecipação
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setShowAutoConfig(true)}>
                            <Edit className="w-4 h-4 mr-1" /> Configurar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Switch checked={autoConfig.enabled} onCheckedChange={(v) => setAutoConfig({...autoConfig, enabled: v})} />
                                <div>
                                    <p className="font-medium">{autoConfig.enabled ? 'Auto-antecipação ativa' : 'Auto-antecipação inativa'}</p>
                                    {autoConfig.enabled && (
                                        <p className="text-sm text-slate-500">
                                            Antecipando {autoConfig.percentage}% do saldo {autoConfig.frequency === 'daily' ? 'diariamente' : 'semanalmente'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {autoConfig.enabled && (
                                <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                            )}
                        </div>
                        {autoConfig.enabled && (
                            <div className="grid grid-cols-4 gap-4 pt-3 border-t border-slate-200">
                                <div>
                                    <p className="text-xs text-slate-500">% a antecipar</p>
                                    <p className="font-medium">{autoConfig.percentage}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Frequência</p>
                                    <p className="font-medium">{autoConfig.frequency === 'daily' ? 'Diário' : 'Semanal'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Mínimo</p>
                                    <p className="font-medium">{formatCurrency(autoConfig.min_amount)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Desconto na taxa</p>
                                    <p className="font-medium">{autoConfig.rate_discount > 0 ? `-${autoConfig.rate_discount}%` : 'Nenhum'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Simulator */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-5 h-5" /> Simular Antecipação em Nome do Cliente
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Label>Valor a antecipar</Label>
                            <Input 
                                type="number" 
                                value={simAmount}
                                onChange={(e) => setSimAmount(e.target.value)}
                                className="mt-1" 
                                placeholder="R$ 0,00"
                            />
                        </div>
                        <Button variant="outline">Antecipar tudo disponível</Button>
                    </div>

                    <div>
                        <Label>Data de recebimento</Label>
                        <Input type="date" defaultValue="2026-01-29" className="mt-1" />
                        <p className="text-xs text-slate-500 mt-1">(amanhã)</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h4 className="font-bold mb-4 text-lg">SIMULAÇÃO</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Valor bruto a antecipar:</span>
                                <span className="font-bold text-lg">{formatCurrency(amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Dias médios antecipados:</span>
                                <span className="font-medium">{avgDays} dias</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Taxa aplicada:</span>
                                <span className="font-medium">1,89% × ({avgDays}/30) = {(rate * 100).toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Custo da antecipação:</span>
                                <span className="font-medium text-red-600">{formatCurrency(cost)}</span>
                            </div>
                            <div className="border-t border-slate-300 dark:border-slate-600 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">Valor líquido a receber:</span>
                                    <span className="font-bold text-2xl text-green-600">{formatCurrency(netAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancelar</Button>
                        <Button className="bg-[#2bc196] hover:bg-[#239b7a]">
                            <Zap className="w-4 h-4 mr-2" /> Confirmar Antecipação
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Histórico de Antecipações</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor bruto</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Taxa</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Líquido</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anticipationHistory.map(ant => (
                                    <tr key={ant.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="py-3 px-3 font-mono text-xs">{ant.id}</td>
                                        <td className="py-3 px-3">{ant.date}</td>
                                        <td className="py-3 px-3 text-right font-medium">{formatCurrency(ant.gross)}</td>
                                        <td className="py-3 px-3 text-right text-red-600">{formatCurrency(ant.fee)}</td>
                                        <td className="py-3 px-3 text-right font-bold text-green-600">{formatCurrency(ant.net)}</td>
                                        <td className="py-3 px-3">
                                            <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Creditado</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Auto-Anticipation Config Dialog */}
            <Dialog open={showAutoConfig} onOpenChange={setShowAutoConfig}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configurar Auto-Antecipação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Habilitar auto-antecipação</Label>
                            <Switch checked={autoConfig.enabled} onCheckedChange={(v) => setAutoConfig({...autoConfig, enabled: v})} />
                        </div>
                        <div>
                            <Label>Percentual do saldo a antecipar</Label>
                            <Select value={String(autoConfig.percentage)} onValueChange={(v) => setAutoConfig({...autoConfig, percentage: parseInt(v)})}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="25">25%</SelectItem>
                                    <SelectItem value="50">50%</SelectItem>
                                    <SelectItem value="75">75%</SelectItem>
                                    <SelectItem value="100">100%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Frequência</Label>
                            <Select value={autoConfig.frequency} onValueChange={(v) => setAutoConfig({...autoConfig, frequency: v})}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Diário</SelectItem>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Valor mínimo para antecipar</Label>
                            <Input type="number" value={autoConfig.min_amount} onChange={(e) => setAutoConfig({...autoConfig, min_amount: parseInt(e.target.value)})} className="mt-1" />
                        </div>
                        <div>
                            <Label>Desconto na taxa (benefício especial)</Label>
                            <Select value={String(autoConfig.rate_discount)} onValueChange={(v) => setAutoConfig({...autoConfig, rate_discount: parseFloat(v)})}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Sem desconto</SelectItem>
                                    <SelectItem value="0.1">0.1% de desconto</SelectItem>
                                    <SelectItem value="0.2">0.2% de desconto</SelectItem>
                                    <SelectItem value="0.3">0.3% de desconto</SelectItem>
                                    <SelectItem value="0.5">0.5% de desconto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="flex items-center gap-2 text-amber-700">
                                <AlertTriangle className="w-4 h-4" />
                                <p className="text-sm">Esta configuração afeta o fluxo de caixa do cliente.</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAutoConfig(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Configuração salva!'); setShowAutoConfig(false); }}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}