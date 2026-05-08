import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Users, Zap, Crown, BarChart3, Heart, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/common/PageHeader';

import EngagementHubKpis from '@/components/customers/v2/engagement/EngagementHubKpis';
import CampaignsList from '@/components/customers/v2/engagement/CampaignsList';
import SegmentsManager from '@/components/customers/v2/engagement/SegmentsManager';
import AutomationsBuilder from '@/components/customers/v2/engagement/AutomationsBuilder';
import LoyaltyView from '@/components/customers/v2/engagement/LoyaltyView';
import EngagementAnalytics from '@/components/customers/v2/engagement/EngagementAnalytics';
import NPSDashboard from '@/components/customers/v2/engagement/NPSDashboard';
import CampaignBuilder from '@/components/customers/v2/engagement/CampaignBuilder';

export default function CustomersHub() {
  const [campaignBuilderOpen, setCampaignBuilderOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engagement Hub"
        subtitle="Centro de comunicação, segmentação e fidelização de clientes"
        icon={Sparkles}
        breadcrumbs={[
          { label: 'Clientes', page: 'Customers' },
          { label: 'Engagement Hub' }
        ]}
      />

      {/* Top KPIs */}
      <EngagementHubKpis />

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="flex-wrap h-auto bg-slate-100">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-white">
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Campanhas <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">8</Badge>
          </TabsTrigger>
          <TabsTrigger value="segments" className="data-[state=active]:bg-white">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Segmentos <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">7</Badge>
          </TabsTrigger>
          <TabsTrigger value="automations" className="data-[state=active]:bg-white">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Automations <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">4</Badge>
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="data-[state=active]:bg-white">
            <Crown className="w-3.5 h-3.5 mr-1.5" />
            Loyalty
          </TabsTrigger>
          <TabsTrigger value="nps" className="data-[state=active]:bg-white">
            <Heart className="w-3.5 h-3.5 mr-1.5" />
            NPS
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <CampaignsList onCreate={() => setCampaignBuilderOpen(true)} />
        </TabsContent>

        <TabsContent value="segments">
          <SegmentsManager />
        </TabsContent>

        <TabsContent value="automations">
          <AutomationsBuilder />
        </TabsContent>

        <TabsContent value="loyalty">
          <LoyaltyView />
        </TabsContent>

        <TabsContent value="nps">
          <NPSDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <EngagementAnalytics />
        </TabsContent>
      </Tabs>

      {/* Campaign Builder Modal */}
      <CampaignBuilder open={campaignBuilderOpen} onOpenChange={setCampaignBuilderOpen} />
    </div>
  );
}