import React from 'react';
import { FileText, Construction, AlertCircle, Map as MapIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import PageOverview from './blocks/PageOverview';
import StructureBlock from './blocks/StructureBlock';
import ActionsList from './blocks/ActionsList';
import StatesList from './blocks/StatesList';
import NavigationMap from './blocks/NavigationMap';
import DataSourcesList from './blocks/DataSourcesList';
import LegacyContent from './blocks/LegacyContent';

/**
 * Detecta o formato do conteúdo:
 * - 'v2-descriptive': novo formato estruturado (purpose + structure + actions...)
 * - 'legacy': formatos antigos (array de blocos OU explainer/technical)
 * - 'placeholder': null
 */
function detectFormat(content) {
  if (content === null || content === undefined) return 'placeholder';
  if (
    typeof content === 'object' &&
    !Array.isArray(content) &&
    (content.schemaVersion === 'v2-descriptive' || content.purpose || content.structure)
  ) {
    return 'v2-descriptive';
  }
  return 'legacy';
}

export default function PlatformMapContent({ module, page }) {
  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Selecione uma página
          </h3>
          <p className="text-sm text-slate-500">
            Escolha uma página na navegação ao lado para ver sua estrutura
            visual completa: abas, seções, blocos, campos e fluxos.
          </p>
        </div>
      </div>
    );
  }

  const format = detectFormat(page.content);

  return (
    <ScrollArea className="flex-1 bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header da página */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
            <span>{module.label}</span>
            <span>›</span>
            <span className="font-mono">{page.route}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            {page.label}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">
              {page.id}
            </Badge>
            {format === 'placeholder' && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                Aguardando documentação
              </Badge>
            )}
            {format === 'legacy' && (
              <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                Formato antigo
              </Badge>
            )}
            {format === 'v2-descriptive' && (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                Documentação visual completa
              </Badge>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        {format === 'placeholder' && (
          <PlaceholderContent module={module} page={page} />
        )}
        {format === 'legacy' && <LegacyContent content={page.content} />}
        {format === 'v2-descriptive' && (
          <DescriptiveContent doc={page.content} />
        )}
      </div>
    </ScrollArea>
  );
}

/**
 * Renderiza um doc no formato v2-descriptive.
 * Estrutura visual: Overview → Estrutura da Tela → Ações → Estados → Navegação → Dados
 */
function DescriptiveContent({ doc }) {
  return (
    <div className="space-y-5">
      {/* 1. Overview da página (gradient escuro) */}
      <PageOverview doc={doc} />

      {/* 2. Estrutura visual da tela (CORE) */}
      {Array.isArray(doc.structure) && doc.structure.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <MapIcon className="w-4 h-4 text-purple-600" />
            </div>
            Estrutura visual da tela
          </h2>
          <p className="text-xs text-slate-500 mb-5 ml-10">
            Mapa hierárquico de todos os blocos visíveis na página — clique nos
            blocos para expandir/recolher.
          </p>
          <div className="space-y-3">
            {doc.structure.map((block, idx) => (
              <StructureBlock key={idx} block={block} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Ações disponíveis */}
      <ActionsList actions={doc.actions} />

      {/* 4. Estados visuais */}
      <StatesList states={doc.states} />

      {/* 5. Navegação cross-page */}
      <NavigationMap navigation={doc.navigation} />

      {/* 6. Origem dos dados */}
      <DataSourcesList dataSources={doc.dataSources} />

      {/* 7. Notas finais (se houver) */}
      {doc.notes && (
        <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            💡 Observações
          </h2>
          <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-line">
            {doc.notes}
          </p>
        </section>
      )}
    </div>
  );
}

function PlaceholderContent({ module, page }) {
  return (
    <div className="bg-white border border-amber-200 rounded-2xl p-12 text-center shadow-sm">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: `${module.color}15` }}
      >
        <Construction className="w-8 h-8" style={{ color: module.color }} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">
        Documentação em construção
      </h3>
      <p className="text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
        Esta página ainda não foi documentada. Em breve você verá aqui o mapa
        visual completo da tela: abas, sub-abas, blocos, campos, ações e
        fluxos.
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-700 mb-1">
              O que você vai encontrar aqui:
            </p>
            <ul className="space-y-1 text-xs list-disc list-inside text-slate-500">
              <li>Resumo do propósito da tela</li>
              <li>Estrutura hierárquica de todos os blocos</li>
              <li>Cada campo, botão e elemento visual</li>
              <li>Ações que o usuário pode executar</li>
              <li>Estados (loading, vazio, erro, sucesso)</li>
              <li>Navegação para outras telas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}