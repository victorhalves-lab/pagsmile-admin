import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createPageUrl } from '@/components/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Mail, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLogoUrlByTheme } from '@/components/utils/branding';
import { cn } from "@/lib/utils";
import SelectionButton from '@/components/ui/selection-button';
import LanguageSelector from '@/components/i18n/LanguageSelector';

export default function AccountCreationStep1() {
  const { t } = useTranslation();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-2 md:p-4 pb-24 md:pb-4 relative">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>
      <Card className="w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-[#003459]/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-0 pt-4 space-y-1">
                        <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-1 hover:opacity-80 transition-opacity">
                          <img
                            src={getLogoUrlByTheme('light')}
                            alt="PagSmile Logo"
                            className="h-8"
                          />
                        </Link>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('onboarding.create_account')}</CardTitle>
            <CardDescription className="text-base text-slate-500 dark:text-slate-400">{t('onboarding.responsible_data')}</CardDescription>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#2bc196] z-10 relative shadow-[0_0_10px_rgba(0,194,149,0.4)]" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#2bc196]" />
              </div>
              <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#2bc196] to-emerald-500 shadow-sm" />
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
                  <Label htmlFor="fullName">{t('onboarding.full_name')}</Label>
                  <Input id="fullName" placeholder={t('onboarding.full_name_placeholder')} value={formData.fullName} onChange={handleChange} />
                </div>
                
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="cpf">{t('onboarding.cpf')}</Label>
                  <Input id="cpf" placeholder={t('onboarding.cpf_placeholder')} value={formData.cpf} onChange={handleChange} />
                </div>
                
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="phone">{t('onboarding.phone')}</Label>
                  <Input id="phone" placeholder={t('onboarding.phone_placeholder')} value={formData.phone} onChange={handleChange} />
                </div>
                
                <div className="space-y-2 md:col-span-6">
                  <Label htmlFor="email">{t('onboarding.email')}</Label>
                  <Input id="email" type="email" placeholder={t('onboarding.email_placeholder')} value={formData.email} onChange={handleChange} />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="birthDate">{t('onboarding.birth_date')}</Label>
                  <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                </div>
                
                <div className="space-y-2 md:col-span-3">
                  <Label className="text-sm font-bold text-[#2bc196]">{t('onboarding.legal_representative')}</Label>
                  <div className="flex gap-2">
                    <SelectionButton
                      className="flex-1"
                      selected={formData.isRepresentative === 'yes'}
                      onClick={() => setFormData(p => ({...p, isRepresentative: 'yes'}))}
                    >
                      {t('onboarding.yes')}
                    </SelectionButton>
                    <SelectionButton
                      className="flex-1"
                      selected={formData.isRepresentative === 'no'}
                      onClick={() => setFormData(p => ({...p, isRepresentative: 'no'}))}
                    >
                      {t('onboarding.no')}
                    </SelectionButton>
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-6">
                  <Label htmlFor="password">{t('onboarding.password')}</Label>
                  <Input id="password" type="password" placeholder={t('onboarding.password_placeholder')} value={formData.password} onChange={handleChange} />
                </div>
                <div className="space-y-2 md:col-span-6">
                  <Label htmlFor="confirmPassword">{t('onboarding.confirm_password')}</Label>
                  <Input id="confirmPassword" type="password" placeholder={t('onboarding.password_placeholder')} value={formData.confirmPassword} onChange={handleChange} />
                </div>

                <div className="md:col-span-12 pt-2">
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <button
                          type="button"
                          onClick={() => setFormData(p => ({...p, agreeToTerms: !p.agreeToTerms}))}
                          className={cn(
                              "flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border",
                              formData.agreeToTerms
                                  ? "bg-[#2bc196] text-white border-[#2bc196]"
                                  : "bg-white text-slate-600 border-[#2bc196] hover:bg-[#2bc196]/5"
                          )}
                      >
                          {formData.agreeToTerms ? (
                              <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  {t('onboarding.i_agree')}
                              </>
                          ) : (
                              <>
                                  {t('onboarding.accept_terms')}
                              </>
                          )}
                      </button>
                      <p className="text-sm text-slate-500 text-center sm:text-left">
                          {t('onboarding.terms_text')} <Link to="#" className="text-[#2bc196] font-semibold hover:underline">{t('onboarding.terms_of_use')}</Link> {t('onboarding.and')} <Link to="#" className="text-[#2bc196] font-semibold hover:underline">{t('onboarding.privacy_policy')}</Link>.
                      </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 py-2">
                                <div className="text-center space-y-2">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2bc196]/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-2 shadow-inner ring-4 ring-white dark:ring-[#1E293B]">
                                    <Check className="w-6 h-6 text-[#2bc196] drop-shadow-md" />
                                  </div>

                                  <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('onboarding.verify_identity')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                      {t('onboarding.how_receive_code')}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
                                      <button
                                          type="button"
                                          onClick={() => setVerificationMethod('email')}
                                          className={cn(
                                              "flex flex-row items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 h-14 gap-2",
                                              verificationMethod === 'email'
                                                  ? "border-[#2bc196] bg-[#2bc196]/5 text-[#2bc196]"
                                                  : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                                          )}
                                      >
                                          <div className={cn(
                                              "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                              verificationMethod === 'email' ? "bg-[#2bc196] text-white" : "bg-slate-100 text-slate-400"
                                          )}>
                                              <Mail className="w-3 h-3" />
                                          </div>
                                          <span className="font-semibold text-xs">{t('onboarding.via_email')}</span>
                                      </button>

                                      <button
                                          type="button"
                                          onClick={() => setVerificationMethod('sms')}
                                          className={cn(
                                              "flex flex-row items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 h-14 gap-2",
                                              verificationMethod === 'sms'
                                                  ? "border-[#2bc196] bg-[#2bc196]/5 text-[#2bc196]"
                                                  : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                                          )}
                                      >
                                          <div className={cn(
                                              "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                              verificationMethod === 'sms' ? "bg-[#2bc196] text-white" : "bg-slate-100 text-slate-400"
                                          )}>
                                              <Smartphone className="w-3 h-3" />
                                          </div>
                                          <span className="font-semibold text-xs">{t('onboarding.via_sms')}</span>
                                      </button>
                                  </div>

                <div className="bg-[#2bc196]/5 border border-[#2bc196]/10 rounded-lg p-3 max-w-xs mx-auto">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('onboarding.code_sent_to')}</p>
                <p className="font-mono font-medium text-slate-700 dark:text-slate-300 truncate">
                  {verificationMethod === 'email' ? formData.email : formData.phone}
                </p>
                </div>
              </div>

              <div className="space-y-3 max-w-xs mx-auto">
                <Label htmlFor="verificationCode" className="text-center block text-slate-700">{t('onboarding.six_digit_code')}</Label>
                <Input 
                  id="verificationCode" 
                  placeholder={t('onboarding.code_placeholder')} 
                  value={verificationCode} 
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="text-center text-2xl tracking-[0.5em] font-mono font-bold h-14 border-slate-300 focus:border-[#2bc196] focus:ring-[#2bc196]/20"
                  maxLength={6}
                />
              </div>

              <p className="text-sm text-slate-500 text-center">
                {t('onboarding.didnt_receive')} <button className="text-[#2bc196] font-semibold hover:underline hover:text-[#239b7a] transition-colors ml-1">{t('onboarding.resend_now')}</button>
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col pt-6 pb-8 px-8 fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-20 md:static md:bg-transparent md:border-0 md:p-8">
          {!showVerification ? (
            <>
              <div className="flex justify-between w-full">
                <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" asChild>
                  <Link to={createPageUrl('LandingPage')}><ArrowLeft className="mr-2 h-4 w-4" /> {t('onboarding.back')}</Link>
                </Button>
                <Button onClick={handleNext} size="lg" className="bg-[#2bc196] hover:bg-[#239b7a] text-white font-bold px-10 rounded-full shadow-lg shadow-[#2bc196]/20 hover:shadow-[#2bc196]/40 transition-all hover:-translate-y-0.5">
                  {t('onboarding.continue')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="w-full text-center mt-4">
                <a 
                  href="https://pagsmileonboarding.base44.app/QuestionarioPublico?tipo=manual" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-[#2bc196] hover:text-[#239b7a] hover:underline font-medium transition-colors"
                >
                  {t('onboarding.custom_proposal_link')}
                </a>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowVerification(false)} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('onboarding.back')}
              </Button>
              <Button onClick={handleVerify} size="lg" className="bg-[#2bc196] hover:bg-[#239b7a] text-white font-bold px-10 rounded-full shadow-lg shadow-[#2bc196]/20 hover:shadow-[#2bc196]/40 transition-all hover:-translate-y-0.5">
                {t('onboarding.confirm_and_proceed')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}