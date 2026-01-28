import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default function AdminIntProfiles() {
    const profiles = [
        { name: 'Admin', users: 3, type: 'Sistema' },
        { name: 'Gerente', users: 5, type: 'Sistema' },
        { name: 'Comercial', users: 12, type: 'Sistema' },
        { name: 'Auditor Externo', users: 2, type: 'Customizado' },
    ];

    const columns = [
        { header: 'Perfil', accessorKey: 'name' },
        { header: 'Tipo', accessorKey: 'type', cell: i => <Badge variant="outline">{i.getValue()}</Badge> },
        { header: 'Usuários', accessorKey: 'users' },
        { header: 'Ações', id: 'actions', cell: () => <Button size="sm" variant="ghost">Editar</Button> }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Perfis e Permissões" 
                subtitle="Grupos de Acesso"
                breadcrumbs={[{ label: 'Configurações', page: 'AdminIntSettings' }, { label: 'Perfis', page: 'AdminIntProfiles' }]}
                actions={<Button><Plus className="w-4 h-4 mr-2" /> Novo Perfil</Button>}
            />

            <DataTable columns={columns} data={profiles} />
        </div>
    );
}