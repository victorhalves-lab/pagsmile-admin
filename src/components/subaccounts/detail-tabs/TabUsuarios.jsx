import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users } from 'lucide-react';

const roleLabels = {
  admin: 'Administrador',
  financial: 'Financeiro',
  operations: 'Operações',
  viewer: 'Visualizador',
  developer: 'Desenvolvedor',
};

const userStatusConfig = {
  active: { label: 'Ativo', color: 'bg-green-100 text-green-700' },
  inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
  blocked: { label: 'Bloqueado', color: 'bg-red-100 text-red-700' },
};

export default function TabUsuarios({ subaccount }) {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['clientUsers', subaccount.id],
    queryFn: () => base44.entities.ClientUser.filter({ subaccount_id: subaccount.id }),
    enabled: !!subaccount.id,
  });

  if (isLoading) return <p className="text-sm text-gray-400 py-6 text-center animate-pulse">Carregando...</p>;

  if (users.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Nenhum usuário cadastrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((u, i) => {
        const st = userStatusConfig[u.status] || userStatusConfig.pending;
        return (
          <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">{(u.full_name || 'U')[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{u.full_name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{roleLabels[u.role] || u.role}</Badge>
              <Badge className={st.color}>{st.label}</Badge>
              {u.mfa_enabled && <Badge className="bg-purple-100 text-purple-700 text-[10px]">MFA</Badge>}
            </div>
          </div>
        );
      })}
    </div>
  );
}