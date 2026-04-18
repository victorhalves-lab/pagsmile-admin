import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SideDrawer from '@/components/common/SideDrawer';
import { Plus, Eye, Settings, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntFeePlans() {
    const [newPlanModal, setNewPlanModal] = useState(false);
    const plans = [
        { name: 'Starter', code: 'STARTER', type: 'Padrão', fees: { card_1x: '4.99%', pix: '1.49%' }, rr: '5%', term: 'D+30', merchants: 89 },
        { name: 'Growth', code: 'GROWTH', type: 'Padrão', fees: { card_1x: '3.99%', pix: '0.99%' }, rr: '3%', term: 'D+15', merchants: 156 },
        { name: 'Pro', code: 'PRO', type: 'Padrão', fees: { card_1x: '3.29%', pix: '0.89%' }, rr: '2%', term: 'D+15', merchants: 98 },
        { name: 'Enterprise', code: 'ENTERPRISE', type: 'Padrão', fees: { card_1x: '2.79%', pix: '0.59%' }, rr: '0%', term: 'D+2', merchants: 23 },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Planos de Taxas" 
                subtitle="Catálogo de Precificação"
                breadcrumbs={[{ label: 'Administração', page: '#' }, { label: 'Planos', page: 'AdminIntFeePlans' }]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" asChild><Link to={createPageUrl('AdminIntPriceSimulator')}>Simulador</Link></Button>
                        <Button onClick={() => setNewPlanModal(true)}><Plus className="w-4 h-4 mr-2" /> Novo Plano</Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.code} className="hover:shadow-lg transition-all cursor-pointer group">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className="mb-2">{plan.type}</Badge>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{plan.name}</CardTitle>
                                </div>
                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <BarChart2 className="w-5 h-5 text-slate-500 group-hover:text-primary" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex justify-between"><span>Cartão 1x</span><span className="font-bold">{plan.fees.card_1x}</span></div>
                                <div className="flex justify-between"><span>Pix</span><span className="font-bold">{plan.fees.pix}</span></div>
                                <div className="flex justify-between"><span>Prazo</span><span>{plan.term}</span></div>
                                <div className="flex justify-between"><span>Rolling Reserve</span><span>{plan.rr}</span></div>
                            </div>
                            <div className="pt-2 border-t flex justify-between items-center text-xs text-slate-500">
                                <span>{plan.merchants} Merchants</span>
                                <Button variant="ghost" size="sm" className="h-8" asChild>
                                    <Link to={createPageUrl('AdminIntFeePlanDetail', { id: plan.code })}>Detalhes <Eye className="w-3 h-3 ml-1" /></Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* New Plan Side Drawer */}
            <SideDrawer
                open={newPlanModal}
                onOpenChange={setNewPlanModal}
                title="Novo Plano de Taxas"
                description="Configure um novo plano de taxas para merchants"
                icon={Plus}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setNewPlanModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Plano criado com sucesso!'); setNewPlanModal(false); }}>
                            <Plus className="w-4 h-4 mr-2" /> Criar Plano
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <Label>Nome do Plano *</Label>
                        <Input className="mt-1" placeholder="Ex: Premium, Starter..." />
                    </div>
                    <div>
                        <Label>Código *</Label>
                        <Input className="mt-1" placeholder="Ex: PREMIUM" />
                    </div>
                    <div>
                        <Label>Tipo</Label>
                        <Select defaultValue="padrao">
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="padrao">Padrão</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                <SelectItem value="custom">Customizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Taxa Cartão 1x (%)</Label>
                            <Input className="mt-1" placeholder="3.99" type="number" step="0.01" />
                        </div>
                        <div>
                            <Label>Taxa PIX (%)</Label>
                            <Input className="mt-1" placeholder="0.99" type="number" step="0.01" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Rolling Reserve (%)</Label>
                            <Input className="mt-1" placeholder="5" type="number" step="1" />
                        </div>
                        <div>
                            <Label>Prazo Liquidação</Label>
                            <Select defaultValue="d15">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="d2">D+2</SelectItem>
                                    <SelectItem value="d15">D+15</SelectItem>
                                    <SelectItem value="d30">D+30</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </SideDrawer>
        </div>
    );
}