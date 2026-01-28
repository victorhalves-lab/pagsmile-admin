import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, Users, FileText, Activity, Bot, ArrowLeft 
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import AdminIntPlaceholder from '@/components/admin-interno/Placeholder';

export default function AdminIntLeadProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Tech Solutions LTDA
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Novo</Badge>
          </h1>
          <p className="text-slate-500">CNPJ: 12.345.678/0001-90 • ID: L-10492</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <Bot className="w-4 h-4 mr-2" />
            Analisar PRISCILA
          </Button>
          <Button className="bg-[#00c295] hover:bg-[#00a880]">
            Criar Proposta
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="w-full justify-start h-auto p-1 bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="summary" className="gap-2 py-2">
            <Activity className="w-4 h-4" /> Resumo
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2 py-2">
            <Building2 className="w-4 h-4" /> Empresa
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2 py-2">
            <Bot className="w-4 h-4" /> Análise PRISCILA
          </TabsTrigger>
          <TabsTrigger value="proposals" className="gap-2 py-2">
            <FileText className="w-4 h-4" /> Propostas
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
            <TabsContent value="summary">
                <AdminIntPlaceholder title="Resumo do Lead" description="Visão geral, contatos principais e KPIs" />
            </TabsContent>
            <TabsContent value="company">
                <AdminIntPlaceholder title="Dados da Empresa" description="Detalhes cadastrais e operacionais" />
            </TabsContent>
            <TabsContent value="analysis">
                <AdminIntPlaceholder title="Análise PRISCILA" description="Score, risco e sugestões de taxas" />
            </TabsContent>
            <TabsContent value="proposals">
                <AdminIntPlaceholder title="Histórico de Propostas" description="Propostas enviadas e status" />
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}