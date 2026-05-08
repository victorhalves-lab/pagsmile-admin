import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, AlertTriangle, Heart, Zap, TrendingUp, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Computes dynamic / smart segments based on customer data — like Salesforce's "Einstein Segments"
export default function SegmentChips({ customer }) {
  const segments = [];

  // High Value
  if ((customer.total_spent || 0) > 5000) {
    segments.push({ label: 'High Value', icon: Crown, color: 'bg-purple-100 text-purple-700 border-purple-200' });
  }

  // High Frequency
  if ((customer.total_purchases || 0) >= 10) {
    segments.push({ label: 'High Frequency', icon: Zap, color: 'bg-blue-100 text-blue-700 border-blue-200' });
  }

  // Recently Active
  if (customer.last_purchase_date) {
    const days = Math.floor((new Date() - new Date(customer.last_purchase_date)) / (1000 * 60 * 60 * 24));
    if (days <= 7) {
      segments.push({ label: 'Recently Active', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' });
    } else if (days > 60) {
      segments.push({ label: 'Dormant', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' });
    }
  }

  // Risk
  if ((customer.chargebacks_count || 0) >= 1) {
    segments.push({ label: 'Has Disputes', icon: AlertTriangle, color: 'bg-red-100 text-red-700 border-red-200' });
  }

  // Loyalty
  if (customer.first_purchase_date) {
    const months = Math.floor((new Date() - new Date(customer.first_purchase_date)) / (1000 * 60 * 60 * 24 * 30));
    if (months >= 12) {
      segments.push({ label: 'Loyal 1Y+', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-200' });
    }
  }

  // High AOV
  if ((customer.average_ticket || 0) > 500) {
    segments.push({ label: 'High AOV', icon: Star, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' });
  }

  if (segments.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium uppercase tracking-wider mr-1">
        <Sparkles className="w-3 h-3 text-purple-500" />
        IA Segmentos:
      </span>
      {segments.map((s, i) => {
        const Icon = s.icon;
        return (
          <Badge key={i} className={cn('gap-1 text-[10px] border', s.color)}>
            <Icon className="w-2.5 h-2.5" />
            {s.label}
          </Badge>
        );
      })}
    </div>
  );
}