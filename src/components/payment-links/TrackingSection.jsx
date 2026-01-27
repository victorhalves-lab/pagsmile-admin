import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Code, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrackingSection({ formData, setFormData }) {
  const [utmOpen, setUtmOpen] = useState(false);
  const [pixelOpen, setPixelOpen] = useState(false);
  const [metadataOpen, setMetadataOpen] = useState(false);

  const updateUtm = (field, value) => {
    setFormData({
      ...formData,
      utm_parameters: {
        ...(formData.utm_parameters || {}),
        [field]: value
      }
    });
  };

  const updatePixel = (field, value) => {
    setFormData({
      ...formData,
      pixel_ids: {
        ...(formData.pixel_ids || {}),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* External Reference */}
      <div>
        <Label className="text-sm font-medium">Referência Externa</Label>
        <Input
          placeholder="Ex: PROMO-2024-001"
          value={formData.external_reference || ''}
          onChange={(e) => setFormData({ ...formData, external_reference: e.target.value })}
          maxLength={50}
          className="mt-1.5"
        />
        <p className="text-xs text-gray-500 mt-1">ID para rastrear o link no seu sistema</p>
      </div>

      {/* UTM Parameters */}
      <Collapsible open={utmOpen} onOpenChange={setUtmOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 h-auto border rounded-lg">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              <span className="font-medium">UTM Parameters</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", utmOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3 pl-4 border-l-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Source</Label>
              <Input
                placeholder="facebook, google, email"
                value={formData.utm_parameters?.source || ''}
                onChange={(e) => updateUtm('source', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Medium</Label>
              <Input
                placeholder="cpc, social, email"
                value={formData.utm_parameters?.medium || ''}
                onChange={(e) => updateUtm('medium', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Campaign</Label>
              <Input
                placeholder="black_friday_2024"
                value={formData.utm_parameters?.campaign || ''}
                onChange={(e) => updateUtm('campaign', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Content</Label>
              <Input
                placeholder="banner_topo"
                value={formData.utm_parameters?.content || ''}
                onChange={(e) => updateUtm('content', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Term</Label>
              <Input
                placeholder="marketing digital"
                value={formData.utm_parameters?.term || ''}
                onChange={(e) => updateUtm('term', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Pixel IDs */}
      <Collapsible open={pixelOpen} onOpenChange={setPixelOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 h-auto border rounded-lg">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="font-medium">Pixels de Rastreamento</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", pixelOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3 pl-4 border-l-2">
          <div>
            <Label className="text-xs">Meta Pixel ID</Label>
            <Input
              placeholder="123456789012345"
              value={formData.pixel_ids?.meta || ''}
              onChange={(e) => updatePixel('meta', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Google Ads Conversion ID</Label>
            <Input
              placeholder="AW-123456789"
              value={formData.pixel_ids?.google_ads || ''}
              onChange={(e) => updatePixel('google_ads', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">TikTok Pixel ID</Label>
            <Input
              placeholder="ABCDEFGHIJ12345"
              value={formData.pixel_ids?.tiktok || ''}
              onChange={(e) => updatePixel('tiktok', e.target.value)}
              className="mt-1"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Metadata */}
      <Collapsible open={metadataOpen} onOpenChange={setMetadataOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 h-auto border rounded-lg">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="font-medium">Metadata (JSON)</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", metadataOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 pl-4 border-l-2">
          <Textarea
            placeholder='{"key": "value"}'
            value={formData.metadata ? JSON.stringify(formData.metadata, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setFormData({ ...formData, metadata: parsed });
              } catch {
                // Invalid JSON, ignore
              }
            }}
            className="font-mono text-xs h-32"
          />
          <p className="text-xs text-gray-500 mt-1">Dados adicionais retornados em webhooks</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}