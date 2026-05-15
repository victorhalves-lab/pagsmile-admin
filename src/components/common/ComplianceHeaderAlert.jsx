import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Shield, Bot, FileText, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Alerta unificado de Compliance/KYC — substitui o duplo banner
 * (Alert no header + QicCallToActionBanner no dashboard).
 *
 * Slim, sticky-friendly, com 2 ações inline:
 *  - "Começar com IA" (recomendado)  → OnboardingAgentChat
 *  - "Formulário"                    → ComplianceFullKYC
 *
 * Dismissible apenas por sessão.
 */
export default function ComplianceHeaderAlert({ onDismiss }) {
  return (
    <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-0">
      <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 via-amber-50/80 to-emerald-50/40 dark:from-amber-900/20 dark:via-amber-900/10 dark:to-emerald-900/10 dark:border-amber-700/40 shadow-sm">
        {/* Decoração sutil */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-3 p-3 lg:p-4 flex-wrap">
          {/* Ícone */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/30 flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>

          {/* Texto principal */}
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-sm text-amber-900 dark:text-amber-100">
                Ação Necessária: Complete seu KYC/KYB
              </p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-800 text-[9px] font-black uppercase tracking-wider dark:bg-amber-700/50 dark:text-amber-100">
                Obrigatório
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-200/80 mt-0.5">
              Sua conta está quase pronta. Conclua o compliance para processar pagamentos · Circular BCB 3.978/2020.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={createPageUrl('OnboardingAgentChat')}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#2bc196] to-emerald-600 hover:from-[#239b7a] hover:to-emerald-700 text-white shadow-md gap-1.5 h-8 px-3 text-xs"
              >
                <Bot className="w-3.5 h-3.5" />
                Começar com IA
                <span className="hidden lg:inline text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">~15 min</span>
              </Button>
            </Link>
            <Link to={createPageUrl('ComplianceFullKYC')}>
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700/60 dark:text-amber-200 dark:hover:bg-amber-900/30 gap-1.5 h-8 px-3 text-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                Formulário
              </Button>
            </Link>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1.5 rounded-md text-amber-600 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/30 transition-colors"
                title="Adiar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}