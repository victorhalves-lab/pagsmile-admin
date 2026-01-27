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

export default function AccountCreationStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    isRepresentative: 'yes',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#00D26A] flex items-center justify-center">
              <span className="text-white font-bold text-lg">PS</span>
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold text-gray-800">Crie sua conta PagSmile</CardTitle>
          <CardDescription className="text-gray-500">Etapa 1 de 3 - Dados do Responsável</CardDescription>
          <div className="flex gap-2 justify-center mt-4">
            <div className="w-20 h-1.5 rounded-full bg-[#00D26A]"></div>
            <div className="w-20 h-1.5 rounded-full bg-gray-200"></div>
            <div className="w-20 h-1.5 rounded-full bg-gray-200"></div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
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
                  <Label>Você é representante legal da empresa?</Label>
                  <RadioGroup value={formData.isRepresentative} onValueChange={(v) => setFormData(p => ({...p, isRepresentative: v}))} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="rep-yes" />
                      <Label htmlFor="rep-yes" className="font-normal">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="rep-no" />
                      <Label htmlFor="rep-no" className="font-normal">Não</Label>
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
              
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="agreeToTerms" 
                  checked={formData.agreeToTerms} 
                  onCheckedChange={(c) => setFormData(p => ({...p, agreeToTerms: c}))} 
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-tight">
                  Li e aceito os <a href="#" className="text-[#00D26A] hover:underline">Termos de Uso</a> e a <a href="#" className="text-[#00D26A] hover:underline">Política de Privacidade</a>
                </label>
              </div>
            </>
          ) : (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#00D26A]/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#00D26A]" />
                </div>
                <p className="text-gray-600">Um código de verificação foi enviado para</p>
                <p className="font-semibold text-gray-800">{formData.email}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Código de Verificação</Label>
                <Input 
                  id="verificationCode" 
                  placeholder="Digite o código de 6 dígitos" 
                  value={verificationCode} 
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Não recebeu? <button className="text-[#00D26A] hover:underline">Reenviar código</button>
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2">
          {!showVerification ? (
            <>
              <Button variant="ghost" asChild>
                <Link to={createPageUrl('LandingPage')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
              </Button>
              <Button onClick={handleNext} className="bg-[#00D26A] hover:bg-[#00A854]">
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowVerification(false)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={handleVerify} className="bg-[#00D26A] hover:bg-[#00A854]">
                Verificar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}