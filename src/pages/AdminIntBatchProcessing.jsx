import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, Download, Eye, CheckCircle2, XCircle, Clock, 
  FileSpreadsheet, RefreshCw, AlertTriangle, ArrowUpRight,
  Layers, Zap, History, ChevronRight, FileUp, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const OperationCard = ({ icon: Icon, title, description, selected, onClick, color }) => (
  <div 
    onClick={onClick}
    className={cn(
      "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
      selected 
        ? "border-[#2bc196] bg-[#2bc196]/5 dark:bg-[#2bc196]/10" 
        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
    )}
  >
    <div className="flex items-start gap-3">
      <div className={cn(
        "p-2 rounded-lg",
        selected ? "bg-[#2bc196]/20" : `bg-${color}-50 dark:bg-${color}-900/20`
      )}>
        <Icon className={cn(
          "w-5 h-5",
          selected ? "text-[#2bc196]" : `text-${color}-600 dark:text-${color}-400`
        )} />
      </div>
      <div className="flex-1">
        <h4 className={cn(
          "font-semibold text-sm",
          selected ? "text-[#2bc196]" : "text-slate-900 dark:text-white"
        )}>{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
      </div>
      {selected && (
        <CheckCircle2 className="w-5 h-5 text-[#2bc196]" />
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    completed: { icon: CheckCircle2, label: 'Concluído', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    processing: { icon: RefreshCw, label: 'Processando', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', spin: true },
    failed: { icon: XCircle, label: 'Falhou', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    pending: { icon: Clock, label: 'Pendente', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  }[status] || config.pending;
  
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", config.color)}>
      <Icon className={cn("w-3 h-3", config.spin && "animate-spin")} />
      {config.label}
    </span>
  );
};

export default function AdminIntBatchProcessing() {
  const [operationType, setOperationType] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const operations = [
    { id: 'refund', icon: RefreshCw, title: 'Estorno em Lote', description: 'Estornar múltiplas transações de uma vez', color: 'purple' },
    { id: 'capture', icon: CheckCircle2, title: 'Captura em Lote', description: 'Capturar transações pré-autorizadas', color: 'emerald' },
    { id: 'cancel', icon: XCircle, title: 'Cancelamento em Lote', description: 'Cancelar transações pendentes', color: 'red' },
    { id: 'webhook', icon: Zap, title: 'Reenvio de Webhooks', description: 'Reenviar notificações para URLs configuradas', color: 'blue' },
  ];

  const batches = [
    { id: 'LOT-001', date: '28/01/2026 14:32', operation: 'Estorno', user: 'admin@pagsmile.com', total: 150, success: 148, failed: 2, status: 'completed' },
    { id: 'LOT-002', date: '27/01/2026 10:15', operation: 'Webhook', user: 'ops@pagsmile.com', total: 500, success: 500, failed: 0, status: 'completed' },
    { id: 'LOT-003', date: '26/01/2026 16:45', operation: 'Captura', user: 'admin@pagsmile.com', total: 75, success: 75, failed: 0, status: 'completed' },
    { id: 'LOT-004', date: '25/01/2026 09:20', operation: 'Estorno', user: 'finance@pagsmile.com', total: 200, success: 195, failed: 5, status: 'completed' },
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'text/csv' || droppedFile?.name.endsWith('.csv')) {
      setFile(droppedFile);
      toast.success(`Arquivo ${droppedFile.name} carregado!`);
    } else {
      toast.error('Apenas arquivos CSV são aceitos');
    }
  };

  const formatTemplates = {
    refund: 'transaction_id,amount,reason',
    capture: 'transaction_id,amount',
    cancel: 'transaction_id,reason',
    webhook: 'transaction_id',
  };

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader 
        title="Processamento em Lote"
        subtitle="Execute operações em massa de forma segura e rastreável"
        breadcrumbs={[{ label: 'Transações' }, { label: 'Processamento em Lote' }]}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <History className="w-4 h-4" /> Ver Histórico Completo
          </Button>
        }
      />

      {/* Nova Operação */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#2bc196]" />
              Nova Operação em Lote
            </CardTitle>
            <CardDescription>Selecione o tipo de operação e faça upload do arquivo CSV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">Tipo de Operação</label>
              <div className="grid grid-cols-2 gap-3">
                {operations.map(op => (
                  <OperationCard
                    key={op.id}
                    icon={op.icon}
                    title={op.title}
                    description={op.description}
                    color={op.color}
                    selected={operationType === op.id}
                    onClick={() => setOperationType(op.id)}
                  />
                ))}
              </div>
            </div>

            {operationType && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-200">Formato esperado:</p>
                    <code className="text-xs text-blue-700 dark:text-blue-300 font-mono mt-0.5 block">{formatTemplates[operationType]}</code>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <FileUp className="w-5 h-5 text-[#2bc196]" />
              Upload de Arquivo
            </CardTitle>
            <CardDescription>Arraste ou selecione um arquivo CSV com os IDs das transações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                isDragging 
                  ? "border-[#2bc196] bg-[#2bc196]/5" 
                  : file 
                    ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
                !operationType && "opacity-50 pointer-events-none"
              )}
            >
              {file ? (
                <>
                  <FileSpreadsheet className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-red-500" onClick={() => setFile(null)}>
                    Remover arquivo
                  </Button>
                </>
              ) : (
                <>
                  <Upload className={cn(
                    "w-12 h-12 mx-auto mb-3 transition-colors",
                    isDragging ? "text-[#2bc196]" : "text-slate-400"
                  )} />
                  <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {isDragging ? 'Solte o arquivo aqui' : 'Arraste o arquivo CSV aqui'}
                  </p>
                  <p className="text-xs text-slate-500 mb-3">ou clique para selecionar</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setFile(e.target.files[0]);
                        toast.success(`Arquivo ${e.target.files[0].name} carregado!`);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" className="pointer-events-none">
                      Selecionar Arquivo
                    </Button>
                  </label>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!operationType}
                onClick={() => toast.info('Download do template iniciado')}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-1.5" /> Baixar Template
              </Button>
              <Button 
                disabled={!file || !operationType} 
                onClick={() => toast.success('Validação concluída! 150 registros encontrados.')}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Validar
              </Button>
            </div>

            <Button 
              disabled={!file || !operationType} 
              onClick={() => toast.success('Lote enviado para processamento!')}
              className="w-full bg-[#2bc196] hover:bg-[#239b7a]"
            >
              <Zap className="w-4 h-4 mr-1.5" /> Processar Lote
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Histórico */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              Histórico de Processamentos
            </CardTitle>
            <span className="text-xs text-slate-500">Últimos 30 dias</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">ID do Lote</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Operação</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Usuário</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Progresso</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Ações</th>
                </tr>
              </thead>
              <tbody>
                {batches.map(batch => (
                  <tr key={batch.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-medium text-[#2bc196]">{batch.id}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">{batch.date}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-slate-900 dark:text-white">{batch.operation}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">{batch.user}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={(batch.success / batch.total) * 100} className="h-1.5 flex-1" />
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          {batch.success}/{batch.total}
                        </span>
                      </div>
                      {batch.failed > 0 && (
                        <span className="text-[10px] text-red-500">{batch.failed} falhas</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}