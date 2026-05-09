import React from 'react';
import { FileText, ArrowDownLeft, ArrowUpRight, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Header de stats no Comprovantes Hub.
 * Sumário visual + bulk download zip do mês.
 */
export default function ProofsStatsHeader({ proofs = [] }) {
  const total = proofs.length;
  const received = proofs.filter(p => p.type === 'received').reduce((s, p) => s + p.amount, 0);
  const sent = proofs.filter(p => p.type === 'sent').reduce((s, p) => s + p.amount, 0);
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-100 dark:border-slate-800">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total no período</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">{total} comprovantes</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs text-slate-500">Recebidos</p>
                <p className="text-sm font-bold text-emerald-600">{formatCurrency(received)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-xs text-slate-500">Enviados</p>
                <p className="text-sm font-bold text-red-600">{formatCurrency(sent)}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Baixar todos do mês (.zip)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}