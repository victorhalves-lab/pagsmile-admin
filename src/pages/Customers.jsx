import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  UserPlus,
  Eye,
  MoreHorizontal,
  Mail,
  CreditCard,
  Crown,
  AlertTriangle,
  Filter,
  Download,
  Tag,
  TrendingUp,
  Clock,
  Heart,
  Ban,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import CustomersKpiBar from '@/components/customers/v2/CustomersKpiBar';
import CustomersSearchBar from '@/components/customers/v2/CustomersSearchBar';
import CustomersBulkBar from '@/components/customers/v2/CustomersBulkBar';
import RiskScoreCell from '@/components/customers/v2/RiskScoreCell';
import LastPurchaseCell from '@/components/customers/v2/LastPurchaseCell';
import CustomerHoverCard from '@/components/customers/v2/CustomerHoverCard';
import CustomersAdvancedFilters from '@/components/customers/v2/CustomersAdvancedFilters';
import { toast } from 'sonner';

export default function Customers() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({
    segment: 'all',
    state: 'all',
    paymentMethod: 'all',
    riskRange: 'all',
    minLTV: '',
    maxLTV: '',
    minPurchases: '',
    tag: '',
  });

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('-created_date', 100),
  });

  const segmentConfig = {
    new: { label: 'Novo', color: 'bg-blue-100 text-blue-700', icon: UserPlus },
    recurring: { label: 'Recorrente', color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
    vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700', icon: Crown },
    at_risk: { label: 'Em Risco', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
    inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-700', icon: Clock },
  };

  // Apply filters + search
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (search) {
        const q = search.toLowerCase();
        const matches = [c.name, c.email, c.document, c.phone].some(f => f?.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (filters.segment !== 'all' && c.segment !== filters.segment) return false;
      if (filters.minLTV && (c.total_spent || 0) < parseFloat(filters.minLTV)) return false;
      if (filters.maxLTV && (c.total_spent || 0) > parseFloat(filters.maxLTV)) return false;
      if (filters.minPurchases && (c.total_purchases || 0) < parseInt(filters.minPurchases)) return false;
      if (filters.riskRange !== 'all') {
        const score = c.risk_score || 0;
        if (filters.riskRange === 'low' && score >= 30) return false;
        if (filters.riskRange === 'medium' && (score < 30 || score >= 60)) return false;
        if (filters.riskRange === 'high' && score < 60) return false;
      }
      if (filters.tag && !c.tags?.some(t => t.toLowerCase().includes(filters.tag.toLowerCase()))) return false;
      return true;
    });
  }, [customers, search, filters]);

  // Specialty tabs
  const cardsExpiring = customers.filter(c => 
    c.saved_cards?.some(card => {
      const [m, y] = (card.expiry || '').split('/');
      if (!m || !y) return false;
      const expDate = new Date(`20${y}`, parseInt(m), 0);
      const days = (expDate - new Date()) / (1000 * 60 * 60 * 24);
      return days < 30 && days > 0;
    })
  );
  const recoveryCandidates = customers.filter(c => (c.refunds_count || 0) > 0 || c.segment === 'at_risk');
  const highValueAtRisk = customers.filter(c => (c.total_spent || 0) > 3000 && c.segment === 'at_risk');
  const vipsNoCard = customers.filter(c => c.segment === 'vip' && (!c.saved_cards || c.saved_cards.length === 0));

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = (data) => {
    if (selectedIds.length === data.length) setSelectedIds([]);
    else setSelectedIds(data.map(d => d.id));
  };

  const columns = [
    {
      key: '_select',
      label: '',
      render: (_, row) => (
        <Checkbox
          checked={selectedIds.includes(row.id)}
          onCheckedChange={() => toggleSelect(row.id)}
          onClick={(e) => e.stopPropagation()}
        />
      )
    },
    {
      key: 'name',
      label: 'Cliente',
      render: (value, row) => (
        <CustomerHoverCard customer={row}>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#101F3E] text-white text-xs">
                {value?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CL'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-slate-900 text-sm">{value || 'N/A'}</p>
              <p className="text-xs text-slate-500">{row.email}</p>
            </div>
          </div>
        </CustomerHoverCard>
      )
    },
    {
      key: 'document',
      label: 'Documento',
      render: (value, row) => (
        <div>
          <p className="text-xs text-slate-700 font-mono">{value || 'N/A'}</p>
          <p className="text-[10px] text-slate-500 uppercase">{row.document_type || 'CPF'}</p>
        </div>
      )
    },
    {
      key: 'segment',
      label: 'Segmento',
      render: (value) => {
        const config = segmentConfig[value] || segmentConfig.new;
        const Icon = config.icon;
        return (
          <Badge className={cn('font-medium gap-1', config.color)}>
            <Icon className="w-3 h-3" />
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'risk_score',
      label: 'Risk',
      render: (value) => <RiskScoreCell score={value || 0} />
    },
    {
      key: 'total_purchases',
      label: 'Compras',
      render: (value) => <span className="text-sm font-medium">{value || 0}</span>
    },
    {
      key: 'total_spent',
      label: 'LTV',
      render: (value) => (
        <span className="font-semibold text-emerald-600">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)}
        </span>
      )
    },
    {
      key: 'last_purchase_date',
      label: 'Última Compra',
      render: (value) => <LastPurchaseCell date={value} />
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((t, i) => (
            <Badge key={i} variant="outline" className="text-[10px]">{t}</Badge>
          ))}
          {value?.length > 2 && <Badge variant="outline" className="text-[10px]">+{value.length - 2}</Badge>}
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Link to={createPageUrl(`CustomerDetail?id=${row.id}`)} onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={createPageUrl(`CustomerDetail?id=${row.id}`)}>
                  <Eye className="w-4 h-4 mr-2" /> Ver perfil 360°
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Email enviado')}>
                <Mail className="w-4 h-4 mr-2" /> Enviar e-mail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Tag adicionada')}>
                <Tag className="w-4 h-4 mr-2" /> Adicionar tag
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Promovido a VIP')}>
                <Crown className="w-4 h-4 mr-2" /> Promover a VIP
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Recovery campaign iniciada')}>
                <RefreshCw className="w-4 h-4 mr-2" /> Iniciar Recovery
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => toast.warning('Cliente bloqueado')}>
                <Ban className="w-4 h-4 mr-2" /> Bloquear cliente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title={t('customers.title')}
        subtitle="Customer Intelligence + Engagement"
        breadcrumbs={[{ label: t('customers.title'), page: 'Customers' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Ocultar filtros' : 'Filtros avançados'}
            </Button>
            <Button variant="outline" onClick={() => toast.success('Export iniciado')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => toast.info('Função em breve')}>
              <UserPlus className="w-4 h-4 mr-2" /> Novo Cliente
            </Button>
          </div>
        }
      />

      {/* AI Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-emerald-50 border border-purple-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2bc196] to-emerald-400 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">
            🎯 IA detectou: <span className="text-purple-700">{cardsExpiring.length} clientes com cartão expirando + {highValueAtRisk.length} VIPs em risco</span>
          </p>
          <p className="text-xs text-slate-600">Acionar Account Updater + campanha retention pode evitar ~R$ 28k em churn involuntário</p>
        </div>
        <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
          Ver recomendações
        </Button>
      </div>

      {/* Search bar */}
      <CustomersSearchBar value={search} onChange={setSearch} />

      {/* Advanced Filters */}
      {showFilters && (
        <CustomersAdvancedFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters({ segment: 'all', state: 'all', paymentMethod: 'all', riskRange: 'all', minLTV: '', maxLTV: '', minPurchases: '', tag: '' })}
          onSaveView={() => toast.success('View salva!')}
        />
      )}

      {/* KPI Bar (6 KPIs com period-over-period) */}
      <CustomersKpiBar customers={customers} />

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">
            Todos <Badge variant="secondary" className="ml-2">{customers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="vip">
            VIP <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">{customers.filter(c => c.segment === 'vip').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="at_risk">
            Em Risco <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700">{customers.filter(c => c.segment === 'at_risk').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="new">
            Novos <Badge variant="secondary" className="ml-2">{customers.filter(c => c.segment === 'new').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inativos <Badge variant="secondary" className="ml-2">{customers.filter(c => c.segment === 'inactive').length}</Badge>
          </TabsTrigger>
          {/* New actionable tabs */}
          <TabsTrigger value="cards_expiring" className="data-[state=active]:bg-yellow-100">
            <CreditCard className="w-3 h-3 mr-1" />
            Cartões expirando <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700">{cardsExpiring.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="recovery" className="data-[state=active]:bg-orange-100">
            <RefreshCw className="w-3 h-3 mr-1" />
            Recovery <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">{recoveryCandidates.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="hv_risk" className="data-[state=active]:bg-red-100">
            <Heart className="w-3 h-3 mr-1" />
            VIP em risco <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">{highValueAtRisk.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="vips_no_card" className="data-[state=active]:bg-blue-100">
            VIPs s/ cartão <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">{vipsNoCard.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {[
          { value: 'all', data: filteredCustomers },
          { value: 'vip', data: filteredCustomers.filter(c => c.segment === 'vip') },
          { value: 'at_risk', data: filteredCustomers.filter(c => c.segment === 'at_risk') },
          { value: 'new', data: filteredCustomers.filter(c => c.segment === 'new') },
          { value: 'inactive', data: filteredCustomers.filter(c => c.segment === 'inactive') },
          { value: 'cards_expiring', data: cardsExpiring },
          { value: 'recovery', data: recoveryCandidates },
          { value: 'hv_risk', data: highValueAtRisk },
          { value: 'vips_no_card', data: vipsNoCard },
        ].map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <DataTable
              columns={columns}
              data={tab.data}
              loading={isLoading}
              pagination
              pageSize={25}
              currentPage={1}
              totalItems={tab.data.length}
              emptyMessage="Nenhum cliente encontrado"
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Bulk actions floating bar */}
      <CustomersBulkBar selectedIds={selectedIds} onClear={() => setSelectedIds([])} />
    </div>
  );
}