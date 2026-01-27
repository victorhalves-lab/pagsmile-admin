import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QuantityVariationsSection({ formData, setFormData }) {
  const addVariation = () => {
    const variations = formData.variations || [];
    setFormData({
      ...formData,
      variations: [...variations, { name: '', options: [{ label: '', price_diff: 0 }] }]
    });
  };

  const updateVariation = (index, field, value) => {
    const variations = [...(formData.variations || [])];
    variations[index][field] = value;
    setFormData({ ...formData, variations });
  };

  const addVariationOption = (varIndex) => {
    const variations = [...(formData.variations || [])];
    variations[varIndex].options.push({ label: '', price_diff: 0 });
    setFormData({ ...formData, variations });
  };

  const updateVariationOption = (varIndex, optIndex, field, value) => {
    const variations = [...(formData.variations || [])];
    variations[varIndex].options[optIndex][field] = value;
    setFormData({ ...formData, variations });
  };

  const removeVariation = (index) => {
    const variations = [...(formData.variations || [])];
    variations.splice(index, 1);
    setFormData({ ...formData, variations });
  };

  const removeVariationOption = (varIndex, optIndex) => {
    const variations = [...(formData.variations || [])];
    variations[varIndex].options.splice(optIndex, 1);
    setFormData({ ...formData, variations });
  };

  const addCustomField = () => {
    const fields = formData.custom_fields || [];
    setFormData({
      ...formData,
      custom_fields: [...fields, { label: '', type: 'text', required: false, options: [] }]
    });
  };

  const updateCustomField = (index, field, value) => {
    const fields = [...(formData.custom_fields || [])];
    fields[index][field] = value;
    setFormData({ ...formData, custom_fields: fields });
  };

  const removeCustomField = (index) => {
    const fields = [...(formData.custom_fields || [])];
    fields.splice(index, 1);
    setFormData({ ...formData, custom_fields: fields });
  };

  return (
    <div className="space-y-6">
      {/* Quantity Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Quantidade</CardTitle>
            <Switch
              checked={formData.allow_quantity || false}
              onCheckedChange={(v) => setFormData({ ...formData, allow_quantity: v })}
            />
          </div>
        </CardHeader>
        {formData.allow_quantity && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Quantidade Mínima</Label>
                <Input
                  type="number"
                  value={formData.min_quantity || 1}
                  onChange={(e) => setFormData({ ...formData, min_quantity: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Quantidade Máxima</Label>
                <Input
                  type="number"
                  value={formData.max_quantity || ''}
                  onChange={(e) => setFormData({ ...formData, max_quantity: parseInt(e.target.value) || null })}
                  min="1"
                  placeholder="Sem limite"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Variations */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Variações do Produto</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addVariation}>
              <Plus className="w-3 h-3 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {(formData.variations || []).length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma variação configurada (ex: tamanho, cor)</p>
          ) : (
            formData.variations.map((variation, varIndex) => (
              <div key={varIndex} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nome da variação (ex: Tamanho)"
                    value={variation.name}
                    onChange={(e) => updateVariation(varIndex, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeVariation(varIndex)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 pl-4">
                  {variation.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <Input
                        placeholder="Opção (ex: P, M, G)"
                        value={opt.label}
                        onChange={(e) => updateVariationOption(varIndex, optIndex, 'label', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="+R$"
                        value={opt.price_diff || ''}
                        onChange={(e) => updateVariationOption(varIndex, optIndex, 'price_diff', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      {variation.options.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeVariationOption(varIndex, optIndex)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addVariationOption(varIndex)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Opção
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Custom Fields */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Campos Customizados</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
              <Plus className="w-3 h-3 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {(formData.custom_fields || []).length === 0 ? (
            <p className="text-sm text-gray-500">Colete informações adicionais do cliente</p>
          ) : (
            formData.custom_fields.map((field, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <Input
                  placeholder="Nome do campo"
                  value={field.label}
                  onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={field.type}
                  onValueChange={(v) => updateCustomField(index, 'type', v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="select">Seleção</SelectItem>
                    <SelectItem value="textarea">Texto longo</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Obrig.</span>
                  <Switch
                    checked={field.required}
                    onCheckedChange={(v) => updateCustomField(index, 'required', v)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomField(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}