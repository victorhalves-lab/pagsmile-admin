import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity } from 'lucide-react';
import { mockMerchants, mockTransactions } from '@/components/mockData/adminInternoMocks';
import MerchantHeader from '@/components/admin-interno/merchant-profile/MerchantHeader';
import TabResumo from '@/components/admin-interno/merchant-profile/tabs/TabResumo';
import TabDadosCadastrais from '@/components/admin-interno/merchant-profile/tabs/TabDadosCadastrais';
import TabTaxas from '@/components/admin-interno/merchant-profile/tabs/TabTaxas';
import TabConfiguracoes from '@/components/admin-interno/merchant-profile/tabs/TabConfiguracoes';
import TabMetodosPagamento from '@/components/admin-interno/merchant-profile/tabs/TabMetodosPagamento';
import TabCredenciaisAPI from '@/components/admin-interno/merchant-profile/tabs/TabCredenciaisAPI';
import TabTransacoes from '@/components/admin-interno/merchant-profile/tabs/TabTransacoes';
import TabFinanceiro from '@/components/admin-interno/merchant-profile/tabs/TabFinanceiro';
import TabSaques from '@/components/admin-interno/merchant-profile/tabs/TabSaques';
import TabAntecipacao from '@/components/admin-interno/merchant-profile/tabs/TabAntecipacao';
import TabRisco from '@/components/admin-interno/merchant-profile/tabs/TabRisco';
import TabChargebacks from '@/components/admin-interno/merchant-profile/tabs/TabChargebacks';
import TabMEDs from '@/components/admin-interno/merchant-profile/tabs/TabMEDs';
import TabDocumentos from '@/components/admin-interno/merchant-profile/tabs/TabDocumentos';
import TabKYC from '@/components/admin-interno/merchant-profile/tabs/TabKYC';
import TabNotas from '@/components/admin-interno/merchant-profile/tabs/TabNotas';
import TabComunicacoes from '@/components/admin-interno/merchant-profile/tabs/TabComunicacoes';
import TabAuditoria from '@/components/admin-interno/merchant-profile/tabs/TabAuditoria';
import TabUsuarios from '@/components/admin-interno/merchant-profile/tabs/TabUsuarios';
import TabWebhooks from '@/components/admin-interno/merchant-profile/tabs/TabWebhooks';
import TabSplit from '@/components/admin-interno/merchant-profile/tabs/TabSplit';
import TabRecorrencia from '@/components/admin-interno/merchant-profile/tabs/TabRecorrencia';



export default function AdminIntMerchantProfile() {
    const [searchParams, setSearchParams] = useSearchParams();
    const merchantId = searchParams.get('id');
    const tabParam = searchParams.get('tab') || 'resumo';
    const [activeTab, setActiveTab] = useState(tabParam);

    const merchant = mockMerchants.find(m => m.id === merchantId) || mockMerchants[0];

    useEffect(() => {
        setActiveTab(tabParam);
    }, [tabParam]);

    const handleTabChange = (value) => {
        setActiveTab(value);
        setSearchParams({ id: merchant.id, tab: value });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title={merchant.business_name}
                subtitle="Perfil 360°"
                breadcrumbs={[
                    { label: 'Merchants', page: 'AdminIntMerchants' },
                    { label: 'Lista', page: 'AdminIntMerchantsList' },
                    { label: merchant.business_name }
                ]}
            />

            <MerchantHeader merchant={merchant} />

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto p-1 bg-white dark:bg-slate-800 border rounded-lg mb-4 gap-1">
                    <TabsTrigger value="resumo">📊 Resumo</TabsTrigger>
                    <TabsTrigger value="dados">📝 Dados</TabsTrigger>
                    <TabsTrigger value="config">⚙️ Config</TabsTrigger>
                    <TabsTrigger value="taxas">💰 Taxas</TabsTrigger>
                    <TabsTrigger value="metodos">💳 Métodos</TabsTrigger>
                    <TabsTrigger value="api">🔑 API</TabsTrigger>
                    <TabsTrigger value="transacoes">📋 Trans.</TabsTrigger>
                    <TabsTrigger value="financeiro">🏦 Financ.</TabsTrigger>
                    <TabsTrigger value="saques">🏧 Saques</TabsTrigger>
                    <TabsTrigger value="antecipacao">⏩ Antec.</TabsTrigger>
                    <TabsTrigger value="risco">⚠️ Risco</TabsTrigger>
                    <TabsTrigger value="chargebacks">💳 CBs</TabsTrigger>
                    <TabsTrigger value="meds">🏦 MEDs</TabsTrigger>
                    <TabsTrigger value="documentos">📁 Docs</TabsTrigger>
                    <TabsTrigger value="kyc">🔍 KYC</TabsTrigger>
                    <TabsTrigger value="notas">📝 Notas</TabsTrigger>
                    <TabsTrigger value="comunicacoes">💬 Comun.</TabsTrigger>
                    <TabsTrigger value="auditoria">📋 Audit.</TabsTrigger>
                    <TabsTrigger value="usuarios">👥 Users</TabsTrigger>
                    <TabsTrigger value="webhooks">🔔 Webhooks</TabsTrigger>
                    <TabsTrigger value="split">➗ Split</TabsTrigger>
                    <TabsTrigger value="recorrencia">🔄 Recorr.</TabsTrigger>
                </TabsList>

                <TabsContent value="resumo"><TabResumo merchant={merchant} /></TabsContent>
                <TabsContent value="dados"><TabDadosCadastrais merchant={merchant} /></TabsContent>
                <TabsContent value="taxas"><TabTaxas merchant={merchant} /></TabsContent>
                <TabsContent value="config"><TabConfiguracoes merchant={merchant} /></TabsContent>
                <TabsContent value="metodos"><TabMetodosPagamento merchant={merchant} /></TabsContent>
                <TabsContent value="api"><TabCredenciaisAPI merchant={merchant} /></TabsContent>
                <TabsContent value="transacoes"><TabTransacoes merchant={merchant} /></TabsContent>
                <TabsContent value="financeiro"><TabFinanceiro merchant={merchant} /></TabsContent>
                <TabsContent value="saques"><TabSaques merchant={merchant} /></TabsContent>
                <TabsContent value="antecipacao"><TabAntecipacao merchant={merchant} /></TabsContent>
                <TabsContent value="risco"><TabRisco merchant={merchant} /></TabsContent>
                <TabsContent value="chargebacks"><TabChargebacks merchant={merchant} /></TabsContent>
                <TabsContent value="meds"><TabMEDs merchant={merchant} /></TabsContent>
                <TabsContent value="documentos"><TabDocumentos merchant={merchant} /></TabsContent>
                <TabsContent value="kyc"><TabKYC merchant={merchant} /></TabsContent>
                <TabsContent value="notas"><TabNotas merchant={merchant} /></TabsContent>
                <TabsContent value="comunicacoes"><TabComunicacoes merchant={merchant} /></TabsContent>
                <TabsContent value="auditoria"><TabAuditoria merchant={merchant} /></TabsContent>
                <TabsContent value="usuarios"><TabUsuarios merchant={merchant} /></TabsContent>
                <TabsContent value="webhooks"><TabWebhooks merchant={merchant} /></TabsContent>
                <TabsContent value="split"><TabSplit merchant={merchant} /></TabsContent>
                <TabsContent value="recorrencia"><TabRecorrencia merchant={merchant} /></TabsContent>
            </Tabs>
        </div>
    );
}