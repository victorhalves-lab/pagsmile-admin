// Documentação do módulo ONBOARDING & CRIAÇÃO DE CONTA
// Funil público de aquisição de novos clientes (Landing → Step1 → Plano → Step3).

import { LandingPageDoc } from './docs/onboarding/LandingPage';
import { AccountCreationStep1Doc } from './docs/onboarding/AccountCreationStep1';
import { PlanSelectionDoc } from './docs/onboarding/PlanSelection';
import { AccountCreationStep3Doc } from './docs/onboarding/AccountCreationStep3';

export const onboardingModule = {
  id: 'onboarding',
  label: 'Onboarding & Criação de Conta',
  shortLabel: 'Criação de Conta',
  description:
    'Funil público de 4 telas para aquisição de novos clientes. Landing pública → Passo 1 (dados pessoais + OTP) → Passo 2 (escolha de plano) → Passo 3 (dados da empresa + criação real da Subaccount).',
  color: '#2bc196',
  iconName: 'UserPlus',
  sections: [
    {
      id: 'landing',
      label: 'Tela Inicial',
      pages: [
        {
          id: 'LandingPage',
          label: 'Landing Page',
          route: '/',
          content: LandingPageDoc,
        },
      ],
    },
    {
      id: 'wizard',
      label: 'Wizard de Criação',
      pages: [
        {
          id: 'AccountCreationStep1',
          label: 'Passo 1 — Dados do Representante',
          route: '/AccountCreationStep1',
          content: AccountCreationStep1Doc,
        },
        {
          id: 'PlanSelection',
          label: 'Passo 2 — Escolha de Plano',
          route: '/PlanSelection',
          content: PlanSelectionDoc,
        },
        {
          id: 'AccountCreationStep3',
          label: 'Passo 3 — Dados da Empresa',
          route: '/AccountCreationStep3',
          content: AccountCreationStep3Doc,
        },
      ],
    },
  ],
};