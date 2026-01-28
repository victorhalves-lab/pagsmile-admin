import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

const tiposProduto = [
  'Software (SaaS)', 'E-commerce', 'Serviços Digitais',
  'Hardware', 'Financeiro', 'Mídia Digital', 'Educação',
  'Games', 'Turismo', 'Saúde', 'Delivery', 'Logística', 'Outros'
];

const canaisVenda = ['Site próprio', 'App móvel', 'WhatsApp', 'Link pgto', 'Loja física', 'Marketplace', 'Televendas', 'Outro'];

export default function Section2Atividade({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const divisaoPercentual = formData.divisaoPercentual || [];

  return (
    <FormSection title="2. Atividade e Negócios" subtitle="Descreva a atividade da empresa" icon={Briefcase}>
      <div className="space-y-4">
        {/* O que você vende */}
        <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
          <h4 className="font-medium text-gray-800 text-sm">O que você vende?</h4>
          
          <div className="space-y-1">
            <Label className="text-xs">Tipo principal de produto/serviço *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {tiposProduto.map(t => (
                <SelectionButton
                  key={t}
                  className="py-2 text-[10px] md:text-xs h-auto min-h-[40px]"
                  selected={formData.tipoPrincipalProduto === t}
                  onClick={() => handleChange('tipoPrincipalProduto', t)}
                >
                  {t}
                </SelectionButton>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Descrição dos produtos/serviços *</Label>
            <Textarea className="min-h-[60px] text-xs" placeholder="Descreva brevemente..." value={formData.descricaoProdutos || ''} onChange={(e) => handleChange('descricaoProdutos', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">1º mais vendido *</Label>
              <Input className="h-8 text-xs" placeholder="Produto 1" value={formData.top1Produto || ''} onChange={(e) => handleChange('top1Produto', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">2º mais vendido *</Label>
              <Input className="h-8 text-xs" placeholder="Produto 2" value={formData.top2Produto || ''} onChange={(e) => handleChange('top2Produto', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">3º mais vendido *</Label>
              <Input className="h-8 text-xs" placeholder="Produto 3" value={formData.top3Produto || ''} onChange={(e) => handleChange('top3Produto', e.target.value)} />
            </div>
          </div>

          {/* Divisão Percentual */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Divisão Percentual *</Label>
              <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleAddArrayItem('divisaoPercentual', { nome: '', percentual: '' })}>
                <Plus className="w-3 h-3 mr-1" /> Adicionar
              </Button>
            </div>
            {divisaoPercentual.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input className="h-8 text-xs flex-1" placeholder="Nome" value={item.nome} onChange={(e) => handleArrayChange('divisaoPercentual', idx, 'nome', e.target.value)} />
                <Input className="h-8 text-xs w-16" type="number" placeholder="%" value={item.percentual} onChange={(e) => handleArrayChange('divisaoPercentual', idx, 'percentual', e.target.value)} />
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleRemoveArrayItem('divisaoPercentual', idx)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
          </div>
        </div>

        {/* Escopo, Volume, Ticket */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">Escopo do Negócio *</Label>
            <Textarea className="min-h-[50px] text-xs" placeholder="Descreva detalhadamente..." value={formData.escopoNegocio || ''} onChange={(e) => handleChange('escopoNegocio', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Estimativa Volume/Mês (R$) *</Label>
            <Input className="h-8 text-xs" type="number" placeholder="100000" value={formData.estimativaVolumeMes || ''} onChange={(e) => handleChange('estimativaVolumeMes', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Ticket Médio (R$) *</Label>
            <Input className="h-8 text-xs" type="number" placeholder="150" value={formData.ticketMedio || ''} onChange={(e) => handleChange('ticketMedio', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Site Corporativo *</Label>
            <Input className="h-8 text-xs" type="url" placeholder="https://" value={formData.siteCorporativo || ''} onChange={(e) => handleChange('siteCorporativo', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">URL do Produto/App (Opcional)</Label>
            <Input className="h-8 text-xs" type="url" placeholder="https://" value={formData.urlProdutoApp || ''} onChange={(e) => handleChange('urlProdutoApp', e.target.value)} />
          </div>
        </div>

        {/* Gateway/Marketplace */}
        <div className="space-y-2">
          <Label className="text-xs">Sua operação é de gateway, marketplace ou tem sellers? *</Label>
          <div className="flex gap-2">
            <SelectionButton className="flex-1 py-2" selected={formData.operacaoGatewayMarketplace === 'sim'} onClick={() => handleChange('operacaoGatewayMarketplace', 'sim')}>Sim</SelectionButton>
            <SelectionButton className="flex-1 py-2" selected={formData.operacaoGatewayMarketplace === 'nao'} onClick={() => handleChange('operacaoGatewayMarketplace', 'nao')}>Não</SelectionButton>
          </div>
        </div>

        {/* Canais de Venda */}
        <div className="space-y-2">
          <Label className="text-xs">Canais de Venda *</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {canaisVenda.map(canal => {
              const isSelected = (formData.canaisVenda || []).includes(canal);
              return (
                <SelectionButton
                  key={canal}
                  className="py-2 text-[10px] md:text-xs"
                  selected={isSelected}
                  onClick={() => {
                    const current = formData.canaisVenda || [];
                    if (isSelected) handleChange('canaisVenda', current.filter(c => c !== canal));
                    else handleChange('canaisVenda', [...current, canal]);
                  }}
                >
                  {canal}
                </SelectionButton>
              );
            })}
          </div>
        </div>

        {/* Expectativa de Crescimento */}
        <div className="space-y-2">
          <Label className="text-xs">Expectativa de Crescimento (12 meses)</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              {v: 'ate10', l: 'Até 10%'},
              {v: '11-25', l: '11-25%'},
              {v: '26-50', l: '26-50%'},
              {v: '51-100', l: '51-100%'},
              {v: 'mais100', l: '+100%'},
              {v: 'naoSabe', l: 'Não sei'}
            ].map(opt => (
               <SelectionButton
                  key={opt.v}
                  className="py-2 text-[10px]"
                  selected={formData.expectativaCrescimento === opt.v}
                  onClick={() => handleChange('expectativaCrescimento', opt.v)}
                >
                  {opt.l}
                </SelectionButton>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  );
}