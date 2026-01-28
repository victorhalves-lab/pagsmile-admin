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
import { format } from 'date-fns';

export default function AdminIntLeads() {
  const leads = [
    { id: 1, company: 'Tech Solutions', cnpj: '12.345.678/0001-90', tpv: 'R$ 500k', status: 'new', score: 78, owner: 'João S.', lastActivity: 'Há 2 dias' },
    { id: 2, company: 'E-commerce ABC', cnpj: '98.765.432/0001-99', tpv: 'R$ 1.2M', status: 'analysis', score: 85, owner: 'Maria S.', lastActivity: 'Há 5 horas' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Leads"
        subtitle="Base completa de leads comerciais"
        breadcrumbs={[
          { label: 'Comercial', page: 'AdminIntComercial' },
          { label: 'Leads', page: '#' }
        ]}
        action={
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
                    <Badge variant="secondary" className="uppercase text-[10px]">{lead.status}</Badge>
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