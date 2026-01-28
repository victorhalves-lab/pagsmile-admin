import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

export default function AdminIntPlaceholder({ title, description, module = "Admin Interno" }) {
  return (
    <div className="space-y-6">
      <PageHeader 
        title={title}
        subtitle={module}
        breadcrumbs={[
            { label: module, page: '#' },
            { label: title, page: '#' }
        ]}
      />
      
      <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <Construction className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            {description || "Este módulo está em desenvolvimento. Aguarde as próximas atualizações para acessar as funcionalidades completas."}
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
              Em Breve
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
              v2.0
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}