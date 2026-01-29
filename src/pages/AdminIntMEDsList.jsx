import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, Eye, FileText, AlertTriangle, Clock, Banknote } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const meds = [
    { id: 'MED-001', merchant: 'Loja do João', merchantId: '12345', amount: 500, reason: 'Fraude', bank: 'Nubank', deadline: '30/01/2026', status: 'open', urgent: true },
    { id: 'MED-002', merchant: 'Tech Store', merchantId: '12346', amount: 350, reason: 'Erro Op.', bank: 'Itaú', deadline: '31/01/2026', status: 'open', urgent: true },
    { id: 'MED-003', merchant: 'Moda Fashion', merchantId: '12347', amount: 200, reason: 'Fraude', bank: 'Bradesco', deadline: '02/02/2026', status: 'open', urgent: false },
    { id: 'MED-004', merchant: 'Loja do João', merchantId: '12345', amount: 150, reason: 'Fraude', bank: 'Santander', deadline: '-', status: 'in_contest' },
    { id: 'MED-005', merchant: 'Tech Store', merchantId: '12346', amount: 280, reason: 'Erro Op.', bank: 'BB', deadline: '-', status: 'won' },
    { id: 'MED-006', merchant: 'Moda Fashion', merchantId: '12347', amount: 420, reason: 'Fraude', bank: 'Caixa', deadline: '-', status: 'lost' },
];

const statusConfig = {
    open: { label: 'Aberto', color: 'bg-yellow-100 text-yellow-700' },
    in_contest: { label: 'Em Contestação', color: 'bg-blue-100 text-blue-700' },
    won: { label: 'Ganho', color: 'bg-green-100 text-green-700' },
    lost: { label: 'Perdido', color: 'bg-red-100 text-red-700' },
};

const urgentMeds = meds.filter(m => m.urgent && m.status === 'open');

export default function AdminIntMEDsList() {
    const stats = {
        medRate: 0.02,
        open: { count: 8, value: 2100 },
        inContest: { count: 5, value: 1500 },
        won: { count: 13, percentage: 72, value: 3200 },
        lost: { count: 5, percentage: 28, value: 1000 },
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Gestão de MEDs (PIX)"
                breadcrumbs={[{ label: 'Risco e Compliance' }, { label: 'MEDs' }]}
            />

            {/* Stats */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Banknote className="w-5 h-5" /> Resumo Geral
                    </CardTitle>
                    <Select defaultValue="30d">
                        <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">7 dias</SelectItem>
                            <SelectItem value="30d">30 dias</SelectItem>
                            <SelectItem value="90d">90 dias</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-5 gap-4">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-700">{stats.medRate}%</p>
                            <p className="text-xs text-slate-500">MED Rate</p>
                            <Badge className="bg-green-100 text-green-700 border-0 mt-1">🟢 OK</Badge>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                            <p className="text-2xl font-bold">{stats.open.count}</p>
                            <p className="text-xs text-slate-500">Abertos</p>
                            <p className="text-xs text-slate-400">{formatCurrency(stats.open.value)}</p>
                        </div>