import React from 'react';
import KPICard from './shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Server, Activity, Database, Cloud, AlertOctagon, 
  CheckCircle2, AlertTriangle, XCircle, Globe
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const StatusRow = ({ name, status, type, uptime, latency }) => (
  <div className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${
        status === 'operational' ? 'bg-green-100' : 
        status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'
      }`}>
        {type === 'api' ? <Globe className={`w-4 h-4 ${status === 'operational' ? 'text-green-600' : status === 'degraded' ? 'text-yellow-600' : 'text-red-600'}`} /> :
         type === 'db' ? <Database className={`w-4 h-4 ${status === 'operational' ? 'text-green-600' : status === 'degraded' ? 'text-yellow-600' : 'text-red-600'}`} /> :
         <Cloud className={`w-4 h-4 ${status === 'operational' ? 'text-green-600' : status === 'degraded' ? 'text-yellow-600' : 'text-red-600'}`} />
        }
      </div>
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-slate-500">Uptime 30d: {uptime}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium">{latency}</p>
        <p className="text-xs text-slate-500">Latência P95</p>
      </div>
      <Badge variant={
        status === 'operational' ? 'success' : 
        status === 'degraded' ? 'warning' : 'destructive'
      }>
        {status === 'operational' ? 'Operacional' : status === 'degraded' ? 'Degradado' : 'Fora do Ar'}
      </Badge>
    </div>
  </div>
);

export default function TechnicalView() {
  const latencyData = [
    { time: '10:00', api: 120, db: 45 },
    { time: '10:05', api: 132, db: 48 },
    { time: '10:10', api: 125, db: 42 },
    { time: '10:15', api: 145, db: 52 },
    { time: '10:20', api: 280, db: 150 }, // Spike
    { time: '10:25', api: 160, db: 65 },
    { time: '10:30', api: 130, db: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Uptime Geral (30d)" value="99.98%" change={0.01} icon={Activity} />
        <KPICard title="Latência Média API" value="145ms" change={12} positiveIsBad={true} icon={Server} />
        <KPICard title="Erros/Min (5xx)" value="4.2" change={-15} positiveIsBad={true} icon={AlertOctagon} />
        <KPICard title="Jobs em Fila" value="1,240" change={5} positiveIsBad={true} icon={Database} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Status List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status dos Serviços</CardTitle>
            <CardDescription>Monitoramento em tempo real dos componentes críticos</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <StatusRow name="API Gateway" status="operational" type="api" uptime="99.99%" latency="120ms" />
            <StatusRow name="Processador Cartão" status="operational" type="cloud" uptime="99.95%" latency="350ms" />
            <StatusRow name="Pix (SPI)" status="degraded" type="cloud" uptime="99.80%" latency="850ms" />
            <StatusRow name="PostgreSQL Master" status="operational" type="db" uptime="100%" latency="45ms" />
            <StatusRow name="Redis Cluster" status="operational" type="db" uptime="100%" latency="5ms" />
            <StatusRow name="Antifraude Shield" status="operational" type="cloud" uptime="99.90%" latency="420ms" />
          </CardContent>
        </Card>

        {/* Latency Chart & Incidents */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Latência (ms)</CardTitle>
              <CardDescription>API vs Database (30 min)</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Line type="monotone" dataKey="api" stroke="#3b82f6" strokeWidth={2} dot={false} name="API" />
                  <Line type="monotone" dataKey="db" stroke="#10b981" strokeWidth={2} dot={false} name="DB" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incidentes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-yellow-800">Degradação SPI (Pix)</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Latência elevada na comunicação com o BACEN. Transações podem demorar até 5s.
                  </p>
                  <p className="text-[10px] text-yellow-600 mt-2 font-mono">Iniciado: 10:15 (há 20min)</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Ver Status Page Completa
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}