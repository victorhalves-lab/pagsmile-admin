import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import TemplateCardEnhanced from '@/components/checkout/templates/TemplateCardEnhanced';
import { toast } from 'sonner';

const ALL_TEMPLATES = [
  // Originais
  { id: 1, name: 'PagSmile Default', type: 'Standard', vertical: 'Geral', style: 'default', avgConversion: 11.4, usedBy: 487, avgTicket: 220, recommended: true, topPercent: 25 },
  { id: 2, name: 'Dark High Conversion', type: 'Premium', vertical: 'SaaS', style: 'dark', avgConversion: 14.8, usedBy: 234, avgTicket: 320, topPercent: 10 },
  { id: 3, name: 'Minimalist Pro', type: 'Minimal', vertical: 'B2B', style: 'minimal', avgConversion: 12.1, usedBy: 156, avgTicket: 280 },
  // Por vertical
  { id: 4, name: 'E-commerce Express', type: 'Standard', vertical: 'E-commerce', style: 'default', avgConversion: 13.2, usedBy: 892, avgTicket: 145, topPercent: 15 },
  { id: 5, name: 'SaaS B2B Trial', type: 'Premium', vertical: 'SaaS', style: 'minimal', avgConversion: 18.4, usedBy: 312, avgTicket: 89, topPercent: 5 },
  { id: 6, name: 'Infoproduto Lançamento', type: 'Premium', vertical: 'Infoproduto', style: 'dark', avgConversion: 22.1, usedBy: 178, avgTicket: 497, topPercent: 5 },
  { id: 7, name: 'Restaurante Delivery', type: 'Standard', vertical: 'Restaurante', style: 'default', avgConversion: 16.8, usedBy: 423, avgTicket: 78 },
  { id: 8, name: 'Educação Curso', type: 'Standard', vertical: 'Educação', style: 'default', avgConversion: 14.7, usedBy: 267, avgTicket: 197 },
  { id: 9, name: 'Fitness Mensalidade', type: 'Premium', vertical: 'Fitness', style: 'dark', avgConversion: 11.9, usedBy: 134, avgTicket: 89 },
  // Por uso
  { id: 10, name: 'Black Friday Promo', type: 'Premium', vertical: 'Geral', style: 'dark', avgConversion: 19.4, usedBy: 612, avgTicket: 240, topPercent: 10 },
  { id: 11, name: 'Recorrência Mensal', type: 'Standard', vertical: 'Geral', style: 'minimal', avgConversion: 13.8, usedBy: 389, avgTicket: 67 },
  { id: 12, name: 'Order Bump Plus', type: 'Premium', vertical: 'Geral', style: 'default', avgConversion: 15.2, usedBy: 245, avgTicket: 178 },
];

const VERTICALS = ['Todos', 'Geral', 'E-commerce', 'SaaS', 'Infoproduto', 'B2B', 'Educação', 'Fitness', 'Restaurante'];

export default function CheckoutTemplates() {
  const [vertical, setVertical] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = ALL_TEMPLATES.filter(t =>
    (vertical === 'Todos' || t.vertical === vertical) &&
    (!search || t.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <PageHeader
        title="Templates de Checkout"
        subtitle="Escolha um design otimizado com performance histórica real"
        breadcrumbs={[{ label: 'Checkout', page: 'CheckoutBuilder' }, { label: 'Templates', page: 'CheckoutTemplates' }]}
      />

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar template..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Tabs value={vertical} onValueChange={setVertical}>
          <TabsList className="flex-wrap h-auto">
            {VERTICALS.map(v => (
              <TabsTrigger key={v} value={v} className="text-xs">{v}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => (
          <TemplateCardEnhanced
            key={tpl.id}
            template={tpl}
            onPreview={(t) => toast.info(`Abrindo preview de "${t.name}"...`)}
            onUse={(t) => toast.success(`Usando template "${t.name}"`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>Nenhum template encontrado nessa categoria.</p>
        </div>
      )}
    </div>
  );
}