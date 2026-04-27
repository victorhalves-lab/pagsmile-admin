// Documentação microscópica — Módulo INTERNET BANKING
// Conta digital usada pelo merchant para movimentar saldos via PIX, comprovantes
// e configurações pessoais da conta.

import { IBHomeDoc } from './docs/internetBanking/IBHome';
import { IBExtractDoc } from './docs/internetBanking/IBExtract';
import { IBPixSendDoc } from './docs/internetBanking/IBPixSend';

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
        { id: 'IBExtract', label: 'Extrato 511L 72% maior que IBHome (5 filtros wrap c/ Tipo+Direção REDUNDANTES + Período c/ "Personalizado" sem date picker + 3 Selects + Search + Export Dropdown PDF/Excel/OFX TODOS dead onClick / 4 KPIs Saldo Inicial-Final-Entradas-Saídas matematicamente CONSISTENTES / Lista AGRUPADA POR DATA via reduce c/ formatDateHeader Hoje/Ontem/pt-BR ÚNICA feature do IB / 5 mocks RICOS 14-fields cada vs IBHome 5-fields / Saldo running balanceAfter linha-a-linha / Pagination "1-5 de 156" e "Página 1 de 32" HARDCODED / Modal Dialog max-w-lg c/ 5 sub-blocos: Header circle 16w16 / Info ID-EndToEnd-Status SEMPRE "Concluída" / Pagador-OU-Destinatário condicional c/ 6 ternários repetidos / Memo condicional / 2 Buttons Baixar+Compartilhar SEM onClick / 6 useState mas 5 captured-but-ignored — filtros não filtram / ZERO i18n vs IBHome 22 keys gap arquitetural / Copy dead import EXATAMENTE feature que falta no Modal / Chave PIX presente no mock NÃO renderizada gap BACEN / Sem cross-page Links — ilha de navegação)', route: '/IBExtract', content: IBExtractDoc },
      ],
    },
    {
      id: 'pix',
      label: 'PIX',
      pages: [
        { id: 'IBPixSend', label: 'Enviar PIX 689L MAIS COMPLEXA do IB (35% > IBExtract / 132% > IBHome) — Wizard 5-steps render-by-step c/ early returns / 9 useState (1 dead saveAsFavorite) / Step 0 hub c/ 3 Send Methods auto-advance + Favoritos shortcut 4-set-states pula Step 1 + Recents Repeat BUG não popula state / Step 1 QR é DEAD END sem Continuar + sendMethod="copy" tratado como key sem variante própria + grid 5-cols 4-itens + CPF/CNPJ unificados + keyTypeIcons.cpf dead key + handleKeySearch fake length>5 + recipient SEMPRE "Fornecedor ABC" hardcoded / Step 2 Amount XL h-16 text-2xl + description maxLength=140 BACEN correto + Schedule radio sem date picker + saveAsFavorite morto / Step 3 summary "Data/Hora Agora" HARDCODED ignora schedule + password length>=4 trivial / Step 4 Success usa emerald-500-600 GENÉRICO ao invés de #00D26A oficial INCONSISTÊNCIA cromática + Comprovante 100% HARDCODED IDs/Pagador/Timestamp / 3 verdes na página #00D26A wizard / emerald-500-600 success / brand #2bc196 ecosystem / ZERO i18n / Label "Etapa X de 3" não bate c/ 5 steps reais / Step integer ao invés de enum / 0 useEffect / state PERDE ao sair / Sem progress bar visual)', route: '/IBPixSend', content: IBPixSendDoc },
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