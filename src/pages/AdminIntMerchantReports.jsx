import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3, TrendingUp, AlertTriangle, DollarSign, FileSpreadsheet,
  Download, Clock, User
} from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

const AVAILABLE_REPORTS = [
  {
    id: 'base',
    icon: BarChart3,
    title: 'Base de Merchants',
    description: 'Visão geral da base de clientes: quantidade, status, segmentos',
    color: 'blue'
  },
  {
    id: 'performance',
    icon: TrendingUp,
    title: 'Performance por Merchant',
    description: 'TPV, transações, receita e margem por merchant',
    color: 'green'
  },
  {
    id: 'growth',
    icon: TrendingUp,
    title: 'Crescimento e Churn',
    description: 'Novos merchants, cancelamentos, taxa de retenção',
    color: 'purple'
  },
  {
    id: 'risk',
    icon: AlertTriangle,
    title: 'Merchants em Risco',
    description: 'CB Ratio, MED Ratio, merchants bloqueados/suspensos',
    color: 'red'
  },
  {
    id: 'financial',
    icon: DollarSign,
    title: 'Financeiro por Merchant',
    description: 'Saldos, saques, liquidações por merchant',
    color: 'emerald'
  },
  {
    id: 'custom',
    icon: FileSpreadsheet,
    title: 'Relatório Customizado',
    description: 'Crie um relatório com os campos e filtros desejados',
    color: 'slate'
  }
];

const recentReports = [
  { id: 1, name: 'Performance Jan/2026', generatedAt: '28/01/2026 14:30', generatedBy: 'Maria Santos', size: '2.3 MB' },
  { id: 2, name: 'Base de Merchants', generatedAt: '27/01/2026 09:15', generatedBy: 'João Silva', size: '890 KB' },
  { id: 3, name: 'Merchants em Risco', generatedAt: '25/01/2026 16:45', generatedBy: 'Ana Costa', size: '456 KB' },
  { id: 4, name: 'Crescimento Dez/2025', generatedAt: '02/01/2026 10:00', generatedBy: 'Maria Santos', size: '1.1 MB' }
];

export default function AdminIntMerchantReports() {
  const [generating, setGenerating] = useState(null);

  const handleGenerateReport = (reportId) => {
    setGenerating(reportId);
    setTimeout(() => {
      setGenerating(null);
      // Would trigger download here
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Relatórios de Merchants"
        subtitle="Central de relatórios e análises"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Merchants', page: 'AdminIntMerchantsList' },
          { label: 'Relatórios', page: 'AdminIntMerchantReports' }
        ]}
      />

      {/* Available Reports */}
      <div>
        <h2 className="text-lg font-semibold mb-4">📋 Relatórios Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_REPORTS.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`w-10 h-10 rounded-lg bg-${report.color}-100 flex items-center justify-center mb-3`}>
                  <report.icon className={`w-5 h-5 text-${report.color}-600`} />
                </div>
                <CardTitle className="text-base">{report.title}</CardTitle>
                <CardDescription className="text-sm">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full gap-2"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={generating === report.id}
                >
                  {generating === report.id ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" /> Gerando...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" /> Gerar Relatório
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <h2 className="text-lg font-semibold mb-4">🕐 Relatórios Recentes</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Relatório</TableHead>
                  <TableHead>Gerado em</TableHead>
                  <TableHead>Por</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell className="text-slate-600">{report.generatedAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{report.generatedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">{report.size}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="w-4 h-4" /> Baixar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}