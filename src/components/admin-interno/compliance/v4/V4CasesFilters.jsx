import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export default function V4CasesFilters({
  searchTerm, onSearchChange,
  tipoFilter, onTipoChange,
  origemFilter, onOrigemChange,
  modeloFilter, onModeloChange,
  merchantPaiFilter, onMerchantPaiChange,
  merchantPais = [],
  onClear,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por caso, empresa, CNPJ, CPF..."
          className="pl-9 w-64"
        />
      </div>

      <Select value={tipoFilter} onValueChange={onTipoChange}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="merchant">Merchants</SelectItem>
          <SelectItem value="subseller_pj">Subsellers PJ</SelectItem>
          <SelectItem value="subseller_pf">Subsellers PF</SelectItem>
        </SelectContent>
      </Select>

      <Select value={origemFilter} onValueChange={onOrigemChange}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Origem" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as origens</SelectItem>
          <SelectItem value="self_admin_sub">Self (Admin Sub)</SelectItem>
          <SelectItem value="link_subseller_account">Link Conta Subseller</SelectItem>
          <SelectItem value="link_compliance_subseller">Link Compliance</SelectItem>
          <SelectItem value="link_doc_only">Doc-Only</SelectItem>
          <SelectItem value="link_caf_only">Só CAF</SelectItem>
          <SelectItem value="link_caf_docs">CAF + Docs</SelectItem>
          <SelectItem value="api_subseller">API Subseller</SelectItem>
          <SelectItem value="api_merchant">API Merchant</SelectItem>
        </SelectContent>
      </Select>

      <Select value={modeloFilter} onValueChange={onModeloChange}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Modelo V4" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os modelos</SelectItem>
          <SelectItem value="v4_card">V4 Cartão</SelectItem>
          <SelectItem value="v4_pix_merchant">V4 PIX Merchant</SelectItem>
          <SelectItem value="v4_pix_intermediario">V4 PIX Intermediário</SelectItem>
          <SelectItem value="v4_pix_api_enterprise">V4 PIX API Enterprise</SelectItem>
          <SelectItem value="v4_subseller_pj">V4 Subseller PJ</SelectItem>
          <SelectItem value="v4_subseller_pf">V4 Subseller PF</SelectItem>
        </SelectContent>
      </Select>

      {merchantPais.length > 0 && (
        <Select value={merchantPaiFilter} onValueChange={onMerchantPaiChange}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Merchant Pai" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os merchants</SelectItem>
            {merchantPais.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="w-3 h-3 mr-1" /> Limpar
        </Button>
      )}
    </div>
  );
}