import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { platformMapModules } from '@/lib/platformMapData';
import PlatformMapContent from '@/components/platform-map/PlatformMapContent';

// =============================================================================
// PDF Export — Captura o layout REAL renderizado (igual ao que aparece na tela)
// -----------------------------------------------------------------------------
// Estratégia: para cada página documentada, renderiza o componente real
// PlatformMapContent num container off-screen, captura com html2canvas e
// adiciona ao PDF mantendo cabeçalho do módulo e meta-dados.
// =============================================================================

const PAGE_WIDTH_MM = 210; // A4 portrait
const PAGE_HEIGHT_MM = 297;
const MARGIN_MM = 10;
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;

// Container off-screen onde renderizamos cada página real para captura
const RENDER_WIDTH_PX = 1100; // largura usada na captura (igual ao layout desktop)

export default function PlatformMapPdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' });

  const handleExport = async () => {
    setIsExporting(true);

    // Cria container off-screen
    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.left = '-99999px';
    host.style.top = '0';
    host.style.width = `${RENDER_WIDTH_PX}px`;
    host.style.background = '#ffffff';
    host.style.zIndex = '-1';
    document.body.appendChild(host);
    const root = createRoot(host);

    try {
      // Total de páginas documentadas
      let totalPages = 0;
      platformMapModules.forEach((m) =>
        m.sections.forEach((s) => {
          totalPages += s.pages.filter((p) => p.content).length;
        })
      );
      setProgress({ current: 0, total: totalPages, label: 'Iniciando...' });

      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      let isFirstPdfPage = true;

      // ---- Capa ----
      renderCover(doc, totalPages);
      isFirstPdfPage = false;

      // ---- Sumário ----
      doc.addPage();
      renderTableOfContents(doc);

      // ---- Conteúdo ----
      let pageCounter = 0;
      for (const mod of platformMapModules) {
        // Capa do módulo
        doc.addPage();
        renderModuleCover(doc, mod);

        for (const section of mod.sections) {
          for (const page of section.pages) {
            if (!page.content) continue;
            pageCounter += 1;
            setProgress({
              current: pageCounter,
              total: totalPages,
              label: `${mod.label} › ${page.label.slice(0, 50)}`,
            });

            // Renderiza no container off-screen
            await renderPageToHost(root, mod, section, page);
            // Pequeno delay para garantir layout
            await new Promise((r) => setTimeout(r, 100));

            // Captura
            const canvas = await html2canvas(host, {
              scale: 2,
              backgroundColor: '#ffffff',
              useCORS: true,
              logging: false,
              windowWidth: RENDER_WIDTH_PX,
            });

            // Adiciona ao PDF (paginando verticalmente se for muito alto)
            await addCanvasToPdf(doc, canvas);
          }
        }
      }

      addPageNumbers(doc);

      const fileName = `mapa-plataforma-pagsmile-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF: ' + err.message);
    } finally {
      root.unmount();
      document.body.removeChild(host);
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
          <span className="text-slate-400 max-w-[260px] truncate">{progress.label}</span>
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
// Renderiza uma página real (header do módulo + breadcrumb + conteúdo) no host
// =============================================================================
function renderPageToHost(root, mod, section, page) {
  return new Promise((resolve) => {
    root.render(
      <CapturedPage mod={mod} section={section} page={page} onReady={resolve} />
    );
  });
}

function CapturedPage({ mod, section, page, onReady }) {
  useEffect(() => {
    // Espera o paint
    const t = setTimeout(onReady, 50);
    return () => clearTimeout(t);
  }, [onReady]);

  return (
    <div style={{ width: RENDER_WIDTH_PX, background: '#fff', padding: 0 }}>
      {/* Cabeçalho do módulo (faixa colorida) */}
      <div
        style={{
          background: mod.color || '#0f172a',
          color: '#fff',
          padding: '20px 32px',
        }}
      >
        <div style={{ fontSize: 11, opacity: 0.85, letterSpacing: 1, textTransform: 'uppercase' }}>
          {mod.label}
        </div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
          {section.label}
        </div>
      </div>

      {/* Breadcrumb / meta */}
      <div
        style={{
          padding: '8px 32px',
          fontSize: 11,
          color: '#64748b',
          borderBottom: '1px solid #e2e8f0',
          fontFamily: 'monospace',
        }}
      >
        {page.id} · {page.route}
      </div>

      {/* Conteúdo real */}
      <div style={{ padding: 0 }}>
        <PlatformMapContent module={mod} page={page} />
      </div>
    </div>
  );
}

// =============================================================================
// Adiciona um canvas ao PDF, paginando se necessário
// =============================================================================
async function addCanvasToPdf(doc, canvas) {
  // adiciona página nova para o conteúdo capturado
  doc.addPage();

  const imgWidthMm = CONTENT_WIDTH_MM;
  const pxPerMm = canvas.width / imgWidthMm;
  const fullHeightMm = canvas.height / pxPerMm;
  const usableHeightMm = PAGE_HEIGHT_MM - MARGIN_MM * 2;

  if (fullHeightMm <= usableHeightMm) {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    doc.addImage(dataUrl, 'JPEG', MARGIN_MM, MARGIN_MM, imgWidthMm, fullHeightMm);
    return;
  }

  // Conteúdo maior que a página: fatia em pedaços do tamanho da página
  const sliceHeightPx = Math.floor(usableHeightMm * pxPerMm);
  let remaining = canvas.height;
  let offset = 0;
  let firstSlice = true;

  while (remaining > 0) {
    const currentSlicePx = Math.min(sliceHeightPx, remaining);
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = currentSlicePx;
    const ctx = sliceCanvas.getContext('2d');
    ctx.drawImage(
      canvas,
      0,
      offset,
      canvas.width,
      currentSlicePx,
      0,
      0,
      canvas.width,
      currentSlicePx
    );

    if (!firstSlice) doc.addPage();
    const dataUrl = sliceCanvas.toDataURL('image/jpeg', 0.92);
    const sliceHeightMm = currentSlicePx / pxPerMm;
    doc.addImage(dataUrl, 'JPEG', MARGIN_MM, MARGIN_MM, imgWidthMm, sliceHeightMm);

    offset += currentSlicePx;
    remaining -= currentSlicePx;
    firstSlice = false;
  }
}

// =============================================================================
// Capa, sumário, capa de módulo, numeração
// =============================================================================
function renderCover(doc, totalPages) {
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, PAGE_WIDTH_MM, PAGE_HEIGHT_MM, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('Mapa da Plataforma', PAGE_WIDTH_MM / 2, 110, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(43, 193, 150);
  doc.text('PagSmile', PAGE_WIDTH_MM / 2, 122, { align: 'center' });

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(11);
  doc.text(
    'Documentação visual completa de toda a plataforma',
    PAGE_WIDTH_MM / 2,
    136,
    { align: 'center' }
  );

  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text(
    `${platformMapModules.length} módulos · ${totalPages} páginas documentadas`,
    PAGE_WIDTH_MM / 2,
    160,
    { align: 'center' }
  );

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Gerado em ${new Date().toLocaleString('pt-BR')}`,
    PAGE_WIDTH_MM / 2,
    PAGE_HEIGHT_MM - 20,
    { align: 'center' }
  );
}

function renderTableOfContents(doc) {
  let y = 25;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Sumário', MARGIN_MM, y);
  y += 12;

  for (const mod of platformMapModules) {
    if (y > PAGE_HEIGHT_MM - 30) {
      doc.addPage();
      y = 25;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(mod.label, MARGIN_MM, y);
    y += 6;

    for (const section of mod.sections) {
      if (y > PAGE_HEIGHT_MM - 20) {
        doc.addPage();
        y = 25;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const docCount = section.pages.filter((p) => p.content).length;
      doc.text(
        `  • ${section.label}  (${docCount}/${section.pages.length})`,
        MARGIN_MM + 4,
        y
      );
      y += 5;
    }
    y += 4;
  }
}

function renderModuleCover(doc, mod) {
  const color = hexToRgb(mod.color || '#0f172a');
  doc.setFillColor(...color);
  doc.rect(0, 0, PAGE_WIDTH_MM, PAGE_HEIGHT_MM, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(mod.label, PAGE_WIDTH_MM / 2, 130, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(240, 240, 240);
  const desc = doc.splitTextToSize(mod.description || '', CONTENT_WIDTH_MM - 20);
  let dy = 145;
  for (const line of desc) {
    doc.text(line, PAGE_WIDTH_MM / 2, dy, { align: 'center' });
    dy += 6;
  }

  const total = mod.sections.reduce((acc, s) => acc + s.pages.length, 0);
  const documented = mod.sections.reduce(
    (acc, s) => acc + s.pages.filter((p) => p.content).length,
    0
  );
  doc.setFontSize(10);
  doc.setTextColor(220, 220, 220);
  doc.text(
    `${mod.sections.length} seções · ${documented}/${total} páginas documentadas`,
    PAGE_WIDTH_MM / 2,
    dy + 10,
    { align: 'center' }
  );
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
      PAGE_WIDTH_MM / 2,
      PAGE_HEIGHT_MM - 5,
      { align: 'center' }
    );
    doc.text('Mapa da Plataforma — PagSmile', MARGIN_MM, PAGE_HEIGHT_MM - 5);
  }
}