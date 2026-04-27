import React, { useState } from 'react';
import { FileJson, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { platformMapModules } from '@/lib/platformMapData';

// =============================================================================
// JSON Export — Formato legível por IA (Claude, GPT, etc)
// -----------------------------------------------------------------------------
// Gera um arquivo JSON estruturado contendo TODA a documentação do Mapa da
// Plataforma + um README explicando o schema. Qualquer LLM consegue ler
// este arquivo e usar como contexto para gerar interfaces, código ou
// documentação derivada.
// =============================================================================

export default function PlatformMapJsonExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const payload = buildPayload();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mapa-plataforma-pagsmile-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao gerar JSON:', err);
      alert('Erro ao gerar JSON: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Gerando JSON...
        </>
      ) : (
        <>
          <FileJson className="w-4 h-4" />
          Exportar JSON (IA)
        </>
      )}
    </Button>
  );
}

function buildPayload() {
  let totalPages = 0;
  let documentedPages = 0;

  const modules = platformMapModules.map((mod) => ({
    id: mod.id,
    label: mod.label,
    shortLabel: mod.shortLabel,
    description: mod.description,
    color: mod.color,
    iconName: mod.iconName,
    sections: mod.sections.map((section) => ({
      id: section.id,
      label: section.label,
      pages: section.pages.map((page) => {
        totalPages += 1;
        if (page.content) documentedPages += 1;
        return {
          id: page.id,
          label: page.label,
          route: page.route,
          isDocumented: !!page.content,
          contentFormat: detectFormat(page.content),
          content: serializeContent(page.content),
        };
      }),
    })),
  }));

  return {
    $schema: 'pagsmile-platform-map-v1',
    generatedAt: new Date().toISOString(),
    summary: {
      totalModules: modules.length,
      totalPages,
      documentedPages,
      documentationCoverage: `${Math.round((documentedPages / totalPages) * 100)}%`,
    },
    readme: README,
    modules,
  };
}

function detectFormat(content) {
  if (!content) return 'placeholder';
  if (Array.isArray(content)) return 'legacy-blocks';
  if (typeof content === 'object') {
    if (content.overview || content.visualStructure || content.actions) {
      return 'v2-descriptive';
    }
    return 'object';
  }
  return 'unknown';
}

// Remove componentes React e funções, mantendo só dados serializáveis
function serializeContent(content) {
  if (!content) return null;
  return JSON.parse(
    JSON.stringify(content, (key, value) => {
      if (typeof value === 'function') return undefined;
      // React elements têm $$typeof
      if (value && typeof value === 'object' && value.$$typeof) return undefined;
      return value;
    })
  );
}

const README = `
PagSmile — Mapa da Plataforma (export para IA)
================================================

Este arquivo JSON contém a documentação completa da plataforma PagSmile
no mesmo formato visualizado em /PlatformMap.

Estrutura:
  modules[].sections[].pages[]
    - id            → identificador estável (ex: "AdminIntDashboard")
    - label         → nome legível em PT-BR
    - route         → rota da página no app
    - isDocumented  → boolean
    - contentFormat → "v2-descriptive" | "legacy-blocks" | "placeholder"
    - content       → documentação estruturada (varia por formato)

Formato v2-descriptive (preferido):
  {
    overview:        { purpose, audience, primaryGoal, ... },
    visualStructure: [ { region, elements, ... } ],
    actions:         [ { trigger, effect, ... } ],
    states:          [ { name, condition, visualChanges, ... } ],
    navigation:      { entryPoints, exitPoints, ... },
    dataSources:     [ { entity, fields, queries, ... } ]
  }

Formato legacy-blocks (antigo):
  Array de blocos { type: 'description'|'section'|'subsection'|'paragraph'
                    |'list'|'modal'|'callout', ... }

Como usar com uma IA:
  1. Anexe este arquivo na conversa.
  2. Peça: "Use o mapa em modules[] para gerar X".
  3. Cada page.id é único e mapeável para um arquivo em pages/{id}.{js,jsx}.

Módulos disponíveis:
  - onboarding       → Cadastro e ativação de novas contas
  - admin-sub        → Gestão para o merchant (subconta)
  - admin-interno    → Back-office PagSmile
  - internet-banking → Conta digital do merchant
`.trim();