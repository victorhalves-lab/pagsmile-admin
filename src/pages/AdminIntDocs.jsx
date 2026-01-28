import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminIntDocs() {
    // Placeholder page for Documents management across all merchants
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Gestão de Documentos" 
                subtitle="Repositório central de documentos de merchants"
            />
            <Card>
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                    <FileText className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Repositório de Documentos</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Visualize e gerencie todos os documentos enviados pelos merchants em um só lugar. Use a busca para encontrar contratos, documentos de identificação e comprovantes.
                    </p>
                    <Button>
                        <Download className="w-4 h-4 mr-2" /> Exportar Relatório de Docs
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}