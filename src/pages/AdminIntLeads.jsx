import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { 
  Search, Filter, Plus, User, MoreVertical, Calendar, DollarSign 
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

export default function AdminIntLeads() {
  const leads = [
    { id: 1, company: 'Tech Solutions', cnpj: '12.345.678/0001-90', tpv: 'R$ 500k', status: 'new', score: 78, owner: 'João S.', lastActivity: 'Há 2 dias' },
    { id: 2, company: 'E-commerce ABC', cnpj: '98.765.432/0001-99', tpv: 'R$ 1.2M', status: 'analysis', score: 85, owner: 'Maria S.', lastActivity: 'Há 5 horas' },
    { id: 3, company: 'Moda Express', cnpj: '11.222.333/0001-50', tpv: 'R$ 320k', status: 'qualified', score: 72, owner: 'Pedro C.', lastActivity: 'Há 1 dia' },
    { id: 4, company: 'Café Gourmet', cnpj: '44.555.666/0001-22', tpv: 'R$ 150k', status: 'new', score: 65, owner: 'João S.', lastActivity: 'Há 3 horas' },
    { id: 5, company: 'Eletrônicos Plus', cnpj: '77.888.999/0001-33', tpv: 'R$ 2.1M', status: 'proposal', score: 92, owner: 'Maria S.', lastActivity: 'Agora' },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { label: 'Novo', className: 'bg-blue-100 text-blue-700' },
      analysis: { label: 'Em Análise', className: 'bg-amber-100 text-amber-700' },
      qualified: { label: 'Qualificado', className: 'bg-green-100 text-green-700' },
      proposal: { label: 'Proposta', className: 'bg-purple-100 text-purple-700' },
    };
    const config = statusConfig[status] || { label: status, className: 'bg-slate-100 text-slate-700' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Leads"
        subtitle="Base completa de leads comerciais"
        breadcrumbs={[
          { label: 'Comercial', page: 'AdminIntComercial' },
          { label: 'Leads', page: 'AdminIntLeads' }
        ]}
        actions={
          <Button className="bg-[#00c295] hover:bg-[#00a880]">
            <Plus className="w-4 h-4 mr-2" /> Novo Lead
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar por empresa, CNPJ, vendedor..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>TPV Est.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Última Ativ.</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell>{lead.cnpj}</TableCell>
                  <TableCell>{lead.tpv}</TableCell>
                  <TableCell>
                    {getStatusBadge(lead.status)}
                  </TableCell>
                  <TableCell className={lead.score >= 80 ? 'text-green-600 font-bold' : 'text-yellow-600'}>
                    {lead.score}
                  </TableCell>
                  <TableCell>{lead.owner}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{lead.lastActivity}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
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