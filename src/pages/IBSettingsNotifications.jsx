import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  ArrowLeft,
  Bell,
  Mail,
  Smartphone,
  Save,
  Edit3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function IBSettingsNotifications() {
  const [notifications, setNotifications] = useState({
    // Transactions
    pixReceived: { email: true, push: true },
    pixSent: { email: true, push: true },
    pixScheduled: { email: true, push: true },
    // Security
    newAccess: { email: true, push: true },
    passwordChange: { email: true, push: true },
    newDevice: { email: true, push: true },
    suspiciousAccess: { email: true, push: true },
    // Limits
    limitApproved: { email: true, push: false },
    limitReached: { email: true, push: true },
  });

  const [notificationEmail, setNotificationEmail] = useState('financeiro@lojaabc.com.br');
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const handleNotificationChange = (key, type) => {
    setNotifications(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: !prev[key][type]
      }
    }));
  };

  const NotificationRow = ({ id, label, emailKey, pushKey }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${id}-email`}
            checked={notifications[id].email}
            onCheckedChange={() => handleNotificationChange(id, 'email')}
          />
          <Label htmlFor={`${id}-email`} className="text-sm text-slate-500 cursor-pointer">
            <Mail className="w-4 h-4" />
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${id}-push`}
            checked={notifications[id].push}
            onCheckedChange={() => handleNotificationChange(id, 'push')}
          />
          <Label htmlFor={`${id}-push`} className="text-sm text-slate-500 cursor-pointer">
            <Bell className="w-4 h-4" />
          </Label>
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notificações</h1>
          <p className="text-slate-500 dark:text-slate-400">Configure seus alertas e avisos</p>
        </div>
      </div>

      {/* Legend */}
      <Card className="bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="p-4 flex items-center justify-end gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail className="w-4 h-4" />
            <span>E-mail</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Bell className="w-4 h-4" />
            <span>Push</span>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Transações
        </h2>
        <Card>
          <CardContent className="p-4 divide-y dark:divide-slate-700">
            <NotificationRow id="pixReceived" label="Pix recebido" />
            <NotificationRow id="pixSent" label="Pix enviado" />
            <NotificationRow id="pixScheduled" label="Pix agendado executado" />
          </CardContent>
        </Card>
      </div>

      {/* Security */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Segurança
        </h2>
        <Card>
          <CardContent className="p-4 divide-y dark:divide-slate-700">
            <NotificationRow id="newAccess" label="Novo acesso à conta" />
            <NotificationRow id="passwordChange" label="Alteração de senha" />
            <NotificationRow id="newDevice" label="Novo dispositivo" />
            <NotificationRow id="suspiciousAccess" label="Tentativa de acesso suspeita" />
          </CardContent>
        </Card>
      </div>

      {/* Limits and Account */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Limites e Conta
        </h2>
        <Card>
          <CardContent className="p-4 divide-y dark:divide-slate-700">
            <NotificationRow id="limitApproved" label="Alteração de limite aprovada" />
            <NotificationRow id="limitReached" label="Limite diário atingido" />
          </CardContent>
        </Card>
      </div>

      {/* Notification Email */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          E-mail para Notificações
        </h2>
        <Card>
          <CardContent className="p-4">
            {isEditingEmail ? (
              <div className="flex items-center gap-3">
                <Input
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => setIsEditingEmail(false)}>
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setIsEditingEmail(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-white">{notificationEmail}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingEmail(true)}>
                  <Edit3 className="w-4 h-4 mr-1" />
                  Alterar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <Button className="w-full bg-[#00D26A] hover:bg-[#00B85C]">
        <Save className="w-4 h-4 mr-2" />
        Salvar Preferências
      </Button>
    </div>
  );
}