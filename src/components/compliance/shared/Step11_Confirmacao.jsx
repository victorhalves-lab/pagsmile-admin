import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormSection from '@/components/compliance/FormSection';
import { CheckCircle, FileCheck, Shield } from 'lucide-react';

export default function Step11_Confirmacao({ formData, handleChange }) {
  return (
    <FormSection title="Confirmação e Declarações" subtitle="Revisão final e aceite dos termos" icon={CheckCircle}>
      <div className="space-y-8">
        <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800 text-lg">Quase lá!</h3>
              <p className="text-emerald-700 mt-1">
                Por favor, revise todas as informações fornecidas antes de finalizar. 
                Após esta etapa, você será direcionado para o envio de documentos.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <Checkbox 
              id="declaracao1"
              checked={formData.declaracao1 || false}
              onCheckedChange={(checked) => handleChange('declaracao1', checked)}
              className="mt-1 h-6 w-6"
            />
            <Label htmlFor="declaracao1" className="text-base text-slate-700 cursor-pointer leading-relaxed">
              Declaro que todas as informações fornecidas são verdadeiras e correspondem à realidade 
              da empresa, comprometendo-me a informar qualquer alteração relevante.
            </Label>
          </div>

          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <Checkbox 
              id="declaracao2"
              checked={formData.declaracao2 || false}
              onCheckedChange={(checked) => handleChange('declaracao2', checked)}
              className="mt-1 h-6 w-6"
            />
            <Label htmlFor="declaracao2" className="text-base text-slate-700 cursor-pointer leading-relaxed">
              Autorizo a PagSmile a realizar consultas e verificações necessárias para 
              validação das informações cadastrais junto a órgãos e bureaus de crédito.
            </Label>
          </div>

          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <Checkbox 
              id="declaracao3"
              checked={formData.declaracao3 || false}
              onCheckedChange={(checked) => handleChange('declaracao3', checked)}
              className="mt-1 h-6 w-6"
            />
            <Label htmlFor="declaracao3" className="text-base text-slate-700 cursor-pointer leading-relaxed">
              Li e concordo com os <a href="#" className="text-[#2bc196] underline">Termos de Uso</a> e 
              a <a href="#" className="text-[#2bc196] underline">Política de Privacidade</a> da PagSmile.
            </Label>
          </div>
        </div>

        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <p className="text-blue-700 text-sm">
              <strong>Segurança:</strong> Seus dados são protegidos com criptografia de ponta a ponta 
              e tratados de acordo com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  );
}