import React from 'react';
import { Warning, CaretRight, X } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * CriticalAlertsBanner — Pulse VF.
 * Banner de alerta crítico com gradient danger soft + icon container err + CTA solid red.
 */
export default function CriticalAlertsBanner({ alerts = [], onDismiss }) {
  const [dismissed, setDismissed] = React.useState([]);

  const defaultCritical = [
    {
      id: 'cb_ratio_critical',
      title: 'Chargeback ratio em 0.85% — próximo do limite Visa',
      action: 'Ver disputas',
      actionUrl: createPageUrl('DisputeDashboard'),
    },
  ];

  const list = (alerts.length > 0 ? alerts : defaultCritical).filter(
    (a) => !dismissed.includes(a.id)
  );

  if (list.length === 0) return null;

  const handleDismiss = (id) => {
    setDismissed((prev) => [...prev, id]);
    onDismiss?.(id);
  };

  return (
    <div className="space-y-2">
      {list.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
            border: '1px solid #FCA5A5',
            borderLeft: '4px solid #B91C1C',
            boxShadow: '0 4px 14px -4px rgba(185,28,28,0.2)',
          }}
        >
          {/* Icon container err */}
          <div
            className="flex-shrink-0 inline-flex items-center justify-center"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #FECACA, #FCA5A5)',
              color: '#B91C1C',
              border: '1px solid #FCA5A5',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            <Warning weight="duotone" size={18} />
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="font-mono"
              style={{
                fontSize: 10, fontWeight: 800,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#7F1D1D', marginBottom: 2,
              }}
            >
              Alerta crítico
            </p>
            <p
              className="truncate"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13, fontWeight: 700,
                color: '#7F1D1D', lineHeight: 1.3,
              }}
            >
              {alert.title}
            </p>
          </div>

          {alert.action && alert.actionUrl && (
            <Link
              to={alert.actionUrl}
              className="inline-flex items-center gap-1.5 flex-shrink-0 transition-all hover:-translate-y-px"
              style={{
                padding: '8px 14px', borderRadius: 9,
                background: 'linear-gradient(135deg, #DC2626, #991B1B)',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12, fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 6px 14px -3px rgba(220,38,38,0.5)',
              }}
            >
              {alert.action}
              <CaretRight weight="bold" size={11} />
            </Link>
          )}

          <button
            onClick={() => handleDismiss(alert.id)}
            className="flex-shrink-0 transition-opacity hover:opacity-100"
            style={{ color: '#B91C1C', opacity: 0.6, background: 'transparent', border: 0, padding: 4, cursor: 'pointer' }}
            aria-label="Dispensar"
          >
            <X weight="bold" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}