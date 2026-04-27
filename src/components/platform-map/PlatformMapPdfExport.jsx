import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { platformMapModules } from '@/lib/platformMapData';

// =============================================================================
// PDF Export — Mapa da Plataforma
// -----------------------------------------------------------------------------
// Gera um PDF único com TODA a documentação da pasta lib/platformMapData/.
// Trata DOIS formatos de `page.content`:
//  (A) Array de blocos { type: 'description'|'section'|'subsection'|'paragraph'
//                       |'list'|'modal'|'callout', ... }  — usado nas docs antigas
//  (B) Objeto { explainer, technical }                    — usado nas docs novas
// Estratégia: serializa qualquer estrutura em texto plano com indentação e
// quebras de página automáticas via jsPDF.splitTextToSize + tracking de Y.
// =============================================================================

const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 40;
const MARGIN_TOP = 50;
const MARGIN_BOTTOM = 50;
const PAGE_WIDTH = 595; // A4 em pontos
const PAGE_HEIGHT = 842;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

export default function PlatformMapPdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Conta total de páginas para barra de progresso
      let totalPages = 0;
      platformMapModules.forEach((m) =>
        m.sections.forEach((s) => {
          totalPages += s.pages.length;
        })
      );
      setProgress({ current: 0, total: totalPages, label: 'Iniciando...' });

      // Gera o PDF de forma assíncrona para a UI atualizar
      await new Promise((resolve) => setTimeout(resolve, 50));
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      let y = MARGIN_TOP;

      // ---- Capa ----
      y = renderCover(doc, totalPages);

      // ---- Sumário ----
      doc.addPage();
      y = MARGIN_TOP;
      y = renderTableOfContents(doc, y);

      // ---- Conteúdo ----
      let pageCounter = 0;
      for (const mod of platformMapModules) {
        doc.addPage();
        y = MARGIN_TOP;
        y = renderModuleHeader(doc, mod, y);

        for (const section of mod.sections) {
          y = ensureSpace(doc, y, 60);
          y = renderSectionHeader(doc, section, y);

          for (const page of section.pages) {
            pageCounter += 1;
            setProgress({
              current: pageCounter,
              total: totalPages,
              label: `${mod.label} › ${page.label.slice(0, 40)}`,
            });
            await new Promise((resolve) => setTimeout(resolve, 0));

            y = ensureSpace(doc, y, 80);
            y = renderPage(doc, mod, section, page, y);
          }
        }
      }

      // ---- Footer com numeração ----
      addPageNumbers(doc);

      const fileName = `mapa-plataforma-pagsmile-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF: ' + err.message);
    } finally {
      setIsExporting(false);
      setProgress({ current: 0, total: 0, label: '' });
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isExporting && progress.total > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-mono">
            {progress.current}/{progress.total}
          </span>
          <span className="text-slate-400 max-w-[200px] truncate">{progress.label}</span>
        </div>
      )}
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
            Gerando PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Exportar PDF Completo
          </>
        )}
      </Button>
    </div>
  );
}

// =============================================================================
// Helpers de renderização
// =============================================================================

function ensureSpace(doc, y, needed) {
  if (y + needed > PAGE_HEIGHT - MARGIN_BOTTOM) {
    doc.addPage();
    return MARGIN_TOP;
  }
  return y;
}

function writeWrapped(doc, text, x, y, opts = {}) {
  const {
    fontSize = 10,
    fontStyle = 'normal',
    color = [40, 40, 40],
    maxWidth = CONTENT_WIDTH,
    lineHeight = 1.4,
  } = opts;

  doc.setFontSize(fontSize);
  doc.setFont('helvetica', fontStyle);
  doc.setTextColor(...color);

  const lines = doc.splitTextToSize(String(text || ''), maxWidth);
  const lineSize = fontSize * lineHeight;

  for (const line of lines) {
    y = ensureSpace(doc, y, lineSize);
    doc.text(line, x, y);
    y += lineSize;
  }
  return y;
}

function renderCover(doc, totalPages) {
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text('Mapa da Plataforma', PAGE_WIDTH / 2, 280, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(43, 193, 150); // brand
  doc.text('PagSmile', PAGE_WIDTH / 2, 320, { align: 'center' });

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(13);
  doc.text(
    'Documentação microscópica de toda a plataforma',
    PAGE_WIDTH / 2,
    360,
    { align: 'center' }
  );

  // Stats
  let documented = 0;
  platformMapModules.forEach((m) =>
    m.sections.forEach((s) =>
      s.pages.forEach((p) => {
        if (p.content) documented += 1;
      })
    )
  );

  doc.setFontSize(11);
  doc.setTextColor(180, 180, 180);
  doc.text(
    `${platformMapModules.length} módulos · ${totalPages} páginas · ${documented} documentadas`,
    PAGE_WIDTH / 2,
    440,
    { align: 'center' }
  );

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Gerado em ${new Date().toLocaleString('pt-BR')}`,
    PAGE_WIDTH / 2,
    PAGE_HEIGHT - 60,
    { align: 'center' }
  );

  return MARGIN_TOP;
}

function renderTableOfContents(doc, y) {
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Sumário', MARGIN_LEFT, y);
  y += 32;

  for (const mod of platformMapModules) {
    y = ensureSpace(doc, y, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(mod.label, MARGIN_LEFT, y);
    y += 18;

    for (const section of mod.sections) {
      y = ensureSpace(doc, y, 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const sectionTitle = `  • ${section.label}  (${section.pages.length} páginas)`;
      const lines = doc.splitTextToSize(sectionTitle, CONTENT_WIDTH - 20);
      for (const line of lines) {
        y = ensureSpace(doc, y, 14);
        doc.text(line, MARGIN_LEFT + 12, y);
        y += 14;
      }
    }
    y += 8;
  }
  return y;
}

function renderModuleHeader(doc, mod, y) {
  // Faixa colorida do módulo
  const color = hexToRgb(mod.color || '#0f172a');
  doc.setFillColor(...color);
  doc.rect(0, y - 30, PAGE_WIDTH, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(mod.label, MARGIN_LEFT, y);
  y += 24;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y = writeWrapped(doc, mod.description || '', MARGIN_LEFT, y, {
    fontSize: 10,
    color: [240, 240, 240],
    maxWidth: CONTENT_WIDTH,
  });
  y += 16;

  return y;
}

function renderSectionHeader(doc, section, y) {
  y = ensureSpace(doc, y, 40);
  doc.setDrawColor(43, 193, 150);
  doc.setLineWidth(2);
  doc.line(MARGIN_LEFT, y - 4, MARGIN_LEFT + 30, y - 4);
  doc.setLineWidth(0.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  y = writeWrapped(doc, section.label, MARGIN_LEFT, y + 8, {
    fontSize: 14,
    fontStyle: 'bold',
    color: [15, 23, 42],
  });
  y += 6;
  return y;
}

function renderPage(doc, mod, section, page, y) {
  // Cabeçalho da página
  y = ensureSpace(doc, y, 50);
  doc.setFillColor(248, 250, 252);
  doc.rect(MARGIN_LEFT - 8, y - 12, CONTENT_WIDTH + 16, 4, 'F');

  y = writeWrapped(doc, page.label, MARGIN_LEFT, y, {
    fontSize: 12,
    fontStyle: 'bold',
    color: [15, 23, 42],
  });

  // Metadata
  const metadata = `ID: ${page.id}    Rota: ${page.route}    ${
    page.content ? '✓ Documentada' : '○ Aguardando documentação'
  }`;
  y = writeWrapped(doc, metadata, MARGIN_LEFT, y, {
    fontSize: 8,
    color: [100, 116, 139],
  });
  y += 8;

  // Conteúdo
  if (!page.content) {
    y = writeWrapped(
      doc,
      'Documentação ainda não escrita — esta página será documentada em uma das próximas entregas.',
      MARGIN_LEFT,
      y,
      { fontSize: 9, fontStyle: 'italic', color: [148, 163, 184] }
    );
  } else if (Array.isArray(page.content)) {
    // Formato A: array de blocos
    for (const block of page.content) {
      y = renderBlock(doc, block, y, 0);
    }
  } else if (typeof page.content === 'object') {
    // Formato B: objeto { explainer, technical, ... }
    y = renderObject(doc, page.content, y, 0);
  }

  y += 16;
  // Linha separadora entre páginas
  y = ensureSpace(doc, y, 10);
  doc.setDrawColor(226, 232, 240);
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
  y += 12;
  return y;
}

// Formato A — blocos tipados
function renderBlock(doc, block, y, depth = 0) {
  const indent = depth * 10;
  const x = MARGIN_LEFT + indent;
  const maxWidth = CONTENT_WIDTH - indent;

  switch (block.type) {
    case 'description':
      y = writeWrapped(doc, `${block.emoji || '🎯'} ${block.title || ''}`, x, y, {
        fontSize: 11,
        fontStyle: 'bold',
        color: [15, 23, 42],
        maxWidth,
      });
      y = writeWrapped(doc, block.body || '', x, y, {
        fontSize: 9,
        color: [55, 65, 81],
        maxWidth,
      });
      y += 6;
      return y;

    case 'section':
      y = ensureSpace(doc, y, 20);
      y = writeWrapped(doc, `▸ ${block.title || ''}`, x, y, {
        fontSize: 12,
        fontStyle: 'bold',
        color: [15, 23, 42],
        maxWidth,
      });
      y += 4;
      for (const child of block.children || []) {
        y = renderBlock(doc, child, y, depth + 1);
      }
      y += 4;
      return y;

    case 'subsection':
      y = writeWrapped(doc, block.title || '', x, y, {
        fontSize: 10,
        fontStyle: 'bold',
        color: [30, 41, 59],
        maxWidth,
      });
      for (const child of block.children || []) {
        y = renderBlock(doc, child, y, depth + 1);
      }
      return y;

    case 'modal':
      y = writeWrapped(doc, `🟪 ${block.title || ''}`, x, y, {
        fontSize: 10,
        fontStyle: 'bold',
        color: [88, 28, 135],
        maxWidth,
      });
      for (const child of block.children || []) {
        y = renderBlock(doc, child, y, depth + 1);
      }
      y += 4;
      return y;

    case 'paragraph':
      y = writeWrapped(doc, block.text || '', x, y, {
        fontSize: 9,
        color: [55, 65, 81],
        maxWidth,
      });
      y += 2;
      return y;

    case 'list':
      for (const item of block.items || []) {
        y = writeWrapped(doc, `• ${item}`, x + 6, y, {
          fontSize: 9,
          color: [55, 65, 81],
          maxWidth: maxWidth - 6,
        });
      }
      y += 2;
      return y;

    case 'callout':
      const variantColors = {
        info: [30, 64, 175],
        warning: [146, 64, 14],
        success: [6, 95, 70],
      };
      const calloutColor = variantColors[block.variant] || variantColors.info;
      if (block.title) {
        y = writeWrapped(doc, `⚠ ${block.title}`, x, y, {
          fontSize: 9,
          fontStyle: 'bold',
          color: calloutColor,
          maxWidth,
        });
      }
      y = writeWrapped(doc, block.body || '', x, y, {
        fontSize: 9,
        color: calloutColor,
        maxWidth,
      });
      y += 4;
      return y;

    default:
      return y;
  }
}

// Formato B — objeto { explainer: {...}, technical: {...}, ... }
function renderObject(doc, obj, y, depth = 0) {
  const indent = depth * 10;
  const x = MARGIN_LEFT + indent;
  const maxWidth = CONTENT_WIDTH - indent;

  if (obj === null || obj === undefined) return y;

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    y = writeWrapped(doc, String(obj), x, y, {
      fontSize: 9,
      color: [55, 65, 81],
      maxWidth,
    });
    return y;
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'string') {
        y = writeWrapped(doc, `• ${item}`, x + 6, y, {
          fontSize: 9,
          color: [55, 65, 81],
          maxWidth: maxWidth - 6,
        });
      } else {
        y = renderObject(doc, item, y, depth + 1);
      }
    }
    return y;
  }

  if (typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      // Pula chaves estruturais redundantes no nível raiz
      if (depth === 0 && ['pageId', 'pagePaths', 'module', 'section'].includes(key)) {
        y = writeWrapped(doc, `${formatKey(key)}: ${formatPrimitive(val)}`, x, y, {
          fontSize: 8,
          color: [100, 116, 139],
          maxWidth,
        });
        continue;
      }

      y = ensureSpace(doc, y, 20);

      // Cabeçalho da chave
      const keyLabel = formatKey(key);
      const keyFontSize = depth === 0 ? 12 : depth === 1 ? 10 : 9;
      const keyColor = depth === 0 ? [15, 23, 42] : depth === 1 ? [30, 41, 59] : [55, 65, 81];

      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        // Inline: chave + valor
        y = writeWrapped(doc, `${keyLabel}: ${val}`, x, y, {
          fontSize: keyFontSize - 1,
          color: keyColor,
          maxWidth,
        });
      } else if (val === null) {
        // skip
      } else if (Array.isArray(val) && val.every((i) => typeof i === 'string')) {
        // Lista simples de strings — chave + bullets
        y = writeWrapped(doc, keyLabel, x, y, {
          fontSize: keyFontSize,
          fontStyle: 'bold',
          color: keyColor,
          maxWidth,
        });
        for (const item of val) {
          y = writeWrapped(doc, `• ${item}`, x + 8, y, {
            fontSize: 9,
            color: [55, 65, 81],
            maxWidth: maxWidth - 8,
          });
        }
        y += 2;
      } else {
        // Objeto/array complexo — abre seção
        y = writeWrapped(doc, keyLabel, x, y, {
          fontSize: keyFontSize,
          fontStyle: 'bold',
          color: keyColor,
          maxWidth,
        });
        y = renderObject(doc, val, y, depth + 1);
        y += 2;
      }
    }
    return y;
  }

  return y;
}

function formatKey(key) {
  // converte camelCase em palavras com primeira letra maiúscula
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatPrimitive(val) {
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'object' && val !== null) return JSON.stringify(val);
  return String(val);
}

function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  const num = parseInt(cleaned, 16);
  if (cleaned.length === 6) {
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  return [15, 23, 42];
}

function addPageNumbers(doc) {
  const total = doc.internal.getNumberOfPages();
  for (let i = 2; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Página ${i} de ${total}`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 20,
      { align: 'center' }
    );
    doc.text('Mapa da Plataforma — PagSmile', MARGIN_LEFT, PAGE_HEIGHT - 20);
  }
}