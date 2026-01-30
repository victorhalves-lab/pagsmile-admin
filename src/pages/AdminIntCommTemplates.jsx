import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Eye, Copy, Mail, FileText, Bold, Italic, Underline, Link as LinkIcon, Image, List, ListOrdered, Code } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const templates = [
  { id: 'TPL-001', name: 'Boas-vindas ao PagSmile', category: 'Onboarding', usedIn: 2 },
  { id: 'TPL-002', name: 'Link para completar KYC', category: 'Onboarding', usedIn: 1 },
  { id: 'TPL-003', name: 'Lembrete KYC - 3 dias', category: 'Onboarding', usedIn: 1 },
  { id: 'TPL-004', name: 'Lembrete KYC - Último aviso', category: 'Onboarding', usedIn: 1 },
  { id: 'TPL-005', name: 'KYC Aprovado', category: 'Onboarding', usedIn: 1 },
  { id: 'TPL-006', name: 'KYC Reprovado', category: 'Onboarding', usedIn: 1 },
  { id: 'TPL-007', name: 'Conta Ativada', category: 'Onboarding', usedIn: 1 },
  { id: 'TPL-008', name: 'Credenciais API', category: 'Onboarding', usedIn: 1 },
  { id: 'TPL-020', name: 'Primeira Transação', category: 'Transacional', usedIn: 1 },
  { id: 'TPL-030', name: 'Saque Solicitado', category: 'Financeiro', usedIn: 1 },
  { id: 'TPL-031', name: 'Saque Processado', category: 'Financeiro', usedIn: 1 },
  { id: 'TPL-040', name: 'Chargeback Recebido', category: 'Risco', usedIn: 1 },
];

const variablesGroups = {
  merchant: ['{{merchant.trade_name}}', '{{merchant.legal_name}}', '{{merchant.cnpj}}', '{{merchant.contact_name}}', '{{merchant.email}}'],
  links: ['{{link_kyc}}', '{{link_portal}}', '{{link_docs}}', '{{link_api}}'],
  dates: ['{{current_date}}', '{{expiry_date}}', '{{created_at}}'],
};

const categoryColors = {
  'Onboarding': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Transacional': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Financeiro': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'Risco': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminIntCommTemplates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editorModal, setEditorModal] = useState(null);
  const [editorMode, setEditorMode] = useState('visual');

  const filteredTemplates = templates.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'all' || t.category.toLowerCase() === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Templates de E-mail"
        subtitle="Gerencie os templates de comunicação"
        icon={FileText}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Comunicação', page: 'AdminIntCommDashboard' },
          { label: 'Templates' }
        ]}
        actions={
          <Button onClick={() => setEditorModal({ id: null, name: '', category: 'Onboarding' })}>
            <Plus className="w-4 h-4 mr-2" /> Novo Template
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar template por nome ou ID..." 
                className="pl-10" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="transacional">Transacional</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="risco">Risco</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2bc196]" />
            Lista de Templates
          </CardTitle>
          <CardDescription>{filteredTemplates.length} templates encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoria</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usado em</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTemplates.map(template => (
                  <tr key={template.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-slate-600 dark:text-slate-400">
                        {template.id}
                      </code>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-900 dark:text-white">{template.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={cn("border-0 text-xs", categoryColors[template.category])}>
                        {template.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400">
                      {template.usedIn} automações
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditorModal(template)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success('Template duplicado!')}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Editor Modal */}
      <Dialog open={!!editorModal} onOpenChange={() => setEditorModal(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2bc196]" />
              {editorModal?.id ? `Editar Template - ${editorModal.id}` : 'Novo Template'}
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="info">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="variables">Variáveis</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome *</Label>
                  <Input className="mt-1.5" defaultValue={editorModal?.name} placeholder="Nome do template" />
                </div>
                <div>
                  <Label>Categoria *</Label>
                  <Select defaultValue={editorModal?.category?.toLowerCase()}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="transacional">Transacional</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="risco">Risco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Assunto do e-mail *</Label>
                <Input className="mt-1.5" placeholder="🎉 Bem-vindo ao PagSmile, {{merchant.trade_name}}!" />
              </div>
              <div>
                <Label>Pré-header (texto de preview)</Label>
                <Input className="mt-1.5" placeholder="Sua conta está quase pronta. Complete seu cadastro!" />
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Conteúdo do e-mail</Label>
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Button 
                    variant={editorMode === 'visual' ? 'default' : 'ghost'} 
                    size="sm" 
                    className="h-7"
                    onClick={() => setEditorMode('visual')}
                  >
                    Visual
                  </Button>
                  <Button 
                    variant={editorMode === 'html' ? 'default' : 'ghost'} 
                    size="sm"
                    className="h-7"
                    onClick={() => setEditorMode('html')}
                  >
                    HTML
                  </Button>
                </div>
              </div>
              
              {editorMode === 'visual' ? (
                <>
                  <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Underline className="w-4 h-4" /></Button>
                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8"><LinkIcon className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Image className="w-4 h-4" /></Button>
                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8"><List className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ListOrdered className="w-4 h-4" /></Button>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 min-h-[300px] bg-white dark:bg-slate-900">
                    <div className="text-center mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                      [LOGO PAGSMILE]
                    </div>
                    <p className="mb-4 text-slate-700 dark:text-slate-300">Olá, <strong>{'{{merchant.contact_name}}'}</strong>!</p>
                    <p className="mb-4 text-slate-700 dark:text-slate-300">Seja bem-vindo ao <strong>PagSmile</strong>! Estamos muito felizes em ter a <strong>{'{{merchant.trade_name}}'}</strong> conosco.</p>
                    <p className="mb-4 text-slate-700 dark:text-slate-300">Sua conta foi criada com sucesso. Para começar a receber pagamentos, complete seu cadastro:</p>
                    <div className="text-center my-6">
                      <Button>COMPLETAR CADASTRO</Button>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{'{{link_kyc}}'}</p>
                    </div>
                  </div>
                </>
              ) : (
                <Textarea className="min-h-[400px] font-mono text-sm" placeholder="<html>...</html>" />
              )}
            </TabsContent>

            <TabsContent value="variables" className="space-y-4 mt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Clique em uma variável para copiá-la:</p>
              <div className="space-y-4">
                {Object.entries(variablesGroups).map(([key, vars]) => (
                  <div key={key} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Label className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                      {key === 'merchant' ? '👤 Merchant' : key === 'links' ? '🔗 Links' : '📅 Datas'}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {vars.map(v => (
                        <Badge 
                          key={v} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-[#2bc196]/10 hover:border-[#2bc196] transition-colors font-mono text-xs"
                          onClick={() => { navigator.clipboard.writeText(v); toast.success('Copiado!'); }}
                        >
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-8 bg-slate-50 dark:bg-slate-800/50 min-h-[300px] flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">Preview do e-mail com dados de exemplo</p>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditorModal(null)}>Cancelar</Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" /> Enviar Teste
            </Button>
            <Button onClick={() => { toast.success('Template salvo com sucesso!'); setEditorModal(null); }}>
              Salvar Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}