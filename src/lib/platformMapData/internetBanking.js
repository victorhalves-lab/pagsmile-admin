// Documentação microscópica — Módulo INTERNET BANKING
// Conta digital usada pelo merchant para movimentar saldos via PIX, comprovantes
// e configurações pessoais da conta.

import { IBHomeDoc } from './docs/internetBanking/IBHome';

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
        { id: 'IBHome', label: 'Home 297L (Hero card saldo navy gradient #002443→#003459→#004D73 c/ 2 blur pseudo-elements ÚNICOS / showBalance toggle Eye/EyeOff aplica máscara "••••••" em 12 ocorrências / 3 Quick Actions Send-Receive-Keys + 4ª "Cards" DEAD CODE cortada por slice(0,3) c/ self-link IBHome / Resumo Mês 2 Cards Entradas-Saídas espelho c/ TrendingUp icon em ambos BUG semântico saídas / ProgressBar Entradas 100% e Saídas 74% HARDCODED / 5 mocks transações c/ label fixo "PIX Recebido/Enviado" ignora description / Saudação "Bom dia" hardcode sem lógica horária / Badge "Janeiro 2026" hardcode / 1 useState minimal / 22 i18n keys + datas em PT hardcoded / 4/11 páginas IB linkadas / Zero SDK Subaccount apesar de balance_available/blocked/pending_release/revenue prontos no schema)', route: '/IBHome', content: IBHomeDoc },
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