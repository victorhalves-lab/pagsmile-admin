import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection from '@/components/compliance/FormSection';
import { Activity } from 'lucide-react';

export default function Section9PerfilTransacional({ formData, handleChange }) {
  return (
    <FormSection title="9. Perfil Transacional e Operacional" subtitle="Descreva o perfil de transações" icon={Activity}>
      <div className="space-y-6">
        {/* Informações Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Qual modelo de negócio melhor descreve sua operação? *</Label>
            <Select value={formData.modeloNegocio || ''} onValueChange={(v) => handleChange('modeloNegocio', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gateway">Gateway</SelectItem>
                <SelectItem value="infoprodutos">Infoprodutos</SelectItem>
                <SelectItem value="educacao">Educação</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="foodservice">Foodservice</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="petshop">Petshop</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label>Possui sub-vendedores/sub-merchants/subcontas? *</Label>
            <RadioGroup value={formData.possuiSubvendedores || ''} onValueChange={(v) => handleChange('possuiSubvendedores', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="sub-sim" /><Label htmlFor="sub-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="sub-nao" /><Label htmlFor="sub-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <Label>Vende produto físico? *</Label>
            <RadioGroup value={formData.vendeProdutoFisico || ''} onValueChange={(v) => handleChange('vendeProdutoFisico', v)} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="fisico-sim" /><Label htmlFor="fisico-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="fisico-nao" /><Label htmlFor="fisico-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label>Vende produto digital ou serviço? *</Label>
            <RadioGroup value={formData.vendeProdutoDigital || ''} onValueChange={(v) => handleChange('vendeProdutoDigital', v)} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="digital-sim" /><Label htmlFor="digital-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="digital-nao" /><Label htmlFor="digital-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label>Prazo típico de entrega &gt; 7 dias? *</Label>
            <RadioGroup value={formData.prazoEntregaMaior7 || ''} onValueChange={(v) => handleChange('prazoEntregaMaior7', v)} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="prazo-sim" /><Label htmlFor="prazo-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="prazo-nao" /><Label htmlFor="prazo-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
        </div>

        {/* B1. Perfil de Transações */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">B1. Perfil de Transações</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Volume mensal estimado (R$) *</Label>
              <Select value={formData.volumeMensalFaixa || ''} onValueChange={(v) => handleChange('volumeMensalFaixa', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate10k">Até R$ 10.000</SelectItem>
                  <SelectItem value="10k-50k">R$ 10.001 a R$ 50.000</SelectItem>
                  <SelectItem value="50k-100k">R$ 50.001 a R$ 100.000</SelectItem>
                  <SelectItem value="100k-500k">R$ 100.001 a R$ 500.000</SelectItem>
                  <SelectItem value="500k-1m">R$ 500.001 a R$ 1.000.000</SelectItem>
                  <SelectItem value="1m-5m">R$ 1.000.001 a R$ 5.000.000</SelectItem>
                  <SelectItem value="5m-10m">R$ 5.000.001 a R$ 10.000.000</SelectItem>
                  <SelectItem value="mais10m">Mais de R$ 10.000.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantidade de transações/mês *</Label>
              <Select value={formData.qtdTransacoesMes || ''} onValueChange={(v) => handleChange('qtdTransacoesMes', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate100">Até 100</SelectItem>
                  <SelectItem value="101-500">101 a 500</SelectItem>
                  <SelectItem value="501-1000">501 a 1.000</SelectItem>
                  <SelectItem value="1001-5000">1.001 a 5.000</SelectItem>
                  <SelectItem value="5001-10000">5.001 a 10.000</SelectItem>
                  <SelectItem value="mais10000">Mais de 10.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ticket médio (R$) *</Label>
              <Select value={formData.ticketMedioFaixa || ''} onValueChange={(v) => handleChange('ticketMedioFaixa', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate50">Até R$ 50</SelectItem>
                  <SelectItem value="51-100">R$ 51 a R$ 100</SelectItem>
                  <SelectItem value="101-200">R$ 101 a R$ 200</SelectItem>
                  <SelectItem value="201-500">R$ 201 a R$ 500</SelectItem>
                  <SelectItem value="501-1000">R$ 501 a R$ 1.000</SelectItem>
                  <SelectItem value="mais1000">Mais de R$ 1.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Existe sazonalidade/picos? *</Label>
            <RadioGroup value={formData.existeSazonalidade || ''} onValueChange={(v) => handleChange('existeSazonalidade', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="saz-sim" /><Label htmlFor="saz-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="saz-nao" /><Label htmlFor="saz-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.existeSazonalidade === 'sim' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-gray-300">
              <div className="space-y-2">
                <Label>Quando ocorrem os picos?</Label>
                <Input placeholder="Ex: Black Friday, Natal" value={formData.quandoPicos || ''} onChange={(e) => handleChange('quandoPicos', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Pico máximo esperado (R$ ou %)</Label>
                <Input placeholder="Ex: 200% ou R$ 500.000" value={formData.picoMaximo || ''} onChange={(e) => handleChange('picoMaximo', e.target.value)} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>% Físico</Label><Input type="number" placeholder="%" value={formData.percentualFisico || ''} onChange={(e) => handleChange('percentualFisico', e.target.value)} /></div>
            <div className="space-y-2"><Label>% Serviço</Label><Input type="number" placeholder="%" value={formData.percentualServico || ''} onChange={(e) => handleChange('percentualServico', e.target.value)} /></div>
            <div className="space-y-2"><Label>% Digital</Label><Input type="number" placeholder="%" value={formData.percentualDigital || ''} onChange={(e) => handleChange('percentualDigital', e.target.value)} /></div>
          </div>
        </div>

        {/* B4. Cancelamentos e Reembolsos */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">B4. Cancelamentos e Reembolsos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Taxa de reembolso/cancelamento (últimos 3 meses) *</Label>
              <Select value={formData.taxaReembolso || ''} onValueChange={(v) => handleChange('taxaReembolso', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="menos1">Menos de 1%</SelectItem>
                  <SelectItem value="1-3">1% a 3%</SelectItem>
                  <SelectItem value="3-5">3% a 5%</SelectItem>
                  <SelectItem value="mais5">Mais de 5%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Reembolso pode ser parcial? *</Label>
              <RadioGroup value={formData.reembolsoParcial || ''} onValueChange={(v) => handleChange('reembolsoParcial', v)} className="flex gap-6">
                <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="reemb-sim" /><Label htmlFor="reemb-sim" className="font-normal">Sim</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="reemb-nao" /><Label htmlFor="reemb-nao" className="font-normal">Não</Label></div>
              </RadioGroup>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Política de reembolso é pública? *</Label>
            <RadioGroup value={formData.politicaReembolsoPublica || ''} onValueChange={(v) => handleChange('politicaReembolsoPublica', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="pol-reemb-sim" /><Label htmlFor="pol-reemb-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="pol-reemb-nao" /><Label htmlFor="pol-reemb-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.politicaReembolsoPublica === 'sim' && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-300">
              <Label>Link da política</Label>
              <Input type="url" placeholder="https://..." value={formData.linkPoliticaReembolso || ''} onChange={(e) => handleChange('linkPoliticaReembolso', e.target.value)} />
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}