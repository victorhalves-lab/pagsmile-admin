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
                            <p className="text-2xl font-bold text-[