import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Search, Filter, FileText, Download, Eye, CheckCircle2, XCircle,
  Clock, Building2, Calendar, Image, File, AlertTriangle, Sparkles
} from 'lucide-react';

// Mock documents data
const mockDocuments = [
  {
    id: 'DOC001',
    name: 'Contrato Social',
    type: 'contract',
    subaccount_id: 'SUB001',
    business_name: 'Tech Solutions LTDA',
    document: '12.345.678/0001-90',
    status: 'approved',
    uploaded_at: '2024-01-28T14:25:00',
    validated_at: '2024-01-28T15:30:00',
    validated_by: 'maria.silva@pagsmile.com',
    file_type: 'pdf',
    file_size: '2.4 MB',
    helena_analysis: 'Documento válido. Assinaturas verificadas. Data de emissão compatível.',
    url: '#'
  },
  {
    id: 'DOC002',
    name: 'Comprovante de Endereço',
    type: 'address',
    subaccount_id: 'SUB001',
    business_name: 'Tech Solutions LTDA',
    document: '12.345.678/0001-90',
    status: 'pending',
    uploaded_at: '2024-01-28T14:26:00',
    validated_at: null,
    validated_by: null,
    file_type: 'pdf',
    file_size: '1.1 MB',
    helena_analysis: 'Documento com data de emissão superior a 90 dias. Verificação manual recomendada.',
    url: '#'
  },
  {
    id: 'DOC003',
    name: 'RG Sócio - João Silva',
    type: 'id',
    subaccount_id: 'SUB001',
    business_name: 'Tech Solutions LTDA',
    document: '12.345.678/0001-90',
    status: 'approved',
    uploaded_at: '2024-01-28T14:27:00',
    validated_at: '2024-01-28T14:30:00',
    validated_by: 'HELENA_AI',
    file_type: 'jpg',
    file_size: '850 KB',
    helena_analysis: 'Documento válido. CPF verificado. Face match: 98.5% compatível.',
    url: '#'
  },
  {
    id: 'DOC004',
    name: 'Contrato Social',
    type: 'contract',
    subaccount_id: 'SUB003',
    business_name: 'Loja Virtual Express',
    document: '11.222.333/0001-44',
    status: 'rejected',
    uploaded_at: '2024-01-26T16:40:00',
    validated_at: '2024-01-26T16:42:00',
    validated_by: 'HELENA_AI',
    file_type: 'pdf',
    file_size: '1.8 MB',
    helena_analysis: 'ALERTA: Documento apresenta sinais de adulteração. Metadados indicam edição posterior à data de assinatura.',
    rejection_reason: 'Documento adulterado',
    url: '#'
  },
  {
    id: 'DOC005',
    name: 'CNPJ',
    type: 'cnpj',
    subaccount_id: 'SUB002',
    business_name: 'Comércio Digital ME',
    document: '98.765.432/0001-10',
    status: 'approved',
    uploaded_at: '2024-01-27T10:10:00',
    validated_at: '2024-01-27T10:10:05',
    validated_by: 'HELENA_AI',
    file_type: 'pdf',
    file_size: '320 KB',
    helena_analysis: 'Documento válido. CNPJ ativo na Receita Federal. Dados conferem com o cadastro.',
    url: '#'
  },
];

const documentTypes = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'contract', label: 'Contrato Social' },
  { value: 'address', label: 'Comprovante de Endereço' },
  { value: 'id', label: 'Documento de Identidade' },
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'bank', label: 'Dados Bancários' },
  { value: 'other', label: 'Outros' },
];

export default function DocumentsRepository() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pendente', class: 'bg-amber-100 text-amber-700', icon: Clock },
      approved: { label: 'Aprovado', class: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      rejected: { label: 'Rejeitado', class: 'bg-red-100 text-red-700', icon: XCircle },
    };
    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.class} border-0 flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getFileIcon = (fileType) => {
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    return <FileText className="w-5 h-5 text-red-500" />;
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.document.includes(searchTerm) ||
                         doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{mockDocuments.length}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {mockDocuments.filter(d => d.status === 'approved').length}
              </p>
              <p className="text-xs text-slate-500">Aprovados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {mockDocuments.filter(d => d.status === 'pending').length}
              </p>
              <p className="text-xs text-slate-500">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {mockDocuments.filter(d => d.status === 'rejected').length}
              </p>
              <p className="text-xs text-slate-500">Rejeitados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por empresa, CNPJ ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Repositório de Documentos</CardTitle>
          <CardDescription>Todos os documentos enviados pelos clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800">
                  <th className="text-left py-3 px-4 font-medium">Documento</th>
                  <th className="text-left py-3 px-4 font-medium">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Upload</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Validado por</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.file_type)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.file_size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-medium">{doc.business_name}</p>
                          <p className="text-xs text-slate-500">{doc.document}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {documentTypes.find(t => t.value === doc.type)?.label || doc.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-xs">{formatDate(doc.uploaded_at)}</td>
                    <td className="py-4 px-4">{getStatusBadge(doc.status)}</td>
                    <td className="py-4 px-4">
                      {doc.validated_by ? (
                        doc.validated_by === 'HELENA_AI' ? (
                          <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Helena AI
                          </Badge>
                        ) : (
                          <span className="text-xs">{doc.validated_by.split('@')[0]}</span>
                        )
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Document Viewer Modal */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDocument && getFileIcon(selectedDocument.file_type)}
              {selectedDocument?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedDocument?.business_name} - {selectedDocument?.document}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {/* Document Preview */}
            <div className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Pré-visualização do documento</p>
            </div>

            {/* Document Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipo:</span>
                    <span>{documentTypes.find(t => t.value === selectedDocument?.type)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tamanho:</span>
                    <span>{selectedDocument?.file_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Upload:</span>
                    <span>{formatDate(selectedDocument?.uploaded_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    {selectedDocument && getStatusBadge(selectedDocument.status)}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Análise da Helena
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{selectedDocument?.helena_analysis}</p>
                  {selectedDocument?.rejection_reason && (
                    <div className="mt-2 p-2 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Motivo da rejeição: {selectedDocument.rejection_reason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedDocument?.status === 'pending' && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-red-600 border-red-300 hover:bg-red-50">
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeitar
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aprovar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}