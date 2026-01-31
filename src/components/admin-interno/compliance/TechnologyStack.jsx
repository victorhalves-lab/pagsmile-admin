import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain, Eye, Shield, Database, Cpu, Globe, FileText,
  CheckCircle2, Zap, Server
} from 'lucide-react';

export default function TechnologyStack() {
  const technologies = {
    llm: {
      title: 'Motor de LLM Especializado',
      icon: Brain,
      color: 'purple',
      specs: [
        { label: 'Modelo Base', value: 'GPT-4 class fine-tuned' },
        { label: 'Parâmetros', value: '175B → 7B (distillation)' },
        { label: 'Latência', value: '<200ms (95%)' },
        { label: 'Contexto', value: '32k tokens' }
      ],
      capabilities: [
        'Detecção de Evasão',
        'Explicação Regulatória',
        'Negociação Suave',
        'Educação Contextual'
      ]
    },
    vision: {
      title: 'Sistema de Visão Computacional',
      icon: Eye,
      color: 'blue',
      specs: [
        { label: 'OCR Primário', value: 'Google Vision API' },
        { label: 'OCR Secundário', value: 'Amazon Textract' },
        { label: 'Precisão', value: '99.5%' },
        { label: 'Documentos BR', value: '50+ tipos' }
      ],
      capabilities: [
        'Análise de Micro-padrões',
        'Verificação de Fontes',
        'Detecção de Photoshop',
        'Validação de Hologramas'
      ]
    },
    risk: {
      title: 'Motor de Análise de Risco',
      icon: Shield,
      color: 'red',
      specs: [
        { label: 'Arquitetura', value: 'XGBoost + Deep Learning' },
        { label: 'Features', value: '500+ variáveis' },
        { label: 'Update', value: 'Retreino diário' },
        { label: 'Performance', value: 'AUC 0.95' }
      ],
      capabilities: [
        'Análise Empresa',
        'Análise Sócios',
        'Análise Comportamental',
        'Análise de Mercado'
      ]
    },
    integrations: {
      title: 'Integrações e APIs',
      icon: Globe,
      color: 'green',
      specs: [
        { label: 'Receita Federal', value: 'CPF/CNPJ real-time' },
        { label: 'SERPRO', value: 'CNH, Biometria' },
        { label: 'Bureaus', value: 'Serasa, SPC, Boa Vista' },
        { label: 'Compliance', value: 'PEP, Sanctions (15+ bases)' }
      ],
      capabilities: [
        'Validação em <500ms',
        'Fallback automático',
        'Cache inteligente',
        'Rate limit handling'
      ]
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="llm">
        <TabsList className="grid grid-cols-4 w-full">
          {Object.keys(technologies).map(key => {
            const tech = technologies[key];
            const Icon = tech.icon;
            return (
              <TabsTrigger key={key} value={key} className="gap-2">
                <Icon className="w-4 h-4" />
                {tech.title.split(' ')[0]}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.keys(technologies).map(key => {
          const tech = technologies[key];
          const Icon = tech.icon;
          
          return (
            <TabsContent key={key} value={key} className="space-y-4">
              <Card className={`border-2 border-${tech.color}-200 bg-${tech.color}-50/30`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 text-${tech.color}-600`} />
                    {tech.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Specs */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Especificações Técnicas</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {tech.specs.map((spec, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border">
                          <p className="text-xs text-slate-500">{spec.label}</p>
                          <p className="font-mono text-sm font-medium mt-1">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Capacidades</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {tech.capabilities.map((cap, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 text-${tech.color}-600`} />
                          <span className="text-sm">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}