import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Upload,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Calendar,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import SideDrawer from '@/components/common/SideDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import KPICard from '@/components/dashboard/KPICard';

export default function Disputes() {
  const [selectedDispute, setSelectedDispute] = useState(null);

  const { data: disputes = [], isLoading, refetch } = useQuery({
    queryKey: ['disputes'],
    queryFn: () => base44.entities.Dispute.list('-created_date', 50),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate metrics
  const openDisputes = disputes.filter(d => d.status === 'open' || d.status === 'under_review');
  const totalOpenAmount = openDisputes.reduce((sum, d) => sum + (d.amount || 0), 0);
  const wonDisputes = disputes.filter(d => d.status === 'won');
  const lostDisputes = disputes.filter(d => d.status === 'lost');
  const winRate = (wonDisputes.length + lostDisputes.length) > 0 
    ? (wonDisputes.length / (wonDisputes.length + lostDisputes.length)) * 100 
    : 0;
  
  // Mock chargeback ratio (in real app, calculate from transactions)
  const chargebackRatio = 0.45;

  const columns = [
    {
      key: 'dispute_id',
      label: 'ID',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            row.type === 'chargeback' ? 'bg-red-100' : 'bg-yellow-100'
          )}>
            {row.type === 'chargeback' ? (
              <ShieldAlert className="w-5 h-5 text-red-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500 capitalize">{row.type?.replace('_', ' ')}</p>
          </div>
        </div>
      )
    },
    {
      key: 'customer_name',
      label: 'Cliente',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{value || 'N/A'}</p>
          <p className="text-xs text-gray-500">{row.transaction_id}</p>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'reason_description',
      label: 'Motivo',
      render: (value, row) => (
        <div>
          <p className="text-sm text-gray-900">{value || 'Não especificado'}</p>
          <p className="text-xs text-gray-500">Código: {row.reason_code}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'deadline_date',
      label: 'Prazo',
      render: (value) => {
        if (!value) return 'N/A';
        const deadline = new Date(value);
        const today = new Date();
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        return (
          <div>
            <p className="text-sm text-gray-900">
              {format(deadline, 'dd/MM/yyyy', { locale: ptBR })}
            </p>
            <p className={cn(
              "text-xs",
              daysLeft <= 3 ? 'text-red-500 font-medium' : daysLeft <= 7 ? 'text-yellow-600' : 'text-gray-500'
            )}>
              {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo expirado'}
            </p>
          </div>
        );
      }
    },
    {
      key: 'win_probability',
      label: 'Prob. Vitória',
      render: (value) => {
        const prob = value || Math.random() * 100;
        return (
          <div className="flex items-center gap-2">
            <Progress value={prob} className="w-16 h-2" />
            <span className={cn(
              "text-sm font-medium",
              prob >= 70 ? 'text-emerald-600' : prob >= 40 ? 'text-yellow-600' : 'text-red-600'
            )}>
              {prob.toFixed(0)}%
            </span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setSelectedDispute(row)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" />
                Enviar Evidências
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="w-4 h-4 mr-2" />
                Adicionar Nota
              </DropdownMenuItem>
              <DropdownMenuItem>Aceitar Disputa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Disputas e Chargebacks"
        subtitle="Gerencie suas disputas e contestações"
        breadcrumbs={[
          { label: 'Disputas', page: 'Disputes' }
        ]}
        actions={
          <Button className="bg-[#00D26A] hover:bg-[#00A854]">
            <Sparkles className="w-4 h-4 mr-2" />
            Dispute Manager AI
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Disputas Abertas"
          value={openDisputes.length}
          format="number"
          icon={ShieldAlert}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
        <KPICard
          title="Valor em Disputa"
          value={totalOpenAmount}
          format="currency"
          icon={AlertTriangle}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <KPICard
          title="Win Rate"
          value={winRate}
          format="percentage"
          change={5.2}
          icon={TrendingUp}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Chargeback Ratio</p>
              <p className="text-2xl font-bold text-gray-900">{chargebackRatio.toFixed(2)}%</p>
            </div>
            <div className={cn(
              "p-2.5 rounded-lg",
              chargebackRatio < 0.5 ? 'bg-emerald-100' : chargebackRatio < 1 ? 'bg-yellow-100' : 'bg-red-100'
            )}>
              <TrendingDown className={cn(
                "w-5 h-5",
                chargebackRatio < 0.5 ? 'text-emerald-600' : chargebackRatio < 1 ? 'text-yellow-600' : 'text-red-600'
              )} />
            </div>
          </div>
          <Progress 
            value={chargebackRatio * 100} 
            className="h-2 mb-2" 
          />
          <p className="text-xs text-gray-500">
            Meta: &lt; 1.0% • {chargebackRatio < 1 ? '✓ Dentro do limite' : '⚠️ Atenção necessária'}
          </p>
        </div>
      </div>

      {/* Compliance Alert */}
      {chargebackRatio >= 0.9 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900">Atenção: Aproximando do limite</h4>
              <p className="text-sm text-yellow-800 mt-1">
                Seu chargeback ratio está se aproximando do limite de 1.0% estabelecido pelas bandeiras. 
                Considere ações preventivas para evitar penalidades.
              </p>
              <Button variant="outline" size="sm" className="mt-3 border-yellow-300 text-yellow-700">
                Ver recomendações
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Todas
            <Badge variant="secondary" className="ml-2">{disputes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="open">
            Abertas
            <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">{openDisputes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            columns={columns}
            data={disputes}
            loading={isLoading}
            searchable
            searchPlaceholder="Buscar por ID, cliente ou transação..."
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={disputes.length}
            onRefresh={refetch}
            emptyMessage="Nenhuma disputa encontrada"
          />
        </TabsContent>

        <TabsContent value="open">
          <DataTable
            columns={columns}
            data={openDisputes}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={openDisputes.length}
            emptyMessage="Nenhuma disputa aberta"
          />
        </TabsContent>

        <TabsContent value="alerts">
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Alertas Ethoca/Verifi</h3>
            <p className="text-gray-500 mb-4">Gerencie alertas preventivos das bandeiras</p>
            <Button variant="outline">Configurar Alertas</Button>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="font-semibold text-gray-900 mb-4">Programa Visa</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">VDMP (Dispute)</span>
                  <Badge className="bg-emerald-100 text-emerald-700">Normal</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">VFMP (Fraud)</span>
                  <Badge className="bg-emerald-100 text-emerald-700">Normal</Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="font-semibold text-gray-900 mb-4">Programa Mastercard</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">ECM (Chargeback)</span>
                  <Badge className="bg-emerald-100 text-emerald-700">Normal</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">EFM (Fraud)</span>
                  <Badge className="bg-emerald-100 text-emerald-700">Normal</Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dispute Detail Side Drawer */}
      <SideDrawer
        open={!!selectedDispute}
        onOpenChange={() => setSelectedDispute(null)}
        title="Detalhes da Disputa"
        description={selectedDispute?.dispute_id}
        icon={ShieldAlert}
        iconClassName="bg-red-100 text-red-600"
        size="lg"
        footer={
          selectedDispute && (
            <div className="flex gap-3">
              <Button className="flex-1 bg-[#00D26A] hover:bg-[#00A854]">
                <Upload className="w-4 h-4 mr-2" />
                Enviar Evidências
              </Button>
              <Button variant="outline" className="flex-1">
                Aceitar Disputa
              </Button>
            </div>
          )
        }
      >
        {selectedDispute && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Valor</p>
                <p className="font-semibold text-lg">{formatCurrency(selectedDispute.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <StatusBadge status={selectedDispute.status} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-medium capitalize">{selectedDispute.type?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bandeira</p>
                <p className="font-medium capitalize">{selectedDispute.card_brand || 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Motivo</p>
              <p className="text-gray-900">{selectedDispute.reason_description || 'Não especificado'}</p>
              <p className="text-sm text-gray-500">Código: {selectedDispute.reason_code}</p>
            </div>

            {selectedDispute.ai_recommendation && (
              <div className="bg-gradient-to-br from-[#00D26A]/10 to-[#00D26A]/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#00D26A]" />
                  <span className="font-medium text-gray-900">Recomendação do AI</span>
                </div>
                <p className="text-sm text-gray-700">{selectedDispute.ai_recommendation}</p>
              </div>
            )}
          </div>
        )}
      </SideDrawer>
    </div>
  );
}