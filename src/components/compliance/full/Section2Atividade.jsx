import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

const tiposProduto = [
  'Software (SaaS)', 'E-commerce (Varejo Online)', 'Serviços Digitais (Consultoria, Marketing)',
  'Hardware/Eletrônicos', 'Serviços Financeiros', 'Mídia/Conteúdo Digital', 'Educação/Cursos Online',
  'Jogos/Games', 'Turismo/Viagens', 'Saúde/Bem-estar', 'Alimentação/Delivery', 'Logística/Transporte', 'Outros'
];

const canaisVenda = ['Site próprio', 'Aplicativo móvel', 'WhatsApp', 'Link de pagamento', 'PDV / Loja física', 'Marketplace', 'Televendas', 'Outro'];

export default function Section2Atividade({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const divisaoPercentual = formData.divisaoPercentual || [];

  return (
    <FormSection title="2. Atividade e Negócios" subtitle="Descreva a atividade da empresa" icon={Briefcase}>
      <div className="space-y-6">
        {/* O que você vende */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
          <h4 className="font-medium text-gray-800">O que você vende?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Qual o principal tipo de produto/serviço? *</Label>
              <Select value={formData.tipoPrincipalProduto || ''} onValueChange={(v) => handleChange('tipoPrincipalProduto', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo principal" /></SelectTrigger>
                <SelectContent>
                  {tiposProduto.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descreva brevemente todos os produtos/serviços comercializados *</Label>
            <Textarea placeholder="Ex: Vendemos roupas masculinas e femininas..." value={formData.descricaoProdutos || ''} onChange={(e) => handleChange('descricaoProdutos', e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>1º produto/serviço mais vendido *</Label>
              <Input placeholder="Produto 1" value={formData.top1Produto || ''} onChange={(e) => handleChange('top1Produto', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>2º produto/serviço mais vendido *</Label>
              <Input placeholder="Produto 2" value={formData.top2Produto || ''} onChange={(e) => handleChange('top2Produto', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>3º produto/serviço mais vendido *</Label>
              <Input placeholder="Produto 3" value={formData.top3Produto || ''} onChange={(e) => handleChange('top3Produto', e.target.value)} />
            </div>
          </div>

          {/* Divisão Percentual */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>Divisão Percentual dos Volumes *</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem('divisaoPercentual', { nome: '', percentual: '' })}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <p className="text-xs text-gray-500">A soma dos percentuais deve ser exatamente 100%</p>
            {divisaoPercentual.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-end">
                <div className="flex-1 space-y-1">
                  <Input placeholder="Nome do produto/serviço" value={item.nome} onChange={(e) => handleArrayChange('divisaoPercentual', idx, 'nome', e.target.value)} />
                </div>
                <div className="w-24 space-y-1">
                  <Input type="number" placeholder="%" value={item.percentual} onChange={(e) => handleArrayChange('divisaoPercentual', idx, 'percentual', e.target.value)} />
                </div>
                <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemoveArrayItem('divisaoPercentual', idx)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        </div>

        {/* Escopo, Volume, Ticket */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Escopo do Negócio *</Label>
            <Textarea placeholder="Descreva detalhadamente o que a empresa faz... (mínimo 50 caracteres)" value={formData.escopoNegocio || ''} onChange={(e) => handleChange('escopoNegocio', e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Estimativa de Volume/Mês (R$) *</Label>
            <Input type="number" placeholder="Ex: 100000" value={formData.estimativaVolumeMes || ''} onChange={(e) => handleChange('estimativaVolumeMes', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Ticket Médio (R$) *</Label>
            <Input type="number" placeholder="Ex: 150" value={formData.ticketMedio || ''} onChange={(e) => handleChange('ticketMedio', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Site Corporativo *</Label>
            <Input type="url" placeholder="https://www.empresa.com.br" value={formData.siteCorporativo || ''} onChange={(e) => handleChange('siteCorporativo', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>URL do Produto/Aplicativo/Checkout</Label>
            <Input type="url" placeholder="https://... (opcional)" value={formData.urlProdutoApp || ''} onChange={(e) => handleChange('urlProdutoApp', e.target.value)} />
          </div>
        </div>

        {/* Gateway/Marketplace */}
        <div className="space-y-3">
          <Label>Sua operação é de gateway, marketplace, plataforma de infoprodutos ou plataforma que tem sellers? *</Label>
          <RadioGroup value={formData.operacaoGatewayMarketplace || ''} onValueChange={(v) => handleChange('operacaoGatewayMarketplace', v)} className="flex gap-6">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="gm-sim" /><Label htmlFor="gm-sim" className="font-normal">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="gm-nao" /><Label htmlFor="gm-nao" className="font-normal">Não</Label></div>
          </RadioGroup>
        </div>

        {/* Canais de Venda */}
        <div className="space-y-3">
          <Label>Canais de Venda *</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {canaisVenda.map(canal => (
              <div key={canal} className="flex items-center space-x-2">
                <Checkbox id={`canal-${canal}`} checked={(formData.canaisVenda || []).includes(canal)} onCheckedChange={(checked) => {
                  const current = formData.canaisVenda || [];
                  if (checked) handleChange('canaisVenda', [...current, canal]);
                  else handleChange('canaisVenda', current.filter(c => c !== canal));
                }} />
                <Label htmlFor={`canal-${canal}`} className="text-sm font-normal">{canal}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Expectativa de Crescimento */}
        <div className="space-y-2">
          <Label>Expectativa de Crescimento (12 meses)</Label>
          <Select value={formData.expectativaCrescimento || ''} onValueChange={(v) => handleChange('expectativaCrescimento', v)}>
            <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ate10">Até 10%</SelectItem>
              <SelectItem value="11-25">11% a 25%</SelectItem>
              <SelectItem value="26-50">26% a 50%</SelectItem>
              <SelectItem value="51-100">51% a 100%</SelectItem>
              <SelectItem value="mais100">Mais de 100%</SelectItem>
              <SelectItem value="naoSabe">Não sabe informar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FormSection>
  );
}