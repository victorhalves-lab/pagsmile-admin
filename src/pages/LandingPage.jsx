import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { CreditCard, Zap, Shield, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1121] via-[#0F172A] to-[#1E293B]">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00D26A] flex items-center justify-center">
            <span className="text-white font-bold text-lg">PS</span>
          </div>
          <span className="text-white font-bold text-xl">PagSmile</span>
        </div>
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost" className="text-slate-300 hover:text-white">
            <Link to="#">Soluções</Link>
          </Button>
          <Button asChild variant="ghost" className="text-slate-300 hover:text-white">
            <Link to="#">Preços</Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Link to={createPageUrl('Dashboard')}>Fazer Login</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#00D26A]/10 border border-[#00D26A]/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-[#00D26A]" />
            <span className="text-[#00D26A] text-sm font-medium">Plataforma completa de pagamentos</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transforme seus
            <span className="text-[#00D26A]"> pagamentos</span>
            <br />em crescimento
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Aceite Pix e Cartão com as melhores taxas do mercado. 
            Simplifique sua operação financeira com nossa plataforma inteligente.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-[#00D26A] hover:bg-[#00A854] text-white px-8 py-6 text-lg shadow-lg shadow-[#00D26A]/25">
              <Link to={createPageUrl('AccountCreationStep1')}>Criar Conta Grátis</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg">
              <a href="https://preview--onboardingpagsmile.base44.app/QuestionarioPublico?tipo=manual" target="_blank" rel="noopener noreferrer">Receber Proposta Personalizada</a>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: CreditCard, title: 'Pix & Cartão', desc: 'Aceite todos os métodos de pagamento em uma única plataforma' },
            { icon: Shield, title: 'Compliance Automatizado', desc: 'Onboarding rápido e seguro com análise inteligente de risco' },
            { icon: TrendingUp, title: 'Dashboard Completo', desc: 'Gerencie suas transações e receitas em tempo real' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-[#00D26A]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#00D26A]/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-[#00D26A]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          © 2024 PagSmile. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}