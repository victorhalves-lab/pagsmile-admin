import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormSection from '@/components/compliance/FormSection';
import { Shield } from 'lucide-react';

const perguntasPldFt = [
  { id: 'pld1', label: 'A empresa, algum sócio/acionista (direto ou indireto) ou administrador está incluído(a) em listas de sanções nacionais e/ou internacionais? *', condicional: 'pld1Detalhe', condicionalLabel: 'Se sim, especifique quem e em qual(is) lista(s).' },
  { id: 'pld2', label: 'A empresa possui vínculos comerciais, financeiros ou operacionais com países ou jurisdições sob sanções (Ex: Cuba, Irã, Síria, Coreia do Norte, etc.)? *', condicional: 'pld2Detalhe', condicionalLabel: 'Se sim, especifique o(s) país(es) e o tipo de vínculo.' },
  { id: 'pld3', label: 'A empresa é direta ou indiretamente controlada, administrada ou tem participação relevante de pessoas ou entidades incluídas em listas de sanções? *', condicional: 'pld3Detalhe', condicionalLabel: 'Se sim, especifique.' },
  { id: 'pld4', label: 'A empresa já realizou transações com parceiros, fornecedores ou clientes que foram identificados com histórico de compliance problemático, fraudes ou irregularidades? *', condicional: 'pld4Detalhe', condicionalLabel: 'Se sim, especifique a natureza da transação e o parceiro.' },
  { id: 'pld5', label: 'A empresa, seus colaboradores ou representantes já efetuaram ou foram instruídos a efetuar pagamentos que possam ser interpretados como propina, suborno ou vantagem indevida a agentes públicos ou privados? *', condicional: 'pld5Detalhe', condicionalLabel: 'Se sim, especifique o contexto do pagamento.' },
  { id: 'pld6', label: 'A empresa possui um programa de PLD/FT (Prevenção à Lavagem de Dinheiro e Financiamento ao Terrorismo) implementado? *', condicional: 'pld6Detalhe', condicionalLabel: 'Se não, justifique.', condicionalInvertido: true },
  { id: 'pld7', label: 'As políticas e procedimentos de PLD/FT da empresa estão formalizados e documentados? *', condicional: 'pld7Detalhe', condicionalLabel: 'Se sim, descreva a abrangência.' },
  { id: 'pld8', label: 'A empresa implementa procedimentos de KYC (Know Your Customer)? *', condicional: 'pld8Detalhe', condicionalLabel: 'Se sim, descreva os passos do processo de KYC.' },
  { id: 'pld9', label: 'A empresa possui mecanismos para controle de idade (se aplicável ao negócio)? *', condicional: 'pld9Detalhe', condicionalLabel: 'Se sim, especifique como funciona.' },
  { id: 'pld10', label: 'A empresa atua como plataforma de apostas? *', condicional: 'pld10Detalhe', condicionalLabel: 'Se sim, especifique o tipo de apostas e as jurisdições de atuação.' },
  { id: 'pld11', label: 'A empresa atua como plataforma de criptomoedas (exchange, custódia, etc.)? *', condicional: 'pld11Detalhe', condicionalLabel: 'Se sim, especifique o tipo de atuação e as moedas digitais.' },
  { id: 'pld12', label: 'A empresa oferece produtos ou serviços restritos por regulamentação (ex: armas, tabaco, conteúdo adulto)? *', condicional: 'pld12Detalhe', condicionalLabel: 'Se sim, especifique o produto/serviço e as políticas de controle.' },
  { id: 'pld13', label: 'A empresa oferece produtos ou serviços proibidos por lei? *', condicional: 'pld13Detalhe', condicionalLabel: 'Se sim, especifique o produto/serviço.' },
  { id: 'pld14', label: 'A empresa implementa procedimentos de EDD (Enhanced Due Diligence) para clientes de alto risco? *', condicional: 'pld14Detalhe', condicionalLabel: 'Se sim, descreva os critérios para aplicação do EDD e os procedimentos adicionais.' },
  { id: 'pld15', label: 'A empresa possui procedimentos específicos para o tratamento e monitoramento de clientes identificados como de alto risco de PLD/FT? *', condicional: 'pld15Detalhe', condicionalLabel: 'Se sim, descreva esses procedimentos.' },
];

const perguntasPldFt2 = [
  { id: 'pld16', label: 'Momento da coleta de documentos e procedimento: *', tipo: 'texto', placeholder: 'Descreva quando e como a empresa realiza a coleta de documentos de seus clientes.' },
  { id: 'pld17', label: 'A empresa realiza triagem de seus clientes (existentes e potenciais) e/ou de transações contra bases de dados de PEPs, listas de sanções (nacionais e internacionais) e outras listas restritivas? *', condicional: 'pld17Detalhe', condicionalLabel: 'Se sim, descreva a frequência, as bases de dados utilizadas e o processo de tratamento de \'hits\' ou alertas.' },
  { id: 'pld18', label: 'A empresa possui sistemas ou processos implementados para monitorar as transações e atividades dos clientes, a fim de identificar padrões incomuns ou suspeitos de PLD/FT? *', condicional: 'pld18Detalhe', condicionalLabel: 'Se sim, descreva o tipo de sistema (manual/automático), os indicadores de alerta e o fluxo de análise e reporte.' },
  { id: 'pld19', label: 'A empresa estabelece limites para o valor, frequência ou tipo de transações que os clientes podem realizar, como medida de controle de risco de PLD/FT? *', condicional: 'pld19Detalhe', condicionalLabel: 'Se sim, descreva os limites e sua aplicação.' },
  { id: 'pld20', label: 'A empresa possui um gestor de compliance designado, com autonomia e recursos suficientes? *' },
  { id: 'pld21', label: 'A empresa possui política que proíbe o relacionamento com "shell companies" (empresas de fachada) ou que exija identificação rigorosa do beneficiário final? *' },
  { id: 'pld22', label: 'A empresa oferece treinamentos regulares em PLD/FT para seus colaboradores, incluindo a alta direção? *' },
  { id: 'pld23', label: 'A empresa realiza auditorias internas ou externas periódicas para avaliar a efetividade de seus controles de compliance e PLD/FT? *' },
];

export default function Section8PldFt({ formData, handleChange }) {
  const renderPergunta = (pergunta) => {
    if (pergunta.tipo === 'texto') {
      return (
        <div key={pergunta.id} className="space-y-2 p-4 bg-slate-50 rounded-lg">
          <Label>{pergunta.label}</Label>
          <Textarea 
            placeholder={pergunta.placeholder}
            value={formData[pergunta.id] || ''} 
            onChange={(e) => handleChange(pergunta.id, e.target.value)}
            rows={3}
          />
        </div>
      );
    }

    const mostrarCondicional = pergunta.condicionalInvertido 
      ? formData[pergunta.id] === 'nao'
      : formData[pergunta.id] === 'sim';

    return (
      <div key={pergunta.id} className="space-y-3 p-4 bg-slate-50 rounded-lg">
        <Label>{pergunta.label}</Label>
        <RadioGroup 
          value={formData[pergunta.id] || ''} 
          onValueChange={(v) => handleChange(pergunta.id, v)} 
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sim" id={`${pergunta.id}-sim`} />
            <Label htmlFor={`${pergunta.id}-sim`} className="font-normal">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nao" id={`${pergunta.id}-nao`} />
            <Label htmlFor={`${pergunta.id}-nao`} className="font-normal">Não</Label>
          </div>
        </RadioGroup>
        
        {pergunta.condicional && mostrarCondicional && (
          <div className="mt-3 pl-4 border-l-2 border-gray-300">
            <Label className="text-sm text-gray-600">{pergunta.condicionalLabel}</Label>
            <Textarea 
              placeholder="Especifique..." 
              value={formData[pergunta.condicional] || ''} 
              onChange={(e) => handleChange(pergunta.condicional, e.target.value)}
              rows={2}
              className="mt-2"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <FormSection title="8. Compliance e PLD/FT" subtitle="Perguntas de risco e conformidade" icon={Shield}>
      <div className="space-y-4">
        {perguntasPldFt.map(renderPergunta)}
        {perguntasPldFt2.map(renderPergunta)}
      </div>
    </FormSection>
  );
}