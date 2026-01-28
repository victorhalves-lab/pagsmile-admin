import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Users, Plus, Trash2, Edit2 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Shared component for Responsibles/Contacts
// Supports sections: Accounting, Support, Compliance (optional), Channels, Reclame Aqui

export default function Step_ResponsaveisCanais({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem, isFullKYC = false }) {
  const canais = formData.canaisAtendimento || [];

  return (
    <FormSection title="Responsáveis e Canais" subtitle="Contatos e atendimento" icon={Users}>
      <div className="space-y-6">
        {/* Responsáveis em Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Contabilidade */}
          <div className="p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-100">
            <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider mb-1">Contabilidade</h4>
            <div className="space-y-1"><Label className="text-[10px] font-semibold">Nome</Label><Input className="h-7 text-xs" value={formData.respContabilidadeNome || ''} onChange={(e) => handleChange('respContabilidadeNome', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-[10px] font-semibold">Email</Label><Input className="h-7 text-xs" value={formData.respContabilidadeEmail || ''} onChange={(e) => handleChange('respContabilidadeEmail', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-[10px] font-semibold">Telefone</Label><Input className="h-7 text-xs" value={formData.respContabilidadeTelefone || ''} onChange={(e) => handleChange('respContabilidadeTelefone', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-[10px] font-semibold">CRC</Label><Input className="h-7 text-xs" value={formData.respContabilidadeCRC || ''} onChange={(e) => handleChange('respContabilidadeCRC', e.target.value)} /></div>
          </div>

          {/* Atendimento */}
          <div className="p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-100">
            <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider mb-1">Atendimento (SAC)</h4>
            <div className="space-y-1"><Label className="text-[10px] font-semibold">Nome</Label><Input className="h-7 text-xs" value={formData.respSACNome || ''} onChange={(e) => handleChange('respSACNome', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-[10px] font-semibold">Email</Label><Input className="h-7 text-xs" value={formData.respSACEmail || ''} onChange={(e) => handleChange('respSACEmail', e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-[10px] font-semibold">Telefone</Label><Input className="h-7 text-xs" value={formData.respSACTelefone || ''} onChange={(e) => handleChange('respSACTelefone', e.target.value)} /></div>
          </div>
          
          {/* Compliance - Only for Full KYC */}
          {isFullKYC && (
            <div className="p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-100 md:col-span-2">
              <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider mb-1">Compliance</h4>
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1"><Label className="text-[10px] font-semibold">Nome</Label><Input className="h-7 text-xs" value={formData.respComplianceNome || ''} onChange={(e) => handleChange('respComplianceNome', e.target.value)} /></div>
                 <div className="space-y-1"><Label className="text-[10px] font-semibold">CPF</Label><Input className="h-7 text-xs" value={formData.respComplianceCPF || ''} onChange={(e) => handleChange('respComplianceCPF', e.target.value)} /></div>
                 <div className="space-y-1"><Label className="text-[10px] font-semibold">Email</Label><Input className="h-7 text-xs" value={formData.respComplianceEmail || ''} onChange={(e) => handleChange('respComplianceEmail', e.target.value)} /></div>
                 <div className="space-y-1"><Label className="text-[10px] font-semibold">Telefone</Label><Input className="h-7 text-xs" value={formData.respComplianceTelefone || ''} onChange={(e) => handleChange('respComplianceTelefone', e.target.value)} /></div>
              </div>
            </div>
          )}
        </div>

        {/* Canais */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Canais de Atendimento</Label>
            <Button type="button" variant="outline" size="sm" className="h-6 text-[10px] px-2" onClick={() => handleAddArrayItem('canaisAtendimento', { tipo: '', contato: '' })}>
              <Plus className="w-3 h-3 mr-1" /> Adicionar
            </Button>
          </div>
          <div className="space-y-2">
            {canais.map((canal, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Select value={canal.tipo} onValueChange={(v) => handleArrayChange('canaisAtendimento', idx, 'tipo', v)}>
                  <SelectTrigger className="h-7 text-xs w-[100px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="h-7 text-xs flex-1" placeholder="Contato" value={canal.contato} onChange={(e) => handleArrayChange('canaisAtendimento', idx, 'contato', e.target.value)} />
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleRemoveArrayItem('canaisAtendimento', idx)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
            {canais.length === 0 && <p className="text-[10px] text-gray-400 italic">Nenhum canal adicionado.</p>}
          </div>
        </div>

        {/* Reclame Aqui */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
             <Label className="text-xs font-semibold">Possui Reclame Aqui?</Label>
             <div className="flex gap-2">
                <SelectionButton className="py-0.5 px-2 text-[10px] h-6" selected={formData.temReclameAqui === 'sim'} onClick={() => handleChange('temReclameAqui', 'sim')}>Sim</SelectionButton>
                <SelectionButton className="py-0.5 px-2 text-[10px] h-6" selected={formData.temReclameAqui === 'nao'} onClick={() => handleChange('temReclameAqui', 'nao')}>Não</SelectionButton>
             </div>
          </div>
          {formData.temReclameAqui === 'sim' && (
            <Input className="h-8 text-xs" placeholder="Link do Reclame Aqui" value={formData.linkReclameAqui || ''} onChange={(e) => handleChange('linkReclameAqui', e.target.value)} />
          )}
        </div>
      </div>
    </FormSection>
  );
}