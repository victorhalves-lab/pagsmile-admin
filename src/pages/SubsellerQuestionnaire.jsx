import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, Building2, User as UserIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

import WhiteLabelHeader, { WhiteLabelFooter } from '@/components/white-label/WhiteLabelHeader';
import { getBrandingFromUrl } from '@/components/white-label/mockWhiteLabelMerchants';

/**
 * Questionário V4 simplificado para subsellers.
 * - PJ: ~30 perguntas em 4 etapas
 * - PF: ~20 perguntas em 3 etapas
 *
 * INTEGRAÇÃO BACKEND:
 *   - Submit final → POST /onboarding/registerContact (já existe) com tipo=subseller_*
 *   - Score V4 → ENDPOINT NECESSÁRIO: /compliance/scoreSubsellerV4
 */
export default function SubsellerQuestionnaire() {
  const branding = useMemo(() => getBrandingFromUrl(), []);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const kind = params.get('kind') === 'pf' ? 'pf' : 'pj';

  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const totalSteps = kind === 'pj' ? 4 : 3;

  const update = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit
      toast.success('Cadastro enviado! Você receberá um email assim que a análise for concluída.');
      // Em produção:
      // await base44.functions.invoke('onboarding/registerContact', { ... });
    }
  };

  const handleBack = () => step > 1 && setStep(step - 1);

  const accent = branding.brand_color_primary;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC' }}>
      <WhiteLabelHeader
        branding={branding}
        subtitle={`Cadastro como subseller ${kind === 'pj' ? 'PJ' : 'PF'}`}
      />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold" style={{ color: accent }}>Etapa {step} de {totalSteps}</span>
            <span className="text-slate-500">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" style={{ '--progress-color': accent }} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          {/* PJ Step 1: Identificação */}
          {kind === 'pj' && step === 1 && (
            <Step title="Identificação da empresa" icon={Building2} accent={accent}>
              <Field label="Razão Social"><Input value={data.razao_social || ''} onChange={(e) => update('razao_social', e.target.value)} placeholder="Razão social completa" /></Field>
              <Field label="Nome Fantasia"><Input value={data.nome_fantasia || ''} onChange={(e) => update('nome_fantasia', e.target.value)} /></Field>
              <Field label="CNPJ"><Input value={data.cnpj || ''} onChange={(e) => update('cnpj', e.target.value)} placeholder="00.000.000/0000-00" /></Field>
              <Field label="Email corporativo"><Input type="email" value={data.email || ''} onChange={(e) => update('email', e.target.value)} /></Field>
              <Field label="Telefone"><Input value={data.telefone || ''} onChange={(e) => update('telefone', e.target.value)} placeholder="(11) 90000-0000" /></Field>
            </Step>
          )}

          {/* PJ Step 2: Atividade */}
          {kind === 'pj' && step === 2 && (
            <Step title="Atividade econômica" icon={Sparkles} accent={accent}>
              <Field label="Setor de atuação">
                <Select value={data.segmento || ''} onValueChange={(v) => update('segmento', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Descrição da atividade"><Input value={data.descricao || ''} onChange={(e) => update('descricao', e.target.value)} placeholder="O que sua empresa faz?" /></Field>
              <Field label="CNAE principal"><Input value={data.cnae || ''} onChange={(e) => update('cnae', e.target.value)} placeholder="0000-0/00" /></Field>
              <Field label="Tempo de atividade">
                <Select value={data.tempo_atividade || ''} onValueChange={(v) => update('tempo_atividade', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lt_1y">Menos de 1 ano</SelectItem>
                    <SelectItem value="1_3y">1 a 3 anos</SelectItem>
                    <SelectItem value="3_5y">3 a 5 anos</SelectItem>
                    <SelectItem value="gt_5y">Mais de 5 anos</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </Step>
          )}

          {/* PJ Step 3: Volumetria */}
          {kind === 'pj' && step === 3 && (
            <Step title="Volume estimado" icon={Sparkles} accent={accent}>
              <Field label="Faturamento mensal estimado">
                <Select value={data.volume_mensal || ''} onValueChange={(v) => update('volume_mensal', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lt_10k">Até R$ 10.000</SelectItem>
                    <SelectItem value="10_50k">R$ 10k a R$ 50k</SelectItem>
                    <SelectItem value="50_200k">R$ 50k a R$ 200k</SelectItem>
                    <SelectItem value="200k_1m">R$ 200k a R$ 1M</SelectItem>
                    <SelectItem value="gt_1m">Acima de R$ 1M</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Ticket médio"><Input value={data.ticket_medio || ''} onChange={(e) => update('ticket_medio', e.target.value)} placeholder="R$ 0,00" /></Field>
              <Field label="Principais formas de pagamento aceitas">
                <Select value={data.metodos || ''} onValueChange={(v) => update('metodos', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="ambos">PIX + Cartão</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </Step>
          )}

          {/* PJ Step 4: Sócios */}
          {kind === 'pj' && step === 4 && (
            <Step title="Sócio principal (responsável)" icon={UserIcon} accent={accent}>
              <Field label="Nome completo"><Input value={data.socio_nome || ''} onChange={(e) => update('socio_nome', e.target.value)} /></Field>
              <Field label="CPF"><Input value={data.socio_cpf || ''} onChange={(e) => update('socio_cpf', e.target.value)} placeholder="000.000.000-00" /></Field>
              <Field label="% participação"><Input type="number" value={data.socio_percent || ''} onChange={(e) => update('socio_percent', e.target.value)} /></Field>
              <Field label="É pessoa politicamente exposta (PEP)?">
                <Select value={data.socio_pep || ''} onValueChange={(v) => update('socio_pep', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Não</SelectItem>
                    <SelectItem value="yes">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 mt-2">
                ℹ️ Após enviar este cadastro, você receberá um link por email para upload dos documentos (Cartão CNPJ, Contrato Social, Selfie + Documento do sócio).
              </div>
            </Step>
          )}

          {/* PF Step 1: Identificação */}
          {kind === 'pf' && step === 1 && (
            <Step title="Seus dados" icon={UserIcon} accent={accent}>
              <Field label="Nome completo"><Input value={data.nome_completo || ''} onChange={(e) => update('nome_completo', e.target.value)} /></Field>
              <Field label="CPF"><Input value={data.cpf || ''} onChange={(e) => update('cpf', e.target.value)} placeholder="000.000.000-00" /></Field>
              <Field label="Data de nascimento"><Input type="date" value={data.data_nasc || ''} onChange={(e) => update('data_nasc', e.target.value)} /></Field>
              <Field label="Email"><Input type="email" value={data.email || ''} onChange={(e) => update('email', e.target.value)} /></Field>
              <Field label="Celular"><Input value={data.telefone || ''} onChange={(e) => update('telefone', e.target.value)} placeholder="(11) 90000-0000" /></Field>
            </Step>
          )}

          {/* PF Step 2: Endereço + Atividade */}
          {kind === 'pf' && step === 2 && (
            <Step title="Endereço e atividade" icon={Sparkles} accent={accent}>
              <Field label="CEP"><Input value={data.cep || ''} onChange={(e) => update('cep', e.target.value)} placeholder="00000-000" /></Field>
              <Field label="Endereço"><Input value={data.endereco || ''} onChange={(e) => update('endereco', e.target.value)} /></Field>
              <Field label="Cidade / UF"><Input value={data.cidade_uf || ''} onChange={(e) => update('cidade_uf', e.target.value)} placeholder="São Paulo / SP" /></Field>
              <Field label="O que você vende?"><Input value={data.atividade || ''} onChange={(e) => update('atividade', e.target.value)} placeholder="Ex: Cosméticos, Eletrônicos, Serviços..." /></Field>
            </Step>
          )}

          {/* PF Step 3: Volumetria */}
          {kind === 'pf' && step === 3 && (
            <Step title="Estimativa de volume" icon={Sparkles} accent={accent}>
              <Field label="Volume mensal estimado">
                <Select value={data.volume_pf || ''} onValueChange={(v) => update('volume_pf', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lt_5k">Até R$ 5.000</SelectItem>
                    <SelectItem value="5_20k">R$ 5k a R$ 20k</SelectItem>
                    <SelectItem value="20_50k">R$ 20k a R$ 50k</SelectItem>
                    <SelectItem value="gt_50k">Acima de R$ 50k</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="É pessoa politicamente exposta (PEP)?">
                <Select value={data.pep || ''} onValueChange={(v) => update('pep', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Não</SelectItem>
                    <SelectItem value="yes">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 mt-2">
                ℹ️ Após enviar, você receberá um link para captura de selfie + documento (RG ou CNH).
              </div>
            </Step>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <Button
              onClick={handleNext}
              size="lg"
              style={{ background: accent, color: 'white' }}
              className="hover:opacity-90"
            >
              {step === totalSteps ? (
                <>Enviar cadastro <CheckCircle2 className="w-4 h-4 ml-1" /></>
              ) : (
                <>Continuar <ArrowRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Você está se cadastrando como subseller de <strong>{branding.business_name_display}</strong>.
        </p>
      </div>

      <WhiteLabelFooter branding={branding} />
    </div>
  );
}

function Step({ title, icon: Icon, accent, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}20`, color: accent }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-black tracking-tight text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <Label className="text-xs font-bold text-slate-700 mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}