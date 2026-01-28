import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

export default function AdminIntIntegrationDetail() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Integração: Adyen" 
                subtitle="Configuração de Conector"
                breadcrumbs={[{ label: 'Integrações', page: 'AdminIntIntegrations' }, { label: 'Adyen', page: '#' }]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline"><Play className="w-4 h-4 mr-2" /> Testar Conexão</Button>
                        <Button>Salvar</Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Nome</label>
                            <Input defaultValue="Adyen" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Tipo</label>
                            <Input defaultValue="Adquirente" disabled />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Status</label>
                            <Badge className="w-fit bg-green-100 text-green-700">Ativo</Badge>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Ambiente</label>
                            <Input defaultValue="Produção" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Credenciais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">API Key</label>
                            <div className="flex gap-2">
                                <Input type="password" defaultValue="************************" />
                                <Button variant="outline">Mostrar</Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Merchant Account</label>
                            <Input defaultValue="PagSmileBR" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Timeout (segundos)</label>
                            <Input defaultValue="30" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}