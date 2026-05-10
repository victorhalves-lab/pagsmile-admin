import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, CheckCircle2, ShieldCheck, Edit2 } from 'lucide-react';
import CustomerQuickSearch from '../customer/CustomerQuickSearch';
import CustomerNewForm from '../customer/CustomerNewForm';

export default function StepCustomerIdentification({ sale, updateSale, onNext }) {
  const [mode, setMode] = useState('search'); // search | new | confirmed
  const [consent, setConsent] = useState(false);

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
          <User className="w-4 h-4 text-[#2bc196]" /> Etapa 1 · Identificação do Cliente
        </CardTitle>
        <p className="text-xs text-slate-500">Pergunte ao cliente CPF/CNPJ ou telefone para localizar o cadastro.</p>
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

            <div className="border-2 border-amber-200 bg-amber-50 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900 text-sm">Consentimento LGPD + MOTO</div>
                  <p className="text-xs text-amber-800 mt-1">
                    Leia ao cliente: "Esta ligação está sendo gravada. O senhor(a) autoriza o uso dos dados e a cobrança nos meios de pagamento informados?"
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={consent} onCheckedChange={setConsent} />
                <span className="text-sm font-medium text-amber-900">Cliente confirmou consentimento verbalmente</span>
              </label>
            </div>

            <Button
              onClick={() => { updateSale({ consent_recorded: true }); onNext(); }}
              disabled={!consent}
              className="w-full bg-[#2bc196] hover:bg-[#25a880]"
            >
              Prosseguir para itens da venda →
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}