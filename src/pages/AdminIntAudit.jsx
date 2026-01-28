import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import KPICard from '@/components/dashboard/KPICard';
import { Activity, Shield, Users, Clock } from 'lucide-react';

export default function AdminIntAudit() {
    const logs = [
        { time: '14:45:32', user: 'Ana Silva', action: 'Editou Merchant', object: 'M-00123', details: 'Alterou taxa Visa 1x' },
        { time: '14:42:18', user: 'Pedro Santos', action: 'Criou Proposta', object: 'P-00567', details: 'Loja XYZ' },
        { time: '14:38:05', user: 'Maria Costa', action: 'Resolveu Ticket', object: 'T-00456', details: 'Tempo: 1h 45m' },
        { time: '14:30:11', user: 'João Lima', action: 'Login', object: 'Sessão', details: 'IP: 189.123.45.67' },
    ];

    const columns = [
        { header: 'Timestamp', accessorKey: 'time' },
        { header: 'Usuário', accessorKey: 'user' },
        { header: 'Ação', accessorKey: 'action' },
        { header: 'Objeto', accessorKey: 'object' },
        { header: 'Detalhes', accessorKey: 'details' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Log de Auditoria" 
                subtitle="Rastreabilidade e Compliance"
                breadcrumbs={[{ label: 'Configurações', page: 'AdminIntSettings' }, { label: 'Auditoria', page: 'AdminIntAudit' }]}
            />

            <div className="grid grid-cols-4 gap-4">
                <KPICard title="Ações Hoje" value="4.567" icon={Activity} />
                <KPICard title="Usuários Ativos" value="32" icon={Users} />
                <KPICard title="Logins Hoje" value="89" icon={Clock} />
                <KPICard title="Alertas Seg." value="3" icon={Shield} className="border-l-4 border-l-red-500" />
            </div>

            <DataTable columns={columns} data={logs} />
        </div>
    );
}