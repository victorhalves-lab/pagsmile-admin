import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Upload, Download, CreditCard, User, Mail, Globe, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const blacklistCards = [
    { value: '411111******', reason: 'Fraude confirmada', addedDate: '28/01/2026', addedBy: 'João Silva' },
    { value: '543210******', reason: 'Múltiplos CBs', addedDate: '27/01/2026', addedBy: 'Maria Santos' },
    { value: '401200******', reason: 'Teste de cartão', addedDate: '25/01/2026', addedBy: 'Sistema' },
];

const blacklistCPFs = [
    { value: '123.456.789-00', reason: 'Fraude confirmada', addedDate: '28/01/2026', addedBy: 'João Silva' },
    { value: '987.654.321-00', reason: 'Chargeback', addedDate: '26/01/2026', addedBy: 'Ana Paula' },
];

export default function AdminIntControlLists() {
    const [tab, setTab] = useState('blacklist');
    const [listType, setListType] = useState('cards');
    const [addModal, setAddModal] = useState(false);

    const stats = {
        cards: 234,
        cpfs: 156,
        emails: 89,
        ips: 45,
        devices: 67,
        total: 591,
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Listas de Controle"
                breadcrumbs={[{ label: 'Risco e Compliance' }, { label: 'Listas' }]}
            />

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="blacklist">Blacklists</TabsTrigger>
                    <TabsTrigger value="whitelist">Whitelists</TabsTrigger>
                </TabsList>

                <TabsContent value="blacklist" className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-6 gap-4">
                        <div className="p-3 bg-white border rounded-lg text-center">
                            <p className="text-2xl font-bold">{stats.cards}</p>
                            <p className="text-xs text-slate-500">Cartões</p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg text-center">
                            <p className="text-2xl font-bold">{stats.cpfs}</p>
                            <p className="text-xs text-slate-500">CPFs</p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg text-center">
                            <p className="text-2xl font-bold">{stats.emails}</p>
                            <p className="text-xs text-slate-500">E-mails</p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg text-center">
                            <p className="text-2xl font-bold">{stats.ips}</p>
                            <p className="text-xs text-slate-500">IPs</p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg text-center">
                            <p className="text-2xl font-bold">{stats.devices}</p>
                            <p className="text-xs text-slate-500">Devices</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                            <p className="text-xs text-slate-500">Total</p>
                        </div>
                    </div>

                    {/* Card Blacklist */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Blacklist de Cartões
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setAddModal(true)}>
                                    <Plus className="w-4 h-4 mr-1" /> Adicionar
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Upload className="w-4 h-4 mr-1" /> Importar
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <Input placeholder="🔍 Buscar cartão..." />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">Cartão</th>
                                            <th className="text-left py-2 px-3">Motivo</th>
                                            <th className="text-left py-2 px-3">Adicionado</th>
                                            <th className="text-left py-2 px-3">Por</th>
                                            <th className="text-center py-2 px-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blacklistCards.map((item, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3 font-mono">{item.value}</td>
                                                <td className="py-3 px-3">{item.reason}</td>
                                                <td className="py-3 px-3">{item.addedDate}</td>
                                                <td className="py-3 px-3">{item.addedBy}</td>
                                                <td className="py-3 px-3 text-center">
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success('Item removido!')}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-slate-500 text-center mt-4">Mostrando 1-50 de 234</p>
                        </CardContent>
                    </Card>

                    {/* CPF Blacklist */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="w-5 h-5" /> Blacklist de CPFs
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setAddModal(true)}>
                                    <Plus className="w-4 h-4 mr-1" /> Adicionar
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Upload className="w-4 h-4 mr-1" /> Importar
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <Input placeholder="🔍 Buscar CPF..." />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">CPF</th>
                                            <th className="text-left py-2 px-3">Motivo</th>
                                            <th className="text-left py-2 px-3">Adicionado</th>
                                            <th className="text-left py-2 px-3">Por</th>
                                            <th className="text-center py-2 px-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blacklistCPFs.map((item, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3 font-mono">{item.value}</td>
                                                <td className="py-3 px-3">{item.reason}</td>
                                                <td className="py-3 px-3">{item.addedDate}</td>
                                                <td className="py-3 px-3">{item.addedBy}</td>
                                                <td className="py-3 px-3 text-center">
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success('Item removido!')}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="whitelist">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">Whitelists em desenvolvimento</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add to Blacklist Modal */}
            <Dialog open={addModal} onOpenChange={setAddModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar à Blacklist</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Tipo</Label>
                            <Select defaultValue="card">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="card">Cartão</SelectItem>
                                    <SelectItem value="cpf">CPF</SelectItem>
                                    <SelectItem value="email">E-mail</SelectItem>
                                    <SelectItem value="ip">IP</SelectItem>
                                    <SelectItem value="device">Device</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Valor *</Label>
                            <Input className="mt-1" placeholder="Ex: 411111 (BIN) ou número completo" />
                        </div>
                        <div>
                            <Label>Motivo *</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fraud">Fraude confirmada</SelectItem>
                                    <SelectItem value="chargeback">Chargeback</SelectItem>
                                    <SelectItem value="test">Teste de cartão</SelectItem>
                                    <SelectItem value="suspicious">Atividade suspeita</SelectItem>
                                    <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Observações</Label>
                            <Textarea className="mt-1" placeholder="Detalhes adicionais..." />
                        </div>
                        <div>
                            <Label>Validade</Label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="validity" value="permanent" defaultChecked />
                                    Permanente
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="validity" value="temp" />
                                    Temporária:
                                    <Input type="number" className="w-16" defaultValue="30" /> dias
                                </label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Item adicionado à blacklist!'); setAddModal(false); }}>
                            ➕ Adicionar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}