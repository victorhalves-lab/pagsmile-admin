import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Banner que materializa a tese: "GMV de cartão/PIX cai automaticamente aqui"
 * Conexão entre PSP core (Financial B10/B11) e Internet Banking.
 */
export default function PsConnectionBanner() {
  return (
    <Card className="border-2 border-[#2bc196]/30 bg-gradient-to-r from-[#2bc196]/5 via-emerald-50/50 to-blue-50/30 dark:from-[#2bc196]/10 dark:via-slate-800 dark:to-slate-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#2bc196] opacity-5 blur-3xl rounded-full" />
      <CardContent className="p-4 relative">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-500 flex items-center justify-center shadow-lg shadow-[#2bc196]/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-slate-800 dark:text-white text-sm">
                  Seus recebíveis caem direto aqui
                </p>
                <Badge className="bg-[#2bc196]/15 text-[#2bc196] border-0 text-[10px] h-5">
                  PSP integrado
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Cartão e PIX liquidados pelo PagSmile alimentam automaticamente sua conta digital — sem TED para banco externo.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/FinancialOverview">
              <Button variant="outline" size="sm" className="gap-2 border-[#2bc196]/40 text-[#2bc196] hover:bg-[#2bc196] hover:text-white">
                <Wallet className="w-4 h-4" />
                Ver Recebíveis
              </Button>
            </Link>
            <Link to="/Withdrawals">
              <Button size="sm" className="gap-2">
                Fluxo Financeiro
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}