import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, Camera, User, FileText, Shield, Scan, Smile, MoveHorizontal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function LivenessSimulation() {
  const { t } = useTranslation();
  const [stage, setStage] = useState('welcome'); 
  // welcome -> liveness_instructions -> liveness_scanning -> facematch_selfie -> facematch_document -> processing -> completed
  const [progress, setProgress] = useState(0);

  // Pega o sessionId da URL para comunicar com a janela pai
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session');

  // Ajuste 1: Ignorar erro de autenticação visualmente e permitir fluxo de simulação
  // A simulação não deve depender de estar logado se for um link externo
  
  const stages = {
    welcome: { title: t('onboarding.identity_verification'), progress: 0 },
    liveness_instructions: { title: t('onboarding.liveness_proof'), progress: 15 },
    liveness_scanning: { title: t('onboarding.scanning'), progress: 35 },
    facematch_selfie: { title: t('onboarding.take_selfie'), progress: 55 },
    facematch_document: { title: t('onboarding.document_photo'), progress: 75 },
    processing: { title: t('onboarding.processing'), progress: 90 },
    completed: { title: t('onboarding.verification_completed'), progress: 100 },
  };

  const advanceStage = (nextStage, delay = 0) => {
    if (delay) {
      setTimeout(() => {
        setStage(nextStage);
        setProgress(stages[nextStage].progress);
      }, delay);
    } else {
      setStage(nextStage);
      setProgress(stages[nextStage].progress);
    }
  };

  const startLiveness = () => {
    setStage('liveness_instructions');
    setProgress(15);
  };

  const performLiveness = () => {
    setStage('liveness_scanning');
    setProgress(35);
    // Simula o escaneamento
    setTimeout(() => {
      setStage('facematch_selfie');
      setProgress(55);
    }, 3000);
  };

  const captureSelfie = () => {
    setStage('facematch_document');
    setProgress(75);
  };

  const captureDocument = () => {
    setStage('processing');
    setProgress(90);
    // Simula processamento
    setTimeout(() => {
      setStage('completed');
      setProgress(100);
      // Notifica a janela pai
      if (window.opener && sessionId) {
        window.opener.postMessage({ type: 'LIVENESS_COMPLETED', sessionId }, '*');
      }
    }, 3000);
  };

  const finishVerification = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-400 mt-2 text-center">{stages[stage].title}</p>
        </div>

        {/* Welcome */}
        {stage === 'welcome' && (
          <>
            <CardHeader className="text-center pt-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D26A] to-[#00A854] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">{t('onboarding.identity_verification')}</CardTitle>
              <CardDescription className="text-base mt-2">
                {t('onboarding.liveness_intro')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00D26A]/10 flex items-center justify-center">
                    <Scan className="w-4 h-4 text-[#00D26A]" />
                  </div>
                  <p className="text-sm text-gray-600">{t('onboarding.liveness_proof')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00D26A]/10 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-[#00D26A]" />
                  </div>
                  <p className="text-sm text-gray-600">{t('onboarding.take_selfie')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00D26A]/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#00D26A]" />
                  </div>
                  <p className="text-sm text-gray-600">{t('onboarding.document_photo')}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startLiveness} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                {t('onboarding.start_verification')}
              </Button>
            </CardFooter>
          </>
        )}

        {/* Liveness Instructions */}
        {stage === 'liveness_instructions' && (
          <>
            <CardHeader className="text-center pt-8">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-blue-500" />
              </div>
              <CardTitle className="text-xl">{t('onboarding.liveness_proof')}</CardTitle>
              <CardDescription className="mt-2">
                {t('onboarding.follow_instructions')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Smile className="w-5 h-5 text-amber-500" />
                  <p className="text-sm text-gray-600">{t('onboarding.smile_camera')}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <MoveHorizontal className="w-5 h-5 text-blue-500" />
                  <p className="text-sm text-gray-600">{t('onboarding.move_head')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">
                {t('onboarding.well_lit_place')}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={performLiveness} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                {t('onboarding.start_capture')}
              </Button>
            </CardFooter>
          </>
        )}

        {/* Liveness Scanning */}
        {stage === 'liveness_scanning' && (
          <>
            <CardHeader className="text-center pt-8">
              <div className="w-32 h-32 rounded-full border-4 border-[#00D26A] border-dashed flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center">
                  <Scan className="w-12 h-12 text-[#00D26A] animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-xl">{t('onboarding.scanning')}</CardTitle>
              <CardDescription className="mt-2">
                {t('onboarding.keep_face_centered')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-[#00D26A] animate-spin" />
            </CardContent>
          </>
        )}

        {/* Facematch Selfie */}
        {stage === 'facematch_selfie' && (
          <>
            <CardHeader className="text-center pt-8">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-purple-500" />
              </div>
              <CardTitle className="text-xl">{t('onboarding.take_selfie')}</CardTitle>
              <CardDescription className="mt-2">
                {t('onboarding.position_face')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-2 border-slate-400 mx-auto mb-2 flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-sm text-gray-400">{t('onboarding.capture_area')}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={captureSelfie} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                <Camera className="mr-2 h-4 w-4" /> {t('onboarding.capture_selfie')}
              </Button>
            </CardFooter>
          </>
        )}

        {/* Facematch Document */}
        {stage === 'facematch_document' && (
          <>
            <CardHeader className="text-center pt-8">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-amber-500" />
              </div>
              <CardTitle className="text-xl">{t('onboarding.document_photo')}</CardTitle>
              <CardDescription className="mt-2">
                {t('onboarding.photo_id_front')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/10] bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">{t('onboarding.position_document')}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={captureDocument} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                <Camera className="mr-2 h-4 w-4" /> {t('onboarding.capture_document')}
              </Button>
            </CardFooter>
          </>
        )}

        {/* Processing */}
        {stage === 'processing' && (
          <>
            <CardHeader className="text-center pt-12">
              <Loader2 className="w-16 h-16 text-[#00D26A] animate-spin mx-auto mb-4" />
              <CardTitle className="text-xl">{t('onboarding.processing')}</CardTitle>
              <CardDescription className="mt-2">
                {t('onboarding.verifying_info')}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-12">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-gray-600">{t('onboarding.liveness_completed')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-gray-600">{t('onboarding.selfie_captured')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <p className="text-sm text-gray-600">{t('onboarding.comparing_faces')}</p>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Completed */}
        {stage === 'completed' && (
          <>
            <CardHeader className="text-center pt-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">{t('onboarding.verification_completed')}</CardTitle>
              <CardDescription className="mt-2 text-base">
                {t('onboarding.identity_verified')}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-700">{t('onboarding.liveness_validated')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-700">{t('onboarding.facial_match_approved')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-700">{t('onboarding.document_verified')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={finishVerification} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                {t('onboarding.close_window')}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}