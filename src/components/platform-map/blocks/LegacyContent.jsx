import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Renderiza docs no formato ANTIGO (microscopic v1 com strings longas).
 * Quebra parágrafos gigantes em segmentos legíveis com tipografia adequada.
 */
export default function LegacyContent({ content }) {
  // Quebra strings longas em parágrafos pelas marcas: ' / ', ' — ', '; ', ': '
  const splitLongString = (text) => {
    if (typeof text !== 'string') return [text];
    if (text.length < 250) return [text];

    // Primeiro tenta quebrar por ' / ' que é o separador mais comum nos docs
    const segments = text
      .split(/\s+\/\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (segments.length > 1) return segments;

    // Senão tenta por ' — '
    const dashSegs = text
      .split(/\s+—\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (dashSegs.length > 1) return dashSegs;

    // Por último, frases longas demais ficam como estão
    return [text];
  };

  const renderValue = (value, depth = 0) => {
    if (value === null || value === undefined) return null;

    if (typeof value === 'string') {
      const segments = splitLongString(value);
      if (segments.length === 1) {
        return (
          <p className="text-sm text-slate-700 leading-relaxed">
            {segments[0]}
          </p>
        );
      }
      return (
        <ul className="space-y-2">
          {segments.map((seg, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed"
            >
              <span className="text-slate-400 mt-1 flex-shrink-0">▸</span>
              <span className="flex-1">{seg}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return <span className="text-sm font-mono text-slate-700">{String(value)}</span>;
    }

    if (Array.isArray(value)) {
      return (
        <ul className="space-y-1.5">
          {value.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-slate-400 mt-1 flex-shrink-0">•</span>
              <div className="flex-1">
                {typeof item === 'object' && item !== null
                  ? renderValue(item, depth + 1)
                  : <span className="leading-relaxed">{String(item)}</span>}
              </div>
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className={depth === 0 ? 'space-y-3' : 'space-y-2 pl-3 border-l-2 border-slate-200'}>
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {k.replace(/([A-Z])/g, ' $1').trim()}
              </h5>
              <div>{renderValue(v, depth + 1)}</div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // Banner amarelo informando que é doc antigo
  const banner = (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-800 leading-relaxed">
        Esta página ainda usa o formato antigo de documentação. O conteúdo
        abaixo foi auto-formatado em parágrafos legíveis. Será migrado em
        breve para o novo formato visual estruturado.
      </p>
    </div>
  );

  // Formato array de blocos (Dashboard original)
  if (Array.isArray(content)) {
    return (
      <div>
        {banner}
        <div className="space-y-4">
          {content.map((block, idx) => (
            <ClassicBlock key={idx} block={block} />
          ))}
        </div>
      </div>
    );
  }

  // Formato microscópico (objeto com explainer/technical)
  if (content && typeof content === 'object') {
    return (
      <div>
        {banner}
        <div className="space-y-6">
          {Object.entries(content)
            .filter(([k]) => !['pageId', 'pagePaths', 'module', 'section'].includes(k))
            .map(([k, v]) => (
              <section
                key={k}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-bold text-slate-900 mb-4 capitalize">
                  {k.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                {renderValue(v)}
              </section>
            ))}
        </div>
      </div>
    );
  }

  return null;
}

function ClassicBlock({ block }) {
  switch (block.type) {
    case 'description':
      return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{block.emoji || '🎯'}</span>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 mb-2">{block.title}</h4>
              <p className="text-slate-700 leading-relaxed text-sm">
                {block.body}
              </p>
            </div>
          </div>
        </div>
      );
    case 'section':
      return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            🔸 {block.title}
          </h2>
          <div className="space-y-4">
            {block.children?.map((child, i) => (
              <ClassicBlock key={i} block={child} />
            ))}
          </div>
        </section>
      );
    case 'subsection':
      return (
        <div className="border-l-4 border-slate-300 pl-4 space-y-3 py-1">
          <h3 className="font-bold text-slate-800 text-base">{block.title}</h3>
          {block.children?.map((child, i) => (
            <ClassicBlock key={i} block={child} />
          ))}
        </div>
      );
    case 'modal':
      return (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <h4 className="font-bold text-purple-900 mb-3">🟪 {block.title}</h4>
          <div className="space-y-3">
            {block.children?.map((child, i) => (
              <ClassicBlock key={i} block={child} />
            ))}
          </div>
        </div>
      );
    case 'paragraph':
      return (
        <p className="text-sm text-slate-700 leading-relaxed">{block.text}</p>
      );
    case 'list':
      return (
        <ul className="space-y-1.5 text-sm text-slate-700">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'callout': {
      const variants = {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        warning: 'bg-amber-50 border-amber-200 text-amber-900',
        success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      };
      return (
        <div
          className={`border rounded-lg p-4 ${
            variants[block.variant] || variants.info
          }`}
        >
          {block.title && <p className="font-semibold mb-1">{block.title}</p>}
          <p className="text-sm leading-relaxed">{block.body}</p>
        </div>
      );
    }
    default:
      return null;
  }
}