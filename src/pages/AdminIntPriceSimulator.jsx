import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminIntPriceSimulator() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Simulador de Preços" 
                subtitle="Projeção de Receita e Margem"
                breadcrumbs={[{ label: 'Planos', page: 'AdminIntFeePlans' }, { label: 'Simulador', page: 'AdminIntPriceSimulator' }]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle>Parâmetros</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">MCC</label>
                            <Select defaultValue="5411">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5411">5411 - Supermercados</SelectItem>
                                    <SelectItem value="5734">5734 - Software</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">TPV Mensal (R$)</label>
                            <Input defaultValue="500000" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Plano Base</label>
                            <Select defaultValue="growth">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="growth">Growth</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mix Cartão / Pix</label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">Cartão</span>
                                <Slider defaultValue={[70]} max={100} step={1} className="flex-1" />
                                <span className="text-xs">Pix</span>
                            </div>
                            <p className="text-xs text-slate-500 text-center">70% Cartão - 30% Pix</p>
                        </div>
                        <Button className="w-full mt-4"><Calculator className="w-4 h-4 mr-2" /> Calcular</Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Resultado da Simulação</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500">Receita Bruta</p>
                                <p className="text-2xl font-bold text-slate-900">R$ 20.299</p>
                                <p className="text-xs text-green-600">4.06% do TPV</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500">Custo Total</p>
                                <p className="text-2xl font-bold text-red-600">R$ 10.330</p>
                                <p className="text-xs text-red-500">2.07% do TPV</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-sm text-green-700">Margem Líquida</p>
                                <p className="text-2xl font-bold text-green-700">R$ 9.969</p>
                                <p className="text-xs text-green-600 font-semibold">1.99% do TPV</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Detalhamento</h4>
                            <div className="bg-white border rounded-lg overflow-hidden text-sm">
                                <div className="grid grid-cols-4 bg-slate-50 p-2 font-medium border-b">
                                    <span>Produto</span>
                                    <span>Volume</span>
                                    <span>Receita</span>
                                    <span>Margem</span>
                                </div>
                                <div className="grid grid-cols-4 p-2 border-b">
                                    <span>Visa 1x</span>
                                    <span>R$ 78.750</span>
                                    <span>R$ 3.142</span>
                                    <span className="text-green-600">R$ 1.543</span>
                                </div>
                                <div className="grid grid-cols-4 p-2 border-b">
                                    <span>Pix</span>
                                    <span>R$ 150.000</span>
                                    <span>R$ 1.485</span>
                                    <span className="text-green-600">R$ 1.485</span>
                                </div>
                                <div className="grid grid-cols-4 p-2 border-b">
                                    <span>Antecipação</span>
                                    <span>R$ 150.000</span>
                                    <span>R$ 2.985</span>
                                    <span className="text-green-600">R$ 810</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}