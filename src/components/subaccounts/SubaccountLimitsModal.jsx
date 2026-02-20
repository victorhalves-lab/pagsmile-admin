import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/components/utils';
import { Settings, Info, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const limitFields = [
  { key: 'per_transaction', label: 'Limite por Transação', description: 'Valor máximo por transação individual (todos os meios)', placeholder: '50000' },
  { key: 'daily', label: 'Limite Diário', description: 'Valor máximo processado por dia', placeholder: '200000' },
  { key: 'monthly', label: 'Limite Mensal', description: 'Valor máximo processado por mês', placeholder: '5000000' },
  { key: 'pix_per_transaction', label: 'PIX - Por Transação', description: 'Valor máximo por transação PIX', placeholder: '20000' },
  { key: 'pix_daily', label: 'PIX - Diário', description: 'Valor máximo em PIX por dia', placeholder: '100000' },
];

export default function SubaccountLimitsModal({ open, onOpenChange, subaccount }) {
  const queryClient = useQueryClient();
  const [limits, setLimits] = useState({});

  useEffect(() => {
    if (subaccount) {
      const existing = subaccount.limits || {};
      setLimits({
        per_transaction: existing.per_transaction ?? subaccount.limit_per_transaction ?? '',
        daily: existing.daily ?? subaccount.limit_daily ?? '',
        monthly: existing.monthly ?? subaccount.limit_monthly ?? '',
        pix_per_transaction: existing.pix_per_transaction ?? '',
        pix_daily: existing.pix_daily ?? '',
      });
    }
  }, [subaccount]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Subaccount.update(subaccount.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subaccounts'] });
      toast.success('Limites atualizados com sucesso!');
      onOpenChange(false);
    }
  });

  const handleSave = () => {
    const cleanLimits = {};
    Object.entries(limits).forEach(([key, value]) => {
      if (value !== '' && value != null) {
        cleanLimits[key] = parseFloat(value);
      }
    });

    updateMutation.mutate({
      limits: cleanLimits,
      limit_per_transaction: cleanLimits.per_transaction,
      limit_daily: cleanLimits.daily,
      limit_monthly: cleanLimits.monthly,
    });
  };

  if (!subaccount) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Alterar Limites</DialogTitle>
              <DialogDescription className="mt-0.5">
                {subaccount.business_name} • {subaccount.document}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {limitFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{field.label}</Label>
                {limits[field.key] && (
                  <span className="text-xs text-gray-500">
                    {formatCurrency(parseFloat(limits[field.key]) || 0)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{field.description}</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">R$</span>
                <Input
                  type="number"
                  value={limits[field.key] || ''}
                  onChange={(e) => setLimits(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="pl-10"
                  min={0}
                  step={100}
                />
              </div>
            </div>
          ))}

          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              Deixe em branco para manter o limite padrão da plataforma. Valores zerados desabilitam o meio de pagamento.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
            ) : (
              'Salvar Limites'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}