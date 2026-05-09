import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, User, Edit, CheckCircle2, GitBranch, Copy } from 'lucide-react';

const MOCK_AUDIT = [
  { id: 'a_001', actor: 'comercial@pagsmile.com', action: 'rate_changed', label: 'Spread Visa Crédito alterado de 0.40% para 0.45%', timestamp: '2026-04-12T14:30:00', icon: Edit, color: 'text-amber-600' },
  { id: 'a_002', actor: 'cfo@pagsmile.com', action: 'approved', label: 'Versão 4 aprovada', timestamp: '2026-04-10T09:15:00', icon: CheckCircle2, color: 'text-emerald-600' },
  { id: 'a_003', actor: 'comercial@pagsmile.com', action: 'version_created', label: 'Versão 4 criada (rascunho)', timestamp: '2026-04-08T11:00:00', icon: GitBranch, color: 'text-violet-600' },
  { id: 'a_004', actor: 'comercial@pagsmile.com', action: 'cloned_from', label: 'Plano clonado a partir de SP-BR-2025-OLD', timestamp: '2025-11-15T10:00:00', icon: Copy, color: 'text-blue-600' },
];

export default function SalesPlanAuditTab({ plan }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><History className="w-4 h-4" />Trilha de auditoria imutável</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-3">
            {MOCK_AUDIT.map((a) => (
              <li key={a.id} className="ml-4">
                <div className={`absolute w-3 h-3 rounded-full -left-[7px] mt-1.5 ${a.color.replace('text-', 'bg-')}`} />
                <Card>
                  <CardContent className="p-3 flex items-start gap-3">
                    <a.icon className={`w-4 h-4 ${a.color} mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{a.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <User className="w-2.5 h-2.5" />
                        <strong>{a.actor}</strong> · {new Date(a.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[9px]">{a.action}</Badge>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}