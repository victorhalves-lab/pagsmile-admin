import React, { useState } from 'react';
import { FileText, Repeat, Bell, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Cards "Em breve" para PIX Cobrança e PIX Automático (Recurring).
 * Sinaliza roadmap sem precisar do produto pronto.
 * Captura interest list para priorizar produtização.
 */
export default function ReceiveCobrancaPlaceholder() {
  const [interested, setInterested] = useState({ cobranca: false, automatico: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          PIX Avançado
        </h2>
        <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px]">
          <Sparkles className="w-2.5 h-2.5 mr-1" />
          Roadmap 2026
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PIX Cobrança */}
        <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800/40 bg-gradient-to-br from-purple-50/30 to-white dark:from-purple-950/20 dark:to-slate-900 relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px]">Em breve</Badge>
          </div>
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">PIX Cobrança</h3>
            <p className="text-xs text-slate-500 mb-3">
              QR Code com vencimento, multa, juros e desconto antes do vencimento. Padrão Mercado Pago para B2B.
            </p>
            <Button
              variant="outline"
              size="sm"
              className={interested.cobranca ? "w-full bg-purple-50 border-purple-300 text-purple-700" : "w-full border-purple-200 text-purple-600 hover:bg-purple-50"}
              onClick={() => setInterested(s => ({ ...s, cobranca: !s.cobranca }))}
            >
              <Bell className="w-3 h-3 mr-2" />
              {interested.cobranca ? 'Você será avisado' : 'Notifique-me quando lançar'}
            </Button>
          </CardContent>
        </Card>

        {/* PIX Automático */}
        <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800/40 bg-gradient-to-br from-blue-50/30 to-white dark:from-blue-950/20 dark:to-slate-900 relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">Em breve</Badge>
          </div>
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
              <Repeat className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">PIX Automático</h3>
            <p className="text-xs text-slate-500 mb-3">
              Cobranças recorrentes assinadas pelo cliente uma vez. Vital para SaaS B2B brasileiro.
            </p>
            <Button
              variant="outline"
              size="sm"
              className={interested.automatico ? "w-full bg-blue-50 border-blue-300 text-blue-700" : "w-full border-blue-200 text-blue-600 hover:bg-blue-50"}
              onClick={() => setInterested(s => ({ ...s, automatico: !s.automatico }))}
            >
              <Bell className="w-3 h-3 mr-2" />
              {interested.automatico ? 'Você será avisado' : 'Notifique-me quando lançar'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}