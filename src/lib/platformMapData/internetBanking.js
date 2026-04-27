// Documentação — Módulo INTERNET BANKING
// Conta digital usada pelo merchant para movimentar saldos via PIX, comprovantes
// e configurações pessoais da conta.

import { IBHomeDoc } from './docs/internetBanking/IBHome';
import { IBExtractDoc } from './docs/internetBanking/IBExtract';
import { IBPixSendDoc } from './docs/internetBanking/IBPixSend';
import { IBPixReceiveDoc } from './docs/internetBanking/IBPixReceive';
import { IBPixKeysDoc } from './docs/internetBanking/IBPixKeys';
import { IBPixLimitsDoc } from './docs/internetBanking/IBPixLimits';
import { IBProofsDoc } from './docs/internetBanking/IBProofs';
import { IBSettingsDoc } from './docs/internetBanking/IBSettings';
import { IBSettingsAccountDoc } from './docs/internetBanking/IBSettingsAccount';
import { IBSettingsSecurityDoc } from './docs/internetBanking/IBSettingsSecurity';
import { IBSettingsNotificationsDoc } from './docs/internetBanking/IBSettingsNotifications';

export const internetBankingModule = {
  id: 'internet-banking',
  label: 'Internet Banking',
  shortLabel: 'Conta Digital',
  description:
    'Módulo de conta digital integrado à plataforma. Permite ao merchant movimentar saldo via PIX (envio, recebimento, gestão de chaves e limites), gerar comprovantes e configurar segurança, notificações e acessos.',
  color: '#10b981',
  iconName: 'Landmark',
  sections: [
    {
      id: 'home',
      label: 'Home',
      pages: [
        { id: 'IBHome', label: 'Home', route: '/IBHome', content: IBHomeDoc },
      ],
    },
    {
      id: 'extrato',
      label: 'Extrato',
      pages: [
        { id: 'IBExtract', label: 'Extrato', route: '/IBExtract', content: IBExtractDoc },
      ],
    },
    {
      id: 'pix',
      label: 'PIX',
      pages: [
        { id: 'IBPixSend', label: 'Enviar PIX', route: '/IBPixSend', content: IBPixSendDoc },
        { id: 'IBPixReceive', label: 'Receber PIX', route: '/IBPixReceive', content: IBPixReceiveDoc },
        { id: 'IBPixKeys', label: 'Minhas Chaves PIX', route: '/IBPixKeys', content: IBPixKeysDoc },
        { id: 'IBPixLimits', label: 'Limites PIX', route: '/IBPixLimits', content: IBPixLimitsDoc },
      ],
    },
    {
      id: 'comprovantes',
      label: 'Comprovantes',
      pages: [
        { id: 'IBProofs', label: 'Comprovantes', route: '/IBProofs', content: IBProofsDoc },
      ],
    },
    {
      id: 'settings',
      label: 'Configurações',
      pages: [
        { id: 'IBSettings', label: 'Configurações (Hub)', route: '/IBSettings', content: IBSettingsDoc },
        { id: 'IBSettingsAccount', label: 'Dados da Conta', route: '/IBSettingsAccount', content: IBSettingsAccountDoc },
        { id: 'IBSettingsSecurity', label: 'Segurança', route: '/IBSettingsSecurity', content: IBSettingsSecurityDoc },
        { id: 'IBSettingsNotifications', label: 'Notificações', route: '/IBSettingsNotifications', content: IBSettingsNotificationsDoc },
        { id: 'IBSettingsAccess', label: 'Perfis de Acesso', route: '/IBSettingsAccess', content: null },
      ],
    },
  ],
};