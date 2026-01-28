import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { getLogoUrlByTheme } from '@/components/utils/branding';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.removeItem('showComplianceAlert');
    navigate(createPageUrl('Dashboard'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00D26A]/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00D26A]/5 blur-[100px]" />
      </div>

      <div className="text-center space-y-10 max-w-md w-full relative z-10">
        <div className="relative">
          <img
            src={getLogoUrlByTheme('dark')}
            alt="PagSmile Logo"
            className="mx-auto h-16 drop-shadow-2xl"
          />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Bem-vindo à <span className="text-[#00D26A]">PagSmile</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Transforme seus pagamentos em sorrisos com a plataforma mais completa do mercado.
          </p>
        </div>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleLogin} 
            size="lg" 
            className="w-full py-6 text-lg font-bold shadow-lg shadow-[#00D26A]/20 hover:shadow-[#00D26A]/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Fazer Login
          </Button>
          
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="w-full py-6 text-lg border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 hover:text-white transition-all duration-300"
          >
            <Link to={createPageUrl('AccountCreationStep1')}>Criar Conta</Link>
          </Button>
          
          <Button 
            asChild 
            size="lg" 
            variant="ghost" 
            className="w-full py-6 text-base text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-300"
          >
            <a href="https://preview--onboardingpagsmile.base44.app/QuestionarioPublico?tipo=manual" target="_blank" rel="noopener noreferrer">
              Receber Proposta Personalizada
            </a>
          </Button>
        </div>

        <div className="pt-8 text-xs text-slate-600 font-medium">
          &copy; {new Date().getFullYear()} PagSmile. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}