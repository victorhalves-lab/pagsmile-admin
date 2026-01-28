import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormSection from '@/components/compliance/FormSection';
import { FileText, AlertTriangle } from 'lucide-react';

export default function Section12Confirmacao({ formData, handleChange }) {
  return (
    <FormSection title="12. Confirmação e Declarações" subtitle="Confirme as declarações e finalize" icon={FileText}>
      <div className="space-y-6">
        {/* Confirmação de Verificação de Identidade */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
          <h4 className="font-medium text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            CONFIRMAÇÃO DE VERIFICAÇÃO DE IDENTIDADE
          </h4>
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="confirmacaoCAF" 
              checked={formData.confirmacaoCAF || false} 
              onCheckedChange={(c) => handleChange('confirmacaoCAF', c)} 
            />
            <label htmlFor="confirmacaoCAF" className="text-sm text-amber-700 leading-relaxed cursor-pointer">
              Confirmo que realizei a verificação de identidade no CAF
            </label>
          </div>
          <Alert className="bg-amber-100 border-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700 text-xs">
              Atenção: Caso o CAF não tenha sido realizado, sua solicitação será automaticamente reprovada.
            </AlertDescription>
          </Alert>
        </div>

        {/* Declarações */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Declarações</h4>
          {[
            { id: 'declaracaoVerdadeira', label: 'Declaro que todas as informações são verdadeiras e completas' },
            { id: 'declaracaoNaoIlegal', label: 'Declaro que a empresa não atua em atividades ilegais ou proibidas' },
            { id: 'declaracaoAutoriza', label: 'Autorizo a Pagsmile a verificar os dados junto a bureaus e fontes públicas' },
          ].map((decl) => (
            <div key={decl.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
              <Checkbox 
                id={decl.id} 
                checked={formData[decl.id] || false} 
                onCheckedChange={(c) => handleChange(decl.id, c)} 
              />
              <Label htmlFor={decl.id} className="text-sm font-normal leading-relaxed cursor-pointer">
                {decl.label} *
              </Label>
            </div>
          ))}
        </div>

        {/* Termo de Responsabilidade */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-gray-800">TERMO DE RESPONSABILIDADE E VERACIDADE</h4>
          <div className="h-40 overflow-y-auto bg-slate-50 rounded p-3 text-sm text-gray-600">
            <p className="mb-2">
              Eu, na qualidade de representante legal da empresa acima identificada, DECLARO para os devidos fins que:
            </p>
            <p className="mb-2">
              1. Todas as informações fornecidas neste questionário são verdadeiras, precisas e completas, de acordo com meu melhor conhecimento e entendimento.
            </p>
            <p className="mb-2">
              2. Comprometo-me a informar imediatamente a Pagsmile sobre quaisquer alterações nas informações fornecidas que possam afetar a avaliação de risco ou a elegibilidade da empresa para utilizar os serviços.
            </p>
            <p className="mb-2">
              3. Estou ciente de que a prestação de informações falsas ou incompletas pode resultar na recusa ou cancelamento dos serviços, além de possíveis consequências legais.
            </p>
            <p className="mb-2">
              4. Autorizo a Pagsmile a verificar as informações fornecidas junto a fontes públicas, bureaus de crédito e quaisquer outras fontes que julgar necessárias para a análise de compliance.
            </p>
            <p>
              5. Declaro que tenho poderes para representar a empresa e assinar este termo em seu nome.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="termoAceito" 
              checked={formData.termoAceito || false} 
              onCheckedChange={(c) => handleChange('termoAceito', c)} 
            />
            <Label htmlFor="termoAceito" className="text-sm font-normal cursor-pointer">
              Li, compreendi e <strong>ACEITO INTEGRALMENTE</strong> o Termo de Responsabilidade e Veracidade acima descrito, assumindo total responsabilidade pelas informações prestadas. *
            </Label>
          </div>
        </div>
      </div>
    </FormSection>
  );
}