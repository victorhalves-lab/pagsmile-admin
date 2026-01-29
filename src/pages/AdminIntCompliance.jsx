import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard, Users, FileText, FolderOpen, Settings, History,
  Brain, ClipboardList
} from 'lucide-react';

// Import compliance components
import ComplianceDashboard from '@/components/admin-interno/compliance/ComplianceDashboard';
import ManualReviewQueue from '@/components/admin-interno/compliance/ManualReviewQueue';
import AllSubmissionsList from '@/components/admin-interno/compliance/AllSubmissionsList';
import QuestionnaireManager from '@/components/admin-interno/compliance/QuestionnaireManager';
import DocumentsRepository from '@/components/admin-interno/compliance/DocumentsRepository';
import RulesAndWorkflows from '@/components/admin-interno/compliance/RulesAndWorkflows';
import AuditHistory from '@/components/admin-interno/compliance/AuditHistory';
import HelenaTraining from '@/components/admin-interno/compliance/HelenaTraining';

export default function AdminIntCompliance() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <PageHeader
        title="QIC Compliance"
        subtitle="Centro de Gerenciamento de Compliance com IA"
        breadcrumbs={[
          { label: 'Admin Interno' },
          { label: 'Risco & Compliance' },
          { label: 'QIC Compliance' }
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-8 w-full bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden lg:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="manual-review" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <Users className="w-4 h-4" />
            <span className="hidden lg:inline">Análise Manual</span>
          </TabsTrigger>
          <TabsTrigger value="all-submissions" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <ClipboardList className="w-4 h-4" />
            <span className="hidden lg:inline">Questionários</span>
          </TabsTrigger>
          <TabsTrigger value="questionnaires" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <FileText className="w-4 h-4" />
            <span className="hidden lg:inline">Gestão Forms</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <FolderOpen className="w-4 h-4" />
            <span className="hidden lg:inline">Documentos</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <Settings className="w-4 h-4" />
            <span className="hidden lg:inline">Regras</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <History className="w-4 h-4" />
            <span className="hidden lg:inline">Auditoria</span>
          </TabsTrigger>
          <TabsTrigger value="helena" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            <Brain className="w-4 h-4" />
            <span className="hidden lg:inline">Helena IA</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="mt-0">
            <ComplianceDashboard />
          </TabsContent>

          <TabsContent value="manual-review" className="mt-0">
            <ManualReviewQueue />
          </TabsContent>

          <TabsContent value="all-submissions" className="mt-0">
            <AllSubmissionsList />
          </TabsContent>

          <TabsContent value="questionnaires" className="mt-0">
            <QuestionnaireManager />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <DocumentsRepository />
          </TabsContent>

          <TabsContent value="rules" className="mt-0">
            <RulesAndWorkflows />
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <AuditHistory />
          </TabsContent>

          <TabsContent value="helena" className="mt-0">
            <HelenaTraining />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}