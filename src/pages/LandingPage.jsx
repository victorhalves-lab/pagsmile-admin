import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.removeItem('showComplianceAlert');
    navigate(createPageUrl('Dashboard'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1121] via-[#0F172A] to-[#1E293B] flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md w-full">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/bc75d0787_Logo-modo-claro.png"
          alt="PagSmile Logo"
          className="mx-auto h-14"
        />
        
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo à PagSmile</h1>
          <p className="text-xl text-slate-400">Transforme seus pagamentos em sorrisos</p>
        </div>
        
        <hr className="border-t border-slate-700" />

        <div className="flex flex-col gap-4">
          <Button onClick={handleLogin} size="lg" className="w-full py-6 text-lg bg-[#00D26A] hover:bg-[#00A854] text-white">
            Fazer Login
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full py-6 text-lg border-slate-600 text-slate-300 hover:bg-slate-800">
            <Link to={createPageUrl('AccountCreationStep1')}>Criar Conta</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="w-full py-6 text-lg text-slate-400 hover:text-white hover:bg-slate-800/50">
            <a href="https://preview--onboardingpagsmile.base44.app/QuestionarioPublico?tipo=manual" target="_blank" rel="noopener noreferrer">
              Receber Proposta Personalizada
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}