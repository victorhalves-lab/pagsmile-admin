import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function TabSplit({ merchant }) {
    const [sellerModal, setSellerModal] = useState(false);
    const [editSeller, setEditSeller] = useState(null);

    const stats = { activeSellers: 12, tpvSplit: 450000, commission: 22500, commissionRate: 5 };

    const sellers = [
        { id: 'SELLER-001', name: 'Loja do Pedro', commission: 5, status: 'active' },
        { id: 'SELLER-002', name: 'Maria Artesanatos', commission: 5, status: 'active' },
        { id: 'SELLER-003', name: 'Tech Store LTDA', commission: 3, status: 'active' },
        { id: 'SELLER-004', name: 'Moda Fashion', commission: 5, status: 'paused' },
    ];

    const splitTransactions = [
        { id: 'TXN-98765', seller: 'Loja do Pedro', total: 100, sellerAmount: 95, marketplaceAmount: 5, status: 'split' },
        { id: 'TXN-98764', seller: 'Maria Artesanatos', total: 250, sellerAmount: 237.50, marketplaceAmount: 12.50, status: 'split' },
        { id: 'TXN-98763', seller: 'Tech Store LTDA', total: 500, sellerAmount: 485, marketplaceAmount: 15, status: 'split' },
    ];

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Sellers Ativos</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.activeSellers}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">TPV Split (mês)</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(stats.tpvSplit)}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Comissão Recebida</p>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.commission)}</p>
                    <p className="text-xs text-slate-500">({stats.commissionRate}%)</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Status</p>
                    <Badge className="bg-green-100 text-green-700 border-0 text-base">✅ Ativo</Badge>
                </div>
            </div>

            {/* Config */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        ⚙️ Configuração de Split
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Modelo de Split</Label>
                            <Select defaultValue="percentage">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Percentual fixo</SelectItem>
                                    <SelectItem value="variable">Variável por seller</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Comissão do Marketplace</Label>
                            <Input className="mt-1" value="5,00 %" disabled />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Label>Split automático:</Label>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2"><input type="radio" name="auto" defaultChecked /> Sim</div>
                            <div className="flex items-center gap-2"><input type="radio" name="auto" /> Não</div>
                        </div>
                    </div>
                    <div>
                        <Label>Liquidação dos sellers</Label>
                        <Input className="mt-1" value="D+30 (mesmo do marketplace)" disabled />
                    </div>
                    <Button variant="outline"><Edit className="w-4 h-4 mr-2" /> Editar Configuração</Button>
                </CardContent>
            </Card>

            {/* Sellers */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">👥 Sellers Vinculados</CardTitle>
                    <Button onClick={() => { setEditSeller(null); setSellerModal(true); }}>
                        <Plus className="w-4 h-4 mr-2" /> Adicionar Seller
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Nome/Razão Social</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Comissão</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.map(seller => (
                                    <tr key={seller.id} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3 font-mono text-xs">{seller.id}</td>
                                        <td className="py-3 px-3 font-medium">{seller.name}</td>
                                        <td className="py-3 px-3 text-center">{seller.commission}%</td>
                                        <td className="py-3 px-3">
                                            {seller.status === 'active' ? (
                                                <Badge className="bg-green-100 text-green-700 border-0">✅ Ativo</Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-700 border-0">⏸️ Pausado</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => { setEditSeller(seller); setSellerModal(true); }}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success('Seller removido!')}>
                                                    <Trash2 className="w-4 h-4" />
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

            {/* Split Transactions */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">📋 Transações com Split (Recentes)</CardTitle>
                    <Button variant="outline" size="sm">Ver todas</Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Seller</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor Total</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Seller Recebe</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Marketplace</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {splitTransactions.map(tx => (
                                    <tr key={tx.id} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3 font-mono text-xs">{tx.id}</td>
                                        <td className="py-3 px-3">{tx.seller}</td>
                                        <td className="py-3 px-3 text-right font-medium">{formatCurrency(tx.total)}</td>
                                        <td className="py-3 px-3 text-right text-green-600 font-medium">{formatCurrency(tx.sellerAmount)}</td>
                                        <td className="py-3 px-3 text-right text-purple-600 font-medium">{formatCurrency(tx.marketplaceAmount)}</td>
                                        <td className="py-3 px-3">
                                            <Badge className="bg-green-100 text-green-700 border-0">✅ Split</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Seller Modal */}
            <Dialog open={sellerModal} onOpenChange={setSellerModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editSeller ? 'Editar Seller' : 'Adicionar Seller'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nome/Razão Social *</Label>
                            <Input className="mt-1" defaultValue={editSeller?.name} />
                        </div>
                        <div>
                            <Label>Comissão (%) *</Label>
                            <Input type="number" className="mt-1" defaultValue={editSeller?.commission || 5} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSellerModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Seller salvo!'); setSellerModal(false); }}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}