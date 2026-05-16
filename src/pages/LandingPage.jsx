import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { getLogoUrlByTheme } from '@/components/utils/branding';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, Map } from 'lucide-react';
import LanguageSelector from '@/components/i18n/LanguageSelector';

/**
 * LandingPage · V7 (Pagsmile Pulse)
 * - Background: gradient navy 900→700→900 (token oficial)
 * - Logo + título com eyebrow mono mint
 * - CTAs hierárquicos: primary mint sólido / outline navy / ghost
 * - Highlight halo: mint #2bc196 + highlight #5cf7cf
 */
export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = () => {
    localStorage.removeItem('showComplianceAlert');
    navigate(createPageUrl('Dashboard'));
  };

  return (
    <div className="min-h-screen bg-pag-navy-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector variant="landing" />
      </div>

      {/* Background — gradient navy oficial */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 50% 0%, rgba(43,193,150,0.18), transparent 60%), radial-gradient(900px 500px at 50% 100%, rgba(92,247,207,0.12), transparent 60%), linear-gradient(180deg, #001124 0%, #002443 50%, #001124 100%)',
        }}
      />
      {/* Mint glow blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-pag-mint-500/15 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-pag-highlight-500/10 blur-[140px] pointer-events-none z-0" />

      <div className="text-center space-y-10 max-w-md w-full relative z-10">
        {/* Eyebrow */}
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-pag-mint-400">
          Pagsmile · Pulse
        </p>

        {/* Logo */}
        <div className="relative">
          <img
            src={getLogoUrlByTheme('dark')}
            alt="PagSmile Logo"
            className="mx-auto h-24 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Tagline */}
        <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
          {t('landing.tagline', 'Pagamentos inteligentes, reconciliação automática e IA aplicada ao seu fluxo financeiro.')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          {/* Primary — mint sólido */}
          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full h-12 text-base font-semibold rounded-[10px] bg-pag-mint-500 hover:bg-pag-mint-600 active:bg-pag-mint-700 text-white shadow-v7-glow-mint border-0 transition-colors"
          >
            {t('landing.login')}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          {/* Secondary — outline highlight */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full h-11 text-sm font-medium rounded-[10px] bg-transparent border border-pag-mint-500/30 text-pag-mint-300 hover:bg-pag-mint-500/10 hover:border-pag-mint-500/50 hover:text-pag-highlight-500 transition-colors"
          >
            <Link to={createPageUrl('AccountCreationStep1')}>
              {t('landing.create_account')}
            </Link>
          </Button>

          {/* Tertiary — ghost mint */}
          <a
            href="https://pagsmileonboarding.base44.app/QuestionarioPublico?tipo=manual"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 text-sm font-medium rounded-[10px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-pag-mint-400" />
            {t('landing.custom_proposal')}
          </a>

          <Link
            to={createPageUrl('PlatformMap')}
            className="w-full py-2.5 text-sm font-medium rounded-[10px] text-slate-400 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Map className="w-4 h-4" />
            Mapa da Plataforma
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
          © {new Date().getFullYear()} Pagsmile · {t('landing.copyright')}
        </div>
      </div>
    </div>
  );
}