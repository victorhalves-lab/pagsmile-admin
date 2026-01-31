import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, PieChart } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function SimulatedReportModal({ open, onOpenChange, reportType = "QBR", reportTitle }) {
  const reportTemplates = {
    QBR: {
      title: "Quarterly Business Review - Q4 2025",
      icon: BarChart3,
      sections: [
        "Executive Summary",
        "Performance Metrics",
        "Segment Analysis",
        "Risk Overview",
        "Growth Opportunities",
        "Strategic Recommendations"
      ]
    },
    investor: {
      title: "Relatório para Investidores - Q4 2025",
      icon: PieChart,
      sections: [
        "Resumo Executivo",
        "Crescimento de GMV",
        "Análise de Margem",
        "Qualidade da Carteira",
        "Projeções Futuras"
      ]
    },
    portfolio: {
      title: "Sumário de Carteira - Janeiro 2026",
      icon: FileText,
      sections: [
        "Visão Geral da Base",
        "Segmentação por Vertical",
        "Top Merchants",
        "Análise de Risco",
        "Oportunidades de Upsell"
      ]
    }
  };

  const template = reportTemplates[reportType] || reportTemplates.QBR;
  const Icon = template.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-[#2bc196]" />
            {reportTitle || template.title}
          </DialogTitle>
          <DialogDescription>
            Prévia do relatório gerado pelo agente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Report Preview */}
          <Card className="p-6 bg-slate-50 border-2 border-dashed">
            <div className="space-y-4">
              {template.sections.map((section, idx) => (
                <div key={idx} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">{section}</h3>
                  <div className="space-y-1">
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Simulated Data Points */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <p className="text-2xl font-bold text-[#2bc196]">R$ 2.5M</p>
              <p className="text-xs text-slate-500">GMV Total</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">85%</p>
              <p className="text-xs text-slate-500">Taxa Aprovação</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">12.5%</p>
              <p className="text-xs text-slate-500">Margem</p>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Download PDF (Simulado)
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}