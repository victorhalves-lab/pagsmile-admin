import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Card } from '@/components/ui/card';
import { Sparkles, FileText, Bot, Clock, Shield, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BUSINESS_SEGMENTS } from '@/components/onboarding/v2/BusinessSegmentSelector';

/**
 * Banner destacado dentro da área logada para clientes que ainda não
 * completaram o KYC/KYB (Know Your Customer / Know Your Business).
 *
 * Oferece 2 caminhos:
 *  - 🤖 KYC/KYB com IA (OnboardingAgentChat) — guiado, conversacional, ~15 min
 *  - 📋 KYC/KYB Tradicional (ComplianceFullKYC) — formulário oficial baseado na doc v4.0
 *
 * Só é mostrado se localStorage('compliance_completed') !== 'true'.
 */
export default function QicCallToActionBanner() {
  const [dismissed, setDismissed] = React.useState(false);
  const completed = typeof window !== 'undefined' && localStorage.getItem('compliance_completed') === 'true';
  const segmentId = typeof window !== 'undefined' ? localStorage.getItem('onboarding_segment') : null;
  const segment = BUSINESS_SEGMENTS.find((s) => s.id === segmentId);

  if (completed || dismissed) return null;

  return (
    <Card className="relative overflow-hidden border-2 border-[#2bc196]/30 bg-gradient-to-br from-[#2bc196]/5 via-emerald-50/50 to-cyan-50/30 dark:from-[#2bc196]/10 dark:via-[#003459]/50 dark:to-[#002443]/50">
      {/* Decoração */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#2bc196]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/50 transition-colors z-10"
        aria-label="Fechar"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>

      <div className="relative p-6 lg:p-8">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center shadow-lg shadow-[#2bc196]/30 flex-shrink-0">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
                Complete seu KYC/KYB para começar a operar
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider">
                Obrigatório
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              O processo de KYC/KYB (Know Your Customer / Know Your Business) é exigido pela Circular BCB 3.978/2020.
              Sem ele você não pode processar pagamentos.
              {segment && (
                <> Adaptado para o segmento <strong className="text-[#2bc196]">{segment.label}</strong>.</>
              )}
            </p>
          </div>
        </div>

        {/* 2 caminhos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Caminho A — QIC com IA (recomendado) */}
          <Link
            to={createPageUrl('OnboardingAgentChat')}
            className="group relative block p-5 rounded-2xl border-2 border-[#2bc196] bg-gradient-to-br from-white to-emerald-50/50 hover:shadow-xl hover:shadow-[#2bc196]/20 transition-all hover:-translate-y-1"
          >
            <span className="absolute -top-2 -right-2 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
              ✨ Recomendado
            </span>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-base text-slate-900">KYC/KYB com IA</p>
                <p className="text-xs text-slate-500">Conversacional, guiado, mais rápido</p>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 mb-4">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#2bc196]" />
                <span>~15 minutos · pronto na hora</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#2bc196]" />
                <span>Documentos lidos automaticamente</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#2bc196]" />
                <span>Score V4 calculado em tempo real</span>
              </li>
            </ul>
            <div className="inline-flex items-center gap-1 text-sm font-bold text-[#2bc196] group-hover:gap-2 transition-all">
              Começar agora <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Caminho B — QIC tradicional */}
          <Link
            to={createPageUrl('ComplianceFullKYC')}
            className="group relative block p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg transition-all hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-md flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-base text-slate-900 dark:text-white">KYC/KYB Tradicional</p>
                <p className="text-xs text-slate-500">Formulário oficial completo</p>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>~30–45 minutos · pode salvar e voltar</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Baseado na doc oficial v4.0</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Você no controle de cada resposta</span>
              </li>
            </ul>
            <div className="inline-flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:gap-2 transition-all">
              Preencher formulário <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-4">
          Ambos os caminhos cumprem a Circular BCB 3.978/2020. Você escolhe pela conveniência.
        </p>
      </div>
    </Card>
  );
}