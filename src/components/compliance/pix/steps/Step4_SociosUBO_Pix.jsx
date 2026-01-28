import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Users, Plus, Trash2, Edit2, Check } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

// Combined Step for PIX: Beneficiarios + Socios
// Uses a compact list + modal/edit logic

export default function Step4_SociosUBO_Pix({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const ubos = formData.uboList || [];
  const socios = formData.sociosList || [];
  
  const [editingItem, setEditingItem] = useState(null); // { type: 'ubo'|'socio', index: number, data: object }
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openEdit = (type, index, data) => {
    setEditingItem({ type, index, data: { ...data } });
    setIsDialogOpen(true);
  };

  const openNew = (type) => {
    const emptyData = type === 'ubo' 
      ? { nome: '', participacao: '', nacionalidade: 'Brasil', endereco: '', documento: '', isPEP: 'nao' }
      : { nome: '', cargo: 'socio', cpf: '', email: '', isPEP: 'nao' };
    
    // Add item first, then edit it (simplifies logic vs managing temp state)
    // Actually, better to manage temp state in dialog and save on confirm
    setEditingItem({ type, index: -1, data: emptyData });
    setIsDialogOpen(true);
  };

  const saveEdit = () => {
    if (editingItem.index === -1) {
      // New item
      const listName = editingItem.type === 'ubo' ? 'uboList' : 'sociosList';
      handleAddArrayItem(listName, editingItem.data);
    } else {
      // Update item
      const listName = editingItem.type === 'ubo' ? 'uboList' : 'sociosList';
      // We need to update all fields. handleArrayChange updates one field.
      // We can assume parent component has a way to update whole item or we iterate
      // But props provided are handleArrayChange. 
      // Let's iterate keys.
      Object.keys(editingItem.data).forEach(key => {
        handleArrayChange(listName, editingItem.index, key, editingItem.data[key]);
      });
    }
    setIsDialogOpen(false);
  };

  const updateEditField = (field, value) => {
    setEditingItem(prev => ({ ...prev, data: { ...prev.data, [field]: value } }));
  };

  return (
    <div className="space-y-4">
      {/* SECTION 1: UBOs */}
      <FormSection title="Beneficiários Finais (UBO)" subtitle="Sócios com > 25% de participação" icon={Users} collapsible={false}>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
             <Label className="text-xs font-semibold">Lista de Beneficiários</Label>
             <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => openNew('ubo')}>
               <Plus className="w-3 h-3 mr-1" /> Adicionar
             </Button>
          </div>
          
          <div className="space-y-2">
            {ubos.map((ubo, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded text-xs">
                <div>
                  <p className="font-semibold text-slate-700">{ubo.nome || 'Sem nome'}</p>
                  <p className="text-slate-500">{ubo.participacao}% - {ubo.documento}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => openEdit('ubo', idx, ubo)}>
                    <Edit2 className="w-3 h-3 text-blue-500" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRemoveArrayItem('uboList', idx)}>
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {ubos.length === 0 && <p className="text-[10px] text-gray-400 italic">Nenhum beneficiário cadastrado.</p>}
          </div>
        </div>
      </FormSection>

      {/* SECTION 2: Socios */}
      <FormSection title="Sócios e Administradores" subtitle="Gestão da empresa" icon={Users} collapsible={false}>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
             <Label className="text-xs font-semibold">Lista de Sócios/Admins</Label>
             <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => openNew('socio')}>
               <Plus className="w-3 h-3 mr-1" /> Adicionar
             </Button>
          </div>
          
          <div className="space-y-2">
            {socios.map((socio, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded text-xs">
                <div>
                  <p className="font-semibold text-slate-700">{socio.nome || 'Sem nome'}</p>
                  <p className="text-slate-500 capitalize">{socio.cargo} - {socio.cpf}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => openEdit('socio', idx, socio)}>
                    <Edit2 className="w-3 h-3 text-blue-500" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRemoveArrayItem('sociosList', idx)}>
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
             {socios.length === 0 && <p className="text-[10px] text-gray-400 italic">Nenhum sócio cadastrado.</p>}
          </div>
        </div>
      </FormSection>

      {/* DIALOG FOR EDITING */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.index === -1 ? 'Adicionar' : 'Editar'} {editingItem?.type === 'ubo' ? 'Beneficiário' : 'Sócio'}
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="grid gap-3 py-2">
              <div className="space-y-1">
                <Label className="text-xs">Nome Completo</Label>
                <Input className="h-8 text-xs" value={editingItem.data.nome} onChange={(e) => updateEditField('nome', e.target.value)} />
              </div>
              
              {editingItem.type === 'ubo' && (
                 <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Participação %</Label>
                      <Input className="h-8 text-xs" type="number" value={editingItem.data.participacao} onChange={(e) => updateEditField('participacao', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Documento (CPF/Pass)</Label>
                      <Input className="h-8 text-xs" value={editingItem.data.documento} onChange={(e) => updateEditField('documento', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Endereço</Label>
                    <Textarea className="h-16 text-xs resize-none" value={editingItem.data.endereco} onChange={(e) => updateEditField('endereco', e.target.value)} />
                  </div>
                 </>
              )}

              {editingItem.type === 'socio' && (
                 <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Cargo</Label>
                      <Select value={editingItem.data.cargo} onValueChange={(v) => updateEditField('cargo', v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="socio">Sócio</SelectItem>
                          <SelectItem value="administrador">Admin</SelectItem>
                          <SelectItem value="diretor">Diretor</SelectItem>
                          <SelectItem value="procurador">Procurador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">CPF</Label>
                      <Input className="h-8 text-xs" value={editingItem.data.cpf} onChange={(e) => updateEditField('cpf', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input className="h-8 text-xs" value={editingItem.data.email} onChange={(e) => updateEditField('email', e.target.value)} />
                  </div>
                 </>
              )}

              <div className="space-y-2 pt-2 border-t">
                 <Label className="text-xs block">É Pessoa Politicamente Exposta (PEP)?</Label>
                 <div className="flex gap-2">
                    <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={editingItem.data.isPEP === 'sim'} onClick={() => updateEditField('isPEP', 'sim')}>Sim</SelectionButton>
                    <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={editingItem.data.isPEP === 'nao'} onClick={() => updateEditField('isPEP', 'nao')}>Não</SelectionButton>
                 </div>
                 {editingItem.data.isPEP === 'sim' && (
                   <Textarea className="h-14 text-xs resize-none" placeholder="Detalhes PEP" value={editingItem.data.detalhePEP || ''} onChange={(e) => updateEditField('detalhePEP', e.target.value)} />
                 )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" onClick={saveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}