import React from 'react';
import { FileText, AlertCircle, Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Renderiza o conteúdo de uma página específica documentada.
 * Quando `page.content` é null, mostra placeholder informando que
 * a documentação ainda não foi escrita (entrega futura).
 */
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
            Escolha uma página na navegação ao lado para ver sua documentação
            microscópica completa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header da página */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
            <span>{module.label}</span>
            <span>›</span>
            <span className="font-mono">{page.route}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{page.label}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">
              {page.id}
            </Badge>
            {page.content === null ? (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                Aguardando documentação
              </Badge>
            ) : (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                Documentação completa
              </Badge>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        {page.content === null ? (
          <PlaceholderContent module={module} page={page} />
        ) : (
          <DocumentedContent content={page.content} />
        )}
      </div>
    </ScrollArea>
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
        Esta página ainda não foi documentada. A documentação microscópica
        desta tela será adicionada em uma das próximas entregas do plano de
        documentação progressiva.
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-700 mb-1">O que será documentado:</p>
            <ul className="space-y-1 text-xs list-disc list-inside text-slate-500">
              <li>O que é a página e para que serve</li>
              <li>Cada seção, card, botão, modal e drawer</li>
              <li>Cada coluna de tabela, campo de formulário</li>
              <li>Cada ação, fluxo UX e microinteração</li>
              <li>Estados (loading, vazio, erro, sucesso)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Renderiza o conteúdo já documentado.
 * O `content` é um array de blocos com tipos diferentes:
 *  - { type: 'description', emoji, title, body }
 *  - { type: 'section', title, children }
 *  - { type: 'subsection', title, children }
 *  - { type: 'paragraph', text }
 *  - { type: 'list', items }
 *  - { type: 'modal', title, children } -> bloco roxo (drawer/modal)
 *  - { type: 'callout', variant, title, body }
 */
function DocumentedContent({ content }) {
  return (
    <div className="space-y-6">
      {content.map((block, idx) => (
        <ContentBlock key={idx} block={block} />
      ))}
    </div>
  );
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'description':
      return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{block.emoji || '🎯'}</span>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 mb-2">{block.title}</h4>
              <p className="text-slate-700 leading-relaxed text-sm">{block.body}</p>
            </div>
          </div>
        </div>
      );
    case 'section':
      return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            🔸 {block.title}
          </h2>
          <div className="space-y-4">
            {block.children?.map((child, i) => (
              <ContentBlock key={i} block={child} />
            ))}
          </div>
        </section>
      );
    case 'subsection':
      return (
        <div className="border-l-4 border-slate-200 pl-4 space-y-3">
          <h3 className="font-bold text-slate-800">{block.title}</h3>
          {block.children?.map((child, i) => (
            <ContentBlock key={i} block={child} />
          ))}
        </div>
      );
    case 'modal':
      return (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
            🟪 {block.title}
          </h4>
          <div className="space-y-3">
            {block.children?.map((child, i) => (
              <ContentBlock key={i} block={child} />
            ))}
          </div>
        </div>
      );
    case 'paragraph':
      return <p className="text-sm text-slate-700 leading-relaxed">{block.text}</p>;
    case 'list':
      return (
        <ul className="space-y-1.5 text-sm text-slate-700">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'callout':
      const variants = {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        warning: 'bg-amber-50 border-amber-200 text-amber-900',
        success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      };
      return (
        <div className={`border rounded-lg p-4 ${variants[block.variant] || variants.info}`}>
          {block.title && <p className="font-semibold mb-1">{block.title}</p>}
          <p className="text-sm">{block.body}</p>
        </div>
      );
    default:
      return null;
  }
}