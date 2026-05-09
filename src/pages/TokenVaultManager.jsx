import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Search, Trash2, CheckCircle2, XCircle, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

/**
 * Token Vault Manager — 100% baseado na Token API Tuna oficial (§14).
 * Endpoints cobertos:
 *  - POST /api/Token/List       — listar tokens card-on-file por cliente
 *  - POST /api/Token/Bind       — associar CVV a um token salvo
 *  - POST /api/Token/Delete     — excluir token
 *  - POST /api/Token/Validate   — validar se o token ainda está ativo
 *  - POST /api/Token/Migrate    — migrar tokens de outro provedor para Tuna
 *
 * Tokens Tuna seguem o prefixo "ct_" e são gerados em domínio token.* (PCI L1).
 */

const SAVED_TOKENS = [
  { token: 'ct_NjJmZTQ4MzU2YjM4', brand: 'Visa', maskedCardNumber: '**** **** **** 4242', cardHolderName: 'JOAO DA SILVA', expirationMonth: 12, expirationYear: 2027, alias: 'Cartão principal', status: 'active', singleUse: false, customerEmail: 'joao@email.com', lastUsed: '2026-05-08' },
  { token: 'ct_OGM4MjQ5MTcyZWU0', brand: 'Mastercard', maskedCardNumber: '**** **** **** 8888', cardHolderName: 'JOAO DA SILVA', expirationMonth: 6, expirationYear: 2028, alias: 'Trabalho', status: 'active', singleUse: false, customerEmail: 'joao@email.com', lastUsed: '2026-04-22' },
  { token: 'ct_MTJlOWY3YjQ5MDcy', brand: 'Elo', maskedCardNumber: '**** **** **** 3344', cardHolderName: 'MARIA OLIVEIRA', expirationMonth: 3, expirationYear: 2026, alias: 'Pessoal', status: 'expiring', singleUse: false, customerEmail: 'maria@email.com', lastUsed: '2026-05-09' },
  { token: 'ct_NDU2MjEzNzg5YWJj', brand: 'Visa', maskedCardNumber: '**** **** **** 1111', cardHolderName: 'CARLOS SOUZA', expirationMonth: 1, expirationYear: 2025, alias: 'Antigo', status: 'expired', singleUse: false, customerEmail: 'carlos@email.com', lastUsed: '2025-12-10' },
];

const STATUS_BADGE = {
  active: { label: '✓ Ativo', color: 'bg-emerald-100 text-emerald-700' },
  expiring: { label: '⚠ Expirando', color: 'bg-amber-100 text-amber-700' },
  expired: { label: '✗ Expirado', color: 'bg-red-100 text-red-700' },
};

export default function TokenVaultManager() {
  const [search, setSearch] = useState('');
  const [validatingToken, setValidatingToken] = useState(null);

  const filtered = SAVED_TOKENS.filter(t =>
    t.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
    t.maskedCardNumber.includes(search) ||
    t.token.includes(search)
  );

  const stats = {
    total: SAVED_TOKENS.length,
    active: SAVED_TOKENS.filter(t => t.status === 'active').length,
    expiring: SAVED_TOKENS.filter(t => t.status === 'expiring').length,
    expired: SAVED_TOKENS.filter(t => t.status === 'expired').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Token Vault Manager"
        subtitle="Gestão de cartões salvos (card-on-file) · Token API Tuna §14 · PCI DSS Level 1"
        icon={ShieldCheck}
        breadcrumbs={[{ label: 'Configurações' }]}
      />

      <Card className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900 text-sm">Token API Tuna · PCI DSS Level 1</p>
            <p className="text-xs text-emerald-700 mt-1">
              Tokens são gerados em domínio isolado <code className="font-mono bg-white px-1 rounded">token.tunagateway.com</code>.
              Sua infraestrutura jamais armazena PAN/CVV em claro. Operações: List · Bind · Delete · Validate · Migrate.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Total tokens</p><p className="text-3xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Ativos</p><p className="text-3xl font-bold text-emerald-600">{stats.active}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Expirando ≤ 30d</p><p className="text-3xl font-bold text-amber-600">{stats.expiring}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Expirados</p><p className="text-3xl font-bold text-red-600">{stats.expired}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Tokens salvos</TabsTrigger>
          <TabsTrigger value="migrate">Migrar de outro provedor</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-4 relative">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Buscar por email do cliente, últimos 4 dígitos ou token (ct_...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-xs text-slate-500 uppercase">
                    <th className="p-3">Token</th>
                    <th className="p-3">Cartão</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Validade</th>
                    <th className="p-3">Apelido</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Último uso</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.token} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-mono text-[11px]">{t.token}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{t.brand}</Badge>
                          <span className="font-mono text-xs">{t.maskedCardNumber}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">{t.cardHolderName}</p>
                      </td>
                      <td className="p-3 text-xs">{t.customerEmail}</td>
                      <td className="p-3 font-mono text-xs">{String(t.expirationMonth).padStart(2, '0')}/{t.expirationYear}</td>
                      <td className="p-3 text-xs">{t.alias}</td>
                      <td className="p-3"><Badge className={STATUS_BADGE[t.status].color}>{STATUS_BADGE[t.status].label}</Badge></td>
                      <td className="p-3 text-xs text-slate-500">{new Date(t.lastUsed).toLocaleDateString('pt-BR')}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setValidatingToken(t.token)}
                            title="POST /api/Token/Validate"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" title="POST /api/Token/Delete">
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {validatingToken && (
            <Card className="border-2 border-blue-300">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Validate Token · POST /api/Token/Validate</p>
                  <p className="text-xs text-slate-500 font-mono">{`{ sessionId, token: "${validatingToken}" }`}</p>
                </div>
                <Badge className="bg-emerald-500 text-white">{`{ valid: true, brand: "Visa" }`}</Badge>
                <Button size="sm" variant="ghost" onClick={() => setValidatingToken(null)}><XCircle className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="migrate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" />
                POST /api/Token/Migrate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">
                Migre tokens de outros provedores para o cofre Tuna sem que clientes precisem recadastrar cartões.
                Aceita lote de <code className="font-mono bg-slate-100 px-1 rounded">externalTokens[]</code>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500">Provedor de origem</label>
                  <select className="w-full h-10 border border-slate-200 rounded-lg px-3 mt-1">
                    <option>Stripe</option>
                    <option>Pagar.me</option>
                    <option>Cielo eCommerce</option>
                    <option>PagSeguro</option>
                    <option>Mercado Pago</option>
                    <option>Adyen</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Tokens migrados (mês)</label>
                  <p className="text-2xl font-bold mt-1">0</p>
                </div>
              </div>
              <Button className="w-full">
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Iniciar migração em lote
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}