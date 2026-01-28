import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  ArrowLeft,
  Shield,
  Key,
  Smartphone,
  Monitor,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function IBSettingsSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const devices = [
    {
      id: 1,
      name: 'Chrome - Windows',
      icon: Monitor,
      ip: '189.123.45.67',
      lastAccess: 'Agora',
      isCurrent: true
    },
    {
      id: 2,
      name: 'Safari - iPhone',
      icon: Smartphone,
      ip: '189.123.45.68',
      lastAccess: 'Ontem às 18:30',
      isCurrent: false
    },
  ];

  const accessHistory = [
    { date: '27/01 15:30', action: 'Login', device: 'Chrome/Windows', ip: '189.123.45.67', status: 'success' },
    { date: '27/01 08:15', action: 'Login', device: 'Safari/iPhone', ip: '189.123.45.68', status: 'success' },
    { date: '26/01 22:00', action: 'Login', device: 'Chrome/Windows', ip: '189.123.45.67', status: 'success' },
    { date: '26/01 18:45', action: 'Tentativa', device: 'Firefox/Linux', ip: '201.45.67.89', status: 'failed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={createPageUrl('IBSettings')}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Segurança</h1>
          <p className="text-slate-500 dark:text-slate-400">Gerencie a segurança da sua conta</p>
        </div>
      </div>

      {/* Password */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Senha
        </h2>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Key className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Senha de acesso</p>
                <p className="text-sm text-slate-500">Última alteração: 15/01/2026</p>
              </div>
            </div>
            <Button variant="outline">
              <Key className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 2FA */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Autenticação em Dois Fatores (2FA)
        </h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 dark:text-white">Autenticação 2FA</p>
                    {twoFactorEnabled ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Ativado
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 border-0">Desativado</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    Método: Aplicativo autenticador (Google Authenticator)
                  </p>
                </div>
              </div>
              <Button variant="outline">
                Gerenciar 2FA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Authorized Devices */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Dispositivos Autorizados
        </h2>
        <Card>
          <CardContent className="p-0 divide-y dark:divide-slate-700">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <device.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-white">{device.name}</p>
                      {device.isCurrent && (
                        <Badge variant="outline" className="text-xs">Este dispositivo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      IP: {device.ip} • Último acesso: {device.lastAccess}
                    </p>
                  </div>
                </div>
                {!device.isCurrent && (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        <Button variant="outline" className="mt-4 text-red-600 hover:text-red-700 hover:bg-red-50">
          <XCircle className="w-4 h-4 mr-2" />
          Encerrar todas as outras sessões
        </Button>
      </div>

      {/* Access History */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Histórico de Acessos
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y dark:divide-slate-700">
              {accessHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-500 w-24">{item.date}</div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.action}</p>
                      <p className="text-sm text-slate-500">{item.device} • {item.ip}</p>
                    </div>
                  </div>
                  {item.status === 'success' ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Sucesso
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-0">
                      <XCircle className="w-3 h-3 mr-1" />
                      Falhou
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Button variant="ghost" className="mt-2 text-[#00D26A]">
          Ver histórico completo
        </Button>
      </div>
    </div>
  );
}