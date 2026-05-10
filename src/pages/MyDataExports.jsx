import React, { useState } from 'react';
import { Download, FileText, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const FORMATS_ICONS = { pdf: '📄', xlsx: '📊', csv: '📋', json: '🔧', zip: '🗜️' };

const MY_EXPORTS = [
  { id: 'exp_001', name: 'Transações Abril 2026', format: 'xlsx', size: '4.2 MB', date: '2026-05-09 16:20', status: 'completed', expires_in_hours: 38, sensitive: false, downloads: 2 },
  { id: 'exp_002', name: 'Recebíveis Q1 2026', format: 'pdf', size: '1.8 MB', date: '2026-05-08 14:15', status: 'completed', expires_in_hours: 14, sensitive: true, downloads: 1, signed: true },
  { id: 'exp_003', name: 'TPV detalhado por bandeira', format: 'csv', size: '825 KB', date: '2026-05-07 11:42', status: 'completed', expires_in_hours: 0, sensitive: false, expired: true, downloads: 5 },
  { id: 'exp_004', name: 'Histórico de Chargebacks', format: 'xlsx', size: '12 MB', date: '2026-05-06 22:00', status: 'processing', expires_in_hours: null, sensitive: true, progress: 65 },
  { id: 'exp_005', name: 'LGPD - Dados pessoais (Solicitação 2026-0142)', format: 'zip', size: '780 KB', date: '2026-05-05 09:30', status: 'completed', expires_in_hours: 6, sensitive: true, signed: true, lgpd: true, downloads: 0 },
  { id: 'exp_006', name: 'Webhooks Logs últimos 30d', format: 'json', size: '2.4 MB', date: '2026-05-04 18:00', status: 'failed', error: 'Timeout durante consulta — escopo grande demais' },
];

export default function MyDataExports() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Download}
        title="Minhas Exportações de Dados"
        subtitle="Mentor API · Transparência LGPD · Histórico completo das suas exportações"
        breadcrumbs={[
          { label: 'Configurações', page: 'SettingsPage' },
          { label: 'Exportações' },
        ]}
      />

      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-800">Conformidade LGPD — Direito de Acesso</div>
            <p className="text-sm text-blue-700 mt-1">
              Em conformidade com a LGPD (Art. 18), você tem direito a solicitar exportação de todos os seus dados pessoais a qualquer momento.
              As exportações são preservadas por janela de 24-72h após geração para download seguro com URL assinada.
            </p>
            <Button size="sm" variant="outline" className="mt-2 gap-1">
              <FileText className="w-4 h-4" /> Solicitar Exportação LGPD Completa
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3"><div className="text-xs text-slate-500 uppercase font-bold">Total exportações</div><div className="text-2xl font-black mt-1">47</div></Card>
        <Card className="p-3"><div className="text-xs text-slate-500 uppercase font-bold">Disponíveis agora</div><div className="text-2xl font-black mt-1 text-emerald-600">3</div></Card>
        <Card className="p-3"><div className="text-xs text-slate-500 uppercase font-bold">Próximas a expirar</div><div className="text-2xl font-black mt-1 text-amber-600">2</div></Card>
        <Card className="p-3"><div className="text-xs text-slate-500 uppercase font-bold">Armazenamento usado</div><div className="text-2xl font-black mt-1">125 MB</div></Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="available">Disponíveis</TabsTrigger>
          <TabsTrigger value="processing">Processando</TabsTrigger>
          <TabsTrigger value="lgpd">LGPD</TabsTrigger>
          <TabsTrigger value="expired">Expiradas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <div className="p-3 border-b border-slate-100">
              <Input 
                placeholder="Buscar exportação..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {MY_EXPORTS.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase())).map(e => (
                <div key={e.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-3xl">{FORMATS_ICONS[e.format]}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-medium">{e.name}</div>
                        {e.sensitive && <Badge variant="outline" className="text-xs"><Lock className="w-3 h-3 mr-0.5" /> Sensível</Badge>}
                        {e.signed && <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">🔒 ICP-Brasil</Badge>}
                        {e.lgpd && <Badge className="text-xs bg-blue-100 text-blue-700">LGPD</Badge>}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {e.size && `${e.size} · `}{e.date}
                        {e.downloads !== undefined && ` · ${e.downloads} download(s)`}
                      </div>
                      {e.status === 'processing' && (
                        <div className="mt-2">
                          <div className="text-xs text-amber-600 mb-1">Processando... {e.progress}%</div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all" style={{ width: `${e.progress}%` }}></div>
                          </div>
                        </div>
                      )}
                      {e.status === 'failed' && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" /> {e.error}
                        </div>
                      )}
                      {e.status === 'completed' && e.expires_in_hours > 0 && (
                        <div className={`text-xs mt-1 ${e.expires_in_hours < 12 ? 'text-amber-600' : 'text-slate-500'}`}>
                          {e.expires_in_hours < 12 ? '⚠️' : '⏰'} Expira em {e.expires_in_hours}h
                        </div>
                      )}
                      {e.expired && <Badge variant="outline" className="text-xs text-slate-500 mt-1">Expirado · Disponível em arquivo regulatório</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {e.status === 'completed' && !e.expired && (
                      <Button size="sm" className="gap-1"><Download className="w-3 h-3" /> Baixar</Button>
                    )}
                    {e.status === 'failed' && (
                      <Button size="sm" variant="outline">Reprocessar</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="mt-4"><Card className="p-8 text-center text-slate-500">Filtre apenas exportações disponíveis para download</Card></TabsContent>
        <TabsContent value="processing" className="mt-4"><Card className="p-8 text-center text-slate-500">Exportações em processamento</Card></TabsContent>
        <TabsContent value="lgpd" className="mt-4"><Card className="p-8 text-center text-slate-500">Histórico de exportações LGPD</Card></TabsContent>
        <TabsContent value="expired" className="mt-4"><Card className="p-8 text-center text-slate-500">Exportações expiradas (consultáveis em arquivo)</Card></TabsContent>
      </Tabs>
    </div>
  );
}