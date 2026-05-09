import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';

const SESSIONS = [
  { id: 1, device: 'Chrome / macOS Sonoma', ip: '187.45.123.10', city: 'São Paulo, BR', current: true, lastActive: 'Agora', icon: Monitor },
  { id: 2, device: 'Safari / iOS 17', ip: '177.93.42.5', city: 'São Paulo, BR', current: false, lastActive: '2h atrás', icon: Smartphone },
  { id: 3, device: 'Chrome / Android', ip: '189.10.55.42', city: 'Campinas, BR', current: false, lastActive: '1 dia atrás', icon: Smartphone },
  { id: 4, device: 'Firefox / Ubuntu', ip: '201.50.100.20', city: 'Rio de Janeiro, BR', current: false, lastActive: '3 dias atrás', icon: Monitor },
];

export default function SessionsManagementPanel() {
  const [sessions, setSessions] = useState(SESSIONS);

  const forceLogout = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
    toast.success('Sessão encerrada remotamente');
  };

  const logoutAll = () => {
    setSessions(sessions.filter((s) => s.current));
    toast.success('Todas as outras sessões foram encerradas');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600" />
            Sessões Ativas
            <Badge className="bg-blue-100 text-blue-700 border-0 text-[9px]">{sessions.length} dispositivos</Badge>
          </CardTitle>
          {sessions.filter((s) => !s.current).length > 0 && (
            <Button size="sm" variant="outline" className="text-red-600 border-red-200 h-7 text-xs" onClick={logoutAll}>
              <LogOut className="w-3.5 h-3.5 mr-1" /> Encerrar todas as outras
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {sessions.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className={`flex items-center justify-between p-3 rounded-lg border ${s.current ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.current ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                  <Icon className={`w-4 h-4 ${s.current ? 'text-emerald-600' : 'text-slate-600'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{s.device}</p>
                    {s.current && <Badge className="bg-emerald-600 text-white text-[9px] border-0">Esta sessão</Badge>}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {s.ip} · {s.city} · Ativo {s.lastActive}
                  </p>
                </div>
              </div>
              {!s.current && (
                <Button size="sm" variant="ghost" className="text-red-600 h-7 text-xs" onClick={() => forceLogout(s.id)}>
                  <LogOut className="w-3.5 h-3.5 mr-1" /> Encerrar
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}