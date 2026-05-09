import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles, LayoutTemplate, Search, Filter, Rocket, ShieldCheck,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  mockSplitTemplates,
  mockEligibleMerchants,
} from '@/components/mentor/mocks/splitTemplatesBulkMock';
import MentorSplitTemplateCard from '@/components/mentor/split/MentorSplitTemplateCard';
import MentorBulkMerchantPicker from '@/components/mentor/split/MentorBulkMerchantPicker';
import MentorBulkRolloutValidator from '@/components/mentor/split/MentorBulkRolloutValidator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const VERTICAL_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'infoproducts', label: 'Infoprodutos' },
  { key: 'franchise', label: 'Franchising' },
  { key: 'saas', label: 'SaaS' },
  { key: 'ngo', label: 'ONG' },
];

export default function SplitTemplatesBulkApply() {
  const [verticalFilter, setVerticalFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedMerchantIds, setSelectedMerchantIds] = useState([]);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('');

  const filteredTemplates = useMemo(() => {
    return mockSplitTemplates.filter((t) => {
      if (verticalFilter !== 'all' && t.vertical !== verticalFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [verticalFilter, search]);

  const selectedMerchants = useMemo(
    () => mockEligibleMerchants.filter((m) => selectedMerchantIds.includes(m.merchant_id)),
    [selectedMerchantIds]
  );

  const canApply = selectedTemplate && selectedMerchantIds.length > 0;

  const handleApply = () => {
    if (!justification.trim() || justification.length < 30) {
      toast.error('Justificativa precisa de no mínimo 30 caracteres');
      return;
    }
    if (otp.length !== 6) {
      toast.error('OTP de 6 dígitos é obrigatório');
      return;
    }
    toast.success(
      `Template "${selectedTemplate.name}" agendado para aplicação em ${selectedMerchantIds.length} merchant(s) · cutover programado para D+1`
    );
    setShowApplyDialog(false);
    setSelectedTemplate(null);
    setSelectedMerchantIds([]);
    setJustification('');
    setOtp('');
  };

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Templates & Bulk Apply · Splits"
        subtitle="Biblioteca de templates pré-aprovados + aplicação em massa com validação Mentor"
        icon={LayoutTemplate}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Splits', page: 'SplitManagement' },
          { label: 'Templates & Bulk' },
        ]}
        actions={
          <Badge className="bg-violet-100 text-violet-700 gap-1">
            <Sparkles className="w-3 h-3" /> Mentor · Wave H.8
          </Badge>
        }
      />

      {/* Filtros de templates */}
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] uppercase font-bold text-slate-500">Vertical:</span>
            {VERTICAL_FILTERS.map((v) => (
              <button
                key={v.key}
                onClick={() => setVerticalFilter(v.key)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[11px] font-semibold transition border',
                  verticalFilter === v.key
                    ? 'bg-violet-600 text-white border-violet-700'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Buscar template…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid de templates */}
      <div>
        <p className="text-xs text-slate-500 mb-2">
          {filteredTemplates.length} template(s) {selectedTemplate && `· "${selectedTemplate.name}" selecionado`}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTemplates.map((t) => (
            <MentorSplitTemplateCard
              key={t.template_id}
              template={t}
              isSelected={selectedTemplate?.template_id === t.template_id}
              onSelect={setSelectedTemplate}
              onPreview={setPreviewTemplate}
            />
          ))}
        </div>
        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-sm text-slate-500">
              Nenhum template encontrado.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Etapa 2 — Picker + Validador (só aparece com template selecionado) */}
      {selectedTemplate && (
        <>
          <div className="border-t-2 border-violet-200 pt-4">
            <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-black">
                2
              </span>
              Selecione os merchants alvo
            </p>
          </div>
          <MentorBulkMerchantPicker
            merchants={mockEligibleMerchants}
            selectedIds={selectedMerchantIds}
            onChange={setSelectedMerchantIds}
          />
        </>
      )}

      {selectedTemplate && selectedMerchantIds.length > 0 && (
        <>
          <div className="border-t-2 border-violet-200 pt-4">
            <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-black">
                3
              </span>
              Validação Mentor de rollout
            </p>
          </div>
          <MentorBulkRolloutValidator template={selectedTemplate} selectedMerchants={selectedMerchants} />
        </>
      )}

      {/* Action Bar */}
      <Card className="sticky bottom-4 shadow-xl border-2 border-violet-200">
        <CardContent className="p-3 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {!selectedTemplate ? (
              <span className="text-slate-400">Selecione um template para iniciar</span>
            ) : selectedMerchantIds.length === 0 ? (
              <span className="text-slate-400">Selecione ao menos 1 merchant</span>
            ) : (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-600" />
                <strong>{selectedTemplate.name}</strong> · {selectedMerchantIds.length} merchant(s)
              </span>
            )}
          </div>
          <Button
            onClick={() => setShowApplyDialog(true)}
            disabled={!canApply}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Rocket className="w-4 h-4 mr-1.5" />
            Aplicar template em massa
          </Button>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(o) => !o && setPreviewTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>{previewTemplate?.description}</DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-3 text-sm">
              <div className="bg-slate-50 dark:bg-slate-800 rounded p-3 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-slate-500">Configuração</p>
                <pre className="text-[11px] text-slate-700 dark:text-slate-200">
                  {JSON.stringify(previewTemplate.config, null, 2)}
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-50 border border-emerald-200 rounded p-2">
                  <p className="text-[10px] uppercase font-bold text-emerald-700">Adoção</p>
                  <p className="text-lg font-black text-emerald-800">{previewTemplate.benchmark.adoption_rate}%</p>
                  <p className="text-[10px] text-emerald-600">de marketplaces da plataforma</p>
                </div>
                <div className="bg-violet-50 border border-violet-200 rounded p-2">
                  <p className="text-[10px] uppercase font-bold text-violet-700">Health médio</p>
                  <p className="text-lg font-black text-violet-800">{previewTemplate.benchmark.avg_health_score}/100</p>
                  <p className="text-[10px] text-violet-600">dos splits que usam</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet-600" /> Confirmar aplicação em massa
            </DialogTitle>
            <DialogDescription>
              Esta operação será registrada com sua identidade e gerará eventos de auditoria para cada merchant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-2.5 text-xs space-y-1">
              <p><strong>Template:</strong> {selectedTemplate?.name}</p>
              <p><strong>Merchants:</strong> {selectedMerchantIds.length}</p>
              <p><strong>Cutover:</strong> D+1 às 03:00 (janela noturna padrão)</p>
            </div>
            <div>
              <Label className="text-xs">Justificativa (mínimo 30 caracteres) *</Label>
              <Textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
                placeholder="Descreva o motivo do rollout · contexto comercial · aprovação de governança…"
                className="mt-1"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">{justification.length} caractere(s)</p>
            </div>
            <div>
              <Label className="text-xs">Código OTP de 6 dígitos *</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="mt-1 font-mono tracking-widest text-center text-lg"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>Cancelar</Button>
            <Button onClick={handleApply} className="bg-violet-600 hover:bg-violet-700">
              <Rocket className="w-3.5 h-3.5 mr-1" /> Confirmar e agendar rollout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}