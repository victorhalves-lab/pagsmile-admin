import { QrCode, Repeat, Fingerprint, CalendarClock } from 'lucide-react';

/**
 * Configuração central dos PIX flows.
 * Usado para badges, filtros, labels e cores em toda a aplicação.
 */
export const PIX_FLOWS = {
  manual: {
    value: 'manual',
    label: 'Manual',
    shortLabel: 'Manual',
    icon: QrCode,
    color: 'teal',
    bgClass: 'bg-teal-50',
    textClass: 'text-teal-700',
    borderClass: 'border-teal-200',
    description: 'PIX tradicional via QR Code ou copia-e-cola',
  },
  automatic: {
    value: 'automatic',
    label: 'PIX Automático',
    shortLabel: 'Auto',
    icon: Repeat,
    color: 'blue',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
    description: 'Cobrança recorrente via mandato DICT (PIX Automático)',
  },
  biometric: {
    value: 'biometric',
    label: 'PIX Biometria',
    shortLabel: 'Biometria',
    icon: Fingerprint,
    color: 'violet',
    bgClass: 'bg-violet-50',
    textClass: 'text-violet-700',
    borderClass: 'border-violet-200',
    description: 'Autorização biométrica via Open Finance (sem redirect)',
  },
  scheduled: {
    value: 'scheduled',
    label: 'PIX Agendado',
    shortLabel: 'Agendado',
    icon: CalendarClock,
    color: 'amber',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    description: 'PIX programado para data futura',
  },
};

export const PIX_FLOW_OPTIONS = Object.values(PIX_FLOWS).map(({ value, label }) => ({ value, label }));

export const getPixFlowConfig = (flow) => PIX_FLOWS[flow] || PIX_FLOWS.manual;