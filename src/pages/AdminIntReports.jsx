import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, Download, Clock, CheckCircle2, Calendar, Filter,
  BarChart3, PieChart, TrendingUp, DollarSign, CreditCard, QrCode,
  Users, Shield, Building2, RefreshCw, Eye, Trash2, Star, Plus,
  FileSpreadsheet, File, ChevronRight, Zap, History
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ReportCard = ({ icon: Icon, title, description, tags, color, onClick, favorite }) => (
  <Card 
    className={cn(
      "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-[#2bc196]/30 transition-all cursor-pointer group",
      "relative overflow-hidden"
    )}
    onClick={onClick}
  >
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <div className={cn("p-2.5 rounded-xl", `bg-${color}-50 dark:bg-${color}-900/20`)}>
          <Icon className={cn("w-5 h-5", `text-${color}-600 dark:text-${color}-400`)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-[#2bc196] transition-colors">
              {title}
            </h3>
            {favorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </CardContent>
  </Card>
);

const RecentReportRow = ({ report }) => {
  const statusConfig = {
    completed: { icon: CheckCircle2, label: 'Concluído', color: 'text-emerald-600 bg-emerald-50' },
    processing: { icon: RefreshCw, label: 'Gerando', color: 'text-blue-600 bg-blue-50', spin: true },
    failed: { icon: Shield, label: 'Erro', color: 'text-red-600 bg-red-50' },
  };
  const status = statusConfig[report.status] || statusConfig.completed;
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
        <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{report.name}</p>
        <p className="text-[10px] text-slate-500">{report.date} • {report.user}</p>
      </div>
      <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", status.color)}>
        <StatusIcon className={cn("w-3 h-3", status.spin && "animate-spin")} />
        {status.label}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Eye className="w-4 h-4 text-slate-500" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Download className="w-4 h-4 text-slate-500" />
        </Button>
      </div>
    </div>
  );
};

export default function AdminIntReports() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reportCategories = [
    { id: 'all', label: 'Todos', icon: FileText },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'transactions', label: 'Transações', icon: CreditCard },
    { id: 'risk', label: 'Risco', icon: Shield },
    { id: 'merchants', label: 'Merchants', icon: Building2 },
  ];

  const reports = [
    { id: 1, icon: BarChart3, title: 'Relatório de TPV', description: 'Volume total processado por período, método e merchant', tags: ['TPV', 'Volume', 'Diário'], color: 'blue', category: 'financial', favorite: true },
    { id: 2, icon: TrendingUp, title: 'Análise de Aprovação', description: 'Taxa de aprovação por bandeira, emissor e segmento', tags: ['Aprovação', 'Bandeiras', 'Performance'], color: 'emerald', category: 'transactions', favorite: true },
    { id: 3, icon: PieChart, title: 'Mix de Pagamentos', description: 'Distribuição entre cartão, PIX e boleto', tags: ['Mix', 'Métodos', 'Comparativo'], color: 'purple', category: 'financial' },
    { id: 4, icon: Shield, title: 'Relatório de Chargebacks', description: 'Análise detalhada de disputas e contestações', tags: ['Chargeback', 'Disputas', 'Risco'], color: 'red', category: 'risk', favorite: true },
    { id: 5, icon: QrCode, title: 'Performance PIX', description: 'Métricas de conversão e tempo de confirmação PIX', tags: ['PIX', 'Conversão', 'Tempo'], color: 'teal', category: 'transactions' },
    { id: 6, icon: CreditCard, title: 'Análise de Recusas', description: 'Motivos de recusa por BIN, emissor e merchant', tags: ['Recusas', 'BIN', 'Análise'], color: 'amber', category: 'transactions' },
    { id: 7, icon: Users, title: 'Ranking de Merchants', description: 'Top merchants por volume, aprovação e receita', tags: ['Ranking', 'Merchants', 'Top'], color: 'indigo', category: 'merchants' },
    { id: 8, icon: DollarSign, title: 'Receita e MDR', description: 'Receita gerada, MDR médio e breakdown por produto', tags: ['Receita', 'MDR', 'Financeiro'], color: 'emerald', category: 'financial' },
    { id: 9, icon: Building2, title: 'Novos Merchants', description: 'Onboarding, ativação e primeiras transações', tags: ['Onboarding', 'Ativação', 'Novos'], color: 'blue', category: 'merchants' },
    { id: 10, icon: Shield, title: 'Score de Risco', description: 'Evolução do score de risco por merchant', tags: ['Risco', 'Score', 'Monitoramento'], color: 'red', category: 'risk' },
  ];

  const recentReports = [
    { id: 1, name: 'TPV Consolidado - Janeiro 2026', date: '28/01/2026 14:32', user: 'admin@pagsmile.com', status: 'completed' },
    { id: 2, name: 'Análise de Recusas - Semana 4', date: '28/01/2026 10:15', user: 'ops@pagsmile.com', status: 'completed' },
    { id: 3, name: 'Chargebacks - Merchant TechStore', date: '27/01/2026 16:45', user: 'risk@pagsmile.com', status: 'processing' },
    { id: 4, name: 'Performance PIX - Últimos 30 dias', date: '27/01/2026 09:20', user: 'admin@pagsmile.com', status: 'completed' },
  ];

  const filteredReports = reports.filter(r => {
    const matchCategory = activeTab === 'all' || r.category === activeTab;
    const matchSearch = !searchTerm || 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader 
        title="Central de Relatórios"
        subtitle="Geração e exportação de relatórios personalizados"
        breadcrumbs={[{ label: 'Relatórios' }]}
        actions={
          <Button className="gap-1.5 bg-[#2bc196] hover:bg-[#239b7a]">
            <Plus className="w-4 h-4" /> Novo Relatório
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Relatórios Gerados</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">1,245</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Este Mês</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">87</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Star className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Favoritos</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Agendados</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {reportCategories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="rounded-lg gap-1.5 text-xs">
                <cat.icon className="w-3.5 h-3.5" /> {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar relatório..."
              className="pl-9 w-[200px] bg-slate-50 dark:bg-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid de Relatórios */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          Relatórios Disponíveis
          <Badge variant="outline" className="text-[10px]">{filteredReports.length}</Badge>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredReports.map(report => (
            <ReportCard
              key={report.id}
              icon={report.icon}
              title={report.title}
              description={report.description}
              tags={report.tags}
              color={report.color}
              favorite={report.favorite}
            />
          ))}
        </div>
      </div>

      {/* Relatórios Recentes */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              Relatórios Gerados Recentemente
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              Ver Histórico Completo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {recentReports.map(report => (
              <RecentReportRow key={report.id} report={report} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formatos de Exportação */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Formatos de Exportação</h3>
              <p className="text-xs text-slate-500 mt-0.5">Exporte relatórios em diversos formatos</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Excel</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <File className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">PDF</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">CSV</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}