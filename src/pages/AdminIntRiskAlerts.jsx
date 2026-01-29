import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, Eye, Check, Bell, Settings, BellOff } from 'lucide-react';
import { toast } from 'sonner';

const activeAlerts = [
    { id: 'ALR-001', type: 'cb_ratio', severity: 'error', message: 'CB Ratio da Loja do João atingiu 0,95% (limite: 0,80%)', merchant: 'Loja do João', time: 'há 2 horas', action: 'Investigar transações recentes e aumentar retenção' },
    { id: 'ALR-002', type: 'volume', severity: 'error', message: 'Aumento de volume anormal - Tech Store', merchant: 'Tech Store', time: 'há 4 horas', action: 'Verificar se há promoção ou possível fraude' },
    { id: 'ALR-003', type: 'med', severity: 'warning', message: '5 MEDs pendentes com prazo < 3 dias', merchant: '-', time: 'há 1 dia', action: 'Revisar e responder MEDs urgentes' },
    { id: 'ALR-004', type: 'denial', severity: 'warning', message: 'Taxa de negação alta - Moda Fashion (15%)', merchant: 'Moda Fashion', time: 'há 6 horas', action: 'Analisar causa das negações' },
    { id: 'ALR-005', type: 'fraud', severity: 'error', message: '10 fraudes detectadas em Pet Shop nas últimas 24h', merchant: 'Pet Shop', time: 'há 8 horas', action: 'Investigar padrão de fraude' },
];

const alertHistory = [
    { date: '28/01 12:30', alert: 'CB Ratio alto', merchant: 'Loja do João', status: 'active' },
    { date: '28/01 10:15', alert: 'Volume anormal', merchant: 'Tech Store', status: 'active' },
    { date: '27/01 16:00', alert: 'Negação alta', merchant: 'Moda Fashion', status: 'resolved', resolvedBy: 'Ana P.' },
    { date: '26/01 09:30', alert: 'CB Ratio alto', merchant: 'Tech Store', status: 'resolved', resolvedBy: 'João S.' },
];

export default function AdminIntRiskAlerts() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Alertas e Monitoramento"
                breadcrumbs={[{ label: 'Risco e Compliance' }, { label: 'Alertas' }]}
                actionElement={
                    <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" /> Configurar
                    </Button>
                }
            />

            {/* Active Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Bell className="w-5 h-5 text-red-500" />
                        Alertas Ativos ({activeAlerts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {activeAlerts.map(alert => (
                        <div key={alert.id} className={`border rounded-lg p-4 ${alert.severity === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{alert.severity === 'error' ? '🔴' : '🟡'}</span>
                                    <div>
                                        <p className="font-medium mb-1">{alert.message}</p>
                                        {alert.merchant !== '-' && (
                                            <p className="text-sm text-slate-600">Merchant: {alert.merchant}</p>
                                        )}
                                        <p className="text-sm text-slate-500 mt-1">Ação recomendada: {alert.action}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500">{alert.time}</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" /> Ver merchant
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => toast.success('Alerta marcado como resolvido!')}>
                                    <Check className="w-4 h-4 mr-1" /> Marcar como resolvido
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => toast.info('Alerta silenciado por 24h')}>
                                    <BellOff className="w-4 h-4 mr-1" /> Silenciar 24h
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Alert History */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">📜 Histórico de Alertas</CardTitle>
                    <div className="flex gap-2">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="error">Críticos</SelectItem>
                                <SelectItem value="warning">Avisos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos Status</SelectItem>
                                <SelectItem value="active">Ativos</SelectItem>
                                <SelectItem value="resolved">Resolvidos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="7d">
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">7 dias</SelectItem>
                                <SelectItem value="30d">30 dias</SelectItem>
                                <SelectItem value="90d">90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">Data/Hora</th>
                                    <th className="text-left py-2 px-3">Alerta</th>
                                    <th className="text-left py-2 px-3">Merchant</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                    <th className="text-left py-2 px-3">Resolvido por</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alertHistory.map((ah, idx) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3">{ah.date}</td>
                                        <td className="py-3 px-3">{ah.alert}</td>
                                        <td className="py-3 px-3">{ah.merchant}</td>
                                        <td className="py-3 px-3">
                                            {ah.status === 'active' ? (
                                                <Badge className="bg-red-100 text-red-700 border-0">🔴 Ativo</Badge>
                                            ) : (
                                                <Badge className="bg-green-100 text-green-700 border-0">✅ Resolvido</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">{ah.resolvedBy || '-'}</td>
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