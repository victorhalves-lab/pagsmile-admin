import React from 'react';
import { CreditCard, Landmark, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function BankCard({ account, isPrimary }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-sm">{account.bank_name || 'Banco'}</span>
          {account.bank_code && <span className="text-xs text-gray-400">({account.bank_code})</span>}
        </div>
        {isPrimary && <Badge className="bg-blue-100 text-blue-700 text-[10px]">Principal</Badge>}
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-gray-400">Tipo de Conta</p>
          <p className="font-medium">{account.account_type === 'checking' ? 'Corrente' : account.account_type === 'savings' ? 'Poupança' : account.account_type || '-'}</p>
        </div>
        <div>
          <p className="text-gray-400">Agência</p>
          <p className="font-medium">{account.agency || '-'}</p>
        </div>
        <div>
          <p className="text-gray-400">Conta</p>
          <p className="font-medium">{account.account_number || '-'}</p>
        </div>
        <div>
          <p className="text-gray-400">Titular</p>
          <p className="font-medium">{account.holder_name || '-'}</p>
        </div>
      </div>
      {(account.pix_key || account.pix_key_type) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-gray-400">Chave PIX</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-400">Tipo</p>
              <p className="font-medium">{account.pix_key_type || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400">Chave</p>
              <p className="font-medium break-all">{account.pix_key || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TabBancario({ subaccount }) {
  const bankAccounts = subaccount.bank_accounts || [];
  const primaryAccount = subaccount.bank_account || {};
  const hasPrimary = primaryAccount.bank_name || primaryAccount.agency || primaryAccount.account_number;

  if (!hasPrimary && bankAccounts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <Landmark className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Nenhuma conta bancária cadastrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {hasPrimary && <BankCard account={primaryAccount} isPrimary />}
      {bankAccounts.map((ba, i) => (
        <BankCard key={i} account={ba} isPrimary={i === 0 && !hasPrimary} />
      ))}
    </div>
  );
}