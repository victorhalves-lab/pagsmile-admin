import React from 'react';
import { format } from 'date-fns';
import { Building2, Mail, Phone, Globe, MapPin, Calendar, FileText, Shield } from 'lucide-react';

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words mt-0.5">{value || '-'}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-5 first:mt-0">
      <div className="w-1 h-5 bg-blue-500 rounded-full" />
      <h4 className="text-sm font-bold text-gray-800">{children}</h4>
    </div>
  );
}

export default function TabDadosCadastrais({ subaccount }) {
  const s = subaccount;
  const addr = s.address || {};

  return (
    <div className="space-y-2">
      <SectionTitle>Dados da Empresa</SectionTitle>
      <div className="grid grid-cols-2 gap-x-8">
        <InfoRow icon={Building2} label="Razão Social" value={s.legal_name} />
        <InfoRow icon={Building2} label="Nome Fantasia" value={s.business_name} />
        <InfoRow icon={FileText} label="CNPJ/CPF" value={s.document} />
        <InfoRow icon={FileText} label="Tipo Documento" value={s.document_type === 'cnpj' ? 'CNPJ' : s.document_type === 'cpf' ? 'CPF' : '-'} />
        <InfoRow icon={Mail} label="E-mail" value={s.email} />
        <InfoRow icon={Phone} label="Telefone" value={s.phone} />
        <InfoRow icon={Globe} label="Website" value={s.website} />
        <InfoRow icon={Calendar} label="Data de Abertura" value={s.opening_date} />
        <InfoRow icon={Calendar} label="Data de Cadastro" value={s.created_date ? format(new Date(s.created_date), 'dd/MM/yyyy HH:mm') : '-'} />
        <InfoRow icon={Calendar} label="Data de Aprovação" value={s.approval_date || '-'} />
      </div>

      <SectionTitle>Classificação</SectionTitle>
      <div className="grid grid-cols-2 gap-x-8">
        <InfoRow icon={Shield} label="MCC Registrado" value={s.mcc ? `${s.mcc} - ${s.mcc_description || ''}` : '-'} />
        <InfoRow label="CNAE" value={s.cnae || '-'} />
        <InfoRow label="MCC Declarado" value={s.mcc_declared || '-'} />
        <InfoRow label="CNAE Declarado" value={s.cnae_declared || '-'} />
        <InfoRow label="MCC Observado (IA)" value={s.mcc_observed || '-'} />
        <InfoRow label="CNAE Observado (IA)" value={s.cnae_observed || '-'} />
        <InfoRow label="Categoria" value={s.category || '-'} />
        <InfoRow label="Soft Descriptor" value={s.soft_descriptor || '-'} />
      </div>

      <SectionTitle>Endereço</SectionTitle>
      <div className="grid grid-cols-2 gap-x-8">
        <InfoRow icon={MapPin} label="Logradouro" value={addr.street ? `${addr.street}, ${addr.number || 'S/N'}` : '-'} />
        <InfoRow label="Complemento" value={addr.complement || '-'} />
        <InfoRow label="Bairro" value={addr.neighborhood || '-'} />
        <InfoRow label="Cidade / UF" value={addr.city ? `${addr.city} / ${addr.state}` : '-'} />
        <InfoRow label="CEP" value={addr.zip_code || '-'} />
      </div>

      {/* Contatos */}
      {s.contacts?.length > 0 && (
        <>
          <SectionTitle>Contatos</SectionTitle>
          <div className="space-y-2">
            {s.contacts.map((c, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{c.name} {c.is_primary && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1">Principal</span>}</p>
                  <p className="text-xs text-gray-500">{c.email} • {c.phone}</p>
                </div>
                {c.type && <span className="text-xs text-gray-400">{c.type}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}