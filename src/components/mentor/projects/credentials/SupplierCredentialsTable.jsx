import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, RefreshCw, Trash2, History, Search, Lock } from 'lucide-react';
import { SUPPLIER_TYPES, CREDENTIAL_TYPES, CREDENTIAL_STATUS } from '@/components/mentor/mocks/supplierCredentialsMock';

export default function SupplierCredentialsTable({ credentials = [], onReveal, onRenew, onRevoke, onViewHistory }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = credentials.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.supplier.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'all' && c.supplier_type !== filterType) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4" />Credenciais cadastradas ({filtered.length})
          </span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-7 text-xs w-48"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {Object.entries(SUPPLIER_TYPES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(CREDENTIAL_STATUS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left p-2 font-semibold">Credencial</th>
                <th className="text-center p-2 font-semibold">Tipo</th>
                <th className="text-left p-2 font-semibold">Valor (mascarado)</th>
                <th className="text-center p-2 font-semibold">Status</th>
                <th className="text-center p-2 font-semibold">Expira em</th>
                <th className="text-right p-2 font-semibold">Uso 30d</th>
                <th className="text-center p-2 font-semibold">Último uso</th>
                <th className="text-center p-2 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const supplier = SUPPLIER_TYPES[c.supplier_type];
                const credType = CREDENTIAL_TYPES[c.credential_type];
                const status = CREDENTIAL_STATUS[c.status];
                const daysToExpire = c.expires_at ? Math.ceil((new Date(c.expires_at).getTime() - Date.now()) / 86400000) : null;
                return (
                  <tr key={c.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="p-2">
                      <p className="font-bold text-sm">{c.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge className={`text-[9px] ${supplier?.color}`}>{supplier?.icon} {c.supplier}</Badge>
                        {c.environment === 'sandbox' && <Badge className="text-[9px] bg-amber-100 text-amber-700">SANDBOX</Badge>}
                      </div>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="text-[9px]">{credType?.icon} {credType?.label}</Badge>
                    </td>
                    <td className="p-2">
                      <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{c.masked_value}</code>
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${status?.color}`}>{status?.label}</Badge>
                    </td>
                    <td className="text-center p-2">
                      {c.expires_at ? (
                        <div>
                          <p className="text-[10px]">{new Date(c.expires_at).toLocaleDateString('pt-BR')}</p>
                          {daysToExpire !== null && daysToExpire > 0 && daysToExpire <= 90 && (
                            <Badge className="text-[9px] bg-amber-100 text-amber-700">{daysToExpire}d</Badge>
                          )}
                          {daysToExpire !== null && daysToExpire <= 0 && (
                            <Badge className="text-[9px] bg-red-100 text-red-700">vencida</Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">sem prazo</span>
                      )}
                    </td>
                    <td className="text-right p-2 font-mono">{c.usage_count_30d > 0 ? (c.usage_count_30d / 1_000_000).toFixed(2) + 'mi' : '0'}</td>
                    <td className="text-center p-2 text-[10px] text-slate-500">
                      {c.last_used_at ? new Date(c.last_used_at).toLocaleDateString('pt-BR') : 'nunca'}
                    </td>
                    <td className="text-center p-2">
                      <div className="flex justify-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onReveal?.(c)} title="Revelar (com OTP)">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onRenew?.(c)} title="Renovar">
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onViewHistory?.(c)} title="Histórico de uso">
                          <History className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600 hover:text-red-700" onClick={() => onRevoke?.(c)} title="Revogar">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}