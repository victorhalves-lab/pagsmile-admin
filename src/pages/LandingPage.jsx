import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { getLogoUrlByTheme } from '@/components/utils/branding';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/i18n/LanguageSelector';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = () => {
    localStorage.removeItem('showComplianceAlert');
    navigate(createPageUrl('Dashboard'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002443] via-[#003459] to-[#002443] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector variant="landing" />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#004D73]/30 via-[#003459]/50 to-[#002443] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#2bc196]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2bc196]/10 blur-[120px]" />
      </div>

      <div className="text-center space-y-12 max-w-md w-full relative z-10">
        <div className="relative">
          <img
            src={getLogoUrlByTheme('dark')}
            alt="PagSmile Logo"
            className="mx-auto h-24 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleLogin} 
            size="lg" 
            className="w-full py-7 text-lg font-bold rounded-full bg-[#2bc196] hover:bg-[#239b7a] text-white shadow-xl shadow-[#2bc196]/20 hover:shadow-[#2bc196]/40 transition-all duration-300 transform hover:-translate-y-1 border-0"
          >
            {t('landing.login')}
          </Button>

          {/* Identity Onboarder — caminho recomendado (conversacional) */}
          <Link 
            to={createPageUrl('OnboardingAgentChat')}
            className="w-full py-5 px-6 text-base font-bold rounded-full bg-gradient-to-r from-[#2bc196] via-emerald-400 to-[#2bc196] text-white shadow-xl shadow-[#2bc196]/30 hover:shadow-[#2bc196]/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase tracking-wider rounded-bl-lg rounded-tr-full">
              ✨ Recomendado
            </span>
            <span className="relative z-10">🤖 Cadastro com IA — KYC em 15min</span>
          </Link>

          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="w-full py-6 text-base rounded-full border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 hover:text-white transition-all duration-300"
          >
            <Link to={createPageUrl('AccountCreationStep1')}>
              {t('landing.create_account')} (formulário tradicional)
            </Link>
          </Button>

          <a 
            href="https://pagsmileonboarding.base44.app/QuestionarioPublico?tipo=manual"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 text-base font-medium rounded-full border-2 border-[#2bc196]/30 text-[#2bc196] hover:bg-[#2bc196]/10 hover:border-[#2bc196]/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {t('landing.custom_proposal')}
          </a>

          <Link
            to={createPageUrl('PlatformMap')}
            className="w-full py-4 text-base font-medium rounded-full border-2 border-slate-700/40 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            🗺️ Mapa da Plataforma
          </Link>
        </div>

        <div className="pt-4 text-xs text-slate-600 font-medium">
          &copy; {new Date().getFullYear()} PagSmile. {t('landing.copyright')}
        </div>
      </div>
    </div>
  );
}