import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Tag, ShoppingCart, Percent, AlertTriangle, TrendingUp, Search, Filter, 
    MoreHorizontal, Eye, Settings, BarChart2, Plus 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminIntMCCs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [newMCCModal, setNewMCCModal] = useState(false);

    const kpis = [
        { title: 'MCCs Ativos', value: '45', icon: Tag, change: 0 },
        { title: 'Top MCC (TPV)', value: '5411', sub: 'Supermercados', icon: ShoppingCart },
        { title: 'TPV Total', value: '85M', prefix: 'R$ ', icon: TrendingUp, change: 12 },
        { title: 'Margem Média', value: '0.95', suffix: '%', icon: Percent, change: -5, trend: 'down' },
        { title: 'Irregularidades', value: '5', icon: AlertTriangle, className: 'border-l-4 border-l-amber-500' },
        { title: 'Alto Risco', value: '3', icon: AlertTriangle, className: 'border-l-4 border-l-red-500' }
    ];

    const mccs = [
        { code: '5411', desc: 'Supermercados e Mercearias', merchants: 68, risk: 'low', status: 'active', interchange: '1.65%', tpv: '15.2M' },
        { code: '5734', desc: 'Software e Computadores', merchants: 52, risk: 'low', status: 'active', interchange: '1.85%', tpv: '12.8M' },
        { code: '5812', desc: 'Restaurantes', merchants: 45, risk: 'low', status: 'active', interchange: '1.70%', tpv: '10.5M' },
        { code: '5651', desc: 'Loja de Roupas (Família)', merchants: 38, risk: 'medium', status: 'active', interchange: '1.90%', tpv: '8.9M' },
        { code: '7995', desc: 'Apostas e Loterias', merchants: 8, risk: 'high', status: 'restricted', interchange: '2.50%', tpv: '5.0M' },
    ];

    const getRiskBadge = (risk) => {
        const config = {
            low: { color: 'bg-green-100 text-green-700', label: 'Baixo' },
            medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Médio' },
            high: { color: 'bg-red-100 text-red-700', label: 'Alto' },
        }[risk] || { color: 'bg-gray-100 text-gray-700', label: risk };
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="MCCs (Merchant Category Codes)" 
                subtitle="Gestão de Categorias e Custos"
                breadcrumbs={[{ label: 'Administração', page: '#' }, { label: 'MCCs', page: 'AdminIntMCCs' }]}
                actions={<Button onClick={() => setNewMCCModal(true)}><Tag className="w-4 h-4 mr-2" /> Novo MCC</Button>}
            />

            {/* Insights */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-4 items-start">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg"><Tag className="w-5 h-5 text-blue-600 dark:text-blue-300" /></div>
                <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">INSIGHTS DO DIA</h3>
                    <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <p>🏷️ 5 merchants podem estar com MCC incorreto - <Link to={createPageUrl('AdminIntMccIrregularities')} className="underline font-medium">Revisar</Link></p>
                        <p>📊 MCC 5411 (Supermercados) tem margem 15% abaixo do esperado.</p>
                        <p>💰 MCC 5734 (Software) é o mais rentável: margem média 1.45%.</p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {kpis.map((kpi, idx) => (
                    <KPICard key={idx} {...kpi} />
                ))}
            </div>

            {/* Catalog */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Catálogo de MCCs</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="Buscar por código ou descrição..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filtros</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Merchants</TableHead>
                                <TableHead>Risco</TableHead>
                                <TableHead>Interchange (Visa 1x)</TableHead>
                                <TableHead>TPV Mês</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mccs.map((mcc) => (
                                <TableRow key={mcc.code}>
                                    <TableCell className="font-mono font-medium">{mcc.code}</TableCell>
                                    <TableCell>{mcc.desc}</TableCell>
                                    <TableCell>{mcc.merchants}</TableCell>
                                    <TableCell>{getRiskBadge(mcc.risk)}</TableCell>
                                    <TableCell>{mcc.interchange}</TableCell>
                                    <TableCell>R$ {mcc.tpv}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" title="Detalhes" asChild>
                                                <Link to={createPageUrl('AdminIntMCCDetail', { code: mcc.code })}>
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Configurar">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* New MCC Modal */}
            <Dialog open={newMCCModal} onOpenChange={setNewMCCModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo MCC</DialogTitle>
                        <DialogDescription>Cadastre um novo código MCC no sistema</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Código MCC *</Label>
                            <Input className="mt-1" placeholder="Ex: 5411" maxLength={4} />
                        </div>
                        <div>
                            <Label>Descrição *</Label>
                            <Input className="mt-1" placeholder="Ex: Supermercados e Mercearias" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Categoria</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="varejo">Varejo</SelectItem>
                                        <SelectItem value="servicos">Serviços</SelectItem>
                                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                                        <SelectItem value="entretenimento">Entretenimento</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Nível de Risco</Label>
                                <Select defaultValue="low">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Baixo</SelectItem>
                                        <SelectItem value="medium">Médio</SelectItem>
                                        <SelectItem value="high">Alto</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>Interchange Base (%)</Label>
                            <Input className="mt-1" placeholder="Ex: 1.65" type="number" step="0.01" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewMCCModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('MCC cadastrado com sucesso!'); setNewMCCModal(false); }}>
                            <Plus className="w-4 h-4 mr-2" /> Cadastrar MCC
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}