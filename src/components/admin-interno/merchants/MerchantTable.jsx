import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { formatCurrency } from '@/components/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  MoreVertical, Eye, Edit, Key, Mail, Phone, Lock, Ban, XCircle,
  Copy, ExternalLink, ArrowUp, ArrowDown, CreditCard, QrCode, FileText
} from 'lucide-react';

const STATUS_CONFIG = {
  lead: { label: 'Lead', icon: '⚪', color: 'bg-slate-100 text-slate-700' },
  kyc_pending: { label: 'Em Análise', icon: '🟡', color: 'bg-yellow-100 text-yellow-700' },
  kyc_incomplete: { label: 'KYC Pendente', icon: '🟠', color: 'bg-orange-100 text-orange-700' },
  active: { label: 'Ativo', icon: '🟢', color: 'bg-green-100 text-green-700' },
  suspended: { label: 'Suspenso', icon: '🔴', color: 'bg-red-100 text-red-700' },
  blocked: { label: 'Bloqueado', icon: '⚫', color: 'bg-slate-800 text-white' },
  inactive: { label: 'Inativo', icon: '⚪', color: 'bg-slate-100 text-slate-700' },
  cancelled: { label: 'Cancelado', icon: '⚫', color: 'bg-slate-800 text-white' }
};

const CB_RATIO_CONFIG = {
  normal: { label: 'Normal', color: 'text-green-600' },
  attention: { label: 'Atenção', color: 'text-yellow-600' },
  critical: { label: 'Crítico', color: 'text-red-600' }
};

function getCBRatioStatus(ratio) {
  if (ratio < 0.65) return 'normal';
  if (ratio < 0.85) return 'attention';
  return 'critical';
}

function formatLastAccess(date) {
  if (!date) return 'Nunca';
  const now = new Date();
  const accessDate = new Date(date);
  const diffMs = now - accessDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `Há ${diffMins} min`;
  if (diffHours < 24) return `Hoje, ${accessDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays === 1) return `Ontem, ${accessDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays < 7) return accessDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  return accessDate.toLocaleDateString('pt-BR');
}

export default function MerchantTable({
  merchants,
  selectedIds,
  onSelectionChange,
  sortField,
  sortDirection,
  onSort
}) {
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(merchants.map(m => m.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(i => i !== id));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      onSort(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === merchants.length && merchants.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-20 cursor-pointer" onClick={() => handleSort('id')}>
              <div className="flex items-center gap-1">ID <SortIcon field="id" /></div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('trade_name')}>
              <div className="flex items-center gap-1">Merchant <SortIcon field="trade_name" /></div>
            </TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
              <div className="flex items-center gap-1">Status <SortIcon field="status" /></div>
            </TableHead>
            <TableHead>Métodos</TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('tpv_30d')}>
              <div className="flex items-center justify-end gap-1">TPV 30d <SortIcon field="tpv_30d" /></div>
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('cb_ratio')}>
              <div className="flex items-center justify-end gap-1">CB Ratio <SortIcon field="cb_ratio" /></div>
            </TableHead>
            <TableHead>Segmento</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('last_access')}>
              <div className="flex items-center gap-1">Último Acesso <SortIcon field="last_access" /></div>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchants.map((merchant) => {
            const status = STATUS_CONFIG[merchant.status] || STATUS_CONFIG.active;
            const cbStatus = getCBRatioStatus(merchant.cb_ratio || 0);
            const cbConfig = CB_RATIO_CONFIG[cbStatus];

            return (
              <TableRow key={merchant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(merchant.id)}
                    onCheckedChange={(checked) => handleSelectOne(merchant.id, checked)}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">{merchant.id}</TableCell>
                <TableCell>
                  <Link
                    to={createPageUrl(`AdminIntMerchantProfile?id=${merchant.id}`)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {merchant.trade_name || merchant.business_name}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {merchant.document?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
                </TableCell>
                <TableCell>
                  <Badge className={status.color}>
                    {status.icon} {status.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {merchant.methods?.includes('card') && <CreditCard className="w-4 h-4 text-blue-500" title="Cartão" />}
                    {merchant.methods?.includes('pix') && <QrCode className="w-4 h-4 text-green-500" title="PIX" />}
                    {merchant.methods?.includes('boleto') && <FileText className="w-4 h-4 text-amber-500" title="Boleto" />}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <span className="font-medium">{formatCurrency(merchant.tpv_30d || 0)}</span>
                    {merchant.tpv_change !== undefined && (
                      <span className={`text-xs ml-1 ${merchant.tpv_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {merchant.tpv_change >= 0 ? '↑' : '↓'} {Math.abs(merchant.tpv_change)}%
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {merchant.cb_ratio !== undefined ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-medium ${cbConfig.color}`}>
                        {merchant.cb_ratio.toFixed(2)}%
                      </span>
                      {cbStatus !== 'normal' && (
                        <span className={`w-2 h-2 rounded-full ${cbStatus === 'attention' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      )}
                    </div>
                  ) : '—'}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-600">{merchant.segment || '—'}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-500">{formatLastAccess(merchant.last_access)}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl(`AdminIntMerchantProfile?id=${merchant.id}`)}>
                          <Eye className="w-4 h-4 mr-2" /> Ver Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key className="w-4 h-4 mr-2" /> Credenciais API
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" /> Enviar E-mail
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="w-4 h-4 mr-2" /> Registrar Contato
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-yellow-600">
                        <Lock className="w-4 h-4 mr-2" /> Suspender
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Ban className="w-4 h-4 mr-2" /> Bloquear
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <XCircle className="w-4 h-4 mr-2" /> Cancelar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => copyToClipboard(merchant.id, 'ID')}>
                        <Copy className="w-4 h-4 mr-2" /> Copiar ID
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="w-4 h-4 mr-2" /> Copiar Link do Portal
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}