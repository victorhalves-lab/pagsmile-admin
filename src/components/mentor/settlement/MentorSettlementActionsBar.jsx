import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  RefreshCw, Calculator, ShieldAlert, Undo2, Trash2, Send, FileDown, FileText, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

const ACTIONS = [
  { key: 'reprocess', label: 'Reprocessar', icon: RefreshCw, color: 'bg-blue-50 text-blue-700 border-blue-200', enabledFor: ['failed'] },
  { key: 'recalculate', label: 'Recalcular', icon: Calculator, color: 'bg-violet-50 text-violet-700 border-violet-200', enabledFor: ['created', 'in_validation', 'validated'], link: 'SettlementGovernanceCenter?action=recalculate' },
  { key: 'force_status', label: 'Forçar status', icon: ShieldAlert, color: 'bg-amber-50 text-amber-700 border-amber-200', enabledFor: ['in_execution', 'failed'], link: 'SettlementGovernanceCenter?action=forced_status' },
  { key: 'rollback', label: 'Rollback', icon: Undo2, color: 'bg-red-50 text-red-700 border-red-200', enabledFor: ['executed'], link: 'SettlementGovernanceCenter?action=rollback' },
  { key: 'remove', label: 'Remover', icon: Trash2, color: 'bg-red-50 text-red-700 border-red-200', enabledFor: ['created'] },
];

export default function MentorSettlementActionsBar({ settlement }) {
  const status = settlement.status;

  return (
    <Card className="border-violet-200">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[10px] uppercase font-bold text-slate-500 mr-1">Ações governadas:</p>
          {ACTIONS.map((a) => {
            const enabled = a.enabledFor.includes(status);
            const Icon = a.icon;
            const btn = (
              <Button
                key={a.key}
                variant="outline"
                size="sm"
                disabled={!enabled}
                className={`h-8 text-[11px] ${enabled ? a.color : ''}`}
                title={!enabled ? `Disponível apenas em status: ${a.enabledFor.join(', ')}` : ''}
                onClick={() => !a.link && toast.success(`${a.label} iniciado`)}
              >
                <Icon className="w-3 h-3 mr-1" /> {a.label}
              </Button>
            );
            return enabled && a.link ? (
              <Link key={a.key} to={createPageUrl(a.link)}>{btn}</Link>
            ) : btn;
          })}

          <div className="h-6 w-px bg-slate-200 mx-1" />

          <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => toast.success('Comunicação enviada ao lojista')}>
            <Send className="w-3 h-3 mr-1" /> Comunicar lojista
          </Button>
          {status === 'executed' && (
            <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => toast.success('Comprovante PDF gerado')}>
              <FileText className="w-3 h-3 mr-1" /> Comprovante
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => toast.success('Ficha completa exportada')}>
            <FileDown className="w-3 h-3 mr-1" /> Exportar ficha
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}