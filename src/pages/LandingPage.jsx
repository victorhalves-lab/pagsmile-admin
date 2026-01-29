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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-gray-950/50 to-gray-950 pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#2bc196]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2bc196]/5 blur-[120px]" />
      </div>

      <div className="text-center space-y-12 max-w-md w-full relative z-10">
        <div className="relative">
          <img
            src={getLogoUrlByTheme('dark')}
            alt="PagSmile Logo"
            className="mx-auto h-24 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Proposta Personalizada</h1>
          <p className="text-slate-400 text-sm">Acesse sua proposta comercial exclusiva</p>
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleLogin} 
            size="lg" 
            className="w-full py-7 text-lg font-bold rounded-full bg-[#2bc196] hover:bg-[#239b7a] text-white shadow-xl shadow-[#2bc196]/20 hover:shadow-[#2bc196]/40 transition-all duration-300 transform hover:-translate-y-1 border-0"
          >
            Fazer Login
          </Button>

          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="w-full py-7 text-lg rounded-full border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 hover:text-white transition-all duration-300"
          >
            <Link to={createPageUrl('AccountCreationStep1')}>Criar Conta</Link>
          </Button>
        </div>

        <div className="pt-4 text-xs text-slate-600 font-medium">
          &copy; {new Date().getFullYear()} PagSmile. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}