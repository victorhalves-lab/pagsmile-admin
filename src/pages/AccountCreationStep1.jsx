import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLogoUrlByTheme } from '@/components/utils/branding';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-4 md:p-8">
      <Card className="w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6 pt-8 space-y-4">
          <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-2 hover:opacity-80 transition-opacity">
            <img
              src={getLogoUrlByTheme('light')}
              alt="PagSmile Logo"
              className="h-12"
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
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#00D26A] z-10 relative shadow-[0_0_10px_rgba(0,210,106,0.4)]" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#00D26A]" />
              </div>
              <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#00D26A] to-emerald-500 shadow-sm" />
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
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input id="fullName" placeholder="Seu nome completo" value={formData.fullName} onChange={handleChange} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-700 dark:text-slate-200">Você é representante legal da empresa?</Label>
                  <RadioGroup 
                    value={formData.isRepresentative} 
                    onValueChange={(v) => setFormData(p => ({...p, isRepresentative: v}))} 
                    className="flex gap-4"
                  >
                    <div className={`flex items-center space-x-2 border rounded-xl px-4 py-3 w-full transition-all duration-200 ${formData.isRepresentative === 'yes' ? 'border-[#00D26A] bg-[#00D26A]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                      <RadioGroupItem value="yes" id="rep-yes" />
                      <Label htmlFor="rep-yes" className="font-medium cursor-pointer flex-1">Sim</Label>
                    </div>
                    <div className={`flex items-center space-x-2 border rounded-xl px-4 py-3 w-full transition-all duration-200 ${formData.isRepresentative === 'no' ? 'border-[#00D26A] bg-[#00D26A]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                      <RadioGroupItem value="no" id="rep-no" />
                      <Label htmlFor="rep-no" className="font-medium cursor-pointer flex-1">Não</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Checkbox 
                  id="agreeToTerms" 
                  checked={formData.agreeToTerms} 
                  onCheckedChange={(c) => setFormData(p => ({...p, agreeToTerms: c}))} 
                  className="mt-0.5"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
                  Li e concordo com os <a href="#" className="text-[#00D26A] font-medium hover:underline hover:text-[#00A854] transition-colors">Termos de Uso</a> e a <a href="#" className="text-[#00D26A] font-medium hover:underline hover:text-[#00A854] transition-colors">Política de Privacidade</a> da PagSmile.
                </label>
              </div>
            </>
          ) : (
            <div className="space-y-8 py-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D26A]/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white dark:ring-[#1E293B]">
                  <Check className="w-10 h-10 text-[#00D26A] drop-shadow-md" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Verifique sua identidade</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Para sua segurança, precisamos confirmar que é você. Como deseja receber o código?
                  </p>
                </div>

                <div className="flex gap-3 justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit mx-auto">
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`rounded-lg transition-all duration-300 ${verificationMethod === 'email' ? 'bg-white dark:bg-slate-700 text-[#00D26A] shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setVerificationMethod('email')}
                  >
                    E-mail
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`rounded-lg transition-all duration-300 ${verificationMethod === 'sms' ? 'bg-white dark:bg-slate-700 text-[#00D26A] shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setVerificationMethod('sms')}
                  >
                    SMS
                  </Button>
                </div>

                <div className="bg-[#00D26A]/5 border border-[#00D26A]/10 rounded-lg p-3 max-w-xs mx-auto">
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
                  className="text-center text-2xl tracking-[0.5em] font-mono font-bold h-14 border-slate-300 focus:border-[#00D26A] focus:ring-[#00D26A]/20"
                  maxLength={6}
                />
              </div>

              <p className="text-sm text-slate-500 text-center">
                Não recebeu o código? <button className="text-[#00D26A] font-semibold hover:underline hover:text-[#00A854] transition-colors ml-1">Reenviar agora</button>
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 pb-8 px-8">
          {!showVerification ? (
            <>
              <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" asChild>
                <Link to={createPageUrl('LandingPage')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
              </Button>
              <Button onClick={handleNext} className="bg-[#00D26A] hover:bg-[#00A854] text-white font-bold px-8 shadow-lg shadow-[#00D26A]/20 hover:shadow-[#00D26A]/40 transition-all hover:-translate-y-0.5">
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowVerification(false)} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={handleVerify} className="bg-[#00D26A] hover:bg-[#00A854] text-white font-bold px-8 shadow-lg shadow-[#00D26A]/20 hover:shadow-[#00D26A]/40 transition-all hover:-translate-y-0.5">
                Confirmar e Avançar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}