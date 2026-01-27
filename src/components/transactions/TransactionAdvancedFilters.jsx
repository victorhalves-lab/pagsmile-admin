import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calendar } from '@/components/ui/calendar';
import { 
  SlidersHorizontal, 
  X, 
  Calendar as CalendarIcon,
  Search,
  Save,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: 'approved', label: 'Aprovada' },
  { value: 'pending', label: 'Pendente' },
  { value: 'declined', label: 'Recusada' },
  { value: 'refunded', label: 'Estornada' },
  { value: 'chargeback', label: 'Chargeback' },
  { value: 'cancelled', label: 'Cancelada' },
];

const METHOD_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'card', label: 'Cartão' },
  { value: 'pix', label: 'Pix' },
];

const BRAND_OPTIONS = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'elo', label: 'Elo' },
  { value: 'amex', label: 'American Express' },
  { value: 'hipercard', label: 'Hipercard' },
];

const INSTALLMENT_OPTIONS = [
  { value: '1', label: '1x (à vista)' },
  { value: '2-3', label: '2x a 3x' },
  { value: '4-6', label: '4x a 6x' },
  { value: '7-12', label: '7x a 12x' },
  { value: '12+', label: 'Mais de 12x' },
];

const CHANNEL_OPTIONS = [
  { value: 'api', label: 'API' },
  { value: 'checkout', label: 'Checkout Hosted' },
  { value: 'link', label: 'Link de Pagamento' },
  { value: 'subscription', label: 'Assinatura' },
];

const DECLINE_REASONS = [
  { value: 'nsf', label: 'Saldo Insuficiente' },
  { value: 'limit', label: 'Limite Excedido' },
  { value: 'fraud', label: 'Fraude/Risco' },
  { value: 'invalid', label: 'Cartão Inválido' },
  { value: 'issuer_error', label: 'Erro do Emissor' },
  { value: 'other', label: 'Outros' },
];

const PERIOD_PRESETS = [
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: 'this_month', label: 'Este mês' },
  { value: 'last_month', label: 'Mês passado' },
  { value: 'custom', label: 'Personalizado' },
];

export default function TransactionAdvancedFilters({
  filters = {},
  onChange,
  onClear,
  viewMode = 'all', // 'all', 'card', 'pix'
  savedFilters = [],
  onSaveFilter,
  onLoadFilter,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [periodPreset, setPeriodPreset] = useState('30d');

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== null && value !== undefined && value !== 'all';
  }).length;

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusToggle = (status) => {
    const current = localFilters.statuses || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    handleChange('statuses', updated);
  };

  const handleBrandToggle = (brand) => {
    const current = localFilters.brands || [];
    const updated = current.includes(brand)
      ? current.filter(b => b !== brand)
      : [...current, brand];
    handleChange('brands', updated);
  };

  const handleApply = () => {
    onChange?.(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = {};
    setLocalFilters(cleared);
    onChange?.(cleared);
    onClear?.();
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters };
    if (Array.isArray(newFilters[key])) {
      newFilters[key] = [];
    } else {
      delete newFilters[key];
    }
    onChange?.(newFilters);
    setLocalFilters(newFilters);
  };

  const getFilterLabel = (key, value) => {
    switch (key) {
      case 'statuses':
        return `Status: ${value.map(s => STATUS_OPTIONS.find(o => o.value === s)?.label).join(', ')}`;
      case 'method':
        return `Método: ${METHOD_OPTIONS.find(o => o.value === value)?.label}`;
      case 'brands':
        return `Bandeiras: ${value.map(b => BRAND_OPTIONS.find(o => o.value === b)?.label).join(', ')}`;
      case 'date_from':
        return `De: ${format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}`;
      case 'date_to':
        return `Até: ${format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}`;
      case 'search_id':
        return `ID: ${value}`;
      case 'min_value':
        return `Mín: R$ ${value}`;
      case 'max_value':
        return `Máx: R$ ${value}`;
      default:
        return `${key}: ${value}`;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por ID, cliente..."
            className="pl-9 w-64"
            value={filters.search_id || ''}
            onChange={(e) => onChange?.({ ...filters, search_id: e.target.value })}
          />
        </div>

        {/* Period Preset */}
        <Select value={periodPreset} onValueChange={setPeriodPreset}>
          <SelectTrigger className="w-40">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_PRESETS.map(preset => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Button */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filtros Avançados
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 bg-[#00D26A] text-white px-1.5 py-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[480px] p-0" align="start">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Filtros Avançados</h4>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              <Accordion type="multiple" defaultValue={['status', 'period', 'values']} className="space-y-2">
                {/* Status Filter */}
                <AccordionItem value="status" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Status da Transação
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {STATUS_OPTIONS.map(status => (
                        <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={(localFilters.statuses || []).includes(status.value)}
                            onCheckedChange={() => handleStatusToggle(status.value)}
                          />
                          <span className="text-sm">{status.label}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Method Filter */}
                <AccordionItem value="method" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Método de Pagamento
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-2 pt-2">
                      {METHOD_OPTIONS.map(method => (
                        <Button
                          key={method.value}
                          variant={localFilters.method === method.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange('method', method.value)}
                          className={localFilters.method === method.value ? 'bg-[#00D26A] hover:bg-[#00A854]' : ''}
                        >
                          {method.label}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Card Specific Filters */}
                {(viewMode === 'all' || viewMode === 'card') && (
                  <AccordionItem value="card" className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      Filtros de Cartão
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      {/* Brands */}
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">Bandeiras</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {BRAND_OPTIONS.map(brand => (
                            <Badge
                              key={brand.value}
                              variant={(localFilters.brands || []).includes(brand.value) ? 'default' : 'outline'}
                              className={cn(
                                "cursor-pointer",
                                (localFilters.brands || []).includes(brand.value) && 'bg-[#00D26A]'
                              )}
                              onClick={() => handleBrandToggle(brand.value)}
                            >
                              {brand.label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* BIN */}
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">BIN (6-8 dígitos)</Label>
                        <Input
                          placeholder="Ex: 411111"
                          value={localFilters.bin || ''}
                          onChange={(e) => handleChange('bin', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      {/* Installments */}
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">Parcelamento</Label>
                        <Select 
                          value={localFilters.installments || ''} 
                          onValueChange={(v) => handleChange('installments', v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Todas as parcelas" />
                          </SelectTrigger>
                          <SelectContent>
                            {INSTALLMENT_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 3DS Filter */}
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">3D Secure</Label>
                        <Select 
                          value={localFilters.threeds || ''} 
                          onValueChange={(v) => handleChange('threeds', v)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="with_3ds">Com 3DS</SelectItem>
                            <SelectItem value="without_3ds">Sem 3DS</SelectItem>
                            <SelectItem value="authenticated">3DS Autenticado</SelectItem>
                            <SelectItem value="failed">3DS Falhou</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Period Filter */}
                <AccordionItem value="period" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Período
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">Data Inicial</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start mt-1">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {localFilters.date_from 
                                ? format(new Date(localFilters.date_from), 'dd/MM/yyyy', { locale: ptBR })
                                : 'Selecione'
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={localFilters.date_from ? new Date(localFilters.date_from) : undefined}
                              onSelect={(date) => handleChange('date_from', date?.toISOString())}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">Data Final</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start mt-1">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {localFilters.date_to 
                                ? format(new Date(localFilters.date_to), 'dd/MM/yyyy', { locale: ptBR })
                                : 'Selecione'
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={localFilters.date_to ? new Date(localFilters.date_to) : undefined}
                              onSelect={(date) => handleChange('date_to', date?.toISOString())}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Value Range */}
                <AccordionItem value="values" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Faixa de Valor
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">Valor Mínimo</Label>
                        <Input
                          type="number"
                          placeholder="R$ 0,00"
                          value={localFilters.min_value || ''}
                          onChange={(e) => handleChange('min_value', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">Valor Máximo</Label>
                        <Input
                          type="number"
                          placeholder="R$ 10.000,00"
                          value={localFilters.max_value || ''}
                          onChange={(e) => handleChange('max_value', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Channel Filter */}
                <AccordionItem value="channel" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Canal de Origem
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {CHANNEL_OPTIONS.map(channel => (
                        <label key={channel.value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={(localFilters.channels || []).includes(channel.value)}
                            onCheckedChange={(checked) => {
                              const current = localFilters.channels || [];
                              handleChange('channels', checked 
                                ? [...current, channel.value]
                                : current.filter(c => c !== channel.value)
                              );
                            }}
                          />
                          <span className="text-sm">{channel.label}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Decline Reasons (only for declined filter) */}
                <AccordionItem value="decline" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Motivo da Recusa
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {DECLINE_REASONS.map(reason => (
                        <label key={reason.value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={(localFilters.decline_reasons || []).includes(reason.value)}
                            onCheckedChange={(checked) => {
                              const current = localFilters.decline_reasons || [];
                              handleChange('decline_reasons', checked 
                                ? [...current, reason.value]
                                : current.filter(r => r !== reason.value)
                              );
                            }}
                          />
                          <span className="text-sm">{reason.label}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Customer Filter */}
                <AccordionItem value="customer" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Cliente
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Nome ou E-mail</Label>
                      <Input
                        placeholder="Buscar cliente..."
                        value={localFilters.customer_search || ''}
                        onChange={(e) => handleChange('customer_search', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">CPF/CNPJ</Label>
                      <Input
                        placeholder="000.000.000-00"
                        value={localFilters.customer_document || ''}
                        onChange={(e) => handleChange('customer_document', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onSaveFilter?.(localFilters)}
                className="gap-1"
              >
                <Save className="w-4 h-4" />
                Salvar
              </Button>
              <Button 
                className="flex-1 bg-[#00D26A] hover:bg-[#00A854]"
                onClick={handleApply}
              >
                Aplicar Filtros
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear All Button */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="w-4 h-4 mr-1" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Active Filters Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0) || value === 'all') return null;
            return (
              <Badge 
                key={key} 
                variant="secondary"
                className="gap-1 pr-1"
              >
                {getFilterLabel(key, value)}
                <button
                  onClick={() => removeFilter(key)}
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