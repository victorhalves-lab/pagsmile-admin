import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileCode, Download, Search, Upload } from 'lucide-react';
import CERCFilesTable from '@/components/regulatory/cerc/CERCFilesTable.jsx';
import CERCFileViewer from '@/components/regulatory/cerc/CERCFileViewer.jsx';
import { MOCK_CERC_FILES, CERC_FILE_TYPES } from '@/components/regulatory/mocks/urMock';
import { toast } from 'sonner';

export default function AdminIntCERCFileViewer() {
  const [filters, setFilters] = useState({ search: '', type: 'all', direction: 'all', status: 'all' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_CERC_FILES.filter((f) => {
      if (filters.type !== 'all' && f.type !== filters.type) return false;
      if (filters.direction !== 'all' && f.direction !== filters.direction) return false;
      if (filters.status !== 'all' && f.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return f.id.toLowerCase().includes(q) || f.file_name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [filters]);

  const handleViewFile = (file) => {
    setSelectedFile(file);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Arquivos CERC"
        subtitle="Visualizador de arquivos trocados com a registradora CERC (CNAB / XML / JSON)"
        icon={FileCode}
        breadcrumbs={[
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Arquivos CERC' },
        ]}
        actions={
          <Button variant="outline" onClick={() => toast.success('Upload de arquivo CERC iniciado')}>
            <Upload className="w-4 h-4 mr-2" /> Upload manual
          </Button>
        }
      />

      <Card>
        <CardContent className="p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Buscar por ID ou nome do arquivo…"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
            <SelectTrigger className="w-44 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos tipos</SelectItem>
              {Object.entries(CERC_FILE_TYPES).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.direction} onValueChange={(v) => setFilters({ ...filters, direction: v })}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Direção: ambas</SelectItem>
              <SelectItem value="inbound">Entrada (CERC→PS)</SelectItem>
              <SelectItem value="outbound">Saída (PS→CERC)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="processed">Processados</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="error">Com erro</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-slate-500">{filtered.length} de {MOCK_CERC_FILES.length} arquivos</span>
        </CardContent>
      </Card>

      <CERCFilesTable items={filtered} onViewDetail={handleViewFile} />

      <CERCFileViewer open={viewerOpen} onOpenChange={setViewerOpen} file={selectedFile} />
    </div>
  );
}