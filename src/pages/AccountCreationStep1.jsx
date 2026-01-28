import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Mail, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLogoUrlByTheme } from '@/components/utils/branding';
import { cn } from "@/lib/utils";
import SelectionButton from '@/components/ui/selection-button';

export default function AccountCreationStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    birthDate: '',
    isRepresentative: 'yes',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('email');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    setShowVerification(true);
  };

  const handleVerify = () => {
    // Simulação - qualquer código funciona
    localStorage.setItem('onboarding_user', JSON.stringify(formData));
    navigate(createPageUrl('PlanSelection'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-2 md:p-4 pb-24 md:pb-4">
      <Card className="w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-0 pt-4 space-y-1">
                        <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-1 hover:opacity-80 transition-opacity">
                          <img
                            src={getLogoUrlByTheme('light')}
                            alt="PagSmile Logo"
                            className="h-8"
                          />
                        </Link>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Crie sua conta</CardTitle>
            <CardDescription className="text-base text-slate-500 dark:text-slate-400">Dados do Responsável</CardDescription>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#00c295] z-10 relative shadow-[0_0_10px_rgba(0,194,149,0.4)]" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#00c295]" />
              </div>
              <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#00c295] to-emerald-500 shadow-sm" />
            </div>
            
            <div className="flex flex-col items-center gap-2 opacity-30">
               <div className="w-3 h-3 rounded-full bg-slate-200 border-2 border-slate-300" />
               <div className="w-24 h-1.5 rounded-full bg-slate-200" />
            </div>
            
            <div className="flex flex-col items-center gap-2 opacity-30">
               <div className="w-3 h-3 rounded-full bg-slate-200 border-2 border-slate-300" />
               <div className="w-24 h-1.5 rounded-full bg-slate-200" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-2">
          {!showVerification ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="space-y-2 md:col-span-6">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input id="fullName" placeholder="Seu nome completo" value={formData.fullName} onChange={handleChange} />
                </div>
                
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
                </div>
                
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(11) 99999-9999" value={formData.phone} onChange={handleChange} />
                </div>
                
                <div className="space-y-2 md:col-span-6">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                </div>
                
                <div className="space-y-2 md:col-span-3">
                  <Label className="text-sm font-bold text-[#00c295]">Representante Legal?</Label>
                  <div className="flex gap-2">
                    <SelectionButton
                      className="flex-1"
                      selected={formData.isRepresentative === 'yes'}
                      onClick={() => setFormData(p => ({...p, isRepresentative: 'yes'}))}
                    >
                      Sim
                    </SelectionButton>
                    <SelectionButton
                      className="flex-1"
                      selected={formData.isRepresentative === 'no'}
                      onClick={() => setFormData(p => ({...p, isRepresentative: 'no'}))}
                    >
                      Não
                    </SelectionButton>
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-6">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                </div>
                <div className="space-y-2 md:col-span-6">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                </div>

                <div className="md:col-span-12 pt-2">
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <button
                          type="button"
                          onClick={() => setFormData(p => ({...p, agreeToTerms: !p.agreeToTerms}))}
                          className={cn(
                              "flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border",
                              formData.agreeToTerms
                                  ? "bg-[#00c295] text-white border-[#00c295]"
                                  : "bg-white text-slate-600 border-[#00c295] hover:bg-[#00c295]/5"
                          )}
                      >
                          {formData.agreeToTerms ? (
                              <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Concordo
                              </>
                          ) : (
                              <>
                                  Aceitar Termos
                              </>
                          )}
                      </button>
                      <p className="text-sm text-slate-500 text-center sm:text-left">
                          Ao continuar, você concorda com nossos <Link to="#" className="text-[#00c295] font-semibold hover:underline">Termos de Uso</Link> e <Link to="#" className="text-[#00c295] font-semibold hover:underline">Política de Privacidade</Link>.
                      </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 py-2">
                                <div className="text-center space-y-2">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00c295]/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-2 shadow-inner ring-4 ring-white dark:ring-[#1E293B]">
                                    <Check className="w-6 h-6 text-[#00c295] drop-shadow-md" />
                                  </div>

                                  <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Verifique sua identidade</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                      Como deseja receber o código?
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
                                      <button
                                          type="button"
                                          onClick={() => setVerificationMethod('email')}
                                          className={cn(
                                              "flex flex-row items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 h-14 gap-2",
                                              verificationMethod === 'email'
                                                  ? "border-[#00c295] bg-[#00c295]/5 text-[#00c295]"
                                                  : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                                          )}
                                      >
                                          <div className={cn(
                                              "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                              verificationMethod === 'email' ? "bg-[#00c295] text-white" : "bg-slate-100 text-slate-400"
                                          )}>
                                              <Mail className="w-3 h-3" />
                                          </div>
                                          <span className="font-semibold text-xs">Via E-mail</span>
                                      </button>

                                      <button
                                          type="button"
                                          onClick={() => setVerificationMethod('sms')}
                                          className={cn(
                                              "flex flex-row items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 h-14 gap-2",
                                              verificationMethod === 'sms'
                                                  ? "border-[#00c295] bg-[#00c295]/5 text-[#00c295]"
                                                  : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                                          )}
                                      >
                                          <div className={cn(
                                              "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                              verificationMethod === 'sms' ? "bg-[#00c295] text-white" : "bg-slate-100 text-slate-400"
                                          )}>
                                              <Smartphone className="w-3 h-3" />
                                          </div>
                                          <span className="font-semibold text-xs">Via SMS</span>
                                      </button>
                                  </div>

                <div className="bg-[#00c295]/5 border border-[#00c295]/10 rounded-lg p-3 max-w-xs mx-auto">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Código enviado para</p>
                <p className="font-mono font-medium text-slate-700 dark:text-slate-300 truncate">
                  {verificationMethod === 'email' ? formData.email : formData.phone}
                </p>
                </div>
              </div>

              <div className="space-y-3 max-w-xs mx-auto">
                <Label htmlFor="verificationCode" className="text-center block text-slate-700">Código de 6 dígitos</Label>
                <Input 
                  id="verificationCode" 
                  placeholder="000 000" 
                  value={verificationCode} 
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="text-center text-2xl tracking-[0.5em] font-mono font-bold h-14 border-slate-300 focus:border-[#00c295] focus:ring-[#00c295]/20"
                  maxLength={6}
                />
              </div>

              <p className="text-sm text-slate-500 text-center">
                Não recebeu o código? <button className="text-[#00c295] font-semibold hover:underline hover:text-[#00a880] transition-colors ml-1">Reenviar agora</button>
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 pb-8 px-8 fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-20 md:static md:bg-transparent md:border-0 md:p-8">
          {!showVerification ? (
            <>
              <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" asChild>
                <Link to={createPageUrl('LandingPage')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
              </Button>
              <Button onClick={handleNext} size="lg" className="bg-[#00c295] hover:bg-[#00a880] text-white font-bold px-10 rounded-full shadow-lg shadow-[#00c295]/20 hover:shadow-[#00c295]/40 transition-all hover:-translate-y-0.5">
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowVerification(false)} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={handleVerify} size="lg" className="bg-[#00c295] hover:bg-[#00a880] text-white font-bold px-10 rounded-full shadow-lg shadow-[#00c295]/20 hover:shadow-[#00c295]/40 transition-all hover:-translate-y-0.5">
                Confirmar e Avançar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}