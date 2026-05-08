import React, { useState } from 'react';
import { Users, ShieldCheck, ShieldAlert, UserPlus, Mail, Check, X, Minus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import { teamMembers, rolesMatrix } from '@/components/mockData/futureAdminMocks';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const ROLE_COLORS = {
  admin: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  finance: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  risk_analyst: 'bg-red-500/10 text-red-600 border-red-500/30',
  operations: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  viewer: 'bg-slate-500/10 text-slate-600 border-slate-500/30',
};

const renderPerm = (val) => {
  if (val === true) return <Check className="w-4 h-4 text-emerald-600 mx-auto" />;
  if (val === false) return <Minus className="w-4 h-4 text-slate-300 mx-auto" />;
  if (val === 'read') return <Eye className="w-3.5 h-3.5 text-blue-600 mx-auto" title="Apenas leitura" />;
  return <Badge variant="outline" className="text-[9px] mx-auto">{val}</Badge>;
};

export default function TeamSettings() {
  const { toast } = useToast();
  const [members, setMembers] = useState(teamMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('operations');

  const handleInvite = () => {
    if (!inviteEmail) return;
    setInviteOpen(false);
    toast({ title: 'Convite enviado', description: `${inviteEmail} foi convidado como ${inviteRole}.` });
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Time & Permissões" subtitle="Gerencie quem acessa o quê na sua conta" icon={Users}
        actions={<Button onClick={() => setInviteOpen(true)} className="bg-[#2bc196] hover:bg-[#25a880] gap-2"><UserPlus className="w-4 h-4" /> Convidar</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs text-slate-500">Membros ativos</p>
          <p className="text-2xl font-bold mt-1">{members.filter((m) => m.status === 'active').length}</p>
          <p className="text-[11px] text-slate-500 mt-1">de {members.length} total</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs text-slate-500">Com MFA</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{members.filter((m) => m.mfa).length}</p>
          <p className="text-[11px] text-amber-600 mt-1">{members.filter((m) => !m.mfa).length} sem MFA</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs text-slate-500">Convites pendentes</p>
          <p className="text-2xl font-bold mt-1">{members.filter((m) => m.status === 'pending').length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs text-slate-500">Perfis disponíveis</p>
          <p className="text-2xl font-bold mt-1">5</p>
          <p className="text-[11px] text-slate-500 mt-1">+ custom</p>
        </div>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="roles">Matriz de permissões</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-4">
                <Avatar><AvatarFallback className="bg-[#2bc196]/10 text-[#2bc196]">{m.initials}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{m.name}</span>
                    {m.status === 'pending' && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">Convite pendente</Badge>}
                  </div>
                  <p className="text-xs text-slate-500">{m.email}</p>
                </div>
                <Badge variant="outline" className={cn('text-[11px]', ROLE_COLORS[m.role])}>{m.roleLabel}</Badge>
                {m.mfa ? (
                  <Badge variant="outline" className="text-[10px] gap-1 text-emerald-600 border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> MFA
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] gap-1 text-amber-600 border-amber-500/30">
                    <ShieldAlert className="w-3 h-3" /> Sem MFA
                  </Badge>
                )}
                <span className="text-xs text-slate-400 w-32 text-right">
                  {m.lastLogin ? `${formatDistanceToNow(m.lastLogin, { locale: ptBR })} atrás` : '— nunca'}
                </span>
                <Button variant="ghost" size="sm">Editar</Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Módulo</th>
                  <th className="px-3 py-3 text-center font-medium text-slate-500">Admin</th>
                  <th className="px-3 py-3 text-center font-medium text-slate-500">Financeiro</th>
                  <th className="px-3 py-3 text-center font-medium text-slate-500">Risco</th>
                  <th className="px-3 py-3 text-center font-medium text-slate-500">Operações</th>
                  <th className="px-3 py-3 text-center font-medium text-slate-500">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {rolesMatrix.map((row) => (
                  <tr key={row.module}>
                    <td className="px-4 py-3 font-medium">{row.module}</td>
                    <td className="px-3 py-3 text-center">{renderPerm(row.admin)}</td>
                    <td className="px-3 py-3 text-center">{renderPerm(row.finance)}</td>
                    <td className="px-3 py-3 text-center">{renderPerm(row.risk_analyst)}</td>
                    <td className="px-3 py-3 text-center">{renderPerm(row.operations)}</td>
                    <td className="px-3 py-3 text-center">{renderPerm(row.viewer)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><Check className="w-3 h-3 text-emerald-600" /> Acesso total</span>
            <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3 text-blue-600" /> Apenas leitura</span>
            <span className="inline-flex items-center gap-1"><Minus className="w-3 h-3 text-slate-300" /> Sem acesso</span>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-3">
          {[
            { title: 'MFA obrigatório para admins', enabled: true },
            { title: 'Aprovação 2-pessoas para saques > R$ 10.000', enabled: true },
            { title: 'IP whitelist para acesso ao painel', enabled: false },
            { title: 'Sessão expira após 4h inativo', enabled: true },
            { title: 'Notificar logins de novo dispositivo', enabled: true },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <ShieldCheck className={cn('w-5 h-5', s.enabled ? 'text-emerald-600' : 'text-slate-400')} />
                <span className="text-sm font-medium">{s.title}</span>
              </div>
              {s.enabled ? <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Ativo</Badge> : <Badge variant="outline">Desativado</Badge>}
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar membro</DialogTitle>
            <DialogDescription>Eles receberão um e-mail para acessar a conta.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-2">
            <div>
              <label className="text-xs font-medium mb-1 block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="email" placeholder="pessoa@empresa.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Perfil</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (acesso total)</SelectItem>
                  <SelectItem value="finance">Financeiro</SelectItem>
                  <SelectItem value="risk_analyst">Analista de Risco</SelectItem>
                  <SelectItem value="operations">Operações</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}><X className="w-4 h-4 mr-1" /> Cancelar</Button>
            <Button onClick={handleInvite} className="bg-[#2bc196] hover:bg-[#25a880]"><UserPlus className="w-4 h-4 mr-1" /> Enviar convite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}