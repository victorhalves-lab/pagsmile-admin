import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  LayoutTemplate,
  Star,
  Eye,
  Copy
} from 'lucide-react';

export default function CheckoutTemplates() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['checkout-templates'],
    queryFn: () => base44.entities.CheckoutTemplate.list('-created_date', 50),
  });

  // Templates pré-definidos caso não haja templates salvos
  const defaultTemplates = [
    {
      id: 'modern',
      name: 'Moderno',
      description: 'Design limpo e minimalista com foco na conversão',
      category: 'E-commerce',
      is_featured: true,
      preview_image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop'
    },
    {
      id: 'classic',
      name: 'Clássico',
      description: 'Layout tradicional com todas as informações visíveis',
      category: 'Serviços',
      is_featured: false,
      preview_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      id: 'subscription',
      name: 'Assinatura',
      description: 'Otimizado para vendas recorrentes e planos',
      category: 'SaaS',
      is_featured: true,
      preview_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
    },
    {
      id: 'donation',
      name: 'Doação',
      description: 'Ideal para ONGs e campanhas de arrecadação',
      category: 'Non-profit',
      is_featured: false,
      preview_image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop'
    },
    {
      id: 'event',
      name: 'Evento',
      description: 'Perfeito para venda de ingressos e inscrições',
      category: 'Eventos',
      is_featured: false,
      preview_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
    },
    {
      id: 'product',
      name: 'Produto Único',
      description: 'Focado na venda de um único produto com destaque',
      category: 'E-commerce',
      is_featured: true,
      preview_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
    }
  ];

  const displayTemplates = templates.length > 0 ? templates : defaultTemplates;

  const filteredTemplates = displayTemplates.filter(template =>
    template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates de Checkout"
        subtitle="Escolha um template para começar ou crie o seu próprio"
        breadcrumbs={[
          { label: 'Checkout', page: 'CheckoutBuilder' },
          { label: 'Templates' }
        ]}
        actions={
          <Link to={createPageUrl('CheckoutBuilder')}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Criar do Zero
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
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Templates */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-slate-200"></div>
              <CardContent className="pt-4">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <LayoutTemplate className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhum template encontrado
            </h3>
            <p className="text-slate-500">
              Tente buscar por outro termo
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48 bg-slate-100">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <LayoutTemplate className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                {template.is_featured && (
                  <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Destaque
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Link to={createPageUrl('CheckoutBuilder') + `?template=${template.id}`}>
                    <Button size="sm">
                      <Copy className="w-4 h-4 mr-1" />
                      Usar
                    </Button>
                  </Link>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}