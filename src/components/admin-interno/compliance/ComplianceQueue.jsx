import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Search, Filter, Eye, Clock, AlertTriangle, CheckCircle2, XCircle,
  MoreHorizontal, Download, Mail, User, Building2, Brain, Play
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data para fila de compliance
const mockQueueData = [
  { 
    id: 'sub_001', 
    business_name: 'Tech Solutions Ltda', 
    document: '12.345.678/0001-90',
    type: 'kyb_enterprise',
    status: 'pending',
    helena_score: null,
    created_date: '2026-01-28T10:30:00',
    time_in_queue: 2,
    source: 'commercial',
    analyst: null
  },
  { 
    id: 'sub_002', 
    business_name: 'E-commerce ABC', 
    document: '98.765.432/0001-99',
    type: 'kyc_full',
    status: 'ai_analyzing',
    helena_score: null,
    created_date: '2026-01-28T09:15:00',
    time_in_queue: 3,
    source: 'self_service',
    analyst: null
  },
  { 
    id: 'sub_003', 
    business_name: 'Loja Rápida ME', 
    document: '11.222.333/0001-50',
    type: 'kyc_pix',
    status: 'manual_review',
    helena_score: 58,
    helena_status: 'manual_review',
    created_date: '2026-01-27T14:00:00',
    time_in_queue: 24,
    source: 'self_service',
    analyst: 'maria@pagsmile.com'
  },
  { 
    id: 'sub_004', 
    business_name: 'Café Gourmet SA', 
    document: '44.555.666/0001-22',
    type: 'kyc_full',
    status: 'documents_requested',
    helena_score: 72,
    helena_status: 'manual_review',
    created_date: '2026-01-26T11:00:00',
    time_in_queue: 48,
    source: 'commercial',
    analyst: 'joao@pagsmile.com'
  },
  { 
    id: 'sub_005', 
    business_name: 'Digital Services', 
    document: '77.888.999/0001-33',
    type: 'kyb_enterprise',
    status: 'pending',
    helena_score: null,
    created_date: '2026-01-28T08:00:00',
    time_in_queue: 4,
    source: 'form_link',
    analyst: null
  },
];

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-slate-100 text-slate-700', icon: Clock },
  ai_analyzing: { label: 'Analisando (Helena)', color: 'bg-blue-100 text-blue-700', icon: Brain },
  ai_approved: { label: 'Aprovado (Helena)', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  ai_rejected: { label: 'Reprovado (Helena)', color: 'bg-red-100 text-red-700', icon: XCircle },
  manual_review: { label: 'Análise Manual', color: 'bg-amber-100 text-amber-700', icon: User },
  documents_requested: { label: 'Docs Solicitados', color: 'bg-purple-100 text-purple-700', icon: AlertTriangle },
  approved: { label: 'Aprovado', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  rejected: { label: 'Reprovado', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const typeLabels = {
  kyc_full: 'KYC Completo',
  kyc_pix: 'KYC Pix',
  kyc_card: 'KYC Cartão',
  kyb_enterprise: 'KYB Empresa',
};

const sourceLabels = {
  commercial: 'Comercial',
  self_service: 'Self-Service',
  form_link: 'Link Externo',
};

export default function ComplianceQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);

  // Usando mock data - em produção usaria a query real
  const queueData = mockQueueData;
  const isLoading = false;

  const filteredData = queueData.filter(item => {
    const matchesSearch = 
      item.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.document?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getScoreColor = (score) => {
    if (!score) return 'text-slate-400';
    if (score >= 80) return 'text-emerald-600 font-bold';
    if (score >= 60) return 'text-amber-600 font-medium';
    return 'text-red-600 font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-50 dark:bg-slate-800/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {queueData.filter(q => q.status === 'pending').length}
              </p>
              <p className="text-xs text-slate-500">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {queueData.filter(q => q.status === 'ai_analyzing').length}
              </p>
              <p className="text-xs text-slate-500">Analisando</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {queueData.filter(q => q.status === 'manual_review').length}
              </p>
              <p className="text-xs text-slate-500">Manual Review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {queueData.filter(q => q.status === 'documents_requested').length}
              </p>
              <p className="text-xs text-slate-500">Docs Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {queueData.filter(q => q.time_in_queue > 24).length}
              </p>
              <p className="text-xs text-slate-500">&gt; 24h na Fila</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por empresa ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="ai_analyzing">Analisando</SelectItem>
                  <SelectItem value="manual_review">Análise Manual</SelectItem>
                  <SelectItem value="documents_requested">Docs Solicitados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {selectedItems.length > 0 && (
                <>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-4 h-4" /> Enviar Lembretes ({selectedItems.length})
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" /> Atribuir Analista
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score Helena</TableHead>
                <TableHead>Tempo na Fila</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Analista</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className={item.time_in_queue > 24 ? 'bg-red-50/50 dark:bg-red-900/10' : ''}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.business_name}</p>
                        <p className="text-xs text-slate-500">{item.document}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {typeLabels[item.type] || item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <span className={getScoreColor(item.helena_score)}>
                      {item.helena_score || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${item.time_in_queue > 24 ? 'text-red-500' : 'text-slate-400'}`} />
                      <span className={item.time_in_queue > 24 ? 'text-red-600 font-medium' : ''}>
                        {item.time_in_queue}h
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {sourceLabels[item.source] || item.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.analyst ? (
                      <span className="text-sm text-slate-600">{item.analyst.split('@')[0]}</span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Não atribuído</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {item.status === 'pending' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Atribuir Analista</DropdownMenuItem>
                          <DropdownMenuItem>Solicitar Documentos</DropdownMenuItem>
                          <DropdownMenuItem>Enviar Lembrete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}