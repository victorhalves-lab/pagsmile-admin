import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, History } from 'lucide-react';

const brands = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard'];
const installments = ['1x', '2x', '3x', '4x', '5x', '6x', '7-12x'];

const defaultRates = {
    Visa: ['2.99%', '3.29%', '3.49%', '3.69%', '3.89%', '4.09%', '4.49%'],
    Mastercard: ['2.99%', '3.29%', '3.49%', '3.69%', '3.89%', '4.09%', '4.49%'],
    Elo: ['3.19%', '3.49%', '3.69%', '3.89%', '4.09%', '4.29%', '4.69%'],
    Amex: ['3.49%', '3.79%', '3.99%', '4.19%', '4.39%', '4.59%', '4.99%'],
    Hipercard: ['3.19%', '3.49%', '3.69%', '3.89%', '4.09%', '4.29%', '4.69%'],
};

const debitRates = {
    Visa: '1.99%',
    Mastercard: '1.99%',
    Elo: '2.19%',
};

const serviceCharges = [
    { name: 'Mensalidade do plano', value: 'R$ 99,00/mês' },
    { name: 'Taxa de saque (TED)', value: 'R$ 5,00 por saque' },
    { name: 'Taxa de saque (PIX)', value: 'R$ 0,00 (gratuito)' },
    { name: 'Taxa de antecipação', value: '1,89% ao mês' },
    { name: 'Taxa de chargeback', value: 'R$ 50,00 por CB' },
    { name: 'Taxa de MED (PIX)', value: 'R$ 0,00' },
    { name: 'Taxa de estorno', value: 'R$ 0,00' },
];

const rateHistory = [
    { date: '01/01/2026', change: 'Visa 1x: 3,49% → 2,99%', user: 'Carlos S.', negotiation: '#NEG-2024-892' },
    { date: '01/01/2026', change: 'PIX: 1,29% → 0,99%', user: 'Carlos S.', negotiation: '#NEG-2024-892' },
    { date: '15/06/2025', change: 'Plano: Basic → Premium', user: 'Maria R.', negotiation: '#NEG-2024-456' },
    { date: '01/03/2024', change: 'Taxas iniciais (onboarding)', user: 'Sistema', negotiation: '-' },
];

export default function TabTaxas({ merchant }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button>
                    <Edit className="w-4 h-4 mr-2" /> Editar Taxas
                </Button>
            </div>

            {/* Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        📊 Resumo de Taxas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div>
                            <span className="text-sm text-slate-500">Plano:</span>
                            <span className="ml-2 font-semibold">{merchant.plan_name || 'Premium'}</span>
                        </div>
                        <div>
                            <span className="text-sm text-slate-500">Vigente desde:</span>
                            <span className="ml-2 font-semibold">01/01/2026</span>
                        </div>
                        <div>
                            <span className="text-sm text-slate-500">Negociação:</span>
                            <span className="ml-2 font-semibold text-[#2bc196]">#NEG-2024-0892</span>
                        </div>
                        <div>
                            <span className="text-sm text-slate-500">Validade:</span>
                            <span className="ml-2 font-semibold">31/12/2026</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-sm text-slate-500 mb-1">Crédito à Vista</p>
                            <p className="text-2xl font-bold text-[#2bc196]">2,99%</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-sm text-slate-500 mb-1">Crédito Parcelado</p>
                            <p className="text-2xl font-bold text-[#2bc196]">3,49%+</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-sm text-slate-500 mb-1">Débito</p>
                            <p className="text-2xl font-bold text-[#2bc196]">1,99%</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-sm text-slate-500 mb-1">PIX</p>
                            <p className="text-2xl font-bold text-[#2bc196]">0,99%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Credit Card Rates */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">💳 Taxas - Cartão de Crédito</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Bandeira</th>
                                    {installments.map(i => (
                                        <th key={i} className="text-center py-2 px-2 font-medium text-slate-500">{i}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {brands.map(brand => (
                                    <tr key={brand} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="py-3 px-3 font-medium">{brand}</td>
                                        {defaultRates[brand].map((rate, idx) => (
                                            <td key={idx} className="text-center py-3 px-2">{rate}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-slate-500 mt-3">Taxa fixa por transação: R$ 0,00</p>
                </CardContent>
            </Card>

            {/* Debit Card Rates */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">💳 Taxas - Cartão de Débito</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Bandeira</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Taxa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(debitRates).map(([brand, rate]) => (
                                    <tr key={brand} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="py-3 px-3 font-medium">{brand}</td>
                                        <td className="py-3 px-3">{rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-slate-500 mt-3">Taxa fixa por transação: R$ 0,00</p>
                </CardContent>
            </Card>

            {/* PIX Rates */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">🏦 Taxas - PIX</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-slate-500">Taxa percentual</p>
                            <p className="text-lg font-bold">0,99%</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Taxa fixa</p>
                            <p className="text-lg font-bold">R$ 0,00</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Taxa mínima</p>
                            <p className="text-lg font-bold">R$ 0,50</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Taxa máxima</p>
                            <p className="text-lg font-bold">R$ 50,00</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            <strong>Exemplo:</strong> Transação de R$ 100,00 → Taxa: R$ 0,99
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Service Charges */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">💼 Tarifas de Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Serviço</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceCharges.map((charge, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="py-3 px-3">{charge.name}</td>
                                        <td className="py-3 px-3 font-medium">{charge.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Rate History */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <History className="w-5 h-5" /> Histórico de Alterações de Taxas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Alteração</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Usuário</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Negociação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rateHistory.map((item, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="py-3 px-3">{item.date}</td>
                                        <td className="py-3 px-3">{item.change}</td>
                                        <td className="py-3 px-3">{item.user}</td>
                                        <td className="py-3 px-3">
                                            {item.negotiation !== '-' ? (
                                                <Badge variant="outline" className="text-[#2bc196] border-[#2bc196]">{item.negotiation}</Badge>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button variant="link" size="sm" className="mt-3">Ver histórico completo →</Button>
                </CardContent>
            </Card>
        </div>
    );
}