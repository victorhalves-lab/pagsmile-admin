import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { 
  SlidersHorizontal, 
  X, 
  Calendar as CalendarIcon,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function FilterPanel({
  filters = [],
  values = {},
  onChange,
  onClear,
  onApply,
  className
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localValues, setLocalValues] = React.useState(values);

  const activeFiltersCount = Object.values(values).filter(v => v !== '' && v !== null && v !== undefined).length;

  const handleChange = (key, value) => {
    const newValues = { ...localValues, [key]: value };
    setLocalValues(newValues);
  };

  const handleApply = () => {
    onChange?.(localValues);
    onApply?.(localValues);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedValues = {};
    filters.forEach(f => {
      clearedValues[f.key] = '';
    });
    setLocalValues(clearedValues);
    onChange?.(clearedValues);
    onClear?.();
  };

  const renderFilter = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={localValues[filter.key] || ''}
            onValueChange={(v) => handleChange(filter.key, v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder || 'Selecione...'} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localValues[filter.key] ? (
                  format(new Date(localValues[filter.key]), 'dd/MM/yyyy', { locale: ptBR })
                ) : (
                  <span className="text-muted-foreground">{filter.placeholder || 'Selecione...'}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localValues[filter.key] ? new Date(localValues[filter.key]) : undefined}
                onSelect={(date) => handleChange(filter.key, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      
      case 'text':
      default:
        return (
          <Input
            placeholder={filter.placeholder}
            value={localValues[filter.key] || ''}
            onChange={(e) => handleChange(filter.key, e.target.value)}
          />
        );
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 bg-[#00D26A] text-white px-1.5 py-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Filtros</h4>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Limpar
                </Button>
              )}
            </div>
            
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-1.5">
                <Label className="text-sm">{filter.label}</Label>
                {renderFilter(filter)}
              </div>
            ))}
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 bg-[#00D26A] hover:bg-[#00A854]"
                onClick={handleApply}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filter badges */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => {
            const value = values[filter.key];
            if (!value) return null;
            
            const displayValue = filter.type === 'select' 
              ? filter.options?.find(o => o.value === value)?.label 
              : filter.type === 'date' 
                ? format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })
                : value;
            
            return (
              <Badge 
                key={filter.key} 
                variant="secondary"
                className="gap-1 pr-1"
              >
                {filter.label}: {displayValue}
                <button
                  onClick={() => {
                    const newValues = { ...values, [filter.key]: '' };
                    onChange?.(newValues);
                  }}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}