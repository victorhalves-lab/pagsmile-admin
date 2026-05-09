import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Receipt, Download } from 'lucide-react';
import {
  mockTaxKPIs,
  mockTaxRules,
  mockTaxLedger,
  mockFiscalDocuments,
} from '@/components/mentor/mocks/splitTaxFiscalMock';
import MentorTaxKPIBar from '@/components/mentor/split/MentorTaxKPIBar';
import MentorTaxRulesPanel from '@/components/mentor/split/MentorTaxRulesPanel';
import MentorTaxLedgerTable from '@/components/mentor/split/MentorTaxLedgerTable';
import MentorFiscalDocumentsList from '@/components/mentor/split/MentorFiscalDocumentsList';
import { toast } from 'sonner';

export default function SplitTaxFiscalHub() {
  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Tax & Fiscal Hub · Splits"
        subtitle="Gestão Mentor de retenções tributárias, declarações e informes de rendimento"
        icon={Receipt}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Splits', page: 'SplitManagement' },
          { label: 'Tax & Fiscal' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge className="bg-violet-100 text-violet-700 gap-1">
              <Sparkles className="w-3 h-3" /> Mentor · Wave H.11
            </Badge>
            <Button size="sm" variant="outline" onClick={() => toast.success('Pacote fiscal completo gerado')}>
              <Download className="w-3.5 h-3.5 mr-1" /> Pacote fiscal
            </Button>
          </div>
        }
      />

      <MentorTaxKPIBar kpis={mockTaxKPIs} />

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="ledger">Ledger ({mockTaxLedger.length})</TabsTrigger>
          <TabsTrigger value="rules">Regras Fiscais</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <MentorFiscalDocumentsList docs={mockFiscalDocuments} />
        </TabsContent>

        <TabsContent value="ledger">
          <MentorTaxLedgerTable entries={mockTaxLedger} />
        </TabsContent>

        <TabsContent value="rules">
          <MentorTaxRulesPanel rules={mockTaxRules} />
        </TabsContent>
      </Tabs>
    </div>
  );
}