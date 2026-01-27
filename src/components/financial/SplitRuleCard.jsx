import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeftRight,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Users,
  Percent,
  DollarSign,
  ShieldAlert,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const feePayerLabels = {
  marketplace: 'Marketplace paga MDR',
  seller: 'Seller paga MDR',
  proportional: 'MDR proporcional'
};

const chargebackLabels = {
  marketplace: 'Marketplace assume CB',
  seller: 'Seller assume CB',
  proportional: 'CB proporcional'
};

export default function SplitRuleCard({ rule, onEdit, onDelete, onDuplicate }) {
  const recipients = rule.recipients || [];
  const isActive = rule.status === 'active';

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      !isActive && "opacity-60"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isActive ? "bg-indigo-100" : "bg-gray-100"
            )}>
              <ArrowLeftRight className={cn(
                "w-5 h-5",
                isActive ? "text-indigo-600" : "text-gray-400"
              )} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{rule.name}</h3>
                {rule.is_default && (
                  <Badge variant="secondary" className="text-xs">Padrão</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{rule.description || 'Sem descrição'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? 'Ativa' : 'Inativa'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(rule)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(rule)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(rule)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Recipients */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <Users className="w-4 h-4" />
            <span>Recebedores ({recipients.length})</span>
          </div>
          {recipients.map((recipient, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
            >
              <span className="font-medium">{recipient.name || `Recebedor ${idx + 1}`}</span>
              <div className="flex items-center gap-2">
                {recipient.type === 'percentage' ? (
                  <Badge variant="outline" className="font-mono">
                    <Percent className="w-3 h-3 mr-1" />
                    {recipient.value}%
                  </Badge>
                ) : (
                  <Badge variant="outline" className="font-mono">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {formatCurrency(recipient.value)}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Rules info */}
        <div className="flex flex-wrap gap-2 pt-3 border-t">
          <Badge variant="outline" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            {feePayerLabels[rule.fee_payer] || 'MDR não definido'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <ShieldAlert className="w-3 h-3 mr-1" />
            {chargebackLabels[rule.chargeback_liable] || 'CB não definido'}
          </Badge>
        </div>

        {/* Stats */}
        {(rule.total_transactions > 0 || rule.total_volume > 0) && (
          <div className="flex gap-4 mt-3 pt-3 border-t text-xs text-gray-500">
            <span>{rule.total_transactions} transações</span>
            <span>Volume: {formatCurrency(rule.total_volume)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}