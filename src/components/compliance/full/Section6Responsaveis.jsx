import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Contact, Plus, Trash2 } from 'lucide-react';

export default function Section6Responsaveis({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const canais = formData.canaisAtendimento || [];

  return (
    <FormSection title="6. Responsáveis, Canais de Atendimento e Reputação" subtitle="Informe os responsáveis e canais" icon={Contact}>
      <div className="space-y-6">
        {/* Responsável pela Contabilidade */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">Responsável pela Contabilidade e Faturamento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nome Completo *</Label><Input placeholder="Nome" value={formData.respContabilidadeNome || ''} onChange={(e) => handleChange('respContabilidadeNome', e.target.value)} /></div>
            <div className="space-y-2"><Label>E-mail *</Label><Input type="email" placeholder="email@empresa.com" value={formData.respContabilidadeEmail || ''} onChange={(e) => handleChange('respContabilidadeEmail', e.target.value)} /></div>
            <div className="space-y-2"><Label>CRC</Label><Input placeholder="Registro no Conselho de Contabilidade" value={formData.respContabilidadeCRC || ''} onChange={(e) => handleChange('respContabilidadeCRC', e.target.value)} /></div>
            <div className="space-y-2"><Label>Telefone *</Label><Input placeholder="(11) 99999-9999" value={formData.respContabilidadeTelefone || ''} onChange={(e) => handleChange('respContabilidadeTelefone', e.target.value)} /></div>
          </div>
        </div>

        {/* Responsável pelo Atendimento (SAC) */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">Responsável pelo Atendimento ao Cliente (SAC)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Nome Completo *</Label><Input placeholder="Nome" value={formData.respSACNome || ''} onChange={(e) => handleChange('respSACNome', e.target.value)} /></div>
            <div className="space-y-2"><Label>E-mail *</Label><Input type="email" placeholder="email@empresa.com" value={formData.respSACEmail || ''} onChange={(e) => handleChange('respSACEmail', e.target.value)} /></div>
            <div className="space-y-2"><Label>Telefone Celular *</Label><Input placeholder="(11) 99999-9999" value={formData.respSACTelefone || ''} onChange={(e) => handleChange('respSACTelefone', e.target.value)} /></div>
          </div>
        </div>

        {/* Responsável pelo Compliance */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">Responsável pela Área de Compliance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nome Completo *</Label><Input placeholder="Nome" value={formData.respComplianceNome || ''} onChange={(e) => handleChange('respComplianceNome', e.target.value)} /></div>
            <div className="space-y-2"><Label>CPF *</Label><Input placeholder="000.000.000-00" value={formData.respComplianceCPF || ''} onChange={(e) => handleChange('respComplianceCPF', e.target.value)} /></div>
            <div className="space-y-2"><Label>E-mail *</Label><Input type="email" placeholder="email@empresa.com" value={formData.respComplianceEmail || ''} onChange={(e) => handleChange('respComplianceEmail', e.target.value)} /></div>
            <div className="space-y-2"><Label>Telefone Celular *</Label><Input placeholder="(11) 99999-9999" value={formData.respComplianceTelefone || ''} onChange={(e) => handleChange('respComplianceTelefone', e.target.value)} /></div>
          </div>
        </div>

        {/* Canais de Atendimento */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Canais de Atendimento *</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem('canaisAtendimento', { tipo: '', contato: '' })}>
              <Plus className="w-4 h-4 mr-1" /> Adicionar Canal
            </Button>
          </div>
          {canais.map((canal, idx) => (
            <div key={idx} className="flex gap-3 items-end p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Tipo</Label>
                <Select value={canal.tipo} onValueChange={(v) => handleArrayChange('canaisAtendimento', idx, 'tipo', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Contato</Label>
                <Input placeholder="Endereço/Número" value={canal.contato} onChange={(e) => handleArrayChange('canaisAtendimento', idx, 'contato', e.target.value)} />
              </div>
              <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemoveArrayItem('canaisAtendimento', idx)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        {/* Reclame Aqui */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-3">
            <Label>A empresa possui canal no Reclame Aqui? *</Label>
            <RadioGroup value={formData.temReclameAqui || ''} onValueChange={(v) => handleChange('temReclameAqui', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="ra-sim" /><Label htmlFor="ra-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="ra-nao" /><Label htmlFor="ra-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.temReclameAqui === 'sim' && (
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg">
              <Label>Link do canal no Reclame Aqui *</Label>
              <Input type="url" placeholder="https://www.reclameaqui.com.br/empresa/..." value={formData.linkReclameAqui || ''} onChange={(e) => handleChange('linkReclameAqui', e.target.value)} />
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}