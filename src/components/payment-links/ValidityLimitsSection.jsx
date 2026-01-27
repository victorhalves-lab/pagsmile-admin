import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function ValidityLimitsSection({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      {/* Expiration Date */}
      <div>
        <Label className="text-sm font-medium">Data de Expiração</Label>
        <div className="mt-2 flex items-center gap-4">
          <RadioGroup
            value={formData.expiration_date ? 'set' : 'none'}
            onValueChange={(v) => {
              if (v === 'none') {
                setFormData({ ...formData, expiration_date: null });
              }
            }}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="exp-none" />
              <Label htmlFor="exp-none" className="cursor-pointer">Sem expiração</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="set" id="exp-set" />
              <Label htmlFor="exp-set" className="cursor-pointer">Definir data</Label>
            </div>
          </RadioGroup>
        </div>
        {(formData.expiration_date || formData.expiration_date === null) && (
          <div className="mt-3 flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-48 justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiration_date 
                    ? format(new Date(formData.expiration_date), 'dd/MM/yyyy', { locale: ptBR })
                    : 'Selecione a data'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expiration_date ? new Date(formData.expiration_date) : undefined}
                  onSelect={(date) => setFormData({ ...formData, expiration_date: date?.toISOString() })}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={formData.expiration_date 
                ? format(new Date(formData.expiration_date), 'HH:mm') 
                : '23:59'
              }
              onChange={(e) => {
                if (formData.expiration_date) {
                  const date = new Date(formData.expiration_date);
                  const [hours, minutes] = e.target.value.split(':');
                  date.setHours(parseInt(hours), parseInt(minutes));
                  setFormData({ ...formData, expiration_date: date.toISOString() });
                }
              }}
              className="w-28"
            />
          </div>
        )}
      </div>

      {/* Usage Limit */}
      <div>
        <Label className="text-sm font-medium">Limite de Uso</Label>
        <RadioGroup
          value={formData.usage_limit_type || 'unlimited'}
          onValueChange={(v) => setFormData({ ...formData, usage_limit_type: v })}
          className="mt-2 space-y-2"
        >
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="unlimited" id="use-unlimited" />
            <Label htmlFor="use-unlimited" className="cursor-pointer">Ilimitado</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="single" id="use-single" />
            <Label htmlFor="use-single" className="cursor-pointer">Uso único</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="limited" id="use-limited" />
            <div className="flex items-center gap-2">
              <Label htmlFor="use-limited" className="cursor-pointer">Até</Label>
              <Input
                type="number"
                value={formData.usage_limit_count || ''}
                onChange={(e) => setFormData({ ...formData, usage_limit_count: parseInt(e.target.value) || null })}
                className="w-20"
                min="1"
                disabled={formData.usage_limit_type !== 'limited'}
              />
              <span className="text-sm text-gray-500">vezes</span>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Stock */}
      <div>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Controle de Estoque</Label>
          <Switch
            checked={formData.stock !== undefined && formData.stock !== null}
            onCheckedChange={(v) => setFormData({ ...formData, stock: v ? 10 : null })}
          />
        </div>
        {formData.stock !== undefined && formData.stock !== null && (
          <div className="mt-2">
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-32"
              placeholder="Quantidade"
            />
            <p className="text-xs text-gray-500 mt-1">Quando zerar, link fica indisponível</p>
          </div>
        )}
      </div>

      {/* Operating Hours */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Horário de Funcionamento</Label>
            <p className="text-xs text-gray-500">Link só funciona em determinados horários</p>
          </div>
          <Switch
            checked={!!formData.operating_hours}
            onCheckedChange={(v) => setFormData({ 
              ...formData, 
              operating_hours: v ? { start_time: '08:00', end_time: '22:00' } : null 
            })}
          />
        </div>
        {formData.operating_hours && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <Input
                type="time"
                value={formData.operating_hours.start_time || '08:00'}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  operating_hours: { ...formData.operating_hours, start_time: e.target.value } 
                })}
                className="w-28"
              />
            </div>
            <span className="text-gray-400">até</span>
            <Input
              type="time"
              value={formData.operating_hours.end_time || '22:00'}
              onChange={(e) => setFormData({ 
                ...formData, 
                operating_hours: { ...formData.operating_hours, end_time: e.target.value } 
              })}
              className="w-28"
            />
          </div>
        )}
      </div>
    </div>
  );
}