import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/components/utils';
import { format } from 'date-fns';
import { Settings, Clock, CheckCircle2, XCircle } from 'lucide-react';

const reqStatusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
  under_review: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700' },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-600' },
};

export default function TabLimites({ subaccount }) {
  const s = subaccount;
  const limits = s.limits || {};

  const { data: requests = [] } = useQuery({
    queryKey: ['limitRequests', s.id],
    queryFn: () => base44.entities.ClientLimitRequest.filter({ subaccount_id: s.id }, '-created_date', 20),
    enabled: !!s.id,
  });

  const limitItems = [
    { label: 'Limite por Transação (Geral)', value: s.limit_per_transaction || limits.per_transaction },
    { label: 'Limite Diário', value: s.limit_daily || limits.daily },
    { label: 'Limite Mensal', value: s.limit_monthly || limits.monthly },
    { label: 'PIX por Transação', value: limits.pix_per_transaction },
    { label: 'PIX Diário', value: limits.pix_daily },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Limites Configurados</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {limitItems.map((l, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">{l.label}</p>
              <p className="text-base font-bold">{l.value != null ? formatCurrency(l.value) : <span className="text-gray-300">Padrão</span>}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de solicitações */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Solicitações de Alteração de Limite</h4>
        {requests.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Nenhuma solicitação encontrada</p>
        ) : (
          <div className="space-y-2">
            {requests.map((req, i) => {
              const st = reqStatusConfig[req.status] || reqStatusConfig.pending;
              return (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm">{req.limit_type}</span>
                    </div>
                    <Badge className={st.color}>{st.label}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div><span className="text-gray-400">Limite Atual</span><p className="font-medium">{formatCurrency(req.current_limit)}</p></div>
                    <div><span className="text-gray-400">Solicitado</span><p className="font-medium">{formatCurrency(req.requested_limit)}</p></div>
                    <div><span className="text-gray-400">Aprovado</span><p className="font-medium">{req.approved_limit ? formatCurrency(req.approved_limit) : '-'}</p></div>
                  </div>
                  {req.justification && <p className="text-xs text-gray-500 mt-2 bg-white p-2 rounded">{req.justification}</p>}
                  {req.admin_comments && <p className="text-xs text-blue-600 mt-1 bg-blue-50 p-2 rounded">{req.admin_comments}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}