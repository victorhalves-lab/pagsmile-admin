import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Layout, Sparkles, Globe, Search, BarChart3 } from 'lucide-react';

import PageHeader from '@/components/common/PageHeader';
import ShowcaseHero from '@/components/payment-links/showcase/ShowcaseHero';
import ShowcaseStats from '@/components/payment-links/showcase/ShowcaseStats';
import ShowcaseLinksGrid from '@/components/payment-links/showcase/ShowcaseLinksGrid';
import ShowcaseFeatures from '@/components/payment-links/showcase/ShowcaseFeatures';

export default function PaymentLinkShowcase() {
  const navigate = useNavigate();
  const [showcase, setShowcase] = useState({
    name: 'Minha Loja',
    description: 'Produtos digitais e consultoria',
    url: 'pag.sm/minha-loja',
    layout_type: 'grid_3',
    allow_search: true,
    allow_cart: false,
    social_proof_enabled: false,
    live_notifications_enabled: false,
    event_mode_enabled: false,
  });

  const { data: links = [] } = useQuery({
    queryKey: ['payment-links'],
    queryFn: () => base44.entities.PaymentLink.list('-created_date', 50),
  });

  const handleFeatureUpdate = (key, value) => {
    setShowcase((prev) => ({ ...prev, [`${key === 'search' ? 'allow_search' : key === 'cart' ? 'allow_cart' : `${key}_enabled`}`]: value }));
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Vitrine"
        subtitle="Mini-site público com todos os seus links — Linktree + checkout em um só lugar"
        breadcrumbs={[
          { label: 'Links de Pagamento', page: 'PaymentLinks' },
          { label: 'Vitrine' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(createPageUrl('PaymentLinks'))}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Plus className="w-4 h-4 mr-2" /> Nova vitrine
            </Button>
          </div>
        }
      />

      {/* Hero da vitrine */}
      <ShowcaseHero
        showcase={showcase}
        onEdit={() => {}}
        onShare={() => {}}
        onView={() => window.open('about:blank', '_blank')}
      />

      {/* Stats */}
      <ShowcaseStats />

      <Tabs defaultValue="links">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="links">
            <Layout className="w-3.5 h-3.5 mr-1.5" /> Links
          </TabsTrigger>
          <TabsTrigger value="design">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Design
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="w-3.5 h-3.5 mr-1.5" /> SEO
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ShowcaseLinksGrid links={links.slice(0, 8)} onPin={() => {}} />
          </div>
          <ShowcaseFeatures showcase={showcase} onUpdate={handleFeatureUpdate} />
        </TabsContent>

        <TabsContent value="design" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Identidade visual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Cor primária</Label>
                  <Input type="color" defaultValue="#2bc196" className="h-10" />
                </div>
                <div>
                  <Label className="text-xs">Layout</Label>
                  <select className="w-full h-10 px-3 border rounded-md text-sm">
                    <option value="grid_2">Grid 2 colunas</option>
                    <option value="grid_3">Grid 3 colunas</option>
                    <option value="grid_4">Grid 4 colunas</option>
                    <option value="list">Lista vertical</option>
                    <option value="carousel">Carrossel</option>
                  </select>
                </div>
              </div>
              <div className="text-xs text-slate-500 p-3 bg-slate-50 dark:bg-slate-800 rounded">
                💡 Use o builder visual para customizar tudo (em breve igual ao Checkout Builder).
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" /> SEO da vitrine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Título (meta title)</Label>
                <Input placeholder="Minha Loja — Produtos Digitais" />
              </div>
              <div>
                <Label className="text-xs">Descrição (meta description)</Label>
                <Input placeholder="Cursos, e-books e consultorias..." />
              </div>
              <div>
                <Label className="text-xs">Domínio customizado</Label>
                <Input placeholder="loja.meusite.com.br" />
                <p className="text-[11px] text-slate-500 mt-1">Conecte seu próprio domínio (premium)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Performance da vitrine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Top link da vitrine</p>
                  <p className="font-semibold">Curso de Marketing</p>
                  <p className="text-xs text-emerald-600">42% das vendas</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Tempo médio na vitrine</p>
                  <p className="font-semibold">2min 14s</p>
                  <p className="text-xs text-blue-600">+8% vs período anterior</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 text-xs text-blue-700">
                <strong>Insight:</strong> 64% dos visitantes da vitrine vêm via Instagram bio. Considere otimizar para mobile-first.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}