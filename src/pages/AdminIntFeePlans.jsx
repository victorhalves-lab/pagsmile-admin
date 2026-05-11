import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, BarChart2, Star, CreditCard, Zap, Clock, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import CreatePlanWizard from '@/components/admin-interno/plans/CreatePlanWizard';
import { PLAN_TEMPLATES } from '@/components/admin-interno/plans/planSchema';

/**
 * Catálogo de planos de taxas. Lista enriquecida com TODAS as taxas-chave.
 */
export default function AdminIntFeePlans() {
    const [wizardOpen, setWizardOpen] = useState(false);

    // Lista derivada dos templates + estado simulado de "merchants/status"
    const [plans, setPlans] = useState([
        { ...PLAN_TEMPLATES.starter, id: 'STARTER', status: 'active', merchants: 89 },
        { ...PLAN_TEMPLATES.growth, id: 'GROWTH', status: 'active', merchants: 156 },
        { ...PLAN_TEMPLATES.pro, id: 'PRO', status: 'active', merchants: 98 },
        { ...PLAN_TEMPLATES.enterprise, id: 'ENTERPRISE', status: 'active', merchants: 23 },
    ]);

    const handleCreated = (newPlan) => {
        setPlans((prev) => [...prev, { ...newPlan, id: newPlan.code, merchants: 0, status: 'draft' }]);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Planos de Taxas"
                subtitle="Catálogo completo: MDR, PIX, antecipação, custos por transação, antifraude e mais"
                breadcrumbs={[{ label: 'Administração', page: '#' }, { label: 'Planos', page: 'AdminIntFeePlans' }]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link to={createPageUrl('AdminIntPriceSimulator')}>
                                <Calculator className="w-4 h-4 mr-2" /> Simulador
                            </Link>
                        </Button>
                        <Button onClick={() => setWizardOpen(true)} className="bg-[#2bc196] hover:bg-[#239b7a]">
                            <Plus className="w-4 h-4 mr-2" /> Novo plano
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {plans.map((plan) => (
                    <PlanListCard key={plan.id} plan={plan} />
                ))}
            </div>

            <CreatePlanWizard open={wizardOpen} onOpenChange={setWizardOpen} onCreated={handleCreated} />
        </div>
    );
}

function PlanListCard({ plan }) {
    return (
        <Card className="hover:shadow-xl transition-all group relative overflow-hidden border-slate-200">
            {plan.popular && (
                <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-gradient-to-r from-[#2bc196] to-emerald-500 text-white border-0 text-[9px] uppercase tracking-wider font-bold px-2 py-1">
                        <Star className="w-2.5 h-2.5 mr-1 fill-white" /> Popular
                    </Badge>
                </div>
            )}

            <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="outline" className="text-[9px] py-0 px-1.5 uppercase mb-1.5">
                            {plan.type}
                        </Badge>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-[#2bc196] transition">
                            {plan.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono">{plan.code}</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#2bc196]/10 transition">
                        <BarChart2 className="w-4 h-4 text-slate-400 group-hover:text-[#2bc196]" />
                    </div>
                </div>

                {/* MDR Grid */}
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                    <MetricCell label="1x" value={`${plan.card.mdr_1x}%`} highlight />
                    <MetricCell label="2-6x" value={`${plan.card.mdr_2_6x}%`} />
                    <MetricCell label="7-12x" value={`${plan.card.mdr_7_12x}%`} />
                </div>

                {/* Linhas-chave */}
                <div className="space-y-1.5 text-xs pt-1">
                    <Line icon={Zap} label="PIX" value={`${plan.pix.rate_pct}%`} color="text-[#2bc196]" />
                    <Line icon={Clock} label="Antecipação" value={`${plan.anticipation.rate_monthly}% a.m.`} />
                    <Line icon={CreditCard} label="Gateway/tx" value={`R$ ${plan.card.gateway_approved.toFixed(2)}`} />
                    <Line label="Antifraude/tx" value={`R$ ${plan.card.antifraud_per_tx.toFixed(2)}`} />
                    <Line label="3DS/auth" value={`R$ ${plan.card.threeds_per_auth.toFixed(2)}`} />
                    <Line label="Pré-CB" value={`R$ ${plan.card.pre_chargeback_alert.toFixed(2)}`} />
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="text-[10px] text-slate-500">
                        <span className="font-bold text-slate-900">{plan.merchants}</span> merchants · {plan.anticipation.settlement_term}
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                        <Link to={createPageUrl('AdminIntFeePlanDetail') + `?id=${plan.id}`}>
                            Detalhes <Eye className="w-3 h-3 ml-1" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function MetricCell({ label, value, highlight }) {
    return (
        <div className={`rounded-lg p-2 text-center ${highlight ? 'bg-[#2bc196]/10 border border-[#2bc196]/20' : 'bg-slate-50'}`}>
            <div className="text-[9px] uppercase tracking-wide text-slate-500 font-semibold">{label}</div>
            <div className={`text-sm font-black font-mono mt-0.5 ${highlight ? 'text-[#2bc196]' : 'text-slate-900'}`}>
                {value}
            </div>
        </div>
    );
}

function Line({ icon: Icon, label, value, color = 'text-slate-900' }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-slate-500 flex items-center gap-1.5">
                {Icon && <Icon className="w-3 h-3" />}
                {label}
            </span>
            <span className={`font-bold font-mono ${color}`}>{value}</span>
        </div>
    );
}