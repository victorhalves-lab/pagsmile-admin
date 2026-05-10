import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, CheckCircle2, Edit2 } from 'lucide-react';
import CustomerQuickSearch from '../customer/CustomerQuickSearch';
import CustomerNewForm from '../customer/CustomerNewForm';

export default function StepCustomerIdentification({ sale, updateSale, onNext }) {
  const [mode, setMode] = useState(sale.customer ? 'confirmed' : 'search');

  const handleFound = (customer) => {
    updateSale({ customer });
    setMode('confirmed');
  };

  const handleCreated = (customer) => {
    updateSale({ customer: { ...customer, isNew: true } });
    setMode('confirmed');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="w-4 h-4 text-[#2bc196]" /> Etapa 1 · Dados do Cliente
        </CardTitle>
        <p className="text-xs text-slate-500">Busque o cliente por CPF/CNPJ, telefone, nome ou e-mail. Se for novo, cadastre na hora.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === 'search' && <CustomerQuickSearch onFound={handleFound} onCreateNew={() => setMode('new')} />}
        {mode === 'new' && <CustomerNewForm onSubmit={handleCreated} onBack={() => setMode('search')} />}

        {mode === 'confirmed' && sale.customer && (
          <>
            <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-emerald-900">{sale.customer.name}</div>
                <div className="text-xs text-emerald-700 mt-0.5 flex flex-wrap gap-x-3">
                  <span>📄 {sale.customer.document}</span>
                  <span>📞 {sale.customer.phone}</span>
                  {sale.customer.email && <span>✉️ {sale.customer.email}</span>}
                </div>
                {sale.customer.isNew && <span className="text-[10px] uppercase text-emerald-800 font-bold">Novo cadastro</span>}
              </div>
              <Button size="sm" variant="ghost" onClick={() => { updateSale({ customer: null }); setMode('search'); }}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <Button onClick={onNext} className="w-full bg-[#2bc196] hover:bg-[#25a880]">
              Prosseguir para itens da venda →
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}