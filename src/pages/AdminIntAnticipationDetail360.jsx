import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import { createPageUrl } from '@/components/utils';

import AnticipationHeaderCard from '@/components/mentor/anticipation/detail/AnticipationHeaderCard';
import AnticipationFinancialBreakdown from '@/components/mentor/anticipation/detail/AnticipationFinancialBreakdown';
import AnticipationReceivablesBlock from '@/components/mentor/anticipation/detail/AnticipationReceivablesBlock';
import AnticipationTimeline from '@/components/mentor/anticipation/detail/AnticipationTimeline';
import AnticipationBankAccountCard from '@/components/mentor/anticipation/detail/AnticipationBankAccountCard';
import AnticipationRegistradoraCard from '@/components/mentor/anticipation/detail/AnticipationRegistradoraCard';
import AnticipationActionsBar from '@/components/mentor/anticipation/detail/AnticipationActionsBar';
import AnticipationInsightsCard from '@/components/mentor/anticipation/detail/AnticipationInsightsCard';
import AnticipationNotesPanel from '@/components/mentor/anticipation/detail/AnticipationNotesPanel';

import { spotAnticipationsList, sampleReceivables, sampleTimeline, sampleNotes } from '@/components/mentor/mocks/spotAnticipationMock';

export default function AdminIntAnticipationDetail360() {
  const data = spotAnticipationsList[0]; // Mock — em produção, busca por ID

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ficha 360° da Antecipação"
        breadcrumbs={[
          { label: 'Financeiro' },
          { label: 'Antecipações', page: 'AdminIntAnticipations' },
          { label: data.id }
        ]}
        actions={
          <Link to={createPageUrl('AdminIntAnticipations')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
          </Link>
        }
      />

      {/* Header com identificação e KPIs principais */}
      <AnticipationHeaderCard data={data} />

      {/* Barra de ações */}
      <AnticipationActionsBar data={data} />

      {/* Insights */}
      <AnticipationInsightsCard />

      {/* Grid principal — 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnticipationFinancialBreakdown data={data} />
          <AnticipationReceivablesBlock receivables={sampleReceivables} />
          <AnticipationTimeline events={sampleTimeline} />
          <AnticipationNotesPanel notes={sampleNotes} />
        </div>

        <div className="space-y-6">
          <AnticipationBankAccountCard data={data} />
          <AnticipationRegistradoraCard data={data} />
        </div>
      </div>
    </div>
  );
}