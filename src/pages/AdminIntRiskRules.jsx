import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, BarChart3, Pause, Play, Trash2, TestTube, Shield } from 'lucide-react';
import { toast } from 'sonner';

const rules = [
    { id: 'RULE-001', name: 'Valor Alto', category: 'value', priority: 'high', action: 'block', condition: 'SE valor > R$ 5.000 E cliente_novo = true', active: true, triggers30d: 45, blocks: 38, rate: 84 },
    { id: 'RULE-002', name: 'Múltiplas Tentativas', category: 'velocity', priority: 'high', action: 'block', condition: 'SE tentativas_cartao > 3 EM 1 hora', active: true, triggers30d: 89, blocks: 89, rate: 100 },
    { id: 'RULE-003', name: 'BIN Suspeito', category: 'card', priority: 'medium', action: 'manual_review', condition: 'SE bin_country != "BR" E valor > R$ 500', active: true, triggers30d: 156, blocks: 23, rate: 15 },
    { id: 'RULE-004', name: 'Device Novo', category: 'device', priority: 'low', action: 'score', condition: 'SE device_age < 30 dias', active: false, triggers30d: 234, blocks: 0, rate: 0 },
];

const priorityConfig = {
    high: { label: 'Alta', color: 'bg-red-100 text-red-700' },
    medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-700' },
    low: { label: 'Baixa', color: 'bg-slate-100 text-slate-700' },
};

const actionConfig = {
    block: 'Bloquear',
    manual_review: 'Análise Manual',
    score: 'Adicionar Score',
    alert: 'Alertar',
};

export default function AdminIntRiskRules() {
    const [newRuleModal, setNewRuleModal] = useState(false);
    const [conditions, setConditions] = useState([{ field: '', operator: '', value: '' }]);

    const stats = {
        total: rules.length,
        active: rules.filter(r => r.active).length,
        inactive: rules.filter(r => !r.active).length,
        triggers: rules.reduce((s, r) => s + r.triggers30d, 0),
        blocks: rules.reduce((s, r) => s + r.blocks, 0),
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Regras de Risco"
                breadcrumbs={[{ label: 'Risco e Compliance' }, { label: 'Regras' }]}
                actionElement={
                    <Button onClick={() => setNewRuleModal(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Nova Regra
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
                <div className="p-4 bg-white border rounded-lg text-center">
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-slate-500">Total</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-700">{stats.active}</p>
                    <p className="text-sm text-slate-500">Ativas</p>
                </div>
                <div className="p-4 bg-slate-50 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{stats.inactive}</p>
                    <p className="text-sm text-slate-500">Inativas</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-700">{stats.triggers.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">Disparos (30d)</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-700">{stats.blocks.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">Bloqueios (30d)</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="active">Ativas</SelectItem>
                                <SelectItem value="inactive">Inativas</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas Categorias</SelectItem>
                                <SelectItem value="value">Valor</SelectItem>
                                <SelectItem value="velocity">Velocidade</SelectItem>
                                <SelectItem value="card">Cartão</SelectItem>
                                <SelectItem value="customer">Cliente</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input placeholder="🔍 Buscar regra..." className="w-[200px]" />
                    </div>
                </CardContent>
            </Card>

            {/* Rules List */}
            <div className="space-y-3">
                {rules.map(rule => (
                    <Card key={rule.id}>
                        <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold">{rule.id}: {rule.name}</h3>
                                        {rule.active ? (
                                            <Badge className="bg-green-100 text-green-700 border-0">✅ Ativa</Badge>
                                        ) : (
                                            <Badge className="bg-slate-100 text-slate-700 border-0">⏸️ Inativa</Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-4 text-sm text-slate-600">
                                        <span>Categoria: {rule.category}</span>
                                        <Badge className={`${priorityConfig[rule.priority].color} border-0`}>
                                            Prioridade: {priorityConfig[rule.priority].label}
                                        </Badge>
                                        <span>Ação: {actionConfig[rule.action]}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3 mb-3 font-mono text-sm">
                                {rule.condition}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-4 text-sm text-slate-500">
                                    <span>Disparos (30d): <strong>{rule.triggers30d}</strong></span>
                                    <span>Bloqueios: <strong>{rule.blocks}</strong></span>
                                    <span>Taxa: <strong>{rule.rate}%</strong></span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => toast.info('Editor de regra...')}>
                                        <Edit className="w-4 h-4 mr-1" /> Editar
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <TestTube className="w-4 h-4 mr-1" /> Testar
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <BarChart3 className="w-4 h-4 mr-1" /> Métricas
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => toast.success(rule.active ? 'Regra desativada' : 'Regra ativada')}>
                                        {rule.active ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                                        {rule.active ? 'Desativar' : 'Ativar'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* New Rule Modal */}
            <Dialog open={newRuleModal} onOpenChange={setNewRuleModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" /> Nova Regra de Risco
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nome da regra *</Label>
                            <Input className="mt-1" placeholder="Ex: Bloqueio de valor alto para cliente novo" />
                        </div>
                        <div>
                            <Label>Descrição</Label>
                            <Textarea className="mt-1" placeholder="Descreva o que a regra faz..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Categoria</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="value">Valor</SelectItem>
                                        <SelectItem value="velocity">Velocidade</SelectItem>
                                        <SelectItem value="card">Cartão</SelectItem>
                                        <SelectItem value="customer">Cliente</SelectItem>
                                        <SelectItem value="device">Dispositivo</SelectItem>
                                        <SelectItem value="geo">Geolocalização</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Prioridade</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">Alta</SelectItem>
                                        <SelectItem value="medium">Média</SelectItem>
                                        <SelectItem value="low">Baixa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label>Ação Principal</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="block">Bloquear transação</SelectItem>
                                    <SelectItem value="manual_review">Enviar para análise manual</SelectItem>
                                    <SelectItem value="score">Adicionar ao score</SelectItem>
                                    <SelectItem value="alert">Apenas alertar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Escopo de Aplicação</Label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="scope" value="all" defaultChecked />
                                    Todos os merchants
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="scope" value="specific" />
                                    Merchants específicos
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox id="activate" />
                            <label htmlFor="activate" className="text-sm">Ativar regra imediatamente</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewRuleModal(false)}>Cancelar</Button>
                        <Button variant="outline"><TestTube className="w-4 h-4 mr-2" /> Testar Regra</Button>
                        <Button onClick={() => { toast.success('Regra criada!'); setNewRuleModal(false); }}>
                            💾 Salvar Regra
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}