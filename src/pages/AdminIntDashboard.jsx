import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, Calendar as CalendarIcon, 
  LayoutDashboard, Activity, Wallet, ShieldAlert, Briefcase, Server, Sparkles
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

// Views
import ExecutiveView from '@/components/admin-interno/dashboard/ExecutiveView';
import OperationalView from '@/components/admin-interno/dashboard/OperationalView';
import FinancialView from '@/components/admin-interno/dashboard/FinancialView';
import RiskView from '@/components/admin-interno/dashboard/RiskView';
import CommercialView from '@/components/admin-interno/dashboard/CommercialView';
import TechnicalView from '@/components/admin-interno/dashboard/TechnicalView';

export default function AdminIntDashboard() {
  const [activeTab, setActiveTab] = useState('operational');
  const [period, setPeriod] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Dashboard Operacional"
          subtitle="Visão Geral do Negócio"
          breadcrumbs={[
              { label: "Admin Interno", page: "AdminIntDashboard" },
              { label: "Dashboard", page: "AdminIntDashboard" }
          ]}
        />
        
        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="last7">Últimos 7 dias</SelectItem>
              <SelectItem value="last30">Últimos 30 dias</SelectItem>
              <SelectItem value="thisMonth">Este Mês</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            className={isRefreshing ? "animate-spin" : ""}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* DIA Insights Banner (Simplified for Dashboard top) */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">DIA Insights</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              ⚠️ 3 merchants com ratio acima de 0.7% • 📈 TPV 15% acima da média • 🔔 12 KYCs pendentes
            </p>
          </div>
        </div>
        <Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
          Ver detalhes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-1">
          <TabsTrigger value="executive" className="gap-2 py-2">
            <LayoutDashboard className="w-4 h-4" /> Executivo
          </TabsTrigger>
          <TabsTrigger value="operational" className="gap-2 py-2">
            <Activity className="w-4 h-4" /> Operacional
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-2 py-2">
            <Wallet className="w-4 h-4" /> Financeiro
          </TabsTrigger>
          <TabsTrigger value="risk" className="gap-2 py-2">
            <ShieldAlert className="w-4 h-4" /> Risco
          </TabsTrigger>
          <TabsTrigger value="commercial" className="gap-2 py-2">
            <Briefcase className="w-4 h-4" /> Comercial
          </TabsTrigger>
          <TabsTrigger value="technical" className="gap-2 py-2">
            <Server className="w-4 h-4" /> Técnico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="animate-in fade-in-50 duration-300">
          <ExecutiveView />
        </TabsContent>

        <TabsContent value="operational" className="animate-in fade-in-50 duration-300">
          <OperationalView />
        </TabsContent>
        
        <TabsContent value="financial" className="animate-in fade-in-50 duration-300">
          <FinancialView />
        </TabsContent>

        <TabsContent value="risk" className="animate-in fade-in-50 duration-300">
          <RiskView />
        </TabsContent>

        <TabsContent value="commercial" className="animate-in fade-in-50 duration-300">
          <CommercialView />
        </TabsContent>

        <TabsContent value="technical" className="animate-in fade-in-50 duration-300">
          <TechnicalView />
        </TabsContent>
      </Tabs>
    </div>
  );
}