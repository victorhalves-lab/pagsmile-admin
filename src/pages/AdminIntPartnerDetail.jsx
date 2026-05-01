import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, TrendingUp, ShieldAlert, Lock, QrCode, Receipt, AlertTriangle, Banknote } from 'lucide-react';
import { toast } from 'sonner';

const brands = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard'];

export default function AdminIntPartnerDetail() {
    const [editing, setEditing] = useState(false);

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Configuração - Adyen" 
                subtitle="Adquirente Principal · Custos contratados"
                breadcrumbs={[
                    { label: 'Parceiros', page: 'AdminIntPartners' }, 
                    { label: 'Adyen', page: '#' }
                ]}
                actions={
                    editing ? (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
                            <Button onClick={() => { toast.success('Custos do parceiro salvos!'); setEditing(false); }}>Salvar Custos</Button>
                        </div>
                    ) : (
                        <Button onClick={() => setEditing(true)}>Editar Custos</Button>
                    )
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* ── Informações Gerais ───────────────────────────── */}
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Tipo</span>
                            <span className="font-medium">Adquirente</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Status</span>
                            <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Prioridade</span>
                            <span className="font-medium">1 (Principal)</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Routing</span>
                            <span className="font-medium">60% Volume</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Vigência</span>
                            <span className="font-medium">Até 31/12/2026</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Contrato</span>
                            <span className="font-medium text-blue-600 cursor-pointer hover:underline">Ver PDF</span>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Custos do Parceiro (todas as abas) ──────────── */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Estrutura de Custos do Parceiro</CardTitle>
                        <CardDescription>Custos cobrados pelo parceiro à PagSmile (base para cálculo de margem)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="mdr">
                            <TabsList className="flex flex-wrap h-auto">
                                <TabsTrigger value="mdr"><CreditCard className="w-3.5 h-3.5 mr-1" />MDR Cartão</TabsTrigger>
                                <TabsTrigger value="anticipation"><TrendingUp className="w-3.5 h-3.5 mr-1" />Antecipação</TabsTrigger>
                                <TabsTrigger value="threeds"><Lock className="w-3.5 h-3.5 mr-1" />3DS</TabsTrigger>
                                <TabsTrigger value="antifraud"><ShieldAlert className="w-3.5 h-3.5 mr-1" />Antifraude</TabsTrigger>
                                <TabsTrigger value="fii"><Receipt className="w-3.5 h-3.5 mr-1" />FII / Gateway</TabsTrigger>
                                <TabsTrigger value="precb"><AlertTriangle className="w-3.5 h-3.5 mr-1" />Pré-CB / CB</TabsTrigger>
                                <TabsTrigger value="pix"><QrCode className="w-3.5 h-3.5 mr-1" />PIX / Boleto</TabsTrigger>
                            </TabsList>

                            {/* ── MDR completo por bandeira × parcelamento ── */}
                            <TabsContent value="mdr" className="mt-4 space-y-3">
                                <p className="text-xs text-slate-500">Custo MDR cobrado pelo parceiro por bandeira e faixa de parcelamento.</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bandeira</TableHead>
                                            <TableHead>Crédito 1x</TableHead>
                                            <TableHead>2-6x</TableHead>
                                            <TableHead>7-12x</TableHead>
                                            <TableHead>13-21x</TableHead>
                                            <TableHead>Débito</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {brands.map((brand, idx) => (
                                            <TableRow key={brand}>
                                                <TableCell className="font-medium">{brand}</TableCell>
                                                {['vista', '2_6', '7_12', '13_21', 'debit'].map((col) => (
                                                    <TableCell key={col}>
                                                        {editing ? (
                                                            <Input className="w-20 h-8" defaultValue={(1.95 + idx * 0.1).toFixed(2)} />
                                                        ) : (
                                                            <span className="font-mono">{(1.95 + idx * 0.1).toFixed(2)}%</span>
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>

                            {/* ── Antecipação ── */}
                            <TabsContent value="anticipation" className="mt-4 space-y-4">
                                <p className="text-xs text-slate-500">Custo de antecipação cobrado pelo parceiro (a.m.) por faixa de prazo.</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <CostInput editing={editing} label="Antecipação D+1 (a.m.)" defaultValue="1.49%" />
                                    <CostInput editing={editing} label="Antecipação D+2 a D+14 (a.m.)" defaultValue="1.29%" />
                                    <CostInput editing={editing} label="Antecipação D+15 a D+30 (a.m.)" defaultValue="0.99%" />
                                    <CostInput editing={editing} label="Spread fixo (a.m.)" defaultValue="0.20%" />
                                </div>
                            </TabsContent>

                            {/* ── 3DS ── */}
                            <TabsContent value="threeds" className="mt-4 space-y-4">
                                <p className="text-xs text-slate-500">Custo cobrado pelo parceiro por autenticação 3D Secure.</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <CostInput editing={editing} label="3DS - Autenticação bem-sucedida (R$)" defaultValue="0.18" />
                                    <CostInput editing={editing} label="3DS - Tentativa falha (R$)" defaultValue="0.05" />
                                    <CostInput editing={editing} label="3DS Frictionless (R$)" defaultValue="0.10" />
                                </div>
                            </TabsContent>

                            {/* ── Antifraude ── */}
                            <TabsContent value="antifraud" className="mt-4 space-y-4">
                                <p className="text-xs text-slate-500">Custo cobrado pelo parceiro por análise antifraude.</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <CostInput editing={editing} label="Antifraude Cartão (R$)" defaultValue="0.45" />
                                    <CostInput editing={editing} label="Antifraude PIX (R$)" defaultValue="0.05" />
                                    <CostInput editing={editing} label="Score de risco extra (R$)" defaultValue="0.02" />
                                </div>
                            </TabsContent>

                            {/* ── FII / Gateway ── */}
                            <TabsContent value="fii" className="mt-4 space-y-4">
                                <p className="text-xs text-slate-500">FII (Fee de Intercâmbio Inteligente) e custos de gateway por transação.</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <CostInput editing={editing} label="FII por Transação (R$)" defaultValue="0.10" />
                                    <CostInput editing={editing} label="Gateway - Aprovada (R$)" defaultValue="0.08" />
                                    <CostInput editing={editing} label="Gateway - Recusada (R$)" defaultValue="0.02" />
                                    <CostInput editing={editing} label="Gateway - Estorno (R$)" defaultValue="0.05" />
                                    <CostInput editing={editing} label="Gateway - Captura tardia (R$)" defaultValue="0.03" />
                                </div>
                            </TabsContent>

                            {/* ── Pré-CB / CB ── */}
                            <TabsContent value="precb" className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <div className="w-6 h-4 bg-blue-600 rounded text-white text-[10px] font-bold flex items-center justify-center">VISA</div>
                                            Pré-Chargeback Verifi (CDRN/RDR)
                                        </h4>
                                        <CostInput editing={editing} label="Verifi CDRN - Alerta (R$)" defaultValue="11.00" />
                                        <CostInput editing={editing} label="Verifi RDR - Resolvido (R$)" defaultValue="5.00" />
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <div className="w-6 h-4 bg-red-600 rounded text-white text-[10px] font-bold flex items-center justify-center">MC</div>
                                            Pré-Chargeback Ethoca (Mastercard)
                                        </h4>
                                        <CostInput editing={editing} label="Ethoca Alert (R$)" defaultValue="10.00" />
                                        <CostInput editing={editing} label="Ethoca Consumer Clarity (R$)" defaultValue="3.50" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                                    <CostInput editing={editing} label="Chargeback (R$)" defaultValue="50.00" />
                                    <CostInput editing={editing} label="Representment - sucesso (R$)" defaultValue="0.00" />
                                    <CostInput editing={editing} label="Representment - perdido (R$)" defaultValue="25.00" />
                                </div>
                            </TabsContent>

                            {/* ── PIX / Boleto ── */}
                            <TabsContent value="pix" className="mt-4 space-y-4">
                                <p className="text-xs text-slate-500">Custos do parceiro para PIX e Boleto.</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <CostInput editing={editing} label="PIX in (%)" defaultValue="0.30%" />
                                    <CostInput editing={editing} label="PIX in fixo (R$)" defaultValue="0.00" />
                                    <CostInput editing={editing} label="PIX out / Devolução (R$)" defaultValue="0.05" />
                                    <CostInput editing={editing} label="Boleto - Emissão (R$)" defaultValue="1.50" />
                                    <CostInput editing={editing} label="Boleto - Liquidação (R$)" defaultValue="0.80" />
                                    <CostInput editing={editing} label="Boleto - Vencido (R$)" defaultValue="0.00" />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Helper para input de custo com fallback de visualização
function CostInput({ editing, label, defaultValue }) {
    return (
        <div className="space-y-1">
            <Label className="text-xs">{label}</Label>
            {editing ? (
                <Input className="h-9" defaultValue={defaultValue} />
            ) : (
                <div className="h-9 flex items-center px-3 bg-slate-50 rounded-md border border-slate-200 font-mono text-sm">
                    {defaultValue}
                </div>
            )}
        </div>
    );
}