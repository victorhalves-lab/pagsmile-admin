import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye, FileText, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function TabKYC({ merchant }) {
    const kycStatus = 'approved';
    const riskLevel = 'low';
    const lastCheck = '2026-01-15 10:30';
    const nextReview = '2027-01-15';

    const companyVerifications = [
        { name: 'Situação Cadastral (RFB)', status: 'ok', result: 'ATIVA', date: '15/01/2026' },
        { name: 'Quadro Societário (QSA)', status: 'ok', result: 'OK', date: '15/01/2026' },
        { name: 'Consulta Protestos', status: 'ok', result: 'Limpo', date: '15/01/2026' },
        { name: 'Consulta Processos', status: 'warning', result: '2 processos', date: '15/01/2026' },
    ];

    const partners = [
        {
            name: 'João da Silva',
            cpf: '***.***. 789-00',
            share: '60%',
            verifications: [
                { name: 'Situação CPF (RFB)', status: 'ok', result: 'Regular', date: '15/01/2026' },
                { name: 'Verificação Biométrica', status: 'ok', result: 'Match 99%', date: '15/03/2024' },
                { name: 'PEP (Pessoa Exposta)', status: 'ok', result: 'Não', date: '15/01/2026' },
                { name: 'Listas Restritivas', status: 'ok', result: 'Limpo', date: '15/01/2026' },
            ]
        },
        {
            name: 'Maria da Silva',
            cpf: '***.***. 123-00',
            share: '40%',
            verifications: [
                { name: 'Situação CPF (RFB)', status: 'ok', result: 'Regular', date: '15/01/2026' },
                { name: 'Verificação Biométrica', status: 'ok', result: 'Match 98%', date: '15/03/2024' },
                { name: 'PEP (Pessoa Exposta)', status: 'ok', result: 'Não', date: '15/01/2026' },
                { name: 'Listas Restritivas', status: 'ok', result: 'Limpo', date: '15/01/2026' },
            ]
        }
    ];

    const sanctionLists = [
        { name: 'OFAC (EUA)', status: 'ok', date: '15/01/2026' },
        { name: 'ONU Sanctions', status: 'ok', date: '15/01/2026' },
        { name: 'EU Consolidated List', status: 'ok', date: '15/01/2026' },
        { name: 'COAF/BACEN', status: 'ok', date: '15/01/2026' },
        { name: 'PEP Nacional', status: 'ok', date: '15/01/2026' },
    ];

    const VerificationRow = ({ name, status, result, date }) => (
        <tr className="border-b border-slate-100 hover:bg-slate-50">
            <td className="py-3 px-3">{name}</td>
            <td className="py-3 px-3">
                {status === 'ok' && <Badge className="bg-green-100 text-green-700 border-green-200 border"><CheckCircle className="w-3 h-3 mr-1" /> {result}</Badge>}
                {status === 'warning' && <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 border"><AlertTriangle className="w-3 h-3 mr-1" /> {result}</Badge>}
                {status === 'error' && <Badge className="bg-red-100 text-red-700 border-red-200 border"><XCircle className="w-3 h-3 mr-1" /> {result}</Badge>}
            </td>
            <td className="py-3 px-3 text-slate-500">{date}</td>
            <td className="py-3 px-3 text-center"><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></td>
        </tr>
    );

    return (
        <div className="space-y-6">
            {/* Status Geral */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        📊 Status Geral de Compliance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-lg font-bold text-green-700">STATUS KYC/KYB: ✅ APROVADO</p>
                                <p className="text-sm text-slate-600">Última verificação: {lastCheck}</p>
                                <p className="text-sm text-slate-600">Próxima revisão: {nextReview} (anual)</p>
                                <p className="text-sm text-slate-600">Nível de risco: 🟢 BAIXO</p>
                            </div>
                            <Button variant="outline" onClick={() => toast.success('Revalidação iniciada!')}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Revalidar Tudo
                            </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <div className="text-center p-3 bg-white rounded-lg">
                                <p className="text-xs text-slate-500">Empresa</p>
                                <p className="text-lg font-bold text-green-600">✅ OK</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                                <p className="text-xs text-slate-500">Sócio 1</p>
                                <p className="text-lg font-bold text-green-600">✅ OK</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                                <p className="text-xs text-slate-500">Sócio 2</p>
                                <p className="text-lg font-bold text-green-600">✅ OK</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                                <p className="text-xs text-slate-500">Listas</p>
                                <p className="text-lg font-bold text-green-600">✅ Limpo</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KYB - Empresa */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        🏢 KYB - Verificação da Empresa
                    </CardTitle>
                    <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1" /> Revalidar</Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600 mb-4">CNPJ: {merchant.document} | Razão Social: {merchant.legal_name || merchant.business_name}</p>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-3 font-medium text-slate-500">Verificação</th>
                                <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                <th className="text-center py-2 px-3 font-medium text-slate-500">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companyVerifications.map((v, idx) => <VerificationRow key={idx} {...v} />)}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* KYC - Sócios */}
            {partners.map((partner, idx) => (
                <Card key={idx}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            👤 {partner.name} (Sócio - {partner.share})
                        </CardTitle>
                        <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1" /> Revalidar</Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 mb-4">CPF: {partner.cpf}</p>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Verificação</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Detalhes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partner.verifications.map((v, vIdx) => <VerificationRow key={vIdx} {...v} />)}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            ))}

            {/* Listas Restritivas */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        🌐 Verificação de Listas Restritivas
                    </CardTitle>
                    <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1" /> Revalidar</Button>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-3 font-medium text-slate-500">Lista</th>
                                <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                <th className="text-center py-2 px-3 font-medium text-slate-500">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sanctionLists.map((list, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-3 px-3">{list.name}</td>
                                    <td className="py-3 px-3">
                                        <Badge className="bg-green-100 text-green-700 border-green-200 border"><CheckCircle className="w-3 h-3 mr-1" /> Limpo</Badge>
                                    </td>
                                    <td className="py-3 px-3 text-slate-500">{list.date}</td>
                                    <td className="py-3 px-3 text-center"><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        ⚡ Ações de Compliance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Revalidar Tudo</Button>
                        <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Solicitar Documentos</Button>
                        <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Gerar Relatório KYC</Button>
                        <Button variant="outline" className="text-orange-600 border-orange-200"><AlertTriangle className="w-4 h-4 mr-2" /> Marcar para Revisão</Button>
                        <Button variant="outline" className="text-red-600 border-red-200"><XCircle className="w-4 h-4 mr-2" /> Reprovar Merchant</Button>
                        <Button variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-4 h-4 mr-2" /> Aprovar Manualmente</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}