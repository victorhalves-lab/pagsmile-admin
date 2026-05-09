import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { USER_STATUS, USER_ROLES, USER_DEPARTMENTS } from '@/components/mentor/mocks/usersMock';

export default function UsersFilters({ filters, onChange }) {
  const update = (k, v) => onChange({ ...filters, [k]: v });
  const clearAll = () => onChange({ search: '', status: 'all', role: 'all', department: 'all', mfa: 'all', dormant: 'all' });
  const hasFilters = filters.search || ['status', 'role', 'department', 'mfa', 'dormant'].some((k) => filters[k] && filters[k] !== 'all');

  return (
    <div className="flex flex-wrap gap-2 items-center bg-white dark:bg-slate-900 p-2 rounded-lg border">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="h-9 pl-7 text-xs"
        />
      </div>
      <Select value={filters.status} onValueChange={(v) => update('status', v)}>
        <SelectTrigger className="h-9 w-32 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos status</SelectItem>
          {Object.entries(USER_STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.role} onValueChange={(v) => update('role', v)}>
        <SelectTrigger className="h-9 w-36 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos perfis</SelectItem>
          {Object.entries(USER_ROLES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.department} onValueChange={(v) => update('department', v)}>
        <SelectTrigger className="h-9 w-40 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos departamentos</SelectItem>
          {USER_DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.mfa} onValueChange={(v) => update('mfa', v)}>
        <SelectTrigger className="h-9 w-28 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">MFA: todos</SelectItem>
          <SelectItem value="enabled">MFA ativo</SelectItem>
          <SelectItem value="disabled">Sem MFA</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.dormant} onValueChange={(v) => update('dormant', v)}>
        <SelectTrigger className="h-9 w-32 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Atividade: todos</SelectItem>
          <SelectItem value="recent">Últimos 7d</SelectItem>
          <SelectItem value="dormant">30+ dias</SelectItem>
          <SelectItem value="never">Nunca logou</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <X className="w-3 h-3 mr-1" />Limpar
        </Button>
      )}
    </div>
  );
}