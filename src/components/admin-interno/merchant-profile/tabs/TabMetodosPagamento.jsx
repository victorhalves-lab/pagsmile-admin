import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, QrCode, FileText, Link2, CheckCircle, XCircle, Edit } from 'lucide-react';

const creditBrands = [
    { code: 'visa', name: 'Visa', enabled: true },
    { code: 'mastercard', name: 'Mastercard', enabled: true },
    { code: 'elo', name: 'Elo', enabled: true },
    { code: 'amex', name: 'American Express', enabled: false },
    { code: 'hipercard', name: 'Hipercard', enabled: false },
    { code: 'diners', name: 'Diners', enabled: false },
];

const debitBrands = [
    { code: 'visa', name: 'Visa', enabled: true },
    { code: 'mastercard', name: 'Mastercard', enabled: true },
    { code: 'elo', name: 'Elo', enabled: true },
];

export default function TabMetodosPagamento({ merchant }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" /> Editar
                </Button>
            </div>

            {/* Credit Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CreditCard className="w-5 h-5" /> Cartão de Crédito
                        </CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Habilitado</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="mb-3 block">Bandeiras habilitadas:</Label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {creditBrands.map(brand => (
                                <div key={brand.code} className={`p-4 border rounded-lg text-center ${brand.enabled ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 bg-slate-50 dark:bg-slate-800 opacity-50'}`}>
                                    <p className="font-medium mb-1">{brand.name}</p>
                                    {brand.enabled ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-slate-400 mx-auto" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Configurações:</h4>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>• Máximo de parcelas: <span className="font-medium text-slate-900 dark:text-white">12x</span></li>
                            <li>• Parcela mínima: <span className="font-medium text-slate-900 dark:text-white">R$ 10,00</span></li>
                            <li>• CVV obrigatório: <span className="font-medium text-slate-900 dark:text-white">Sim</span></li>
                            <li>• Aceita cartão internacional: <span className="font-medium text-slate-900 dark:text-white">Sim</span></li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Debit Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CreditCard className="w-5 h-5" /> Cartão de Débito
                        </CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Habilitado</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <Label className="mb-3 block">Bandeiras habilitadas:</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {debitBrands.map(brand => (
                            <div key={brand.code} className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                <p className="font-medium mb-1">{brand.name}</p>
                                <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* PIX */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <QrCode className="w-5 h-5" /> PIX
                        </CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Habilitado</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <h4 className="font-semibold text-sm mb-3">Configurações:</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>• Expiração do QR Code: <span className="font-medium text-slate-900 dark:text-white">30 minutos</span></li>
                        <li>• Valor mínimo: <span className="font-medium text-slate-900 dark:text-white">R$ 1,00</span></li>
                        <li>• Valor máximo: <span className="font-medium text-slate-900 dark:text-white">R$ 100.000,00</span></li>
                        <li>• PIX Copia e Cola: <span className="font-medium text-slate-900 dark:text-white">Habilitado</span></li>
                        <li>• PIX QR Code dinâmico: <span className="font-medium text-slate-900 dark:text-white">Habilitado</span></li>
                    </ul>
                </CardContent>
            </Card>

            {/* Boleto */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="w-5 h-5" /> Boleto
                        </CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Habilitado</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <h4 className="font-semibold text-sm mb-3">Configurações:</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>• Banco emissor: <span className="font-medium text-slate-900 dark:text-white">Bradesco</span></li>
                        <li>• Dias para vencimento: <span className="font-medium text-slate-900 dark:text-white">3 dias</span></li>
                        <li>• Aceitar após vencimento: <span className="font-medium text-slate-900 dark:text-white">Não</span></li>
                        <li>• Valor mínimo: <span className="font-medium text-slate-900 dark:text-white">R$ 10,00</span></li>
                        <li>• Valor máximo: <span className="font-medium text-slate-900 dark:text-white">R$ 50.000,00</span></li>
                        <li>• Juros após vencimento: <span className="font-medium text-slate-900 dark:text-white">0,033% ao dia</span></li>
                        <li>• Multa: <span className="font-medium text-slate-900 dark:text-white">2%</span></li>
                    </ul>
                </CardContent>
            </Card>

            {/* Payment Link */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Link2 className="w-5 h-5" /> Link de Pagamento
                        </CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Habilitado</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <Label className="mb-2 block">Métodos aceitos no link:</Label>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Cartão de Crédito</Badge>
                            <Badge variant="outline">Cartão de Débito</Badge>
                            <Badge variant="outline">PIX</Badge>
                            <Badge variant="outline">Boleto</Badge>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-500">Expiração padrão:</span>
                            <span className="ml-2 font-medium">7 dias</span>
                        </div>
                        <div>
                            <span className="text-slate-500">Limite de usos:</span>
                            <span className="ml-2 font-medium">Ilimitado</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}