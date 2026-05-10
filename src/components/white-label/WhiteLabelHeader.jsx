import React from 'react';
import { Mail, Phone, MessageSquare, Globe } from 'lucide-react';

/**
 * Header reutilizável para páginas públicas white-label.
 * Recebe o branding resolvido (ver getBrandingFromUrl em mockWhiteLabelMerchants).
 *
 * Aplica logo, cores e nome do merchant pai. Mostra "Powered by PagSmile" no rodapé
 * quando branding.show_powered_by = true.
 */
export default function WhiteLabelHeader({ branding, subtitle, compact = false }) {
  if (!branding) return null;

  return (
    <div className="w-full" style={{ background: branding.background_color }}>
      <div className={`max-w-4xl mx-auto px-4 ${compact ? 'py-4' : 'py-6'} flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          {branding.logo_url && (
            <img
              src={branding.logo_url}
              alt={branding.business_name_display}
              className={compact ? 'h-7' : 'h-10'}
            />
          )}
          <div>
            <h1
              className={`font-black tracking-tight ${compact ? 'text-base' : 'text-xl'}`}
              style={{ color: branding.text_color }}
            >
              {branding.business_name_display}
            </h1>
            {!compact && branding.tagline && (
              <p className="text-xs opacity-60" style={{ color: branding.text_color }}>
                {branding.tagline}
              </p>
            )}
            {subtitle && (
              <p className="text-xs mt-0.5 opacity-70" style={{ color: branding.text_color }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {!compact && (
          <div className="hidden md:flex items-center gap-3 text-xs" style={{ color: branding.text_color }}>
            {branding.support_email && (
              <a href={`mailto:${branding.support_email}`} className="flex items-center gap-1 opacity-70 hover:opacity-100 transition">
                <Mail className="w-3.5 h-3.5" /> {branding.support_email}
              </a>
            )}
            {branding.support_phone && (
              <span className="flex items-center gap-1 opacity-70">
                <Phone className="w-3.5 h-3.5" /> {branding.support_phone}
              </span>
            )}
            {branding.support_whatsapp && (
              <a
                href={`https://wa.me/${branding.support_whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 opacity-70 hover:opacity-100 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
            )}
          </div>
        )}
      </div>

      {/* Faixa colorida com a cor primária do merchant */}
      <div className="h-1" style={{ background: branding.brand_color_primary }} />
    </div>
  );
}

/**
 * Footer companion — mostra "Powered by PagSmile" quando aplicável.
 */
export function WhiteLabelFooter({ branding }) {
  if (!branding) return null;

  return (
    <div className="border-t border-slate-100 mt-12 py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3 flex-wrap">
          {branding.privacy_policy_url && (
            <a href={branding.privacy_policy_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Privacidade
            </a>
          )}
          {branding.terms_url && (
            <a href={branding.terms_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Termos
            </a>
          )}
          {branding.website_url && (
            <a href={branding.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
              <Globe className="w-3 h-3" /> Site
            </a>
          )}
        </div>
        {branding.show_powered_by && (
          <div className="flex items-center gap-1.5 opacity-70">
            <span>Powered by</span>
            <span className="font-bold" style={{ color: '#2bc196' }}>PagSmile</span>
          </div>
        )}
      </div>
    </div>
  );
}