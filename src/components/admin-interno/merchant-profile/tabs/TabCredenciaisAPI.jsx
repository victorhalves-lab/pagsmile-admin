import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Copy, Eye, EyeOff, RefreshCw, Ban, Trash2, Plus, Key, 
    Lock, Unlock, Activity, TrendingUp, FileText, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function TabCredenciaisAPI({ merchant }) {
    const [showProdSecret, setShowProdSecret] = useState(false);
    const [showTestSecret, setShowTestSecret] = useState(false);
    const [revealModal, setRevealModal] = useState(false);
    const [regenerateModal, setRegenerateModal] = useState(false);
    const [password, setPassword] = useState('');

    const [ips, setIps] = useState(['187.45.123.100', '200.178.56.200', '10.0.0.0/24']);
    const [domains, setDomains] = useState(['www.lojadojoao.com.br', 'checkout.lojadojoao.com.br', 'lojadojoao.com.br']);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado!`);
    };

    const handleReveal = () => {
        if (password === 'admin123') {
            setShowProdSecret(true);
            setRevealModal(false);
            toast.success('Secret Key revelada');
            setTimeout(() => setShowProdSecret(false), 30000);
        } else {
            toast.error('Senha incorreta');
        }
    };

    const credHistory = [
        { date: '28/01/2026 14:30', action: 'Secret Key revelada', user: 'Carlos Silva' },
        { date: '15/01/2026 09:15', action: 'IP adicionado à whitelist: 10.0.0.0/24', user: 'Maria' },
        { date: '01/12/2025 11:00', action: 'API Key regenerada', user: 'João Santos' },
        { date: '15/03/2024 10:30', action: 'Credenciais criadas', user: 'Sistema - Onboarding' },
    ];

    return (
        <div className="space-y-6">
            {/* Production Credentials */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Key className="w-5 h-5" /> Credenciais de Produção
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-slate-500 text-xs">Merchant ID</Label>
                        <div className="flex gap-2 mt-1">
                            <Input value={merchant.id || '12345'} disabled className="flex-1 font-mono" />
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(merchant.id, 'Merchant ID')}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label className="text-slate-500 text-xs">API Key (Pública)</Label>
                        <div className="flex gap-2 mt-1">
                            <Input value="pk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0" disabled className="flex-1 font-mono text-xs" />
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard('pk_live...', 'API Key')}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label className="text-slate-500 text-xs">Secret Key (Privada)</Label>
                        <div className="flex gap-2 mt-1">
                            <Input 
                                value={showProdSecret ? 'sk_live_s3cr3tk3yv4lu3h3r3f0rpr0duct10n123456' : 'sk_live_••••••••••••••••••••••••••••••••'} 
                                disabled 
                                className="flex-1 font-mono text-xs" 
                                type={showProdSecret ? 'text' : 'password'}
                            />
                            <Button variant="outline" size="sm" onClick={() => setRevealModal(true)}>
                                {showProdSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard('sk_live...', 'Secret Key')}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-amber-600 mt-1">⚠️ Nunca compartilhe a Secret Key. Ela dá acesso total à conta.</p>
                    </div>
                    <Separator />
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div><span className="text-slate-500">Criada em:</span> <span className="font-medium">15/03/2024 10:30</span></div>
                        <div><span className="text-slate-500">Último uso:</span> <span className="font-medium">28/01/2026 14:30</span></div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setRegenerateModal(true)}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Regenerar API Key
                        </Button>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <Ban className="w-4 h-4 mr-2" /> Revogar Acesso
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Sandbox Credentials */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        🧪 Credenciais de Sandbox (Teste)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-slate-500 text-xs">Merchant ID (Sandbox)</Label>
                        <div className="flex gap-2 mt-1">
                            <Input value={`sandbox_${merchant.id || '12345'}`} disabled className="flex-1 font-mono" />
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard('sandbox_12345', 'Merchant ID')}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label className="text-slate-500 text-xs">API Key (Sandbox)</Label>
                        <div className="flex gap-2 mt-1">
                            <Input value="pk_test_x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0" disabled className="flex-1 font-mono text-xs" />
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard('pk_test...', 'API Key')}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label className="text-slate-500 text-xs">Secret Key (Sandbox)</Label>
                        <div className="flex gap-2 mt-1">
                            <Input 
                                value={showTestSecret ? 'sk_test_s4ndb0xs3cr3tk3yf0rt3st1ngpur0s3s123' : 'sk_test_••••••••••••••••••••••••••••••••'} 
                                disabled 
                                className="flex-1 font-mono text-xs" 
                                type={showTestSecret ? 'text' : 'password'}
                            />
                            <Button variant="outline" size="sm" onClick={() => setShowTestSecret(!showTestSecret)}>
                                {showTestSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard('sk_test...', 'Secret Key')}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" /> Regenerar Credenciais Sandbox
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Integration Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        🌐 Configurações de Integração
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Versão da API</Label>
                            <Input value="v2.1 (Recomendada)" disabled className="mt-1" />
                        </div>
                        <div>
                            <Label>Ambiente ativo</Label>
                            <div className="flex gap-4 mt-2">
                                <Badge variant="default">● Produção</Badge>
                                <Badge variant="outline">○ Sandbox</Badge>
                            </div>
                        </div>
                        <div>
                            <Label>Autenticação</Label>
                            <div className="flex gap-4 mt-2">
                                <Badge variant="default">● API Key</Badge>
                                <Badge variant="outline">○ OAuth 2.0</Badge>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Label>IPs Permitidos (Whitelist)</Label>
                            <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Adicionar IP</Button>
                        </div>
                        <div className="space-y-2">
                            {ips.map((ip, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 border border-slate-200 dark:border-slate-700 rounded">
                                    <span className="font-mono text-sm">{ip}</span>
                                    <Button variant="ghost" size="sm" onClick={() => setIps(ips.filter((_, i) => i !== idx))}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <Checkbox id="whitelist-active" />
                            <Label htmlFor="whitelist-active" className="text-sm">Restringir acesso apenas aos IPs listados (whitelist ativa)</Label>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Label>Domínios Autorizados (checkout transparente)</Label>
                            <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Adicionar Domínio</Button>
                        </div>
                        <div className="space-y-2">
                            {domains.map((domain, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 border border-slate-200 dark:border-slate-700 rounded">
                                    <span className="text-sm">{domain}</span>
                                    <Button variant="ghost" size="sm" onClick={() => setDomains(domains.filter((_, i) => i !== idx))}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* API Usage Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        📊 Estatísticas de Uso da API
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3">Últimas 24 horas</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                                <p className="text-sm text-slate-500 mb-1">Total de chamadas</p>
                                <p className="text-2xl font-bold">12.456</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                                <p className="text-sm text-slate-500 mb-1">Chamadas com erro</p>
                                <p className="text-2xl font-bold text-red-600">34</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                                <p className="text-sm text-slate-500 mb-1">Taxa de sucesso</p>
                                <p className="text-2xl font-bold text-green-600">99,73%</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Últimos 7 dias</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                                <p className="text-sm text-slate-500 mb-1">Total de chamadas</p>
                                <p className="text-2xl font-bold">87.234</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                                <p className="text-sm text-slate-500 mb-1">Chamadas com erro</p>
                                <p className="text-2xl font-bold text-red-600">189</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                                <p className="text-sm text-slate-500 mb-1">Taxa de sucesso</p>
                                <p className="text-2xl font-bold text-green-600">99,78%</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Activity className="w-4 h-4 mr-1" /> Ver detalhes de uso</Button>
                        <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-1" /> Exportar logs</Button>
                    </div>
                </CardContent>
            </Card>

            {/* History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        🕐 Histórico de Ações de Credenciais
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {credHistory.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <div className="text-xs text-slate-500 whitespace-nowrap">{item.date}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.action}</p>
                                    <p className="text-xs text-slate-500">Admin: {item.user}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="link" size="sm" className="mt-3">Ver histórico completo</Button>
                </CardContent>
            </Card>

            {/* Reveal Modal */}
            <Dialog open={revealModal} onOpenChange={setRevealModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            Revelar Secret Key
                        </DialogTitle>
                        <DialogDescription>
                            Você está prestes a revelar a Secret Key de PRODUÇÃO do merchant.
                            Esta ação será registrada em auditoria.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Para confirmar, digite sua senha:</Label>
                            <Input 
                                type="password" 
                                className="mt-1" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRevealModal(false)}>Cancelar</Button>
                        <Button onClick={handleReveal}>Revelar Secret Key</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Regenerate Modal */}
            <Dialog open={regenerateModal} onOpenChange={setRegenerateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            Regenerar API Key
                        </DialogTitle>
                        <DialogDescription>
                            ⚠️ Esta ação irá invalidar as chaves antigas IMEDIATAMENTE.
                            O merchant precisará atualizar suas integrações com as novas credenciais.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                            O merchant será notificado por e-mail sobre a regeneração.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRegenerateModal(false)}>Cancelar</Button>
                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => { toast.success('API Key regenerada!'); setRegenerateModal(false); }}>
                            Confirmar Regeneração
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}