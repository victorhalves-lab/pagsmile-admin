import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
            title={t('admin_interno.dashboard')}
            subtitle={t('admin_interno.subtitle')}
            breadcrumbs={[
              { label: t('modules.admin_interno'), page: "AdminIntDashboard" },
              { label: t('menu.dashboard'), page: "AdminIntDashboard" }
            ]}
          />
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span>{t('dashboard.last_update')}: {lastUpdate.toLocaleTimeString()}</span>
            <span>•</span>
            <span>{t('dashboard.next_in')} {nextRefresh}s</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period Selector */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t('common.period')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{t('common.today')}</SelectItem>
              <SelectItem value="yesterday">{t('common.yesterday')}</SelectItem>
              <SelectItem value="last7">{t('common.last_7_days')}</SelectItem>
              <SelectItem value="last30">{t('common.last_30_days')}</SelectItem>
              <SelectItem value="thisMonth">{t('common.this_month')}</SelectItem>
              <SelectItem value="lastMonth">{t('common.last_month')}</SelectItem>
              <SelectItem value="thisYear">{t('common.this_year')}</SelectItem>
              <SelectItem value="custom">{t('common.custom')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Compare With */}
          <Select value={compareWith} onValueChange={setCompareWith}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('common.compare_with')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">{t('common.previous_period')}</SelectItem>
              <SelectItem value="lastYear">{t('common.same_period_last_year')}</SelectItem>
              <SelectItem value="meta">{t('common.goal')}</SelectItem>
              <SelectItem value="none">{t('common.no_compare')}</SelectItem>
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
              <DropdownMenuItem>{t('common.export_pdf')}</DropdownMenuItem>
              <DropdownMenuItem>{t('common.export_excel')}</DropdownMenuItem>
              <DropdownMenuItem>{t('common.export_csv')}</DropdownMenuItem>
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
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('admin_interno.dia_insights_title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              ⚠️ 3 {t('admin_interno.merchants_high_cb')} • 📈 {t('admin_interno.tpv_above_average')} 15% • 🔔 12 {t('admin_interno.pending_kycs')} • 💰 R$ 890k {t('admin_interno.pending_withdrawals')}
            </p>
          </div>
        </div>
        <Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
          {t('common.see_details')}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {/* Visões Consolidadas */}
          <TabsTrigger value="executiva" className="gap-2 py-2.5 px-4">
            <LayoutDashboard className="w-4 h-4" /> {t('dashboard.views.executive')}
          </TabsTrigger>
          <TabsTrigger value="operacional" className="gap-2 py-2.5 px-4">
            <Activity className="w-4 h-4" /> {t('dashboard.views.operational')}
          </TabsTrigger>
          <TabsTrigger value="financeira" className="gap-2 py-2.5 px-4">
            <Wallet className="w-4 h-4" /> {t('dashboard.views.financial')}
          </TabsTrigger>
          <TabsTrigger value="pl" className="gap-2 py-2.5 px-4">
            <TrendingUp className="w-4 h-4" /> {t('dashboard.views.pl')}
          </TabsTrigger>
          <TabsTrigger value="risco" className="gap-2 py-2.5 px-4">
            <ShieldAlert className="w-4 h-4" /> {t('dashboard.views.risk')}
          </TabsTrigger>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />

          {/* Visões por Método */}
          <TabsTrigger value="cartao" className="gap-2 py-2.5 px-4">
            <CreditCard className="w-4 h-4 text-blue-500" /> {t('dashboard.views.card')}
          </TabsTrigger>
          <TabsTrigger value="pix" className="gap-2 py-2.5 px-4">
            <QrCode className="w-4 h-4 text-green-500" /> {t('dashboard.views.pix')}
          </TabsTrigger>
          <TabsTrigger value="boleto" className="gap-2 py-2.5 px-4">
            <FileText className="w-4 h-4 text-amber-500" /> {t('dashboard.views.boleto')}
          </TabsTrigger>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center" />

          {/* Técnico e Alertas */}
          <TabsTrigger value="tecnico" className="gap-2 py-2.5 px-4">
            <Server className="w-4 h-4" /> {t('dashboard.views.technical')}
          </TabsTrigger>
          <TabsTrigger value="alertas" className="gap-2 py-2.5 px-4 relative">
            <Bell className="w-4 h-4" /> {t('dashboard.views.alerts')}
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