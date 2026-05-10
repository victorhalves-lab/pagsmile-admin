import React from 'react';
import { Link } from 'react-router-dom';
import { LinkIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';

export default function AdminIntComplianceFormLink() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <PageHeader
        title="Gerar Link de Formulário"
        subtitle="Página unificada de geração de links — agora consolidada na página principal de Links"
        icon={LinkIcon}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Form Link' },
        ]}
      />

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#2bc196]/10 flex items-center justify-center mx-auto mb-6">
          <LinkIcon className="w-8 h-8 text-[#2bc196]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Funcionalidade movida para "Links de Compliance"
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto mb-6">
          Agora todos os tipos de links (Self, Doc-Only, Só CAF, CAF + Documentos, Pré-preenchido, Subseller PJ/PF e por segmento V4) estão consolidados em um só lugar.
        </p>
        <Button asChild>
          <Link to="/AdminIntComplianceLinks">
            Ir para Links de Compliance <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}