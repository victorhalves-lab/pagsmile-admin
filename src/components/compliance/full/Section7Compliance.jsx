import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormSection from '@/components/compliance/FormSection';
import { Shield } from 'lucide-react';

const perguntas = [
  { id: 'comp1', label: 'Algum sócio, acionista (direto ou indireto), administrador, diretor ou beneficiário final da empresa está incluído em listas de sanções nacionais ou internacionais? *', condicional: 'comp1Detalhe' },
  { id: 'comp2', label: 'A empresa, ou qualquer um de seus diretores, acionistas (diretos ou indiretos) ou beneficiários finais, mantém vínculos com países, regiões ou territórios sujeitos a sanções internacionais abrangentes? *', condicional: 'comp2Detalhe' },
  { id: 'comp3', label: 'A empresa é de propriedade ou está, direta ou indiretamente, sob controle de pessoa ou entidade incluída em listas de sanções? *', condicional: 'comp3Detalhe' },
  { id: 'comp4', label: 'Nos últimos 12 meses, a empresa ou algum de seus diretores, conselheiros, acionistas ou beneficiários finais esteve sob investigação criminal? *', condicional: 'comp4Detalhe' },
  { id: 'comp5', label: 'Nos últimos 12 meses, a empresa ou algum de seus diretores teve contas bancárias ou de pagamento encerradas por motivos de compliance? *', condicional: 'comp5Detalhe' },
  { id: 'comp6', label: 'A empresa opera com criptomoedas, criptoativos, tokens ou assimilados? *', condicional: 'comp6Detalhe' },
  { id: 'comp7', label: 'A empresa opera com jogos, apostas, cassino ou atividades similares? *', condicional: 'comp7Detalhe', condicionalLabel: 'Nº da Licença' },
  { id: 'comp8', label: 'A empresa atua em alguma atividade que possa ser considerada proibida ou ilegal? *' },
  { id: 'comp9', label: 'A empresa atua em alguma atividade considerada de alto risco ou que requer aprovação especial (ex: nutra, viagens, leilões)? *', condicional: 'comp9Detalhe', condicionalLabel: 'Qual atividade?' },
  { id: 'comp10', label: 'Algum beneficiário final (UBO) ou administrador é PEP ou possui relacionamento próximo com PEP? *', condicional: 'comp10Detalhe' },
  { id: 'comp11', label: 'A empresa possui relacionamento comercial ou financeiro com terceiros localizados em jurisdições offshore ou paraísos fiscais? *', condicional: 'comp11Detalhe' },
];

export default function Section7Compliance({ formData, handleChange }) {
  return (
    <FormSection title="7. Compliance" subtitle="Perguntas de risco e conformidade regulatória" icon={Shield}>
      <div className="space-y-4">
        {perguntas.map((p) => (
          <div key={p.id} className="space-y-3 p-4 bg-slate-50 rounded-lg">
            <Label>{p.label}</Label>
            <RadioGroup value={formData[p.id] || ''} onValueChange={(v) => handleChange(p.id, v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id={`${p.id}-sim`} /><Label htmlFor={`${p.id}-sim`} className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id={`${p.id}-nao`} /><Label htmlFor={`${p.id}-nao`} className="font-normal">Não</Label></div>
            </RadioGroup>
            {p.condicional && formData[p.id] === 'sim' && (
              <div className="mt-3 pl-4 border-l-2 border-gray-300">
                <Label className="text-sm text-gray-600">{p.condicionalLabel || 'Especifique:'}</Label>
                {p.condicionalLabel === 'Nº da Licença' ? (
                  <Input placeholder="Número da licença" value={formData[p.condicional] || ''} onChange={(e) => handleChange(p.condicional, e.target.value)} className="mt-2" />
                ) : (
                  <Textarea placeholder="Especifique..." value={formData[p.condicional] || ''} onChange={(e) => handleChange(p.condicional, e.target.value)} rows={2} className="mt-2" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </FormSection>
  );
}