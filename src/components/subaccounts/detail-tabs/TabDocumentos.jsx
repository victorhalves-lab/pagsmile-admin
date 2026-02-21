import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, CheckCircle2, Clock, XCircle } from 'lucide-react';

const docStatusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700', icon: XCircle },
  expired: { label: 'Expirado', color: 'bg-gray-100 text-gray-600', icon: Clock },
};

export default function TabDocumentos({ subaccount }) {
  const { data: submissions = [] } = useQuery({
    queryKey: ['complianceSubmissions', subaccount.id],
    queryFn: () => base44.entities.ComplianceSubmission.filter({ subaccount_id: subaccount.id }),
    enabled: !!subaccount.id,
  });

  // Collect docs from subaccount.documents and submissions
  const subDocs = subaccount.documents || [];
  const submissionDocs = submissions.flatMap(s => s.documents_submitted || []);
  const allDocs = [...subDocs, ...submissionDocs];

  if (allDocs.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Nenhum documento encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {allDocs.map((doc, i) => {
        const st = docStatusConfig[doc.status] || docStatusConfig.pending;
        const StIcon = st.icon;
        return (
          <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-sm">{doc.name || doc.type || doc.document_type || `Documento ${i + 1}`}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {doc.type || doc.document_type || '-'}
                  {doc.uploaded_at && ` • ${new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}`}
                </p>
                {doc.rejection_reason && <p className="text-xs text-red-500 mt-1">Motivo: {doc.rejection_reason}</p>}
                {doc.helena_analysis && <p className="text-xs text-blue-600 mt-1">IA: {doc.helena_analysis}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={st.color}>
                <StIcon className="w-3 h-3 mr-1" />
                {st.label}
              </Badge>
              {doc.url && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}