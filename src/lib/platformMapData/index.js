// Estrutura raiz da documentação do Mapa da Plataforma.
// Cada módulo importa de um arquivo separado para manter os arquivos pequenos
// e evitar arquivos gigantes. Ao adicionar uma nova entrega, basta editar
// o arquivo do módulo correspondente.

import { onboardingModule } from './onboarding';
import { adminSubModule } from './adminSub';
import { adminInternoModule } from './adminInterno';
import { internetBankingModule } from './internetBanking';

export const platformMapModules = [onboardingModule, adminSubModule, adminInternoModule, internetBankingModule];

// Helper: percorre todas as páginas de todos os módulos para busca global
export function getAllPages() {
  const pages = [];
  platformMapModules.forEach((mod) => {
    mod.sections.forEach((section) => {
      section.pages.forEach((page) => {
        pages.push({
          moduleId: mod.id,
          moduleLabel: mod.label,
          sectionId: section.id,
          sectionLabel: section.label,
          ...page,
        });
      });
    });
  });
  return pages;
}