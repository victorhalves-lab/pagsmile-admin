// Documentação microscópica — Módulo INTERNET BANKING
// Conta digital usada pelo merchant para movimentar saldos via PIX, comprovantes
// e configurações pessoais da conta.

export const internetBankingModule = {
  id: 'internet-banking',
  label: 'Internet Banking',
  shortLabel: 'Conta Digital',
  description: 'Módulo de conta digital integrado à plataforma. Permite ao merchant movimentar saldo via PIX (envio, recebimento, gestão de chaves e limites), gerar comprovantes e configurar segurança, notificações e acessos.',
  color: '#10b981',
  iconName: 'Landmark',
  sections: [
    {
      id: 'home',
      label: 'Home',
      pages: [
        { id: 'IBHome', label: 'Home', route: '/IBHome', content: null },
      ],
    },
    {
      id: 'extrato',
      label: 'Extrato',
      pages: [
        { id: 'IBExtract', label: 'Extrato', route: '/IBExtract', content: null },
      ],
    },
    {
      id: 'pix',
      label: 'PIX',
      pages: [
        { id: 'IBPixSend', label: 'Enviar PIX', route: '/IBPixSend', content: null },
        { id: 'IBPixReceive', label: 'Receber PIX', route: '/IBPixReceive', content: null },
        { id: 'IBPixKeys', label: 'Minhas Chaves PIX', route: '/IBPixKeys', content: null },
        { id: 'IBPixLimits', label: 'Limites PIX', route: '/IBPixLimits', content: null },
      ],
    },
    {
      id: 'comprovantes',
      label: 'Comprovantes',
      pages: [
        { id: 'IBProofs', label: 'Comprovantes', route: '/IBProofs', content: null },
      ],
    },
    {
      id: 'settings',
      label: 'Configurações',
      pages: [
        { id: 'IBSettings', label: 'Configurações Gerais', route: '/IBSettings', content: null },
        { id: 'IBSettingsAccount', label: 'Conta', route: '/IBSettingsAccount', content: null },
        { id: 'IBSettingsSecurity', label: 'Segurança', route: '/IBSettingsSecurity', content: null },
        { id: 'IBSettingsNotifications', label: 'Notificações', route: '/IBSettingsNotifications', content: null },
        { id: 'IBSettingsAccess', label: 'Acessos', route: '/IBSettingsAccess', content: null },
      ],
    },
  ],
};