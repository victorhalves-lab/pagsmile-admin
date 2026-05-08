import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Briefcase, Cloud, Sparkles } from 'lucide-react';

const TEMPLATES = [
  {
    key: 'marketplace',
    label: 'Marketplace E-commerce',
    description: 'Vendedor 90% / Plataforma 10%. Vendedor paga MDR.',
    icon: Store,
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    config: {
      name: 'Marketplace Padrão',
      description: 'Split 90/10 — vendedor recebe a maior parte',
      split_type: 'percentage',
      fee_payer: 'seller',
      chargeback_liable: 'seller',
      recipients: [
        { name: 'Vendedor', subaccount_id: '', type: 'percentage', value: 90 },
        { name: 'Plataforma', subaccount_id: '', type: 'percentage', value: 10 },
      ],
    },
  },
  {
    key: 'franchise',
    label: 'Franquia',
    description: 'Franqueado 80% / Franqueador 15% / Royalties 5%',
    icon: Briefcase,
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    config: {
      name: 'Franquia Padrão',
      split_type: 'percentage',
      fee_payer: 'proportional',
      chargeback_liable: 'seller',
      recipients: [
        { name: 'Franqueado', subaccount_id: '', type: 'percentage', value: 80 },
        { name: 'Franqueador', subaccount_id: '', type: 'percentage', value: 15 },
        { name: 'Royalties', subaccount_id: '', type: 'percentage', value: 5 },
      ],
    },
  },
  {
    key: 'saas',
    label: 'SaaS com Parceiros',
    description: 'Empresa 70% / Affiliate 25% / Sub-affiliate 5%',
    icon: Cloud,
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    config: {
      name: 'SaaS Affiliate Split',
      split_type: 'percentage',
      fee_payer: 'marketplace',
      chargeback_liable: 'marketplace',
      recipients: [
        { name: 'Empresa', subaccount_id: '', type: 'percentage', value: 70 },
        { name: 'Affiliate', subaccount_id: '', type: 'percentage', value: 25 },
        { name: 'Sub-affiliate', subaccount_id: '', type: 'percentage', value: 5 },
      ],
    },
  },
];

/**
 * Empty state com templates clicáveis para acelerar primeiro setup.
 */
export default function SplitTemplatesPicker({ onSelect }) {
  return (
    <div className="space-y-4">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex p-3 rounded-full bg-indigo-100 mb-3">
          <Sparkles className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Comece com um template</h3>
        <p className="text-sm text-slate-500 mt-1">
          Templates pré-configurados para os modelos mais comuns de marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TEMPLATES.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <Card
              key={tpl.key}
              className="cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
              onClick={() => onSelect?.(tpl.config)}
            >
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg ${tpl.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${tpl.iconText}`} />
                </div>
                <h4 className="font-semibold text-slate-800 text-sm mb-1">{tpl.label}</h4>
                <p className="text-xs text-slate-500">{tpl.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}