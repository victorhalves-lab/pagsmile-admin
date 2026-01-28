import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  ExternalLink,
  Copy,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ShoppingCart
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Checkouts() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: checkouts = [], isLoading } = useQuery({
    queryKey: ['checkouts'],
    queryFn: () => base44.entities.Checkout.list('-created_date', 50),
  });

  const filteredCheckouts = checkouts.filter(checkout =>
    checkout.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' },
      inactive: { label: 'Inativo', variant: 'secondary' },
      draft: { label: 'Rascunho', variant: 'outline' },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meus Checkouts"
        subtitle="Gerencie todos os seus checkouts personalizados"
        breadcrumbs={[
          { label: 'Checkout', page: 'CheckoutBuilder' },
          { label: 'Meus Checkouts' }
        ]}
        actions={
          <Link to={createPageUrl('CheckoutBuilder')}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Checkout
            </Button>
          </Link>
        }
      />

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar checkouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Checkouts */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCheckouts.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhum checkout encontrado
            </h3>
            <p className="text-slate-500 mb-4">
              Crie seu primeiro checkout personalizado para começar a vender
            </p>
            <Link to={createPageUrl('CheckoutBuilder')}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Checkout
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCheckouts.map((checkout) => (
            <Card key={checkout.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base font-medium">
                    {checkout.name || 'Checkout sem nome'}
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    {checkout.description || 'Sem descrição'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(checkout.status)}
                  <span className="text-sm text-slate-500">
                    {checkout.total_sales || 0} vendas
                  </span>
                </div>
                {checkout.url && (
                  <div className="flex items-center gap-2">
                    <Input
                      value={checkout.url}
                      readOnly
                      className="text-xs h-8"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => copyToClipboard(checkout.url)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => window.open(checkout.url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}