import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';

export default function ValueConfigSection({ formData, setFormData }) {
  const addSuggestedAmount = () => {
    const amounts = formData.suggested_amounts || [];
    if (amounts.length < 5) {
      setFormData({ ...formData, suggested_amounts: [...amounts, 0] });
    }
  };

  const updateSuggestedAmount = (index, value) => {
    const amounts = [...(formData.suggested_amounts || [])];
    amounts[index] = parseFloat(value) || 0;
    setFormData({ ...formData, suggested_amounts: amounts });
  };

  const removeSuggestedAmount = (index) => {
    const amounts = [...(formData.suggested_amounts || [])];
    amounts.splice(index, 1);
    setFormData({ ...formData, suggested_amounts: amounts });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Tipo de Valor *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'fixed', label: 'Valor Fixo', desc: 'Valor exato a ser cobrado' },
            { id: 'open', label: 'Valor Aberto', desc: 'Cliente define o valor' },
            { id: 'minimum', label: 'Valor Mínimo', desc: 'Cliente paga igual ou acima' }
          ].map((option) => (
            <div
              key={option.id}
              onClick={() => setFormData({ ...formData, value_type: option.id })}
              className={`
                cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200
                ${formData.value_type === option.id 
                  ? 'border-[#00D26A] bg-[#00D26A]/5 shadow-sm' 
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                }
              `}
            >
              <div className="flex flex-col gap-1.5">
                <span className={`font-semibold text-sm ${formData.value_type === option.id ? 'text-[#00D26A]' : 'text-slate-900'}`}>
                  {option.label}
                </span>
                <span className="text-xs text-slate-500 leading-snug">
                  {option.desc}
                </span>
              </div>
              {formData.value_type === option.id && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#00D26A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {formData.value_type === 'fixed' && (
        <div>
          <Label className="text-sm font-medium">Valor (R$) *</Label>
          <Input
            type="number"
            placeholder="0,00"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            min="1"
            step="0.01"
            className="mt-1.5"
          />
        </div>
      )}

      {(formData.value_type === 'open' || formData.value_type === 'minimum') && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Valor Mínimo (R$)</Label>
              <Input
                type="number"
                placeholder="10,00"
                value={formData.min_amount || ''}
                onChange={(e) => setFormData({ ...formData, min_amount: parseFloat(e.target.value) || 0 })}
                min="1"
                step="0.01"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Valor Máximo (R$)</Label>
              <Input
                type="number"
                placeholder="Sem limite"
                value={formData.max_amount || ''}
                onChange={(e) => setFormData({ ...formData, max_amount: parseFloat(e.target.value) || null })}
                min="1"
                step="0.01"
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Valores Sugeridos</Label>
              {(formData.suggested_amounts || []).length < 5 && (
                <Button type="button" variant="outline" size="sm" onClick={addSuggestedAmount}>
                  <Plus className="w-3 h-3 mr-1" />
                  Adicionar
                </Button>
              )}
            </div>
            {(formData.suggested_amounts || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.suggested_amounts.map((amount, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => updateSuggestedAmount(index, e.target.value)}
                      className="w-24"
                      placeholder="R$"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => removeSuggestedAmount(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum valor sugerido adicionado</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}