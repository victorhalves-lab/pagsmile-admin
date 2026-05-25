import React from 'react';
import { ShoppingBag, DeviceMobile, Globe, Link as LinkIcon, Storefront, CaretRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * ChannelBreakdownCard — Pulse VF.
 * Card branco + lista de canais com icon container + progress + approval pill.
 */
export default function ChannelBreakdownCard({ channels = [] }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const defaults = [
    { id: 'ecommerce',   label: 'E-commerce',  volume: 485200, approval: 88.4, icon: Globe,        accent: '#002443' },
    { id: 'app',         label: 'App',         volume: 247800, approval: 92.1, icon: DeviceMobile, accent: '#0F2B2B' },
    { id: 'links',       label: 'Links pagto', volume: 142500, approval: 86.7, icon: LinkIcon,     accent: '#00C194' },
    { id: 'marketplace', label: 'Marketplace', volume: 87420,  approval: 84.2, icon: ShoppingBag,  accent: '#F59E0B' },
    { id: 'pos',         label: 'POS',         volume: 23180,  approval: 95.3, icon: Storefront,   accent: '#5CF7CF' },
  ];

  const list = channels.length > 0 ? channels : defaults;
  const total = list.reduce((sum, c) => sum + (c.volume || 0), 0);

  const approvalColor = (a) =>
    a >= 88 ? '#007A5C' : a >= 84 ? '#B45309' : '#B91C1C';

  return (
    <div
      className="relative h-full p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #fff, #F0FAF6)',
        border: '1px solid #80E5C6',
        boxShadow: '0 4px 14px -4px rgba(0,193,148,0.12)',
      }}
    >
      <div className="mb-4">
        <p
          className="font-mono"
          style={{
            fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#007A5C', marginBottom: 4,
          }}
        >
          Performance · por canal
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 800, color: '#001124' }}>
          Volume e aprovação por origem
        </p>
      </div>

      <div className="space-y-2">
        {list.map((ch) => {
          const Icon = ch.icon;
          const sharePct = (ch.volume / total) * 100;
          return (
            <Link
              key={ch.id}
              to={`${createPageUrl('Transactions')}?channel=${ch.id}`}
              className="group flex items-center gap-3 p-2.5 transition-all hover:-translate-y-px"
              style={{
                background: '#fff',
                border: '1px solid #B3F0DE',
                borderRadius: 11,
                textDecoration: 'none',
              }}
            >
              <div
                className="flex-shrink-0 inline-flex items-center justify-center"
                style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: 'linear-gradient(135deg, #E0F8F1, #B4FCE8)',
                  color: '#005A43',
                  border: '1px solid #4DD8AB',
                }}
              >
                <Icon weight="duotone" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#001124' }}>
                    {ch.label}
                  </p>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 12, fontWeight: 800, color: '#001124',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {fmt(ch.volume)}
                  </span>
                </div>
                <div
                  style={{
                    height: 4, background: '#E0F8F1',
                    borderRadius: 99, overflow: 'hidden', border: '1px solid #B3F0DE',
                  }}
                >
                  <div
                    style={{
                      height: '100%', width: `${sharePct}%`,
                      background: `linear-gradient(90deg, ${ch.accent}, #5CF7CF)`,
                      borderRadius: 99,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono" style={{ fontSize: 10, color: '#547C9D', fontWeight: 600 }}>
                    {sharePct.toFixed(1)}% do total
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10, fontWeight: 800,
                      color: approvalColor(ch.approval),
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {ch.approval.toFixed(1)}% aprovação
                  </span>
                </div>
              </div>
              <CaretRight
                weight="bold"
                size={12}
                style={{ color: '#B3F0DE', flexShrink: 0 }}
                className="group-hover:opacity-100"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}