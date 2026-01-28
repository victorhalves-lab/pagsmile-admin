import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Contact, Plus, Trash2 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Section6Responsaveis({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const canais = formData.canaisAtendimento || [];

  return (
    <FormSection title="Responsáveis e Canais" subtitle="Informe os responsáveis e canais" icon={Contact}>
      <div className="space-y-6">
        {/* Responsável pela Contabilidade */}
        <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
          <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider">Contabilidade e Faturamento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs font-semibold">Nome Completo *</Label><Input className="h-8 text-xs" placeholder="Nome" value={formData.respContabilidadeNome || ''} onChange={(e) => handleChange('respContabilidadeNome', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">E-mail *</Label><Input className="h-8 text-xs" type="email" placeholder="email@empresa.com" value={formData.respContabilidadeEmail || ''} onChange={(e) => handleChange('respContabilidadeEmail', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">CRC</Label><Input className="h-8 text-xs" placeholder="Registro CRC" value={formData.respContabilidadeCRC || ''} onChange={(e) => handleChange('respContabilidadeCRC', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Telefone *</Label><Input className="h-8 text-xs" placeholder="(11) 99999-9999" value={formData.respContabilidadeTelefone || ''} onChange={(e) => handleChange('respContabilidadeTelefone', e.target.value)} /></div>
          </div>
        </div>

        {/* Responsável pelo Atendimento (SAC) */}
        <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
          <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider">Atendimento ao Cliente (SAC)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-xs font-semibold">Nome Completo *</Label><Input className="h-8 text-xs" placeholder="Nome" value={formData.respSACNome || ''} onChange={(e) => handleChange('respSACNome', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">E-mail *</Label><Input className="h-8 text-xs" type="email" placeholder="email@empresa.com" value={formData.respSACEmail || ''} onChange={(e) => handleChange('respSACEmail', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Telefone Celular *</Label><Input className="h-8 text-xs" placeholder="(11) 99999-9999" value={formData.respSACTelefone || ''} onChange={(e) => handleChange('respSACTelefone', e.target.value)} /></div>
          </div>
        </div>

        {/* Responsável pelo Compliance */}
        <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
          <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider">Compliance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs font-semibold">Nome Completo *</Label><Input className="h-8 text-xs" placeholder="Nome" value={formData.respComplianceNome || ''} onChange={(e) => handleChange('respComplianceNome', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">CPF *</Label><Input className="h-8 text-xs" placeholder="000.000.000-00" value={formData.respComplianceCPF || ''} onChange={(e) => handleChange('respComplianceCPF', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">E-mail *</Label><Input className="h-8 text-xs" type="email" placeholder="email@empresa.com" value={formData.respComplianceEmail || ''} onChange={(e) => handleChange('respComplianceEmail', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Telefone Celular *</Label><Input className="h-8 text-xs" placeholder="(11) 99999-9999" value={formData.respComplianceTelefone || ''} onChange={(e) => handleChange('respComplianceTelefone', e.target.value)} /></div>
          </div>
        </div>

        {/* Canais de Atendimento */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Canais de Atendimento *</Label>
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => handleAddArrayItem('canaisAtendimento', { tipo: '', contato: '' })}>
              <Plus className="w-3 h-3 mr-1" /> Adicionar Canal
            </Button>
          </div>
          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
          {canais.map((canal, idx) => (
            <div key={idx} className="flex gap-2 items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-1/3">
                <Select value={canal.tipo} onValueChange={(v) => handleArrayChange('canaisAtendimento', idx, 'tipo', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input className="h-8 text-xs" placeholder="Contato" value={canal.contato} onChange={(e) => handleArrayChange('canaisAtendimento', idx, 'contato', e.target.value)} />
              </div>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleRemoveArrayItem('canaisAtendimento', idx)}><Trash2 className="w-3 h-3" /></Button>
            </div>
          ))}
          </div>
        </div>

        {/* Reclame Aqui */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <Label className="text-xs font-semibold mb-2 block">Canal no Reclame Aqui? *</Label>
          <div className="flex gap-2">
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.temReclameAqui === 'sim'}
              onClick={() => handleChange('temReclameAqui', 'sim')}
            >
              Sim
            </SelectionButton>
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.temReclameAqui === 'nao'}
              onClick={() => handleChange('temReclameAqui', 'nao')}
            >
              Não
            </SelectionButton>
          </div>
          {formData.temReclameAqui === 'sim' && (
            <div className="mt-2">
              <Label className="text-xs font-semibold mb-1 block">Link do Reclame Aqui *</Label>
              <Input className="h-8 text-xs" type="url" placeholder="https://..." value={formData.linkReclameAqui || ''} onChange={(e) => handleChange('linkReclameAqui', e.target.value)} />
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}