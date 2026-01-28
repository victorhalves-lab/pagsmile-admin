import React from 'react';
import KPICard from './shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, Users, FileCheck, Target, 
  ArrowRight, Phone
} from 'lucide-react';

export default function CommercialView() {
  const pipeline = [
    { stage: "Leads", count: 45, value: "-" },
    { stage: "Qualificados", count: 28, value: "-" },
    { stage: "Proposta", count: 15, value: "R$ 15.2M" },
    { stage: "Negociação", count: 8, value: "R$ 8.5M" },
    { stage: "KYC/Onboarding", count: 5, value: "R$ 4.2M" },
    { stage: "Ativos (Mês)", count: 12, value: "R$ 6.8M" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Pipeline Total (TPV)" value="R$ 34.7M" change={8.5} icon={Target} />
        <KPICard title="Novos Leads" value="45" change={-2} icon={Users} />
        <KPICard title="Propostas Enviadas" value="15" change={12} icon={FileCheck} />
        <KPICard title="Taxa de Conversão" value="18.5%" change={1.2} icon={Briefcase} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Funil de Vendas</CardTitle>
            <CardDescription>Performance do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipeline.map((step, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center justify-between mb-1 z-10 relative">
                    <span className="font-medium text-sm">{step.stage}</span>
                    <span className="text-sm text-slate-500">{step.count} items {step.value !== "-" && `• ${step.value}`}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-lg h-8 relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-100 border-l-4 border-blue-500" 
                      style={{ width: `${100 - (i * 15)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Recentes</CardTitle>
            <CardDescription>Atividades do time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1 bg-green-100 p-1.5 rounded-full h-fit">
                <FileCheck className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Proposta Aceita</p>
                <p className="text-xs text-slate-500">Merchant "Tech Solutions" aceitou a proposta.</p>
                <span className="text-[10px] text-slate-400">Há 2 horas • Victor Vendedor</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1 bg-blue-100 p-1.5 rounded-full h-fit">
                <Phone className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Reunião Agendada</p>
                <p className="text-xs text-slate-500">Demo com "Grupo ABC".</p>
                <span className="text-[10px] text-slate-400">Há 4 horas • Ana Sales</span>
              </div>
            </div>

            <Button variant="ghost" className="w-full mt-2 text-xs">
              Ver todas atividades
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}