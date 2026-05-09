import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Edit, KeyRound, ShieldOff, Lock, RotateCcw, Power } from 'lucide-react';
import { USER_STATUS, USER_ROLES } from '@/components/mentor/mocks/usersMock';

export default function UsersTable({ users = [], selected = [], onToggleSelect, onToggleAll, onView, onEdit, onResetPwd, onResetMfa, onSuspend, onUnlock }) {
  const allSelected = users.length > 0 && selected.length === users.length;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="p-2 w-8">
                  <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
                </th>
                <th className="text-left p-2 font-semibold">Usuário</th>
                <th className="text-center p-2 font-semibold">Status</th>
                <th className="text-center p-2 font-semibold">Perfil</th>
                <th className="text-left p-2 font-semibold">Departamento</th>
                <th className="text-center p-2 font-semibold">MFA</th>
                <th className="text-center p-2 font-semibold">Último login</th>
                <th className="text-center p-2 font-semibold">Projetos</th>
                <th className="text-center p-2 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const status = USER_STATUS[u.status];
                const role = USER_ROLES[u.role];
                const initials = u.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
                const isSelected = selected.includes(u.id);
                const lastLogin = u.last_login ? new Date(u.last_login) : null;
                const daysAgo = lastLogin ? Math.floor((Date.now() - lastLogin.getTime()) / 86400000) : null;
                return (
                  <tr key={u.id} className={`border-b hover:bg-slate-50 dark:hover:bg-slate-900 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <td className="p-2 text-center">
                      <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect?.(u.id)} />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-violet-100 text-violet-700">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm">{u.name}</p>
                          <p className="text-[10px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${status?.color}`}>{status?.label}</Badge>
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${role?.color}`}>{role?.label}</Badge>
                    </td>
                    <td className="p-2 text-[11px]">{u.department}<br /><span className="text-slate-500 text-[10px]">{u.title}</span></td>
                    <td className="text-center p-2">
                      {u.mfa_enabled ? (
                        <Badge className="text-[9px] bg-emerald-100 text-emerald-700">✓ {u.mfa_method?.toUpperCase()}</Badge>
                      ) : (
                        u.role === 'api_consumer' ? <span className="text-[10px] text-slate-400">N/A</span> : <Badge className="text-[9px] bg-amber-100 text-amber-700">Sem MFA</Badge>
                      )}
                    </td>
                    <td className="text-center p-2">
                      {lastLogin ? (
                        <div>
                          <p className="text-[10px]">{lastLogin.toLocaleDateString('pt-BR')}</p>
                          <p className="text-[9px] text-slate-500">{daysAgo === 0 ? 'hoje' : `há ${daysAgo}d`}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">nunca</span>
                      )}
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="text-[9px]">{u.projects_access?.length || 0}</Badge>
                    </td>
                    <td className="text-center p-2">
                      <div className="flex justify-center gap-0.5">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onView?.(u)} title="Ver detalhes">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit?.(u)} title="Editar">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onResetPwd?.(u)} title="Reset senha">
                          <KeyRound className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onResetMfa?.(u)} title="Reset MFA">
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                        {u.status === 'locked' ? (
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-600" onClick={() => onUnlock?.(u)} title="Desbloquear">
                            <Power className="w-3 h-3" />
                          </Button>
                        ) : u.status === 'active' ? (
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600" onClick={() => onSuspend?.(u)} title="Suspender">
                            <ShieldOff className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button size="icon" variant="ghost" className="h-7 w-7" disabled>
                            <Lock className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}