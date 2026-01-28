import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  User,
  Shield,
  Bell,
  ChevronRight,
  Building2,
  CreditCard,
  Lock,
  Smartphone,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function IBSettings() {
  const settingsItems = [
    {
      id: 'account',
      title: 'Dados da Conta',
      description: 'Informações cadastrais e dados bancários',
      icon: User,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600',
      page: 'IBSettingsAccount'
    },
    {
      id: 'security',
      title: 'Segurança',
      description: 'Senha, autenticação e dispositivos',
      icon: Shield,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600',
      page: 'IBSettingsSecurity'
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Configurar alertas e avisos',
      icon: Bell,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600',
      page: 'IBSettingsNotifications'
    },
    {
      id: 'access',
      title: 'Perfis de Acesso',
      description: 'Gerenciar usuários e permissões',
      icon: Users,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600',
      page: 'IBSettingsAccess'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações</h1>
        <p className="text-slate-500 dark:text-slate-400">Gerencie sua conta e preferências</p>
      </div>

      {/* Settings Menu */}
      <Card>
        <CardContent className="p-0 divide-y dark:divide-slate-700">
          {settingsItems.map((item) => (
            <Link
              key={item.id}
              to={createPageUrl(item.page)}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}