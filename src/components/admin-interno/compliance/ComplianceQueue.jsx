import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search, Eye, Clock, AlertTriangle, CheckCircle2, XCircle,
  MoreHorizontal, Download, Mail, User, Building2, Brain, Play,
} from 'lucide-react';
import { mockOnboardingCases } from '@/components/admin-interno/compliance/onboarding/mocks/onboardingComplianceMock';

const statusConfig = {
  Pendente: { label: 'Pendente', color: 'bg-slate-100 text-slate-700', icon: Clock },
  'Em Análise': { label: 'Analisando (Helena)', color: 'bg-blue-100 text-blue-700', icon: Brain },
  Aprovado: { label: 'Aprovado', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  Recusado: { label: 'Reprovado', color: 'bg-red-100 text-red-700', icon: XCircle },
  Manual: { label: 'Análise Manual', color: 'bg-amber-100 text-amber-700', icon: User },
  'Docs Solicitados': { label: 'Docs Solicitados', color: 'bg-purple-100 text-purple-700', icon: AlertTriangle },
};

export default function ComplianceQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);

  const queueData = mockOnboardingCases;

  const filteredData = useMemo(() => {
    return queueData.filter((item) => {
      const matchesSearch =
        item.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cnpj?.includes(searchTerm) ||
        item.case_id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [queueData, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const now = Date.now();
    return {
      pending: queueData.filter((q) => q.status === 'Pendente').length,
      analyzing: queueData.filter((q) => q.status === 'Em Análise').length,
      manual: queueData.filter((q) => q.status === 'Manual').length,
      docs: queueData.filter((q) => q.status === 'Docs Solicitados').length,
      over24h: queueData.filter((q) => {
        if (q.status === 'Aprovado' || q.status === 'Recusado') return false;
        return (now - new Date(q.updated_date).getTime()) / 3600000 > 24;
      }).length,
    };
  }, [queueData]);

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) setSelectedItems([]);
    else setSelectedItems(filteredData.map((i) => i.id));
  };

  const toggleSelectItem = (id) =>
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const getStatusBadge = (status) => {
    const cfg = statusConfig[status] || statusConfig.Pendente;
    const Icon = cfg.icon;
    return (
      <Badge className={`${cfg.color} gap-1 border-0`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </Badge>
    );
  };

  const getScoreColor = (score) => {
    if (score == null) return 'text-slate-400';
    if (score >= 80) return 'text-emerald-600 font-bold';
    if (score >= 60) return 'text-amber-600 font-medium';
    return 'text-red-600 font-bold';
  };

  const timeInQueueHours = (item) => {
    return Math.round((Date.now() - new Date(item.created_date).getTime()) / 3600000);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Pendentes', value: stats.pending, color: 'slate' },
          { label: 'Analisando', value: stats.analyzing, color: 'blue' },
          { label: 'Manual Review', value: stats.manual, color: 'amber' },
          { label: 'Docs Pendentes', value: stats.docs, color: 'purple' },
          { label: '> 24h na Fila', value: stats.over24h, color: 'red' },
        ].map((s, i) => (
          <Card key={i} className={`bg-${s.color}-50 dark:bg-${s.color}-900/20`}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por empresa, CNPJ ou case ID..."
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
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Análise">Analisando</SelectItem>
                  <SelectItem value="Manual">Análise Manual</SelectItem>
                  <SelectItem value="Docs Solicitados">Docs Solicitados</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Recusado">Recusado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {selectedItems.length > 0 && (
                <>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-4 h-4" /> Lembretes ({selectedItems.length})
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
                <TableHead>Caso / Empresa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score Helena</TableHead>
                <TableHead>Decisão IA</TableHead>
                <TableHead>Tempo na Fila</TableHead>
                <TableHead>Analista</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const t = timeInQueueHours(item);
                return (
                  <TableRow key={item.id} className={t > 24 && !['Aprovado', 'Recusado'].includes(item.status) ? 'bg-red-50/50 dark:bg-red-900/10' : ''}>
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
                          <p className="font-medium text-slate-900 dark:text-white">{item.merchantName}</p>
                          <p className="text-xs text-slate-500 font-mono">{item.case_id} • {item.cnpj}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.merchantType}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <span className={getScoreColor(item.helenaScore)}>
                        {item.helenaScore != null ? Math.round(item.helenaScore) : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {item.iaDecision || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className={`w-4 h-4 ${t > 24 ? 'text-red-500' : 'text-slate-400'}`} />
                        <span className={t > 24 ? 'text-red-600 font-medium' : ''}>{t}h</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.assignedAnalyst ? (
                        <span className="text-sm text-slate-600">{item.assignedAnalyst}</span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Não atribuído</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {item.status === 'Pendente' && (
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}