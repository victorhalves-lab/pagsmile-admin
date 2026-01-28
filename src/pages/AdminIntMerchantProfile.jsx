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
                    <TabsTrigger value="resumo" className="gap-1">📊 Resumo</TabsTrigger>
                    <TabsTrigger value="dados" className="gap-1">📝 Dados</TabsTrigger>
                    <TabsTrigger value="config" className="gap-1">⚙️ Config</TabsTrigger>
                    <TabsTrigger value="taxas" className="gap-1">💰 Taxas</TabsTrigger>
                    <TabsTrigger value="metodos" className="gap-1">💳 Métodos</TabsTrigger>
                    <TabsTrigger value="api" className="gap-1">🔑 API</TabsTrigger>
                    <TabsTrigger value="transacoes" className="gap-1">📋 Trans.</TabsTrigger>
                    <TabsTrigger value="financeiro" className="gap-1">🏦 Financ.</TabsTrigger>
                    <TabsTrigger value="saques" className="gap-1">🏧 Saques</TabsTrigger>
                    <TabsTrigger value="antecipacao" className="gap-1">⏩ Antec.</TabsTrigger>
                    <TabsTrigger value="risco" className="gap-1">⚠️ Risco</TabsTrigger>
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
            </Tabs>
        </div>
    );
}