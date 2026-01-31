import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import { 
  LayoutDashboard, Users, FileSearch, FileText, Settings2, 
  FolderOpen, History, Brain, Link2, RefreshCw, Zap, Cpu
} from 'lucide-react';

import ComplianceDashboard from '@/components/admin-interno/compliance/ComplianceDashboard';
import ComplianceQueue from '@/components/admin-interno/compliance/ComplianceQueue';
import ManualReviewQueue from '@/components/admin-interno/compliance/ManualReviewQueue';
import AllSubmissionsList from '@/components/admin-interno/compliance/AllSubmissionsList';
import QuestionnaireManager from '@/components/admin-interno/compliance/QuestionnaireManager';
import DocumentsRepository from '@/components/admin-interno/compliance/DocumentsRepository';
import RulesAndWorkflows from '@/components/admin-interno/compliance/RulesAndWorkflows';
import AuditHistory from '@/components/admin-interno/compliance/AuditHistory';
import HelenaTraining from '@/components/admin-interno/compliance/HelenaTraining';
import FormLinkGenerator from '@/components/admin-interno/compliance/FormLinkGenerator';
import RevalidationManager from '@/components/admin-interno/compliance/RevalidationManager';
import SpecialAnalysisHub from '@/components/admin-interno/compliance/SpecialAnalysisHub';
import TechnologyStack from '@/components/admin-interno/compliance/TechnologyStack';

export default function AdminIntCompliance() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', label: 'Fila de Compliance', icon: Users },
    { id: 'review', label: 'Análise Manual', icon: FileSearch },
    { id: 'submissions', label: 'Submissões', icon: FileText },
    { id: 'revalidation', label: 'Revalidação', icon: RefreshCw },
    { id: 'special', label: 'Análises Especiais', icon: Zap },
    { id: 'forms', label: 'Gestão de Forms', icon: Settings2 },
    { id: 'docs', label: 'Documentos', icon: FolderOpen },
    { id: 'rules', label: 'Regras', icon: Settings2 },
    { id: 'audit', label: 'Auditoria', icon: History },
    { id: 'helena', label: 'Helena IA', icon: Brain },
    { id: 'tech', label: 'Stack Tecnológico', icon: Cpu },
    { id: 'link', label: 'Link do Formulário', icon: Link2 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="KYC Compliance" 
        subtitle="Central de Compliance, KYC/KYB e Análise de Risco com Helena IA"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'KYC Compliance', page: 'AdminIntCompliance' }
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm rounded-lg text-sm"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="m-0">
            <ComplianceDashboard />
          </TabsContent>
          
          <TabsContent value="queue" className="m-0">
            <ComplianceQueue />
          </TabsContent>
          
          <TabsContent value="review" className="m-0">
            <ManualReviewQueue />
          </TabsContent>
          
          <TabsContent value="submissions" className="m-0">
            <AllSubmissionsList />
          </TabsContent>
          
          <TabsContent value="revalidation" className="m-0">
            <RevalidationManager />
          </TabsContent>
          
          <TabsContent value="special" className="m-0">
            <SpecialAnalysisHub />
          </TabsContent>
          
          <TabsContent value="forms" className="m-0">
            <QuestionnaireManager />
          </TabsContent>
          
          <TabsContent value="docs" className="m-0">
            <DocumentsRepository />
          </TabsContent>
          
          <TabsContent value="rules" className="m-0">
            <RulesAndWorkflows />
          </TabsContent>
          
          <TabsContent value="audit" className="m-0">
            <AuditHistory />
          </TabsContent>
          
          <TabsContent value="helena" className="m-0">
            <HelenaTraining />
          </TabsContent>
          
          <TabsContent value="tech" className="m-0">
            <TechnologyStack />
          </TabsContent>
          
          <TabsContent value="link" className="m-0">
            <FormLinkGenerator />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}