import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Building2, MapPin, Users, Landmark, Edit, Plus, Trash2, Search, 
    ExternalLink, Copy, Phone, Mail, Star, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

const FieldDisplay = ({ label, value, copyable, locked }) => (
    <div className="space-y-1">
        <Label className="text-slate-500 text-xs">{label}</Label>
        <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 dark:text-white">{value || '-'}</span>
            {copyable && value && (
                <button 
                    onClick={() => { navigator.clipboard.writeText(value); toast.success('Copiado!'); }}
                    className="text-slate-400 hover:text-[#2bc196]"
                >
                    <Copy className="w-3 h-3" />
                </button>
            )}
            {locked && <span className="text-slate-400">🔒</span>}
        </div>
    </div>
);

const ContactCard = ({ contact, onEdit, onDelete, isPrimary }) => (
    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
        <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
                <span className="font-medium">{contact.name}</span>
                {isPrimary && <Badge variant="outline" className="text-[#2bc196] border-[#2bc196]"><Star className="w-3 h-3 mr-1" /> Principal</Badge>}
                <Badge variant="secondary">{contact.type}</Badge>
            </div>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
            </div>
        </div>
        <p className="text-sm text-slate-500 mb-2">{contact.position}</p>
        <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{contact.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{contact.phone}</span>
        </div>
    </div>
);

const BankAccountCard = ({ account, isPrimary, onEdit, onDelete }) => (
    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
        <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
                <span className="font-medium">{account.bank_name} ({account.bank_code})</span>
                {isPrimary && <Badge variant="outline" className="text-[#2bc196] border-[#2bc196]">Principal</Badge>}
                {account.verified ? (
                    <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Verificada</Badge>
                ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pendente</Badge>
                )}
            </div>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
                <span className="text-slate-500">Agência:</span>
                <span className="ml-2 font-medium">{account.branch}</span>
            </div>
            <div>
                <span className="text-slate-500">Conta:</span>
                <span className="ml-2 font-medium">{account.account_number}</span>
            </div>
            <div>
                <span className="text-slate-500">Tipo:</span>
                <span className="ml-2 font-medium">{account.type === 'CC' ? 'Corrente' : 'Poupança'}</span>
            </div>
            {account.pix_key && (
                <div>
                    <span className="text-slate-500">PIX:</span>
                    <span className="ml-2 font-medium">{account.pix_key}</span>
                </div>
            )}
        </div>
        <p className="text-xs text-slate-500 mt-2">Titular: {account.holder_name}</p>
    </div>
);

export default function TabDadosCadastrais({ merchant }) {
    const [editMode, setEditMode] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [bankModal, setBankModal] = useState(false);

    const contacts = merchant.contacts || [
        { id: 1, name: 'João da Silva', position: 'Proprietário', email: 'joao@lojadojoao.com.br', phone: '(11) 99999-1234', type: 'Principal', is_primary: true },
        { id: 2, name: 'Maria Santos', position: 'Gerente Financeira', email: 'maria@lojadojoao.com.br', phone: '(11) 98888-5678', type: 'Financeiro', is_primary: false },
    ];

    const bankAccounts = merchant.bank_accounts || [
        { id: 1, bank_name: 'Itaú', bank_code: '341', branch: '1234', account_number: '56789-0', type: 'CC', holder_name: 'LOJA DO JOAO COMERCIO LTDA', pix_key: '12345678000190', verified: true, is_primary: true },
    ];

    const partners = merchant.partners || [
        { name: 'João da Silva', cpf: '***.456.789-**', share: '60%', role: 'Sócio Administrador', pep: false },
        { name: 'Maria da Silva', cpf: '***.789.123-**', share: '40%', role: 'Sócia', pep: false },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button variant={editMode ? 'default' : 'outline'} onClick={() => setEditMode(!editMode)}>
                    <Edit className="w-4 h-4 mr-2" /> {editMode ? 'Salvar Alterações' : 'Editar'}
                </Button>
            </div>

            {/* Company Data */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="w-5 h-5" /> Dados da Empresa
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FieldDisplay label="Razão Social" value={merchant.legal_name || merchant.business_name} />
                        <FieldDisplay label="Nome Fantasia" value={merchant.business_name} />
                        <div className="space-y-1">
                            <Label className="text-slate-500 text-xs">CNPJ</Label>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{merchant.document}</span>
                                <button onClick={() => { navigator.clipboard.writeText(merchant.document); toast.success('Copiado!'); }} className="text-slate-400 hover:text-[#2bc196]">
                                    <Copy className="w-3 h-3" />
                                </button>
                                <Button variant="outline" size="sm" className="h-6 text-xs">
                                    <Search className="w-3 h-3 mr-1" /> Consultar
                                </Button>
                                <span className="text-slate-400">🔒</span>
                            </div>
                        </div>
                        <FieldDisplay label="Inscrição Estadual" value="123.456.789.000" />
                        <FieldDisplay label="Inscrição Municipal" value="12345678" />
                        <FieldDisplay label="Data de Fundação" value="15/03/2020" />
                        <FieldDisplay label="Natureza Jurídica" value="206-2 - Sociedade Empresária Limitada" locked />
                        <FieldDisplay label="Porte" value="Pequena Empresa" />
                        <FieldDisplay label="CNAE Principal" value={`${merchant.mcc} - ${merchant.mcc_description}`} locked />
                        <FieldDisplay label="Capital Social" value="R$ 100.000,00" locked />
                        <FieldDisplay label="Regime Tributário" value="Simples Nacional" />
                    </div>
                </CardContent>
            </Card>

            {/* Address */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> Endereço
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <Label className="text-slate-500 text-xs">CEP</Label>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">01310-100</span>
                                <Button variant="outline" size="sm" className="h-6 text-xs">
                                    <Search className="w-3 h-3 mr-1" /> Buscar
                                </Button>
                            </div>
                        </div>
                        <FieldDisplay label="Logradouro" value="Avenida Paulista" />
                        <FieldDisplay label="Número" value="1000" />
                        <FieldDisplay label="Complemento" value="Sala 501, 5º andar" />
                        <FieldDisplay label="Bairro" value="Bela Vista" />
                        <FieldDisplay label="Cidade" value="São Paulo" />
                        <FieldDisplay label="Estado" value="SP" />
                        <FieldDisplay label="País" value="Brasil" />
                    </div>
                    <div className="mt-4">
                        <Button variant="outline" size="sm">
                            <MapPin className="w-4 h-4 mr-2" /> Ver no mapa
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-5 h-5" /> Contatos
                    </CardTitle>
                    <Button size="sm" onClick={() => setContactModal(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Novo Contato
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {contacts.map((contact) => (
                        <ContactCard 
                            key={contact.id} 
                            contact={contact} 
                            isPrimary={contact.is_primary}
                            onEdit={() => setContactModal(true)}
                            onDelete={() => toast.success('Contato removido')}
                        />
                    ))}
                </CardContent>
            </Card>

            {/* Bank Accounts */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Landmark className="w-5 h-5" /> Dados Bancários
                    </CardTitle>
                    <Button size="sm" onClick={() => setBankModal(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Nova Conta
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {bankAccounts.map((account) => (
                        <BankAccountCard 
                            key={account.id} 
                            account={account} 
                            isPrimary={account.is_primary}
                            onEdit={() => setBankModal(true)}
                            onDelete={() => toast.success('Conta removida')}
                        />
                    ))}
                </CardContent>
            </Card>

            {/* Partners */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        👔 Quadro Societário
                    </CardTitle>
                    <Button variant="outline" size="sm">
                        <Search className="w-4 h-4 mr-2" /> Atualizar via RFB
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 font-medium text-slate-500">Nome</th>
                                    <th className="text-left py-2 font-medium text-slate-500">CPF</th>
                                    <th className="text-left py-2 font-medium text-slate-500">Participação</th>
                                    <th className="text-left py-2 font-medium text-slate-500">Cargo</th>
                                    <th className="text-left py-2 font-medium text-slate-500">PEP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partners.map((partner, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="py-3 font-medium">{partner.name}</td>
                                        <td className="py-3 text-slate-600">{partner.cpf}</td>
                                        <td className="py-3">{partner.share}</td>
                                        <td className="py-3">{partner.role}</td>
                                        <td className="py-3">
                                            {partner.pep ? (
                                                <Badge variant="destructive">PEP</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-green-600 border-green-200">Não</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Última consulta na Receita Federal: 28/01/2026 10:00</p>
                </CardContent>
            </Card>

            {/* Contact Modal */}
            <Dialog open={contactModal} onOpenChange={setContactModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Contato</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Nome Completo *</Label>
                                <Input className="mt-1" />
                            </div>
                            <div>
                                <Label>Cargo</Label>
                                <Input className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <Label>E-mail *</Label>
                            <Input type="email" className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Celular *</Label>
                                <Input className="mt-1" placeholder="(00) 00000-0000" />
                            </div>
                            <div>
                                <Label>Telefone Fixo</Label>
                                <Input className="mt-1" placeholder="(00) 0000-0000" />
                            </div>
                        </div>
                        <div>
                            <Label>Tipo de Contato *</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="principal">Principal</SelectItem>
                                    <SelectItem value="financeiro">Financeiro</SelectItem>
                                    <SelectItem value="tecnico">Técnico</SelectItem>
                                    <SelectItem value="comercial">Comercial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setContactModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Contato adicionado!'); setContactModal(false); }}>Salvar Contato</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bank Account Modal */}
            <Dialog open={bankModal} onOpenChange={setBankModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova Conta Bancária</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Banco *</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o banco..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="001">001 - Banco do Brasil</SelectItem>
                                    <SelectItem value="033">033 - Santander</SelectItem>
                                    <SelectItem value="104">104 - Caixa</SelectItem>
                                    <SelectItem value="237">237 - Bradesco</SelectItem>
                                    <SelectItem value="341">341 - Itaú</SelectItem>
                                    <SelectItem value="260">260 - Nubank</SelectItem>
                                    <SelectItem value="077">077 - Inter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Agência *</Label>
                                <Input className="mt-1" placeholder="0000" />
                            </div>
                            <div>
                                <Label>Conta *</Label>
                                <Input className="mt-1" placeholder="00000-0" />
                            </div>
                        </div>
                        <div>
                            <Label>Tipo de Conta *</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CC">Conta Corrente</SelectItem>
                                    <SelectItem value="CP">Conta Poupança</SelectItem>
                                    <SelectItem value="PP">Conta de Pagamento</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Titular da Conta *</Label>
                            <Input className="mt-1" />
                        </div>
                        <div>
                            <Label>Chave PIX (opcional)</Label>
                            <Input className="mt-1" />
                        </div>
                        <p className="text-xs text-slate-500">⚠️ A conta será verificada antes de receber liquidações.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBankModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Conta adicionada!'); setBankModal(false); }}>Salvar e Verificar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}