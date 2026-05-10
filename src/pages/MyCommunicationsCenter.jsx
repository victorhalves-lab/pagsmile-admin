import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquareDashed, Mail, MessageSquare, MessageCircle, Send, FileText, TrendingUp, Eye } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { myCommsKpis, myCommsLogs, myCommsTemplates, myCommsChannels } from '@/components/my-value/mocks/myValueMock';

const CHANNEL_CFG = {
  email: { label: 'Email', icon: Mail, color: 'bg-blue-100 text-blue-700' },
  sms: { label: 'SMS', icon: MessageSquare, color: 'bg-purple-100 text-purple-700' },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-100 text-green-700' }
};

const STATUS_CFG = {
  delivered: { label: 'Entregue', color: 'bg-emerald-100 text-emerald-700' },
  failed: { label: 'Falhou', color: 'bg-red-100 text-red-700' },
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700' }
};

const CATEGORY_CFG = {
  transactional: 'Transacional',
  recovery: 'Recuperação',
  security: 'Segurança',
  marketing: 'Marketing'
};

export default function MyCommunicationsCenter() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Central de Comunicações — Email, SMS e WhatsApp"
        subtitle="Histórico · Templates · Performance multicanal"
        icon={MessageSquareDashed}
        breadcrumbs={[{ label: 'Operação', page: '#' }, { label: 'Comunicações' }]}
        actions={
          <Button className="gap-2"><Send className="w-4 h-4" /> Nova mensagem</Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MyKpiCard label="MENSAGENS 30D" value={(myCommsKpis.total_sent_30d / 1000).toFixed(1) + 'k'} sub="enviadas" icon={Send} accent="blue" />
        <MyKpiCard label="ENTREGA" value={`${myCommsKpis.delivery_rate}%`} sub="taxa global" icon={TrendingUp} accent="emerald" />
        <MyKpiCard label="ABERTURA" value={`${myCommsKpis.open_rate}%`} sub="média" icon={Eye} accent="emerald" />
        <MyKpiCard label="EMAIL" value={(myCommsKpis.total_email / 1000).toFixed(1) + 'k'} sub="60% do total" accent="blue" />
        <MyKpiCard label="SMS" value={(myCommsKpis.total_sms / 1000).toFixed(1) + 'k'} sub="22% do total" accent="purple" />
        <MyKpiCard label="WHATSAPP" value={(myCommsKpis.total_whatsapp / 1000).toFixed(1) + 'k'} sub="18% do total" accent="emerald" />
        <MyKpiCard label="FALHAS 24H" value={myCommsKpis.failed_24h} sub="precisam atenção" accent="amber" warn={myCommsKpis.failed_24h > 0} />
      </div>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="templates">Templates ({myCommsTemplates.length})</TabsTrigger>
          <TabsTrigger value="channels">Performance por Canal</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quando</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Destinatário</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aberto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myCommsLogs.map((log) => {
                    const channelCfg = CHANNEL_CFG[log.channel];
                    const Icon = channelCfg.icon;
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">{log.timestamp.replace('T', ' ').slice(0, 16)}</TableCell>
                        <TableCell>
                          <Badge className={`${channelCfg.color} gap-1`}>
                            <Icon className="w-3 h-3" /> {channelCfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{log.recipient}</TableCell>
                        <TableCell className="max-w-[300px] truncate text-sm">{log.subject}</TableCell>
                        <TableCell>
                          <Badge className={STATUS_CFG[log.status]?.color || 'bg-slate-100'}>
                            {STATUS_CFG[log.status]?.label || log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {log.opened === true && <span className="text-emerald-600 font-semibold">✓ Sim</span>}
                          {log.opened === false && <span className="text-slate-500">— Não</span>}
                          {log.opened === null && <span className="text-slate-400">N/A</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {myCommsTemplates.map((tpl) => {
              const channelCfg = CHANNEL_CFG[tpl.channel];
              const Icon = channelCfg.icon;
              return (
                <Card key={tpl.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-lg ${channelCfg.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{tpl.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px]">{CATEGORY_CFG[tpl.category]}</Badge>
                            <span className="text-[10px] text-slate-500">{tpl.language}</span>
                          </div>
                        </div>
                      </div>
                      {tpl.customizable && <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Editável</Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center mt-3 pt-3 border-t">
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">Uso 30d</div>
                        <div className="font-bold">{tpl.usage_30d.toLocaleString('pt-BR')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">Abertura</div>
                        <div className="font-bold text-emerald-600">{tpl.open_rate ? `${tpl.open_rate}%` : 'N/A'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Comparativa por Canal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={myCommsChannels}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="channel" />
                  <YAxis tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                  <Bar dataKey="delivery_rate" fill="#3b82f6" name="Taxa de Entrega" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="open_rate" fill="#10b981" name="Taxa de Abertura" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 grid md:grid-cols-3 gap-3">
                {myCommsChannels.map((c) => (
                  <Card key={c.channel} className="bg-slate-50">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-slate-900">{c.channel}</h4>
                      <div className="space-y-1 text-sm mt-2">
                        <div className="flex justify-between"><span className="text-slate-500">Enviadas</span><span className="font-mono font-bold">{c.sent.toLocaleString('pt-BR')}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Entregues</span><span className="font-mono font-bold text-emerald-600">{c.delivered.toLocaleString('pt-BR')}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Falhas</span><span className="font-mono font-bold text-red-600">{c.failed}</span></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}