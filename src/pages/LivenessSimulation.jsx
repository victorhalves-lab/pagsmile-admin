import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, Camera, User, FileText, Shield, Scan, Smile, MoveHorizontal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function LivenessSimulation() {
  const [stage, setStage] = useState('welcome'); 
  // welcome -> liveness_instructions -> liveness_scanning -> facematch_selfie -> facematch_document -> processing -> completed
  const [progress, setProgress] = useState(0);

  // Pega o sessionId da URL para comunicar com a janela pai
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session');

  const stages = {
    welcome: { title: 'Verificação de Identidade', progress: 0 },
    liveness_instructions: { title: 'Prova de Vida', progress: 15 },
    liveness_scanning: { title: 'Escaneando...', progress: 35 },
    facematch_selfie: { title: 'Selfie', progress: 55 },
    facematch_document: { title: 'Documento', progress: 75 },
    processing: { title: 'Processando', progress: 90 },
    completed: { title: 'Verificação Concluída', progress: 100 },
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
              <CardTitle className="text-2xl">Verificação de Identidade</CardTitle>
              <CardDescription className="text-base mt-2">
                Vamos verificar sua identidade através de uma prova de vida e comparação facial.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00D26A]/10 flex items-center justify-center">
                    <Scan className="w-4 h-4 text-[#00D26A]" />
                  </div>
                  <p className="text-sm text-gray-600">Prova de vida (Liveness)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00D26A]/10 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-[#00D26A]" />
                  </div>
                  <p className="text-sm text-gray-600">Selfie do rosto</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00D26A]/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#00D26A]" />
                  </div>
                  <p className="text-sm text-gray-600">Foto do documento</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startLiveness} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                Iniciar Verificação
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
              <CardTitle className="text-xl">Prova de Vida</CardTitle>
              <CardDescription className="mt-2">
                Siga as instruções na tela
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Smile className="w-5 h-5 text-amber-500" />
                  <p className="text-sm text-gray-600">Sorria para a câmera</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <MoveHorizontal className="w-5 h-5 text-blue-500" />
                  <p className="text-sm text-gray-600">Mova a cabeça para os lados</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Certifique-se de estar em um local bem iluminado
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={performLiveness} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                Iniciar Captura
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
              <CardTitle className="text-xl">Escaneando...</CardTitle>
              <CardDescription className="mt-2">
                Mantenha o rosto centralizado
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
              <CardTitle className="text-xl">Tire uma Selfie</CardTitle>
              <CardDescription className="mt-2">
                Posicione seu rosto no centro da tela
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-2 border-slate-400 mx-auto mb-2 flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-sm text-gray-400">Área de captura</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={captureSelfie} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                <Camera className="mr-2 h-4 w-4" /> Capturar Selfie
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
              <CardTitle className="text-xl">Foto do Documento</CardTitle>
              <CardDescription className="mt-2">
                Fotografe a frente do seu RG ou CNH
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/10] bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Posicione o documento aqui</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={captureDocument} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                <Camera className="mr-2 h-4 w-4" /> Capturar Documento
              </Button>
            </CardFooter>
          </>
        )}

        {/* Processing */}
        {stage === 'processing' && (
          <>
            <CardHeader className="text-center pt-12">
              <Loader2 className="w-16 h-16 text-[#00D26A] animate-spin mx-auto mb-4" />
              <CardTitle className="text-xl">Processando...</CardTitle>
              <CardDescription className="mt-2">
                Estamos verificando suas informações
              </CardDescription>
            </CardHeader>
            <CardContent className="py-12">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-gray-600">Prova de vida concluída</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-gray-600">Selfie capturada</p>
                </div>
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <p className="text-sm text-gray-600">Comparando faces...</p>
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
              <CardTitle className="text-2xl text-green-600">Verificação Concluída!</CardTitle>
              <CardDescription className="mt-2 text-base">
                Sua identidade foi verificada com sucesso.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-700">Prova de vida validada</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-700">Comparação facial aprovada</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-700">Documento verificado</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={finishVerification} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                Fechar Janela
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}