import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { 
  Search, Filter, Eye, Bot, Plus, UserPlus, FileText, 
  MoreVertical, CheckCircle2, XCircle, Clock, ArrowUpRight
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

export default function AdminIntQuestionnaires() {
  const [activeTab, setActiveTab] = useState('full');
  
  // Mock data para questionários
  const questionnaires = [
    { id: 1, company: 'Tech Solutions', cnpj: '12.345.678/0001-90', tpv: 'R$ 500k', date: '2026-01-27', status: 'new', score: 78, type: 'full' },
    { id: 2, company: 'E-commerce ABC', cnpj: '98.765.432/0001-99', tpv: 'R$ 1.2M', date: '2026-01-26', status: 'analysis', score: 85, type: 'full' },
    { id: 3, company: 'Loja Rápida', cnpj: '11.222.333/0001-00', tpv: 'N/A', date: '2026-01-25', status: 'new', score: 0, type: 'simplified' },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'new': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Novo</Badge>;
      case 'analysis': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Em Análise</Badge>;
      case 'processed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Processado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 font-bold';
    if (score >= 50) return 'text-yellow-600 font-medium';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Questionários Recebidos"
        subtitle="Gerenciamento de leads de entrada"
        breadcrumbs={[
          { label: 'Comercial', page: 'AdminIntComercial' },
          { label: 'Questionários', page: '#' }
        ]}
      />

      <Tabs defaultValue="full" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="full" className="gap-2">
              <FileText className="w-4 h-4" /> Completos (45)
            </TabsTrigger>
            <TabsTrigger value="simplified" className="gap-2">
              <Clock className="w-4 h-4" /> Simplificados (23)
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Buscar por empresa, CNPJ..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="full">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>TPV Est.</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionnaires.filter(q => q.type === 'full').map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{q.company}</TableCell>
                      <TableCell>{q.cnpj}</TableCell>
                      <TableCell>{q.tpv}</TableCell>
                      <TableCell>{format(new Date(q.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(q.status)}</TableCell>
                      <TableCell className={getScoreColor(q.score)}>{q.score}/100</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Ver Detalhes">
                            <Eye className="w-4 h-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Analisar com PRISCILA">
                            <Bot className="w-4 h-4 text-purple-600" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Criar Lead">
                            <UserPlus className="w-4 h-4 text-blue-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simplified">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionnaires.filter(q => q.type === 'simplified').map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{q.company}</TableCell>
                      <TableCell>{format(new Date(q.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(q.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Ver Detalhes">
                            <Eye className="w-4 h-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Gerar Proposta Rápida">
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}