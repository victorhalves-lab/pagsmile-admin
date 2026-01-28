import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntUsers() {
    const users = [
        { name: 'Ana Silva', email: 'ana@pagsmile.com', profile: 'Admin', status: 'active', last_access: 'Há 5 min' },
        { name: 'Pedro Santos', email: 'pedro@pagsmile.com', profile: 'Comercial', status: 'active', last_access: 'Há 2h' },
        { name: 'Maria Costa', email: 'maria@pagsmile.com', profile: 'Suporte', status: 'active', last_access: 'Há 30 min' },
        { name: 'João Lima', email: 'joao@pagsmile.com', profile: 'Financeiro', status: 'inactive', last_access: 'Há 30 dias' },
    ];

    const columns = [
        { header: 'Usuário', accessorKey: 'name', cell: i => <span className="font-medium">{i.getValue()}</span> },
        { header: 'E-mail', accessorKey: 'email' },
        { header: 'Perfil', accessorKey: 'profile' },
        { header: 'Status', accessorKey: 'status', cell: i => (
            <Badge variant={i.getValue() === 'active' ? 'default' : 'secondary'} className={i.getValue() === 'active' ? 'bg-green-100 text-green-700' : ''}>
                {i.getValue() === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
        )},
        { header: 'Último Acesso', accessorKey: 'last_access' },
        { header: 'Ações', id: 'actions', cell: () => (
            <Button size="sm" variant="ghost" asChild>
                <Link to={createPageUrl('AdminIntUserDetail')}><Settings className="w-4 h-4" /></Link>
            </Button>
        )}
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Gestão de Usuários" 
                subtitle="Controle de Acesso e Equipes"
                breadcrumbs={[{ label: 'Configurações', page: 'AdminIntSettings' }, { label: 'Usuários', page: 'AdminIntUsers' }]}
                actions={<Button><Plus className="w-4 h-4 mr-2" /> Novo Usuário</Button>}
            />

            <DataTable columns={columns} data={users} />
        </div>
    );
}