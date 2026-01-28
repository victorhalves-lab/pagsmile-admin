import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Edit3,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function IBSettingsAccount() {
  const [copied, setCopied] = useState(false);

  const accountData = {
    razaoSocial: 'Loja ABC Comércio Ltda',
    cnpj: '98.765.432/0001-10',
    nomeFantasia: 'Loja ABC',
    email: 'financeiro@lojaabc.com.br',
    telefone: '(11) 3456-7890'
  };

  const bankData = {
    banco: 'PagSmile Instituição de Pagamento',
    ispb: '12345678',
    agencia: '0001',
    conta: '9876543-2',
    tipo: 'Conta de Pagamento',
    titular: 'Loja ABC Comércio Ltda',
    cnpj: '98.765.432/0001-10'
  };

  const handleCopyAll = () => {
    const text = `Banco: ${bankData.banco}
ISPB: ${bankData.ispb}
Agência: ${bankData.agencia}
Conta: ${bankData.conta}
Tipo: ${bankData.tipo}
Titular: ${bankData.titular}
CNPJ: ${bankData.cnpj}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={createPageUrl('IBSettings')}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dados da Conta</h1>
          <p className="text-slate-500 dark:text-slate-400">Informações cadastrais e bancárias</p>
        </div>
      </div>

      {/* Cadastral Data */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Dados Cadastrais
        </h2>
        <Card>
          <CardContent className="p-0 divide-y dark:divide-slate-700">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">Razão Social</p>
                <p className="font-medium text-slate-900 dark:text-white">{accountData.razaoSocial}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">CNPJ</p>
                <p className="font-medium text-slate-900 dark:text-white">{accountData.cnpj}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">Nome Fantasia</p>
                <p className="font-medium text-slate-900 dark:text-white">{accountData.nomeFantasia}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">E-mail</p>
                <p className="font-medium text-slate-900 dark:text-white">{accountData.email}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Edit3 className="w-4 h-4 mr-1" />
                Editar
              </Button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">Telefone</p>
                <p className="font-medium text-slate-900 dark:text-white">{accountData.telefone}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Edit3 className="w-4 h-4 mr-1" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Data */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Dados Bancários (Para receber)
        </h2>
        <p className="text-sm text-slate-500 mb-4">Compartilhe estes dados para receber transferências:</p>
        
        <Card className="bg-slate-50 dark:bg-slate-800/50">
          <CardContent className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Banco</p>
                <p className="font-medium text-slate-900 dark:text-white">{bankData.banco}</p>
              </div>
              <div>
                <p className="text-slate-500">ISPB</p>
                <p className="font-medium text-slate-900 dark:text-white">{bankData.ispb}</p>
              </div>
              <div>
                <p className="text-slate-500">Agência</p>
                <p className="font-medium text-slate-900 dark:text-white">{bankData.agencia}</p>
              </div>
              <div>
                <p className="text-slate-500">Conta</p>
                <p className="font-medium text-slate-900 dark:text-white">{bankData.conta}</p>
              </div>
              <div>
                <p className="text-slate-500">Tipo</p>
                <p className="font-medium text-slate-900 dark:text-white">{bankData.tipo}</p>
              </div>
              <div>
                <p className="text-slate-500">Titular</p>
                <p className="font-medium text-slate-900 dark:text-white">{bankData.titular}</p>
              </div>
            </div>
            <div className="pt-4 border-t dark:border-slate-700">
              <Button
                variant="outline"
                onClick={handleCopyAll}
                className={cn(
                  "w-full transition-all",
                  copied && "bg-emerald-50 border-emerald-200 text-emerald-600"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar tudo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Dica:</strong> Para receber via Pix, use suas chaves cadastradas. É mais rápido e prático!
          </p>
        </div>
      </div>
    </div>
  );
}