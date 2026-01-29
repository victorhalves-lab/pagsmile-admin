import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, Calendar as CalendarIcon, Download,
  LayoutDashboard, Activity, Wallet, TrendingUp, ShieldAlert, 
  CreditCard, QrCode, FileText, Server, Bell, Sparkles, Settings
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// V3 Views
import ExecutiveView from '@/components/admin-interno/dashboard/v3/ExecutiveView';
import OperationalView from '@/components/admin-interno/dashboard/v3/OperationalView';
import FinancialView from '@/components/admin-interno/dashboard/v3/FinancialView';
import PLView from '@/components/admin-interno/dashboard/v3/PLView';
import RiskView from '@/components/admin-interno/dashboard/v3/RiskView';
import CardView from '@/components/admin-interno/dashboard/v3/CardView';
import PixView from '@/components/admin-interno/dashboard/v3/PixView';
import BoletoView from '@/components/admin-interno/dashboard/v3/BoletoView';
import TechnicalView from '@/components/admin-interno/dashboard/v3/TechnicalView';
import AlertsView from '@/components/admin-interno/dashboard/v3/AlertsView';

export default function AdminIntDashboard() {
  const [activeTab, setActiveTab] = useState('executiva');
  const [period, setPeriod] = useState('today');
  const [compareWith, setCompareWith] = useState('previous');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [nextRefresh, setNextRefresh] = useState(30);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNextRefresh(prev => {
        if (prev <= 1) {
          setLastUpdate(new Date());
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdate(new Date());
    setNextRefresh(30);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const alertCount = 3; // Mock - would come from real data

  return (
    <div className="space-y-6 pb-20 bg-[var(--color-bg-page)] min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <PageHeader 
            title="Dashboard Operacional"
            subtitle="Visão consolidada de todos os métodos de pagamento"
            breadcrumbs={[
              { label: "Admin Interno", page: "AdminIntDashboard" },
              { label: "Dashboard", page: "AdminIntDashboard" }
            ]}
          />
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</span>
            <span>•</span>
            <span>Próxima em {nextRefresh}s</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period Selector */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="last7">Últimos 7 dias</SelectItem>
              <SelectItem value="last30">Últimos 30 dias</SelectItem>
              <SelectItem value="thisMonth">Este Mês</SelectItem>
              <SelectItem value="lastMonth">Mês Passado</SelectItem>
              <SelectItem value="thisYear">Este Ano</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          {/* Compare With */}
          <Select value={compareWith} onValueChange={setCompareWith}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Comparar com" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Período Anterior</SelectItem>
              <SelectItem value="lastYear">Mesmo Período Ano Anterior</SelectItem>
              <SelectItem value="meta">Meta</SelectItem>
              <SelectItem value="none">Não comparar</SelectItem>
            </SelectContent>
          </Select>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Exportar PDF</DropdownMenuItem>
              <DropdownMenuItem>Exportar Excel</DropdownMenuItem>
              <DropdownMenuItem>Exportar CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>

          {/* Settings */}
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* DIA Insights Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">DIA Insights</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              ⚠️ 3 merchants com CB Ratio acima de 0.7% • 📈 TPV 15% acima da média • 🔔 12 KYCs pendentes • 💰 R$ 890k em saques pendentes
            </p>
          </div>
        </div>
        <Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
          Ver detalhes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {/* Visões Consolidadas */}
          <TabsTrigger value="executiva" className="gap-2 py-2.5 px-4">
            <LayoutDashboard className="w-4 h-4" /> Executiva
          </TabsTrigger>
          <TabsTrigger value="operacional" className="gap-2 py-2.5 px-4">
            <Activity className="w-4 h-4" /> Operacional
          </TabsTrigger>
          <TabsTrigger value="financeira" className="gap-2 py-2.5 px-4">
            <Wallet className="w-4 h-4" /> Financeira
          </TabsTrigger>
          <TabsTrigger value="pl" className="gap-2 py-2.5 px-4">
            <TrendingUp className="w-4 h-4" /> P&L
          </TabsTrigger>
          <TabsTrigger value="risco" className="gap-2 py-2.5 px-4">
            <ShieldAlert className="w-4 h-4" /> Risco
          </TabsTrigger>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />

          {/* Visões por Método */}
          <TabsTrigger value="cartao" className="gap-2 py-2.5 px-4">
            <CreditCard className="w-4 h-4 text-blue-500" /> Cartão
          </TabsTrigger>
          <TabsTrigger value="pix" className="gap-2 py-2.5 px-4">
            <QrCode className="w-4 h-4 text-green-500" /> PIX
          </TabsTrigger>
          <TabsTrigger value="boleto" className="gap-2 py-2.5 px-4">
            <FileText className="w-4 h-4 text-amber-500" /> Boleto
          </TabsTrigger>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />

          {/* Técnico e Alertas */}
          <TabsTrigger value="tecnico" className="gap-2 py-2.5 px-4">
            <Server className="w-4 h-4" /> Técnico
          </TabsTrigger>
          <TabsTrigger value="alertas" className="gap-2 py-2.5 px-4 relative">
            <Bell className="w-4 h-4" /> Alertas
            {alertCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {alertCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="executiva" className="animate-in fade-in-50 duration-300">
          <ExecutiveView />
        </TabsContent>

        <TabsContent value="operacional" className="animate-in fade-in-50 duration-300">
          <OperationalView />
        </TabsContent>
        
        <TabsContent value="financeira" className="animate-in fade-in-50 duration-300">
          <FinancialView />
        </TabsContent>

        <TabsContent value="pl" className="animate-in fade-in-50 duration-300">
          <PLView />
        </TabsContent>

        <TabsContent value="risco" className="animate-in fade-in-50 duration-300">
          <RiskView />
        </TabsContent>

        <TabsContent value="cartao" className="animate-in fade-in-50 duration-300">
          <CardView />
        </TabsContent>

        <TabsContent value="pix" className="animate-in fade-in-50 duration-300">
          <PixView />
        </TabsContent>

        <TabsContent value="boleto" className="animate-in fade-in-50 duration-300">
          <BoletoView />
        </TabsContent>

        <TabsContent value="tecnico" className="animate-in fade-in-50 duration-300">
          <TechnicalView />
        </TabsContent>

        <TabsContent value="alertas" className="animate-in fade-in-50 duration-300">
          <AlertsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}