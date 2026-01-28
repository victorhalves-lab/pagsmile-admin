import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminIntSystemLogs() {
    const logs = [
        { time: '14:45:32.456', level: 'INFO', service: 'transaction', msg: 'Transaction approved ID: TX-123' },
        { time: '14:45:32.123', level: 'INFO', service: 'antifraud', msg: 'Score calculated: 85' },
        { time: '14:45:31.890', level: 'DEBUG', service: 'gateway', msg: 'Request to Adyen sent' },
        { time: '14:45:30.567', level: 'WARN', service: 'webhook', msg: 'Retry attempt 2/5 for WH-456' },
        { time: '14:45:28.234', level: 'ERROR', service: 'liquidation', msg: 'Bank API timeout after 30s' },
    ];

    const getLevelBadge = (level) => {
        const colors = { INFO: 'bg-blue-100 text-blue-700', ERROR: 'bg-red-100 text-red-700', WARN: 'bg-yellow-100 text-yellow-700', DEBUG: 'bg-slate-100 text-slate-700' };
        return <Badge className={`${colors[level]} border-0`}>{level}</Badge>;
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Logs do Sistema" 
                subtitle="Monitoramento Técnico"
                breadcrumbs={[{ label: 'Configurações', page: 'AdminIntSettings' }, { label: 'Logs Sistema', page: 'AdminIntSystemLogs' }]}
            />

            <Card className="bg-slate-950 text-slate-200 font-mono text-sm">
                <CardContent className="p-4 space-y-2">
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-4 border-b border-slate-800 pb-1 last:border-0">
                            <span className="text-slate-500 whitespace-nowrap">{log.time}</span>
                            <span className="w-16">{getLevelBadge(log.level)}</span>
                            <span className="text-indigo-400 w-24">{log.service}</span>
                            <span className="text-slate-300">{log.msg}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}