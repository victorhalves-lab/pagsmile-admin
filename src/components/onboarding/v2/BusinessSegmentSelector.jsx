import React from 'react';
import { cn } from '@/lib/utils';
import {
  Globe, Store, Layers, Truck, GraduationCap, Repeat,
  Briefcase, Link2, Building2,
} from 'lucide-react';

/**
 * 9 segmentos de negócio oficiais do PagSmile (família Cartão).
 * Todos os planos incluem Cartão + PIX + conta bancária.
 * Baseado na documentação oficial KYC/KYB v4.0 — Seção 2.1.
 *
 * O segmento escolhido determina:
 *  - Qual modelo de questionário de compliance (Gateway/Marketplace/E-commerce/etc)
 *  - Score base do V4 (Risk Scoring)
 *  - Documentos adicionais condicionais
 *  - Datasets BDC consultados (FULL=39, STANDARD=33, LITE=23)
 */
export const BUSINESS_SEGMENTS = [
  {
    id: 'gateway',
    label: 'Gateway / PSP',
    description: 'Processamento de pagamentos para terceiros',
    icon: Globe,
    riskTier: 'FULL',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    description: 'Plataforma com múltiplos sellers',
    icon: Store,
    riskTier: 'FULL',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'plataforma_vertical',
    label: 'Plataforma Vertical',
    description: 'Saúde, educação, foodtech, mobilidade…',
    icon: Layers,
    riskTier: 'FULL',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'dropshipping',
    label: 'Dropshipping',
    description: 'Venda sem estoque, envio do fornecedor',
    icon: Truck,
    riskTier: 'STANDARD',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'infoprodutos',
    label: 'Infoprodutos',
    description: 'Cursos, e-books, mentorias',
    icon: GraduationCap,
    riskTier: 'STANDARD',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    description: 'Loja virtual com estoque próprio',
    icon: Briefcase,
    riskTier: 'STANDARD',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'saas',
    label: 'SaaS / Recorrência',
    description: 'Software com cobrança recorrente',
    icon: Repeat,
    riskTier: 'STANDARD',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'link_pagamento',
    label: 'Link de Pagamento',
    description: 'Cobranças avulsas via link',
    icon: Link2,
    riskTier: 'STANDARD',
    color: 'from-sky-500 to-blue-500',
  },
  {
    id: 'educacao',
    label: 'Educação',
    description: 'Escolas, faculdades, cursos livres',
    icon: Building2,
    riskTier: 'STANDARD',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function BusinessSegmentSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {BUSINESS_SEGMENTS.map((seg) => {
        const Icon = seg.icon;
        const selected = value === seg.id;
        return (
          <button
            key={seg.id}
            type="button"
            onClick={() => onChange(seg.id)}
            className={cn(
              'relative text-left p-4 rounded-2xl border-2 transition-all duration-200',
              'hover:shadow-lg hover:-translate-y-0.5',
              selected
                ? 'border-[#2bc196] bg-[#2bc196]/5 shadow-md ring-2 ring-[#2bc196]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50',
            )}
          >
            <div className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center mb-3 shadow-md',
              `bg-gradient-to-br ${seg.color}`,
            )}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{seg.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{seg.description}</p>
            {selected && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#2bc196] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}