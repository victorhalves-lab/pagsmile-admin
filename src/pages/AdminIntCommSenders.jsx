import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Star, Copy, RefreshCw, CheckCircle2, AlertTriangle, Settings, Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const senders = [
  { email: 'noreply@pagsmile.com', name: 'PagSmile', usage: 'Automações de sistema', isDefault: true, verified: true, spf: true, dkim: true, dmarc: true },
  { email: 'suporte@pagsmile.com', name: 'Suporte PagSmile', usage: 'Comunicações de suporte', isDefault: false, verified: true, spf: true, dkim: true, dmarc: true },
  { email: 'financeiro@pagsmile.com', name: 'Financeiro PagSmile', usage: 'Comunicações financeiras', isDefault: false, verified: true, spf: true, dkim: true, dmarc: true },
  { email: 'marketing@pagsmile.com', name: 'Marketing PagSmile', usage: 'Campanhas e newsletters', isDefault: false, verified: false, spf: false, dkim: true, dmarc: true },
];

const domains = [
  { domain: 'pagsmile.com', spf: true, dkim: true, dmarc: true, status: 'active' },
  { domain: 'pagsmile.io', spf: true, dkim: true, dmarc: false, status: 'partial' },
];

const dnsRecords = {
  spf: 'v=spf1 include:amazonses.com include:sendgrid.net ~all',
  dkim: 'selector1._domainkey.pagsmile.com → dkim.amazonses.com',
  dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@pagsmile.com',
};

export default function AdminIntCommSenders() {
  const [newSenderModal, setNewSenderModal] = useState(false);
  const [newDomainModal, setNewDomainModal] = useState(false);

  const StatusIcon = ({ ok }) => ok 
    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 
    : <AlertTriangle className="w-4 h-4 text-amber-500" />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Remetentes e Domínios"
        subtitle="Gerencie os endereços de e-mail e domínios verificados"
        icon={Mail}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Comunicação', page: 'AdminIntCommDashboard' },
          { label: 'Remetentes' }
        ]}
        actions={
          <Button onClick={() => setNewSenderModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Novo Remetente
          </Button>
        }
      />

      {/* Senders */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#2bc196]" />
            Remetentes Configurados
          </CardTitle>
          <CardDescription>{senders.length} remetentes cadastrados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {senders.map((sender, idx) => (
            <div 
              key={idx} 
              className={cn(
                "border rounded-xl p-4 transition-all",
                !sender.verified 
                  ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    sender.verified ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                  )}>
                    <Mail className={cn(
                      "w-5 h-5",
                      sender.verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    )} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{sender.email}</span>
                      {sender.isDefault && (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-[10px]">
                          <Star className="w-3 h-3 mr-0.5" /> PADRÃO
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{sender.name} • {sender.usage}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  {sender.verified ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  <span className={sender.verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                    {sender.verified ? 'Verificado' : 'Não verificado'}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  SPF <StatusIcon ok={sender.spf} />
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  DKIM <StatusIcon ok={sender.dkim} />
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  DMARC <StatusIcon ok={sender.dmarc} />
                </span>
              </div>
              
              {!sender.verified && (
                <Button variant="outline" size="sm" className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30">
                  <Settings className="w-3.5 h-3.5 mr-1.5" /> Corrigir configuração
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Domains */}
      <Card>
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2bc196]" />
              Domínios Verificados
            </CardTitle>
            <CardDescription>Domínios configurados para envio</CardDescription>
          </div>
          <Button size="sm" onClick={() => setNewDomainModal(true)}>
            <Plus className="w-4 h-4 mr-1" /> Novo Domínio
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Domínio</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SPF</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">DKIM</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">DMARC</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {domains.map((domain, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{domain.domain}</td>
                    <td className="py-3.5 px-4 text-center"><StatusIcon ok={domain.spf} /></td>
                    <td className="py-3.5 px-4 text-center"><StatusIcon ok={domain.dkim} /></td>
                    <td className="py-3.5 px-4 text-center"><StatusIcon ok={domain.dmarc} /></td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge 
                        variant="outline"
                        className={cn(
                          "border-0",
                          domain.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        )}
                      >
                        {domain.status === 'active' ? 'Ativo' : 'Parcial'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* DNS Records */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#2bc196]" />
            Registros DNS Necessários
          </CardTitle>
          <CardDescription>Configure estes registros no seu provedor de DNS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'SPF (TXT em @)', value: dnsRecords.spf },
            { label: 'DKIM (CNAME)', value: dnsRecords.dkim },
            { label: 'DMARC (TXT em _dmarc)', value: dnsRecords.dmarc },
          ].map((record, idx) => (
            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">{record.label}</Label>
              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value={record.value} 
                  className="font-mono text-xs bg-white dark:bg-slate-900" 
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  className="shrink-0"
                  onClick={() => { navigator.clipboard.writeText(record.value); toast.success('Copiado!'); }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* New Sender Modal */}
      <Dialog open={newSenderModal} onOpenChange={setNewSenderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#2bc196]" />
              Novo Remetente
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>E-mail *</Label>
              <Input className="mt-1.5" placeholder="noreply@seudominio.com" />
            </div>
            <div>
              <Label>Nome de exibição *</Label>
              <Input className="mt-1.5" placeholder="Nome da Empresa" />
            </div>
            <div>
              <Label>Uso/Descrição</Label>
              <Input className="mt-1.5" placeholder="Ex: Automações de sistema" />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setNewSenderModal(false)}>Cancelar</Button>
            <Button onClick={() => { toast.success('Remetente adicionado!'); setNewSenderModal(false); }}>
              Adicionar Remetente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Domain Modal */}
      <Dialog open={newDomainModal} onOpenChange={setNewDomainModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#2bc196]" />
              Novo Domínio
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Domínio *</Label>
              <Input className="mt-1.5" placeholder="seudominio.com" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              Após adicionar, você receberá os registros DNS que precisam ser configurados no seu provedor.
            </p>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setNewDomainModal(false)}>Cancelar</Button>
            <Button onClick={() => { toast.success('Domínio adicionado!'); setNewDomainModal(false); }}>
              Adicionar Domínio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}