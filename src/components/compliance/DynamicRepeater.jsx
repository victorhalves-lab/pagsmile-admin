import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function DynamicRepeater({ 
  items, 
  onAddItem, 
  onRemoveItem, 
  renderItem, 
  label,
  addLabel,
  maxItems = 10,
  minItems = 0 
}) {
  const canAdd = items.length < maxItems;
  const canRemove = items.length > minItems;

  return (
    <div className="space-y-4">
      {label && <Label className="text-base font-semibold text-gray-700">{label}</Label>}
      
      {items.map((item, index) => (
        <div key={index} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50/50">
          <div className="absolute -top-3 left-3 bg-white px-2 text-xs font-medium text-gray-500">
            #{index + 1}
          </div>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onRemoveItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <div className="pr-10">
            {renderItem(item, index)}
          </div>
        </div>
      ))}
      
      {canAdd && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onAddItem} 
          className="w-full border-dashed border-2 hover:border-[#00D26A] hover:text-[#00D26A]"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          {addLabel || `Adicionar ${label?.toLowerCase() || 'item'}`}
        </Button>
      )}
    </div>
  );
}