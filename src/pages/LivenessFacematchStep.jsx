import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, CheckCircle2, Loader2, Mail, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LivenessFacematchStep() {
  const navigate = useNavigate();
  const [partnerEmail, setPartnerEmail] = useState('');
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [livenessStatus, setLivenessStatus] = useState('pending'); // pending, sent, completed, failed

  // Gera um ID único para a sessão de verificação
  const sessionId = useState(() => Math.random().toString(36).substring(7))[0];
  const simulatedLivenessLink = `${window.location.origin}${createPageUrl('LivenessSimulation')}?session=${sessionId}`;

  // Escuta mensagens da janela de simulação
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'LIVENESS_COMPLETED' && event.data?.sessionId === sessionId) {
        setLivenessStatus('completed');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sessionId]);

  const handleGenerateLink = () => {
    setLinkGenerated(true);
    setLivenessStatus('sent');
  };

  const handleOpenSimulation = () => {
    window.open(simulatedLivenessLink, '_blank', 'width=500,height=700');
  };

  const handleContinue = () => {
    navigate(createPageUrl('Dashboard'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D26A] to-[#00A854] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00D26A]/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verificação de Identidade</h1>
          <p className="text-gray-500">Liveness e Facematch</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardDescription className="text-gray-600">
              Para finalizar a verificação da sua conta, um link será enviado para o sócio principal 
              realizar o teste de vivacidade e comparação facial.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {!linkGenerated ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="partnerEmail">E-mail do Sócio Principal</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="partnerEmail"
                      type="email"
                      placeholder="email.socio@empresa.com"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateLink} 
                  disabled={!partnerEmail}
                  className="w-full bg-[#00D26A] hover:bg-[#00A854]"
                >
                  Gerar Link de Verificação
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                {/* Status Indicator */}
                <div className={`p-4 rounded-xl ${
                  livenessStatus === 'sent' ? 'bg-blue-50 border border-blue-200' :
                  livenessStatus === 'completed' ? 'bg-green-50 border border-green-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {livenessStatus === 'sent' && (
                      <>
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                        <div>
                          <p className="font-medium text-blue-700">Link enviado!</p>
                          <p className="text-sm text-blue-600">Aguardando conclusão da verificação...</p>
                        </div>
                      </>
                    )}
                    {livenessStatus === 'completed' && (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="font-medium text-green-700">Verificação Concluída!</p>
                          <p className="text-sm text-green-600">Sua identidade foi verificada com sucesso.</p>
                        </div>
                      </>
                    )}
                    {livenessStatus === 'failed' && (
                      <>
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        <div>
                          <p className="font-medium text-red-700">Verificação Falhou</p>
                          <p className="text-sm text-red-600">Por favor, tente novamente.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Simulation Button */}
                <div className="space-y-3">
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700">
                      <strong>Modo Demonstração:</strong> Clique no botão abaixo para simular o processo 
                      de Liveness/Facematch que seria realizado pelo sócio.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    onClick={handleOpenSimulation} 
                    variant="outline" 
                    className="w-full border-2 border-dashed"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> 
                    Abrir Simulação Externa
                  </Button>
                </div>

                {livenessStatus === 'completed' && (
                  <Button onClick={handleContinue} className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                    Continuar para o Dashboard
                  </Button>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="justify-center pt-0">
            <Button variant="ghost" size="sm" asChild>
              <Link to={createPageUrl('Dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}