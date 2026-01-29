import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, Plus, Trash2, Save, Eye, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

const dataSources = [
    { value: 'transactions', label: 'Transações' },
    { value: 'merchants', label: 'Merchants' },
    { value: 'chargebacks', label: 'Chargebacks' },
    { value: 'meds', label: 'MEDs' },
    { value: 'settlements', label: 'Liquidações' },
    { value: 'withdrawals', label: 'Saques' },
];

const fieldsBySource = {
    transactions: [
        { key: 'transaction_id', label: 'ID da transação' },
        { key: 'created_at', label: 'Data da transação' },
        { key: 'merchant_name', label: 'Merchant' },
        { key: 'merchant_id', label: 'Merchant ID' },
        { key: 'amount', label: 'Valor' },
        { key: 'status', label: 'Status' },
        { key: 'method', label: 'Método de pagamento' },
        { key: 'card_brand', label: 'Bandeira' },
        { key: 'installments', label: 'Parcelas' },
        { key: 'nsu', label: 'NSU' },
        { key: 'customer_name', label: 'Cliente' },
        { key: 'customer_document', label: 'CPF' },
        { key: 'mdr_amount', label: 'Taxa MDR' },
        { key: 'net_amount', label: 'Valor líquido' },
    ],
    merchants: [
        { key: 'merchant_id', label: 'ID' },
        { key: 'business_name', label: 'Nome' },
        { key: 'document', label: 'CNPJ' },
        { key: 'status', label: 'Status' },
        { key: 'mdr_card', label: 'MDR Cartão' },
        { key: 'mdr_pix', label: 'MDR PIX' },
        { key: 'balance_available', label: 'Saldo disponível' },
        { key: 'total_tpv', label: 'TPV Total' },
        { key: 'cb_ratio', label: 'CB Ratio' },
    ],
    chargebacks: [
        { key: 'dispute_id', label: 'ID' },
        { key: 'opened_date', label: 'Data' },
        { key: 'amount', label: 'Valor' },
        { key: 'reason_code', label: 'Motivo' },
        { key: 'status', label: 'Status' },
        { key: 'merchant_name', label: 'Merchant' },
        { key: 'card_brand', label: 'Bandeira' },
    ],
};

const operators = [
    { value: 'equals', label: 'igual a' },
    { value: 'not_equals', label: 'diferente de' },
    { value: 'greater', label: 'maior que' },
    { value: 'less', label: 'menor que' },
    { value: 'between', label: 'entre' },
    { value: 'contains', label: 'contém' },
    { value: 'in', label: 'em' },
];

export default function AdminIntReportsCustom() {
    const [reportName, setReportName] = useState('');
    const [dataSource, setDataSource] = useState('transactions');
    const [selectedFields, setSelectedFields] = useState(['created_at', 'merchant_name', 'amount', 'status', 'method']);
    const [filters, setFilters] = useState([{ field: 'created_at', operator: 'between', value: '', value2: '' }]);
    const [groupBy, setGroupBy] = useState('');
    const [orderBy, setOrderBy] = useState('created_at');
    const [orderDir, setOrderDir] = useState('desc');

    const availableFields = fieldsBySource[dataSource] || [];

    const toggleField = (fieldKey) => {
        if (selectedFields.includes(fieldKey)) {
            setSelectedFields(selectedFields.filter(f => f !== fieldKey));
        } else {
            setSelectedFields([...selectedFields, fieldKey]);
        }
    };

    const addFilter = () => {
        setFilters([...filters, { field: '', operator: 'equals', value: '' }]);
    };

    const removeFilter = (idx) => {
        setFilters(filters.filter((_, i) => i !== idx));
    };

    const updateFilter = (idx, key, value) => {
        const newFilters = [...filters];
        newFilters[idx][key] = value;
        setFilters(newFilters);
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Construtor de Relatórios"
                breadcrumbs={[{ label: 'Relatórios' }, { label: 'Customizados' }]}
                actionElement={
                    <Button onClick={() => toast.success('Relatório salvo!')}>
                        <Save className="w-4 h-4 mr-2" /> Salvar
                    </Button>
                }
            />

            <div>
                <Label>Nome do relatório</Label>
                <Input 
                    className="mt-1 max-w-md" 
                    placeholder="Ex: Transações aprovadas por merchant"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Data Source & Fields */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">📂 Fonte de Dados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Fonte</Label>
                            <Select value={dataSource} onValueChange={setDataSource}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {dataSources.map(ds => (
                                        <SelectItem key={ds.value} value={ds.value}>{ds.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Campos disponíveis</Label>
                            <div className="mt-2 border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                                {availableFields.map(field => (
                                    <label key={field.key} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                                        <Checkbox 
                                            checked={selectedFields.includes(field.key)}
                                            onCheckedChange={() => toggleField(field.key)}
                                        />
                                        {field.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Fields */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">📋 Campos Selecionados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500 mb-3">Arraste os campos para ordenar</p>
                        <div className="border rounded-lg divide-y">
                            {selectedFields.map((fieldKey, idx) => {
                                const field = availableFields.find(f => f.key === fieldKey);
                                return (
                                    <div key={fieldKey} className="flex items-center gap-3 p-3 hover:bg-slate-50">
                                        <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                                        <span className="flex-1">{idx + 1}. {field?.label || fieldKey}</span>
                                        <Button variant="ghost" size="sm" onClick={() => toggleField(fieldKey)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                        {selectedFields.length === 0 && (
                            <p className="text-center text-slate-400 py-8">Selecione campos à esquerda</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">🔍 Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {filters.map((filter, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Select value={filter.field} onValueChange={(v) => updateFilter(idx, 'field', v)}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Campo..." /></SelectTrigger>
                                <SelectContent>
                                    {availableFields.map(f => (
                                        <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filter.operator} onValueChange={(v) => updateFilter(idx, 'operator', v)}>
                                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {operators.map(op => (
                                        <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                className="flex-1" 
                                placeholder="Valor..."
                                value={filter.value}
                                onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                            />
                            {filter.operator === 'between' && (
                                <>
                                    <span className="text-slate-500">e</span>
                                    <Input 
                                        className="flex-1" 
                                        placeholder="Valor 2..."
                                        value={filter.value2}
                                        onChange={(e) => updateFilter(idx, 'value2', e.target.value)}
                                    />
                                </>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => removeFilter(idx)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={addFilter}>
                        <Plus className="w-4 h-4 mr-2" /> Adicionar filtro
                    </Button>
                </CardContent>
            </Card>

            {/* Grouping & Ordering */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📊 Agrupamento e Ordenação</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Agrupar por</Label>
                            <Select value={groupBy} onValueChange={setGroupBy}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Nenhum" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={null}>Nenhum</SelectItem>
                                    {availableFields.map(f => (
                                        <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Label>Ordenar por</Label>
                                <Select value={orderBy} onValueChange={setOrderBy}>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {availableFields.map(f => (
                                            <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-40">
                                <Label>Direção</Label>
                                <Select value={orderDir} onValueChange={setOrderDir}>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asc">Crescente</SelectItem>
                                        <SelectItem value="desc">Decrescente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox /> Incluir totais
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox /> Incluir subtotais por grupo
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => toast.info('Preview seria exibido aqui')}>
                    <Eye className="w-4 h-4 mr-2" /> Pré-visualizar
                </Button>
                <Button onClick={() => toast.success('Relatório gerado com sucesso!')}>
                    <FileText className="w-4 h-4 mr-2" /> Gerar Relatório
                </Button>
            </div>
        </div>
    );
}