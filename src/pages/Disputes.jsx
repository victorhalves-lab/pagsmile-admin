import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, Inbox, Sparkles } from 'lucide-react';
import { differenceInHours, differenceInDays } from 'date-fns';

import UnifiedQueueKpiBar from '@/components/disputes/v2/UnifiedQueueKpiBar';
import UnifiedTriageBar from '@/components/disputes/v2/UnifiedTriageBar';
import UnifiedQueueFilters from '@/components/disputes/v2/UnifiedQueueFilters';
import UnifiedQueueTable from '@/components/disputes/v2/UnifiedQueueTable';
import UnifiedBulkBar from '@/components/disputes/v2/UnifiedBulkBar';
import { computeUrgency } from '@/components/disputes/v2/utils';

export default function Disputes() {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [valueRange, setValueRange] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [currentView, setCurrentView] = useState(null);
  const [currentChip, setCurrentChip] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const { data: disputes = [] } = useQuery({
    queryKey: ['disputes-unified'],
    queryFn: () => base44.entities.Dispute.list('-created_date', 200),
  });

  const { data: meds = [] } = useQuery({
    queryKey: ['meds-unified'],
    queryFn: () => base44.entities.MED.list('-created_date', 100),
  });

  // Normaliza tudo para uma fila única com _channel
  const unifiedItems = useMemo(() => {
    const precbs = disputes
      .filter((d) => ['alert_ethoca', 'alert_verifi'].includes(d.type))
      .map((d) => ({ ...d, _channel: 'precb' }));
    const cbs = disputes
      .filter((d) => d.type === 'chargeback')
      .map((d) => ({ ...d, _channel: 'cb' }));
    const medItems = (meds || []).map((m) => ({ ...m, _channel: 'med', amount: m.requested_amount, customer_name: m.payer_name }));
    return [...precbs, ...cbs, ...medItems];
  }, [disputes, meds]);

  const isOpen = (item) => {
    if (item._channel === 'precb') return ['received', 'pending'].includes(item.status);
    if (item._channel === 'cb') return ['received', 'in_analysis', 'in_contestation'].includes(item.status);
    if (item._channel === 'med') return ['pending', 'analyzing'].includes(item.status);
    return false;
  };

  // Aplica saved view
  const applyView = (item) => {
    if (currentView === 'critical') return computeUrgency(item).level === 'critical' && isOpen(item);
    if (currentView === 'precb') return item._channel === 'precb' && isOpen(item);
    if (currentView === 'cb_high_prob') return item._channel === 'cb' && (item.win_probability || 0) >= 60 && isOpen(item);
    if (currentView === 'med_2h') {
      if (item._channel !== 'med' || !isOpen(item)) return false;
      const h = differenceInHours(new Date(item.deadline_at), new Date());
      return h >= 0 && h <= 2;
    }
    if (currentView === 'high_value') return (item.amount || item.requested_amount || 0) >= 2000;
    return true;
  };

  const applyChip = (item) => {
    if (!currentChip) return true;
    if (['critical', 'high', 'medium'].includes(currentChip)) return computeUrgency(item).level === currentChip;
    if (currentChip === 'precb') return item._channel === 'precb';
    if (currentChip === 'cb') return item._channel === 'cb';
    if (currentChip === 'med') return item._channel === 'med';
    return true;
  };

  const filtered = useMemo(() => {
    return unifiedItems.filter((item) => {
      if (!isOpen(item) && !currentView && !currentChip) return false;
      if (channelFilter !== 'all' && item._channel !== channelFilter) return false;
      if (brandFilter !== 'all') {
        if (brandFilter === 'pix' && item._channel !== 'med') return false;
        if (brandFilter !== 'pix' && item.card_brand !== brandFilter) return false;
      }
      const v = item.amount || item.requested_amount || 0;
      if (valueRange === 'low' && v >= 100) return false;
      if (valueRange === 'mid' && (v < 100 || v >= 500)) return false;
      if (valueRange === 'high' && (v < 500 || v >= 2000)) return false;
      if (valueRange === 'vhigh' && v < 2000) return false;
      if (urgencyFilter !== 'all' && computeUrgency(item).level !== urgencyFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [item.dispute_id, item.med_id, item.transaction_id, item.arn, item.customer_name, item.customer_email, item.payer_name]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (!applyView(item)) return false;
      if (!applyChip(item)) return false;
      return true;
    }).sort((a, b) => {
      // Ordena por urgência × valor
      const ua = computeUrgency(a), ub = computeUrgency(b);
      const ord = { critical: 0, high: 1, medium: 2, expired: 3, low: 4 };
      const diff = (ord[ua.level] ?? 5) - (ord[ub.level] ?? 5);
      if (diff !== 0) return diff;
      return (b.amount || b.requested_amount || 0) - (a.amount || a.requested_amount || 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unifiedItems, channelFilter, brandFilter, valueRange, urgencyFilter, search, currentView, currentChip]);

  const stats = useMemo(() => {
    const open = unifiedItems.filter(isOpen);
    const critical = open.filter((i) => computeUrgency(i).level === 'critical');
    const precb = open.filter((i) => i._channel === 'precb');
    const med = open.filter((i) => i._channel === 'med');
    const cb = unifiedItems.filter((i) => i._channel === 'cb');
    const won = cb.filter((d) => d.status === 'won');
    const lost = cb.filter((d) => ['lost', 'accepted'].includes(d.status));
    const winRate = (won.length + lost.length) > 0 ? Math.round((won.length / (won.length + lost.length)) * 100) : 0;
    const sum = (arr) => arr.reduce((s, x) => s + (x.amount || x.requested_amount || 0), 0);

    return {
      criticalCount: critical.length,
      openCount: open.length,
      openValue: sum(open),
      atRiskValue: sum(open) * 0.7,
      precbCount: precb.length,
      precbValue: sum(precb),
      medCount: med.length,
      medValue: sum(med),
      winRate,
      wonCount: won.length,
    };
  }, [unifiedItems]);

  const triageCounts = useMemo(() => ({
    critical: unifiedItems.filter((i) => isOpen(i) && computeUrgency(i).level === 'critical').length,
    high: unifiedItems.filter((i) => isOpen(i) && computeUrgency(i).level === 'high').length,
    medium: unifiedItems.filter((i) => isOpen(i) && computeUrgency(i).level === 'medium').length,
    precb: unifiedItems.filter((i) => isOpen(i) && i._channel === 'precb').length,
    cb: unifiedItems.filter((i) => isOpen(i) && i._channel === 'cb').length,
    med: unifiedItems.filter((i) => isOpen(i) && i._channel === 'med').length,
  }), [unifiedItems]);

  const activeFilterCount =
    (channelFilter !== 'all' ? 1 : 0) +
    (brandFilter !== 'all' ? 1 : 0) +
    (valueRange !== 'all' ? 1 : 0) +
    (urgencyFilter !== 'all' ? 1 : 0) +
    (search ? 1 : 0);

  const clearFilters = () => {
    setSearch(''); setChannelFilter('all'); setBrandFilter('all'); setValueRange('all'); setUrgencyFilter('all');
    setCurrentView(null); setCurrentChip(null);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (filtered.every((i) => selected.has(i.id))) setSelected(new Set());
    else setSelected(new Set(filtered.map((i) => i.id)));
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Disputas"
        subtitle="Cockpit unificado: Pre-Chargebacks, Chargebacks e MEDs em uma única fila ordenada por urgência"
        breadcrumbs={[{ label: 'Disputas' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" /> Triagem IA
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
          </div>
        }
      />

      <UnifiedQueueKpiBar stats={stats} />

      <UnifiedTriageBar counts={triageCounts} currentChip={currentChip} onSelectChip={(c) => setCurrentChip(currentChip === c ? null : c)} />

      <UnifiedQueueFilters
        search={search} onSearch={setSearch}
        channelFilter={channelFilter} onChannelChange={setChannelFilter}
        brandFilter={brandFilter} onBrandChange={setBrandFilter}
        valueRange={valueRange} onValueRangeChange={setValueRange}
        urgencyFilter={urgencyFilter} onUrgencyChange={setUrgencyFilter}
        activeFilterCount={activeFilterCount} onClearFilters={clearFilters}
        currentView={currentView} onSelectView={(id) => setCurrentView(currentView === id ? null : id)}
      />

      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <p className="flex items-center gap-1.5">
          <Inbox className="w-3.5 h-3.5" />
          {filtered.length} {filtered.length === 1 ? 'disputa' : 'disputas'} • ordenadas por urgência × valor
        </p>
      </div>

      <UnifiedQueueTable
        items={filtered}
        selected={selected}
        onToggleSelect={toggleSelect}
        onToggleAll={toggleAll}
        onView={() => {}}
        onAction={() => {}}
      />

      <UnifiedBulkBar
        selectedCount={selected.size}
        onClear={() => setSelected(new Set())}
        onAction={() => setSelected(new Set())}
      />
    </div>
  );
}