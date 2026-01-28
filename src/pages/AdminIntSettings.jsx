import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Settings, Bell, Link as LinkIcon, FileText, Shield, Key, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntSettings() {
    const settingsGroups = [
        {
            title: 'Usuários e Acesso',
            icon: Users,
            items: [
                { label: 'Gestão de Usuários', page: 'AdminIntUsers', desc: 'Gerenciar contas e acessos' },
                { label: 'Perfis e Permissões', page: 'AdminIntProfiles', desc: 'Configurar níveis de acesso' },
                { label: 'Equipes', page: '#', desc: 'Estrutura organizacional' },
                { label: 'Segurança', page: '#', desc: '2FA, Senhas, SSO' },
            ]
        },
        {
            title: 'Sistema',
            icon: Settings,
            items: [
                { label: 'Parâmetros Globais', page: 'AdminIntGlobalParams', desc: 'Taxas, limites e regras' },
                { label: 'Empresa', page: '#', desc: 'Dados cadastrais e bancários' },
                { label: 'Calendário', page: '#', desc: 'Feriados e dias úteis' },
            ]
        },
        {
            title: 'Integrações',
            icon: LinkIcon,
            items: [
                { label: 'Conectores', page: 'AdminIntIntegrations', desc: 'Adquirentes e parceiros' },
                { label: 'Webhooks', page: 'AdminIntWebhooks', desc: 'Logs de eventos' },
                { label: 'API Keys', page: '#', desc: 'Credenciais de sistema' },
            ]
        },
        {
            title: 'Auditoria e Logs',
            icon: FileText,
            items: [
                { label: 'Log de Auditoria', page: 'AdminIntAudit', desc: 'Rastreabilidade de ações' },
                { label: 'Logs do Sistema', page: 'AdminIntSystemLogs', desc: 'Logs técnicos e erros' },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Configurações do Sistema" 
                subtitle="Administração Geral e Parâmetros"
                breadcrumbs={[{ label: 'Configurações', page: 'AdminIntSettings' }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsGroups.map((group, idx) => (
                    <Card key={idx}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <group.icon className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-lg">{group.title}</h3>
                            </div>
                            <div className="grid gap-2">
                                {group.items.map((item, i) => (
                                    <Link 
                                        key={i} 
                                        to={item.page === '#' ? '#' : createPageUrl(item.page)}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                                    >
                                        <div>
                                            <p className="font-medium text-slate-900">{item.label}</p>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}