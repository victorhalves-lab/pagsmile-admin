import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Empty State com Simulação [#46].
 * Substitui zeros por visualização sintética da experiência.
 * Padrão Stripe test mode / Mercury referência.
 */
export default function DashboardEmptyState({ onShowDemo }) {
  return (
    <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Bem-vindo à PagSmile! 👋
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
          Sua conta está pronta. Para você ver como ficará seu dashboard,
          mostramos uma simulação com dados de exemplo.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button onClick={onShowDemo} className="bg-[#2bc196] hover:bg-[#239b7a] text-white gap-2">
            <Eye className="w-4 h-4" />
            Ver simulação
          </Button>
          <Link to={createPageUrl('CheckoutBuilder')}>
            <Button variant="outline" className="gap-2">
              <Zap className="w-4 h-4" />
              Receber primeira venda
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          {[
            { icon: '⚡', label: 'Setup em 5 min' },
            { icon: '🎯', label: 'Aprovação +5pp' },
            { icon: '💰', label: 'Recovery automático' },
          ].map((b) => (
            <div key={b.label} className="text-center">
              <div className="text-2xl mb-1">{b.icon}</div>
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{b.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}