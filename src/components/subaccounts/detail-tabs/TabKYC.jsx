import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const kycStatusConfig = {
  pending: { label: 'Pendente', color: 'bg-gray-100 text-gray-700', icon: Clock },
  ai_analyzing: { label: 'IA Analisando', color: 'bg-blue-100 text-blue-700', icon: Shield },
  ai_approved: { label: 'IA Aprovado', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  ai_rejected: { label: 'IA Rejeitado', color: 'bg-red-100 text-red-700', icon: XCircle },
  manual_review: { label: 'Revisão Manual', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700', icon: XCircle },
  documents_requested: { label: 'Docs Solicitados', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
};

export default function TabKYC({ subaccount }) {
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['complianceSubmissions', subaccount.id],
    queryFn: () => base44.entities.ComplianceSubmission.filter({ subaccount_id: subaccount.id }),
    enabled: !!subaccount.id,
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['complianceAuditLogs', subaccount.id],
    queryFn: () => base44.entities.ComplianceAuditLog.filter({ subaccount_id: subaccount.id }, '-created_date', 20),
    enabled: !!subaccount.id,
  });

  return (
    <div className="space-y-6">
      {/* Status geral */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-bold text-gray-800 mb-3">Status de Compliance</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div><span className="text-gray-400">Status</span><p className="font-semibold mt-0.5">{subaccount.compliance_status || '-'}</p></div>
          <div><span className="text-gray-400">Score IA</span><p className="font-semibold mt-0.5">{subaccount.ai_compliance_score ?? '-'}/100</p></div>
          <div><span className="text-gray-400">Decisão IA</span><p className="font-semibold mt-0.5">{subaccount.ai_compliance_status || '-'}</p></div>
          <div><span className="text-gray-400">Onboarding</span><p className="font-semibold mt-0.5">{subaccount.onboarding_completed ? 'Completo' : `Passo ${subaccount.onboarding_step || 1}`}</p></div>
        </div>
        {subaccount.liveness_facematch_status && (
          <div className="mt-3 pt-3 border-t text-xs">
            <span className="text-gray-400">Liveness / FaceMatch:</span>
            <span className="ml-2 font-medium">{subaccount.liveness_facematch_status}</span>
            {subaccount.liveness_facematch_score && <span className="ml-2 text-gray-500">Score: {subaccount.liveness_facematch_score}</span>}
          </div>
        )}
      </div>

      {/* Submissões */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Questionários Respondidos</h4>
        {isLoading ? (
          <p className="text-sm text-gray-400 animate-pulse">Carregando...</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Nenhum questionário respondido</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub, i) => {
              const st = kycStatusConfig[sub.status] || kycStatusConfig.pending;
              const StIcon = st.icon;
              return (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-sm">{sub.questionnaire_type || 'KYC'}</span>
                      {sub.questionnaire_version && <span className="text-xs text-gray-400">v{sub.questionnaire_version}</span>}
                    </div>
                    <Badge className={st.color}><StIcon className="w-3 h-3 mr-1" />{st.label}</Badge>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs mt-3">
                    <div><span className="text-gray-400">Score Helena</span><p className="font-medium">{sub.helena_score ?? '-'}</p></div>
                    <div><span className="text-gray-400">Status Helena</span><p className="font-medium">{sub.helena_status || '-'}</p></div>
                    <div><span className="text-gray-400">Analista</span><p className="font-medium">{sub.assigned_analyst || '-'}</p></div>
                    <div><span className="text-gray-400">Data</span><p className="font-medium">{sub.submission_date ? format(new Date(sub.submission_date), 'dd/MM/yyyy') : '-'}</p></div>
                  </div>
                  {sub.helena_recommendation && <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">{sub.helena_recommendation}</p>}
                  {sub.helena_red_flags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {sub.helena_red_flags.map((f, j) => <Badge key={j} className="bg-red-50 text-red-600 text-[10px]">{f}</Badge>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audit Log */}
      {auditLogs.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Histórico de Compliance</h4>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {auditLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 py-2 px-3 text-xs hover:bg-gray-50 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-gray-400 ml-2">por {log.actor}</span>
                  {log.details && typeof log.details === 'object' && log.details.description && (
                    <p className="text-gray-500 mt-0.5">{log.details.description}</p>
                  )}
                </div>
                <span className="text-gray-400 text-[10px] flex-shrink-0">{log.created_date ? format(new Date(log.created_date), 'dd/MM HH:mm') : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}