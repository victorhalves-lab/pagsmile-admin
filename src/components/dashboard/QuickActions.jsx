import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Link2, 
  ArrowUpFromLine, 
  FileText, 
  Users, 
  RefreshCw,
  ChevronRight
} from 'lucide-react';

const actions = [
  {
    id: 'new-link',
    label: 'Novo Link',
    description: 'Criar link de pagamento',
    icon: Link2,
    color: 'bg-blue-500',
    page: 'PaymentLinks'
  },
  {
    id: 'withdraw',
    label: 'Solicitar Saque',
    description: 'Transferir saldo',
    icon: ArrowUpFromLine,
    color: 'bg-emerald-500',
    page: 'Withdrawals'
  },
  {
    id: 'report',
    label: 'Gerar Relatório',
    description: 'Exportar dados',
    icon: FileText,
    color: 'bg-purple-500',
    page: 'Reports'
  },
  {
    id: 'subaccount',
    label: 'Nova Subconta',
    description: 'Cadastrar seller',
    icon: Users,
    color: 'bg-orange-500',
    page: 'SubaccountOnboarding'
  }
];

export default function QuickActions({ className }) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3", className)}>
      {actions.map((action) => (
        <Link
          key={action.id}
          to={createPageUrl(action.page)}
          className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
        >
          <div className={cn("p-2.5 rounded-lg text-white", action.color)}>
            <action.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 group-hover:text-[#00D26A] transition-colors">
              {action.label}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {action.description}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#00D26A] transition-colors" />
        </Link>
      ))}
    </div>
  );
}