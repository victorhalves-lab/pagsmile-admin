import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign, Wallet, ArrowUpFromLine, Clock, Target, ArrowRight, Receipt, Sparkles, Shield, ShieldCheck, FileCode, Scale, Lock } from 'lucide-react';
import { ADJUSTMENTS_KPIS, TOP_REASONS_PARETO, formatCurrency as fmtAdj } from '@/components/financial/adjustments/mocks/manualAdjustmentsMock';
import { RECEIVABLES_KPIS } from '@/components/financial/receivables/mocks/receivablesLedgerMock';
import { UR_KPIS, EFFECTS_KPIS, CERC_KPIS, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const tpvData = [
    { month: 'Ago', value: 8500000 },
    { month: 'Set', value: 9200000 },
    { month: 'Out', value: 10100000 },
    { month: 'Nov', value: 11800000 },
    { month: 'Dez', value: 13500000 },
    { month: 'Jan', value: 15200000 },
];

const revenueByProduct = [
    { name: 'Cartão', value: 65, amount: 276250 },
    { name: 'PIX', value: 25, amount: 106250 },
    { name: 'Boleto', value: 8, amount: 34000 },
    { name: 'Outros', value: 2, amount: 8500 },
];

const settlementAgenda = [
    { date: '29/01 (Qua)', value: 1234567, merchants: 45 },
    { date: '30/01 (Qui)', value: 987654, merchants: 38 },
    { date: '31/01 (Sex)', value: 1567890, merchants: 52 },
    { date: '03/02 (Seg)', value: 876543, merchants: 31 },
    { date: '04/02 (Ter)', value: 2345678, merchants: 67 },
];

const alerts = [
    { type: 'error', message: '3 saques bloqueados há mais de 24h', icon: AlertTriangle },
    { type: 'warning', message: '5 merchants com saldo negativo', icon: AlertTriangle },
    { type: 'warning', message: 'Retenção atípica em 2 merchants', icon: AlertTriangle },
    { type: 'success', message: 'Nenhum atraso de liquidação', icon: Clock },
];

export default function AdminIntFinancialDashboard() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Dashboard Financeiro"
                breadcrumbs={[{ label: 'Financeiro' }, { label: 'Dashboard' }]}
                actionElement={
                    <Select defaultValue="jan2026">
                        <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="jan2026">Janeiro 2026</SelectItem>
                            <SelectItem value="dez2025">Dezembro 2025</SelectItem>
                            <SelectItem value="nov2025">Novembro 2025</SelectItem>
                        </SelectContent>
                    </Select>
                }
            />

            {/* Profitability Highlight Card */}
            <Card className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white border-0 shadow-xl overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Target className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">📊 Visão de Rentabilidade Unificada</h3>
                            <p className="text-sm text-white/90 mt-1">
                                Margem líquida = Receita − Custo Variável − Custo Fixo. Veja realizado, projeção 90d, simulações e margem por cliente.
                            </p>
                        </div>
                    </div>
                    <Button asChild variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-md">
                        <Link to={createPageUrl('AdminIntProfitabilityView')}>
                            Abrir Análise <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Main KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-medium">TPV Mês</span>
                        </div>
                        <p className="text-2xl font-bold">R$ 15,2 M</p>
                        <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                            <TrendingUp className="w-3 h-3" /> +12% vs mês anterior
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-medium">Receita</span>
                        </div>
                        <p className="text-2xl font-bold">R$ 425 K</p>
                        <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                            <TrendingUp className="w-3 h-3" /> +8% vs mês anterior
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-medium">A Liquidar</span>
                        </div>
                        <p className="text-2xl font-bold">R$ 8,3 M</p>
                        <p className="text-xs text-slate-500 mt-1">Agenda futura</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Wallet className="w-4 h-4" />
                            <span className="text-xs font-medium">Saldo Merchants</span>
                        </div>
                        <p className="text-2xl font-bold">R$ 2,1 M</p>
                        <p className="text-xs text-slate-500 mt-1">234 merchants ativos</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-amber-600 mb-2">
                            <ArrowUpFromLine className="w-4 h-4" />
                            <span className="text-xs font-medium">Saques Pend.</span>
                        </div>
                        <p className="text-2xl font-bold">R$ 340 K</p>
                        <p className="text-xs text-slate-500 mt-1">23 pendentes</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TPV Evolution Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">📈 Evolução do TPV</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={tpvData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v) => formatCurrency(v)} />
                                <Area type="monotone" dataKey="value" stroke="#2bc196" fill="#2bc196" fillOpacity={0.2} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Revenue by Product */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">📊 Receita por Produto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {revenueByProduct.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{item.name}</span>
                                        <span className="font-medium">{item.value}% ({formatCurrencyShort(item.amount)})</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full" 
                                            style={{ 
                                                width: `${item.value}%`,
                                                backgroundColor: idx === 0 ? '#2bc196' : idx === 1 ? '#3b82f6' : idx === 2 ? '#f59e0b' : '#94a3b8'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Settlement Agenda */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">📅 Agenda de Liquidação (Próximos 7 dias)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {settlementAgenda.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                    <span className="text-sm font-medium">{item.date}</span>
                                    <span className="text-sm font-bold">{formatCurrency(item.value)}</span>
                                    <span className="text-xs text-slate-500">{item.merchants} merchants</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">⚠️ Alertas Financeiros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {alerts.map((alert, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex items-center gap-3 p-3 rounded-lg ${
                                        alert.type === 'error' ? 'bg-red-50 text-red-700' :
                                        alert.type === 'warning' ? 'bg-amber-50 text-amber-700' :
                                        'bg-green-50 text-green-700'
                                    }`}
                                >
                                    <alert.icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">{alert.message}</span>
                                </div>
                            ))}
                            {ADJUSTMENTS_KPIS.pending_approval > 0 && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 text-amber-700">
                                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm flex-1">{ADJUSTMENTS_KPIS.pending_approval} ajustes manuais aguardando aprovação L2</span>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link to={createPageUrl('AdminIntManualAdjustments')}>Revisar</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Receivables + Manual Adjustments overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Receivables snapshot */}
                <Card className="border-violet-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-violet-600" /> Receivables Ledger
                            </CardTitle>
                            <Button size="sm" variant="outline" asChild>
                                <Link to={createPageUrl('AdminIntReceivablesLedger')}>
                                    Abrir hub <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-blue-50 rounded p-2">
                                <p className="text-[10px] uppercase font-bold text-slate-500">A receber</p>
                                <p className="text-sm font-bold text-blue-700">{formatCurrencyShort(RECEIVABLES_KPIS.pending)}</p>
                            </div>
                            <div className="bg-red-50 rounded p-2">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Em chargeback</p>
                                <p className="text-sm font-bold text-red-700">{formatCurrencyShort(RECEIVABLES_KPIS.in_chargeback)}</p>
                            </div>
                            <div className="bg-amber-50 rounded p-2">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Bloqueados</p>
                                <p className="text-sm font-bold text-amber-700">{formatCurrencyShort(RECEIVABLES_KPIS.blocked)}</p>
                            </div>
                        </div>
                        {(RECEIVABLES_KPIS.cerc_divergences > 0 || RECEIVABLES_KPIS.cerc_pending > 0) && (
                            <div className="bg-orange-50 border border-orange-200 rounded p-2 text-[11px] text-orange-900 flex items-center gap-1.5">
                                <AlertTriangle className="w-3 h-3" />
                                <span>{RECEIVABLES_KPIS.cerc_divergences} divergências CERC + {RECEIVABLES_KPIS.cerc_pending} pendentes registro</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Manual Adjustments snapshot — keep first */}
                <Card className="border-violet-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-violet-600" /> Ajustes Manuais (mês)
                            </CardTitle>
                            <Button size="sm" variant="outline" asChild>
                                <Link to={createPageUrl('AdminIntManualAdjustments')}>
                                    Abrir hub <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-emerald-50 rounded p-2">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Créditos</p>
                                <p className="text-sm font-bold text-emerald-700">+{formatCurrencyShort(ADJUSTMENTS_KPIS.total_credit)}</p>
                            </div>
                            <div className="bg-red-50 rounded p-2">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Débitos</p>
                                <p className="text-sm font-bold text-red-700">−{formatCurrencyShort(ADJUSTMENTS_KPIS.total_debit)}</p>
                            </div>
                            <div className="bg-violet-50 rounded p-2">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Pendentes</p>
                                <p className="text-sm font-bold text-violet-700">{ADJUSTMENTS_KPIS.pending_approval}</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-xs">
                            <p className="text-[10px] uppercase font-bold text-slate-500">Top motivos</p>
                            {TOP_REASONS_PARETO.slice(0, 3).map((r) => (
                                <div key={r.reason} className="flex items-center justify-between border-b last:border-0 py-1">
                                    <span className="truncate flex-1">{r.label}</span>
                                    <span className="font-bold ml-2">{fmtAdj(r.value)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Regulatory Mentor cards (Wave Mentor Entrega 6 P3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="w-4 h-4 text-violet-600" /> Saúde Regulatória CERC
                    </CardTitle>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={createPageUrl('AdminIntCERCConciliationHub')}>
                        Hub CERC <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-emerald-50 rounded p-2">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Concordância</p>
                      <p className="text-lg font-bold text-emerald-700">{CERC_KPIS.avg_concordance_rate}%</p>
                    </div>
                    <div className="bg-red-50 rounded p-2">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Críticas</p>
                      <p className="text-lg font-bold text-red-700">{CERC_KPIS.divergences_critical}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {CERC_KPIS.pending_treatment} divergências pendentes · SLA médio {CERC_KPIS.avg_sla_hours}h
                  </p>
                </CardContent>
              </Card>

              <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-violet-600" /> Unidades de Recebíveis (UR)
                    </CardTitle>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`${createPageUrl('AdminIntReceivablesLedger')}?tab=ur_regulatory`}>
                        Visão UR <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 rounded p-2">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Total URs</p>
                      <p className="text-sm font-bold text-blue-700">{UR_KPIS.total_count.toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="bg-emerald-50 rounded p-2">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Disponível</p>
                      <p className="text-sm font-bold text-emerald-700">{formatCurrencyShort(UR_KPIS.total_available)}</p>
                    </div>
                    <div className="bg-amber-50 rounded p-2">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Comprom.</p>
                      <p className="text-sm font-bold text-amber-700">{formatCurrencyShort(UR_KPIS.total_committed)}</p>
                    </div>
                  </div>
                  {(UR_KPIS.registration_pending + UR_KPIS.registration_failed) > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded p-2 text-[11px] text-orange-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{UR_KPIS.registration_pending} pendentes + {UR_KPIS.registration_failed} falhas de registro</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Scale className="w-4 h-4 text-red-600" /> Bloqueios Judiciais
                    </CardTitle>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={createPageUrl('AdminIntJudicialBlockages')}>
                        Hub Jurídico <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-red-50 rounded p-2">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Ativos</p>
                      <p className="text-lg font-bold text-red-700">{EFFECTS_KPIS.judicial_lien_count + EFFECTS_KPIS.attachment_count}</p>
                    </div>
                    <div className="bg-orange-50 rounded p-2">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Penhoras</p>
                      <p className="text-lg font-bold text-orange-700">{EFFECTS_KPIS.attachment_count}</p>
                    </div>
                  </div>
                  {EFFECTS_KPIS.with_conflict_count > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[11px] text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{EFFECTS_KPIS.with_conflict_count} conflitos entre efeitos — escalar Jurídico</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-violet-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-violet-600" /> Arquivos CERC
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black">{CERC_KPIS.files_exchanged_30d}</p>
                    <p className="text-xs text-slate-500">trocados nos últimos 30 dias</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={createPageUrl('AdminIntCERCFileViewer')}>
                      Visualizador <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-violet-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="w-4 h-4 text-violet-600" /> Efeitos de Contrato
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black">{EFFECTS_KPIS.total_count.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-slate-500">{formatCurrencyShort(EFFECTS_KPIS.total_value_affected)} afetados</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={createPageUrl('AdminIntContractEffectsRegistry')}>
                      Hub <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
        </div>
    );
}