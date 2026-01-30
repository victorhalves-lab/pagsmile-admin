import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Search, Eye, RefreshCw, Mail, CheckCircle2, XCircle, Clock, MousePointer, AlertTriangle, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const emailLogs = [
  { id: 'EMAIL-001', date: '28/01 14:35:22', recipient: 'joao@empresa.com', merchant: 'Loja do João', subject: '🎉 Bem-vindo ao PagSmile!', type: 'Boas-vindas', status: 'opened', openedAt: '14:40' },
  { id: 'EMAIL-002', date: '28/01 14:30:15', recipient: 'maria@techstore.com', merchant: 'Tech Store', subject: '✅ KYC Aprovado', type: 'KYC Aprov.', status: 'opened', openedAt: '14:45' },
  { id: 'EMAIL-003', date: '28/01 14:25:00', recipient: 'carlos@modafash.com', merchant: 'Moda Fashion', subject: '💰 Saque processado com sucesso', type: 'Saque Proc.', status: 'delivered', openedAt: null },
  { id: 'EMAIL-004', date: '28/01 14:20:30', recipient: 'ana@invalido.xyz', merchant: 'Loja Ana', subject: '🎉 Bem-vindo ao PagSmile!', type: 'Boas-vindas', status: 'bounced', openedAt: null, error: 'Invalid email address' },
  { id: 'EMAIL-005', date: '28/01 14:15:00', recipient: 'pedro@empresa.com', merchant: 'Empresa XYZ', subject: '⏰ Lembrete: Complete seu cadastro', type: 'Lembrete', status: 'clicked', openedAt: '14:18', clickedAt: '14:20' },
  { id: 'EMAIL-006', date: '28/01 14:10:00', recipient: 'lucas@test.com', merchant: 'Test Co', subject: '📄 Documentos pendentes', type: 'Documentos', status: 'sent', openedAt: null },
];

const statusConfig = {
  sent: { label: 'Enviado', icon: Clock, color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  delivered: { label: 'Entregue', icon: CheckCircle2, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  opened: { label: 'Aberto', icon: Eye, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  clicked: { label: 'Clicado', icon: MousePointer, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  bounced: { label: 'Bounce', icon: XCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  spam: { label: 'Spam', icon: AlertTriangle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function AdminIntCommLogs() {
  const [period, setPeriod] = useState('7d');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchRecipient, setSearchRecipient] = useState('');
  const [searchMerchant, setSearchMerchant] = useState('');
  const [detailModal, setDetailModal] = useState(null);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Histórico de E-mails"
        subtitle="Logs detalhados de todos os e-mails enviados"
        icon={History}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Comunicação', page: 'AdminIntCommDashboard' },
          { label: 'Logs' }
        ]}
        actions={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Período</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="transactional">Transacional</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="risk">Risco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="delivered">Entregues</SelectItem>
                  <SelectItem value="opened">Abertos</SelectItem>
                  <SelectItem value="clicked">Clicados</SelectItem>
                  <SelectItem value="bounced">Bounces</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Destinatário</Label>
              <Input placeholder="email@..." value={searchRecipient} onChange={(e) => setSearchRecipient(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Merchant</Label>
              <Input placeholder="Nome..." value={searchMerchant} onChange={(e) => setSearchMerchant(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button>
              <Search className="w-4 h-4 mr-2" /> Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email List */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#2bc196]" />
            E-mails Enviados
          </CardTitle>
          <CardDescription>Mostrando 1-50 de 12.456 resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emailLogs.map(email => {
              const status = statusConfig[email.status];
              const StatusIcon = status.icon;
              return (
                <div 
                  key={email.id} 
                  className="group border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-[#2bc196]/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{email.date}</span>
                        <span className="font-semibold text-slate-900 dark:text-white truncate">{email.recipient}</span>
                        <Badge variant="outline" className="text-[10px] shrink-0">{email.type}</Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 truncate mb-1">{email.subject}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Merchant: {email.merchant}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <Badge className={cn(status.color, "border-0 mb-1")}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        {email.openedAt && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            <Eye className="w-3 h-3 inline mr-1" />{email.openedAt}
                          </p>
                        )}
                        {email.clickedAt && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            <MousePointer className="w-3 h-3 inline mr-1" />{email.clickedAt}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailModal(email)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {email.status !== 'bounced' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success('E-mail reenviado!')}>
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Mostrando 1-50 de 12.456</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
              <Button variant="outline" size="sm">
                Página 1 de 250
              </Button>
              <Button variant="outline" size="sm">
                Próxima <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#2bc196]" />
              Detalhes do E-mail
            </DialogTitle>
          </DialogHeader>
          {detailModal && (
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Label className="text-xs text-slate-500 dark:text-slate-400">ID</Label>
                    <p className="font-mono text-sm mt-1">{detailModal.id}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Label className="text-xs text-slate-500 dark:text-slate-400">Data/Hora</Label>
                    <p className="text-sm mt-1">28/01/2026 {detailModal.date.split(' ')[1]}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Label className="text-xs text-slate-500 dark:text-slate-400">Tipo</Label>
                    <p className="text-sm mt-1">{detailModal.type}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Label className="text-xs text-slate-500 dark:text-slate-400">Template</Label>
                    <p className="text-sm mt-1">TPL-001</p>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <Label className="text-xs text-slate-500 dark:text-slate-400">Remetente</Label>
                      <p className="text-sm mt-1">noreply@pagsmile.com</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <Label className="text-xs text-slate-500 dark:text-slate-400">Destinatário</Label>
                      <p className="text-sm mt-1">{detailModal.recipient}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <Label className="text-xs text-slate-500 dark:text-slate-400">Assunto</Label>
                  <p className="text-sm mt-1">{detailModal.subject}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex-1">
                    <Label className="text-xs text-slate-500 dark:text-slate-400">Status atual</Label>
                    <div className="mt-1">
                      <Badge className={cn(statusConfig[detailModal.status].color, "border-0")}>
                        {statusConfig[detailModal.status].label}
                      </Badge>
                    </div>
                  </div>
                  {detailModal.openedAt && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex-1">
                      <Label className="text-xs text-slate-500 dark:text-slate-400">Aberto em</Label>
                      <p className="text-sm mt-1">28/01/2026 {detailModal.openedAt}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-4">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-8 bg-slate-50 dark:bg-slate-800/50 min-h-[200px] flex items-center justify-center">
                  <p className="text-slate-500 dark:text-slate-400">Preview do conteúdo do e-mail</p>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  {[
                    { time: '14:35:22', event: 'Enviado para fila', color: 'bg-blue-500' },
                    { time: '14:35:23', event: 'Processado pelo provedor (Amazon SES)', color: 'bg-blue-500' },
                    { time: '14:35:24', event: 'Entregue ao servidor de destino', color: 'bg-emerald-500' },
                    ...(detailModal.openedAt ? [{ time: detailModal.openedAt, event: 'Primeira abertura', color: 'bg-emerald-500' }] : []),
                    ...(detailModal.clickedAt ? [{ time: detailModal.clickedAt, event: 'Clique em link', color: 'bg-violet-500' }] : []),
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", item.color)} />
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono w-16">{item.time}</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item.event}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setDetailModal(null)}>Fechar</Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" /> Ver conteúdo
            </Button>
            <Button onClick={() => { toast.success('E-mail reenviado!'); setDetailModal(null); }}>
              <RefreshCw className="w-4 h-4 mr-2" /> Reenviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}