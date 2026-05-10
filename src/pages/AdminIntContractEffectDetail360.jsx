import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink, RefreshCw, MessageSquare, FileText, Download, Mail, AlertTriangle, X, Copy } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_EFFECTS, MOCK_URS, EFFECT_TYPES, EFFECT_STATUS, REGISTRARS, formatCurrency } from '@/components/regulatory/mocks/urMock';
import { toast } from 'sonner';

export default function AdminIntContractEffectDetail360() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || MOCK_EFFECTS[0].id;

  const effect = useMemo(() => MOCK_EFFECTS.find((e) => e.id === id) || MOCK_EFFECTS[0], [id]);
  const otherEffectsOnUR = useMemo(() => MOCK_EFFECTS.filter((e) => e.ur_id === effect.ur_id && e.id !== effect.id), [effect.ur_id, effect.id]);

  const type = EFFECT_TYPES[effect.type];
  const status = EFFECT_STATUS[effect.status];
  const registrar = REGISTRARS[effect.registrar];

  const copy = (v) => { navigator.clipboard.writeText(v); toast.success('Copiado!'); };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Efeito de Contrato ${effect.id}`}
        subtitle={`${type?.label} ${effect.sub_type ? `· ${effect.sub_type}` : ''}`}
        icon={Shield}
        breadcrumbs={[
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Efeitos de Contrato', page: 'AdminIntContractEffectsRegistry' },
          { label: effect.id },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success('PDF gerado')}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Relatório PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Comunicação enviada à contraparte')}>
              <Mail className="w-3.5 h-3.5 mr-1.5" /> Comunicar contraparte
            </Button>
            {effect.status === 'failed_registration' && (
              <Button size="sm" className="bg-amber-600" onClick={() => toast.success('Reprocessamento iniciado')}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reprocessar registro
              </Button>
            )}
            {effect.status === 'active' && (
              <Button size="sm" variant="destructive" onClick={() => toast.success('Cancelamento solicitado · 4-eyes')}>
                <X className="w-3.5 h-3.5 mr-1.5" /> Cancelar efeito (4-eyes)
              </Button>
            )}
          </div>
        }
      />

      {/* Header destacado */}
      <Card className="bg-gradient-to-r from-violet-50 to-pink-50 border-violet-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="text-5xl">{type?.icon}</div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${type?.color} text-sm`}>{type?.label}</Badge>
                  {effect.sub_type && <Badge variant="outline">{effect.sub_type}</Badge>}
                  <Badge className={`${status?.color}`}>{status?.label}</Badge>
                  <Badge className={`${registrar?.color} border`}>{registrar?.label}</Badge>
                  {effect.has_conflict && <Badge className="bg-red-100 text-red-700"><AlertTriangle className="w-3 h-3 mr-0.5" />Conflito</Badge>}
                </div>
                <p className="text-2xl font-bold mt-2">{effect.counterparty?.name}</p>
                <p className="text-xs text-slate-500">
                  Aplicado em {new Date(effect.application_date).toLocaleDateString('pt-BR')} · {effect.pct_of_ur}% da UR
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-500">Valor afetado</p>
              <p className="text-3xl font-black text-red-700">−{formatCurrency(effect.value_affected)}</p>
              <Link to={`${createPageUrl('AdminIntURDetail360')}?id=${effect.ur_id}`}>
                <Button variant="outline" size="sm" className="mt-2">
                  <ExternalLink className="w-3 h-3 mr-1" /> Ver UR {effect.ur_id}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="bg-white dark:bg-slate-900 border p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="text-xs">Visão geral</TabsTrigger>
          <TabsTrigger value="counterparty" className="text-xs">Contraparte</TabsTrigger>
          <TabsTrigger value="ur_context" className="text-xs">UR & contexto</TabsTrigger>
          <TabsTrigger value="lifecycle" className="text-xs">Ciclo de vida</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Evidências ({effect.documents_count})</TabsTrigger>
          <TabsTrigger value="regulatory" className="text-xs">Referências regulatórias</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Identificação e contexto</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <Field label="ID interno" value={
                <span className="font-mono flex items-center gap-1">{effect.id}<Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => copy(effect.id)}><Copy className="w-3 h-3" /></Button></span>
              } />
              <Field label="ID na registradora" value={
                <span className="font-mono flex items-center gap-1">{effect.registrar_id}<Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => copy(effect.registrar_id)}><Copy className="w-3 h-3" /></Button></span>
              } />
              <Field label="Tipo" value={<Badge className={type?.color}>{type?.icon} {type?.label}</Badge>} />
              {effect.sub_type && <Field label="Sub-tipo" value={effect.sub_type === 'fiscal' ? 'Penhora fiscal' : 'Penhora trabalhista'} />}
              <Field label="Status" value={<Badge className={status?.color}>{status?.label}</Badge>} />
              <Field label="Registradora" value={<Badge className={`${registrar?.color} border`}>{registrar?.label}</Badge>} />
              <Field label="Valor afetado" value={<strong>{formatCurrency(effect.value_affected)}</strong>} />
              <Field label="% da UR" value={`${effect.pct_of_ur}%`} />
              <Field label="Data aplicação" value={new Date(effect.application_date).toLocaleDateString('pt-BR')} />
              <Field label="Data registro" value={new Date(effect.registration_date).toLocaleDateString('pt-BR')} />
              {effect.expiration_date && <Field label="Vigência expira" value={new Date(effect.expiration_date).toLocaleDateString('pt-BR')} />}
              <Field label="Solicitado por" value={effect.created_by} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Explicação contextual</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{type?.desc}</p>
              {effect.type === 'judicial_lien' && (
                <p className="text-xs text-slate-500 mt-2">
                  Bloqueios judiciais têm precedência absoluta na hierarquia regulatória — quando UR liquidar,
                  recursos vão obrigatoriamente para o credor judicial até o limite determinado.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counterparty" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Dados da contraparte</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold">{effect.counterparty?.name}</p>
                    {effect.counterparty?.cnpj && <p className="text-sm text-slate-500">CNPJ: {effect.counterparty.cnpj}</p>}
                    {effect.counterparty?.process && <p className="text-sm text-slate-500 font-mono">Processo: {effect.counterparty.process}</p>}
                    <Badge className="mt-2" variant="outline">{effect.counterparty?.type}</Badge>
                  </div>
                </div>
              </div>
              {effect.contract_ref && (
                <div className="p-3 border rounded">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Contrato origem</p>
                  <p className="font-mono text-sm">{effect.contract_ref}</p>
                </div>
              )}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                Esta contraparte tem <strong>14 outros efeitos ativos</strong> com a PagSmile (somatório R$ 2,12M).
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ur_context" className="mt-4 space-y-3">
          <Card>
            <CardHeader><CardTitle className="text-base">UR vinculada</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div>
                  <p className="font-mono font-bold">{effect.ur?.id}</p>
                  <p className="text-xs text-slate-500">{effect.ur?.merchant?.name} · {effect.ur?.brand} via {effect.ur?.acquirer}</p>
                  <p className="text-xs text-slate-500">Vencimento: {new Date(effect.ur?.expected_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <Link to={`${createPageUrl('AdminIntURDetail360')}?id=${effect.ur_id}`}>
                  <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" /> Ficha 360 da UR</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {otherEffectsOnUR.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Outros efeitos sobre a mesma UR ({otherEffectsOnUR.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {otherEffectsOnUR.map((other) => {
                  const otherType = EFFECT_TYPES[other.type];
                  return (
                    <div key={other.id} className="flex items-center justify-between p-2 border rounded text-xs">
                      <div className="flex items-center gap-2">
                        <span>{otherType?.icon}</span>
                        <Badge className={`${otherType?.color} text-[9px]`}>{otherType?.label}</Badge>
                        <span>{other.counterparty?.name}</span>
                      </div>
                      <span className="font-bold text-red-600">−{formatCurrency(other.value_affected)}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              {[
                { label: 'Aplicação inicial', date: effect.application_date, ok: true },
                { label: 'Registro na registradora', date: effect.registration_date, ok: effect.status !== 'failed_registration' },
                effect.expiration_date ? { label: 'Vigência expira', date: effect.expiration_date, future: true } : null,
                effect.status === 'liquidated' ? { label: 'Aplicado em liquidação', date: effect.application_date, ok: true } : null,
                effect.status === 'cancelled' ? { label: 'Cancelado', date: effect.application_date, ok: true } : null,
              ].filter(Boolean).map((e, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className={`w-2 h-2 rounded-full ${e.future ? 'bg-slate-300' : e.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div className="flex-1">
                    <p className="text-xs font-medium">{e.label}</p>
                    <p className="text-[10px] text-slate-500">{new Date(e.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Evidências documentais</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: effect.documents_count }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">
                        {effect.type === 'judicial_lien' ? `Oficio_judicial_${effect.id}_${i + 1}.pdf` :
                         effect.type === 'fiduciary_assignment' ? `Contrato_cessao_${effect.contract_ref}_v${i + 1}.pdf` :
                         `Evidencia_${i + 1}.pdf`}
                      </p>
                      <p className="text-[10px] text-slate-500">{(150 + i * 50).toFixed(0)} KB · adicionado em {new Date(effect.application_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost"><Download className="w-3 h-3 mr-1" /> Baixar</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulatory" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Referências regulatórias</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2 bg-violet-50 rounded">
                <p className="font-bold">Resolução CMN 4.734/2019</p>
                <p className="text-[10px] text-slate-600">Marco regulatório do registro centralizado de recebíveis</p>
              </div>
              {effect.type === 'judicial_lien' && (
                <div className="p-2 bg-violet-50 rounded">
                  <p className="font-bold">CPC art. 854 (Penhora online — BACEN-JUD)</p>
                </div>
              )}
              {effect.sub_type === 'fiscal' && (
                <div className="p-2 bg-violet-50 rounded">
                  <p className="font-bold">CTN art. 184-185 (Penhora fiscal)</p>
                </div>
              )}
              {effect.sub_type === 'labor' && (
                <div className="p-2 bg-violet-50 rounded">
                  <p className="font-bold">CLT art. 882-883 (Execução trabalhista)</p>
                </div>
              )}
              {effect.type.includes('assignment') && (
                <div className="p-2 bg-violet-50 rounded">
                  <p className="font-bold">CC art. 1.361-1.368-A (Cessão fiduciária)</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Notas administrativas</span>
                <Button size="sm" variant="outline" onClick={() => toast.success('Modal de nota aberto')}>
                  <MessageSquare className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {effect.notes && (
                <div className="p-3 border-l-2 border-violet-300 bg-slate-50 rounded">
                  <p className="text-xs"><strong>Sistema</strong> · {new Date(effect.application_date).toLocaleDateString('pt-BR')}</p>
                  <p className="text-[11px] text-slate-700 mt-1">{effect.notes}</p>
                </div>
              )}
              <p className="text-xs text-slate-400 text-center py-2">Nenhuma nota adicional</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-start justify-between py-1 border-b last:border-0">
      <span className="text-slate-500">{label}</span>
      <div className="font-medium text-right ml-2">{value}</div>
    </div>
  );
}