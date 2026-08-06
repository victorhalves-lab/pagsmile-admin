import React, { useState } from 'react';
import { Users, Gift, UserPlus, Share2, Shield, Bell, Award, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { mgmConfigState, mgmRewardTypes, mgmTriggerOptions } from '@/components/loyalty-cdp/mocks/loyaltyConfigMocks';

export default function MgmConfigTab() {
  const [cfg, setCfg] = useState(mgmConfigState);
  const [openSections, setOpenSections] = useState({ referrer: true, referee: true, code: false, fraud: false, fulfillment: false });

  const toggle = (key) => setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  const setRef = (field, val) => setCfg({ ...cfg, referrer_reward: { ...cfg.referrer_reward, [field]: val } });
  const setRefParams = (field, val) => setCfg({ ...cfg, referrer_reward: { ...cfg.referrer_reward, trigger_params: { ...cfg.referrer_reward.trigger_params, [field]: val } } });
  const setRefTier = (field, val) => setCfg({ ...cfg, referrer_reward: { ...cfg.referrer_reward, milestone_bonus: { ...cfg.referrer_reward.milestone_bonus, [field]: val } } });
  const setReferee = (field, val) => setCfg({ ...cfg, referee_reward: { ...cfg.referee_reward, [field]: val } });
  const setRefereeSplit = (field, val) => setCfg({ ...cfg, referee_reward: { ...cfg.referee_reward, split_reward: { ...cfg.referee_reward.split_reward, [field]: val } } });
  const setFraud = (field, val) => setCfg({ ...cfg, fraud_protection: { ...cfg.fraud_protection, [field]: val } });
  const setFulfill = (field, val) => setCfg({ ...cfg, fulfillment: { ...cfg.fulfillment, [field]: val } });

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm';
  const labelCls = 'text-xs text-slate-500 mb-1 block font-medium';

  const SectionHeader = ({ id, icon: Icon, title, desc }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Icon className="w-4 h-4" /></div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      {openSections[id] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
    </button>
  );

  const Toggle = ({ checked, onChange, label, desc }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <div><p className="text-sm text-slate-700 dark:text-slate-200">{label}</p>{desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}</div>
      <button onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-mint-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Mode */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-mint-500" /> Estratégia de indicação</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          {[
            { id: 'double_sided', label: 'Bilateral', desc: 'Indicador e indicado ganham' },
            { id: 'single_referrer', label: 'Só indicador', desc: 'Quem indica recebe' },
            { id: 'single_referee', label: 'Só indicado', desc: 'Quem se inscreve recebe' },
          ].map((m) => (
            <button key={m.id} onClick={() => setCfg({ ...cfg, mode: m.id })} className={`p-3 rounded-lg border text-left ${cfg.mode === m.id ? 'border-mint-500 bg-mint-50 dark:bg-mint-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-mint-400'}`}>
              <p className={`text-sm font-semibold ${cfg.mode === m.id ? 'text-mint-700 dark:text-mint-300' : 'text-slate-700 dark:text-slate-200'}`}>{m.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
        <Toggle checked={cfg.enabled} onChange={(v) => setCfg({ ...cfg, enabled: v })} label="Programa MGM ativo" desc="Desligar pausa todas as recompensas de indicação" />
      </div>

      {/* Referrer reward */}
      {(cfg.mode === 'double_sided' || cfg.mode === 'single_referrer') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-5 shadow-sm">
          <SectionHeader id="referrer" icon={Gift} title="Recompensa do indicador" desc="O que quem indica ganha e quando" />
          {openSections.referrer && (
            <div className="pb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className={labelCls}>Tipo de recompensa</label><select value={cfg.referrer_reward.type} onChange={(e) => setRef('type', e.target.value)} className={inputCls}>{mgmRewardTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                <div><label className={labelCls}>Valor</label><div className="relative"><input type="number" value={cfg.referrer_reward.amount} onChange={(e) => setRef('amount', Number(e.target.value))} className={inputCls} /><span className="absolute right-3 top-2 text-xs text-slate-400">{mgmRewardTypes.find((t) => t.id === cfg.referrer_reward.type)?.unit}</span></div></div>
                <div><label className={labelCls}>Gatilho de liberação</label><select value={cfg.referrer_reward.trigger} onChange={(e) => setRef('trigger', e.target.value)} className={inputCls}>{mgmTriggerOptions.referrer.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
              </div>
              {cfg.referrer_reward.trigger === 'nth_purchase' && (
                <div><label className={labelCls}>Na Nª compra (qual N?)</label><input type="number" value={cfg.referrer_reward.trigger_params.nth} onChange={(e) => setRefParams('nth', Number(e.target.value))} className={inputCls} /></div>
              )}
              {cfg.referrer_reward.trigger === 'spend_threshold' && (
                <div><label className={labelCls}>Valor gasto mínimo (R$)</label><input type="number" value={cfg.referrer_reward.trigger_params.spend_min} onChange={(e) => setRefParams('spend_min', Number(e.target.value))} className={inputCls} /></div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelCls}>Cap de indicações/mês por indicador</label><input type="number" value={cfg.referrer_reward.cap_per_month} onChange={(e) => setRef('cap_per_month', Number(e.target.value))} className={inputCls} /></div>
                <div><label className={labelCls}>Cap de pontos/mês por indicador</label><input type="number" value={cfg.referrer_reward.cap_points_per_month} onChange={(e) => setRef('cap_points_per_month', Number(e.target.value))} className={inputCls} /></div>
              </div>
              <Toggle checked={cfg.referrer_reward.tiered} onChange={(v) => setRef('tiered', v)} label="Recompensa escalonada" desc="Valor sobe conforme o indicador acumula indicações" />
              {cfg.referrer_reward.tiered && (
                <div className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  {cfg.referrer_reward.tiers.map((tier, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-20">Na {tier.referrals}ª indicação</span>
                      <input type="number" value={tier.reward} onChange={(e) => { const t = [...cfg.referrer_reward.tiers]; t[i] = { ...tier, reward: Number(e.target.value) }; setRef('tiers', t); }} className="flex-1 px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
                      <span className="text-xs text-slate-400">pts</span>
                      <button onClick={() => setRef('tiers', cfg.referrer_reward.tiers.filter((_, idx) => idx !== i))} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button onClick={() => setRef('tiers', [...cfg.referrer_reward.tiers, { referrals: cfg.referrer_reward.tiers.length + 1, reward: 0 }])} className="flex items-center gap-1 text-xs text-mint-600 hover:text-mint-700 font-medium"><Plus className="w-3 h-3" /> Adicionar tier</button>
                </div>
              )}
              <Toggle checked={cfg.referrer_reward.milestone_bonus.enabled} onChange={(v) => setRefTier('enabled', v)} label="Bônus a cada N indicações" desc="Recompensa extra ao atingir marco recorrente" />
              {cfg.referrer_reward.milestone_bonus.enabled && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div><label className={labelCls}>A cada N indicações</label><input type="number" value={cfg.referrer_reward.milestone_bonus.every} onChange={(e) => setRefTier('every', Number(e.target.value))} className={inputCls} /></div>
                  <div><label className={labelCls}>Bônus (pts)</label><input type="number" value={cfg.referrer_reward.milestone_bonus.bonus} onChange={(e) => setRefTier('bonus', Number(e.target.value))} className={inputCls} /></div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Referee reward */}
      {(cfg.mode === 'double_sided' || cfg.mode === 'single_referee') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-5 shadow-sm">
          <SectionHeader id="referee" icon={UserPlus} title="Recompensa do indicado" desc="O que quem foi convidado ganha" />
          {openSections.referee && (
            <div className="pb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className={labelCls}>Tipo de recompensa</label><select value={cfg.referee_reward.type} onChange={(e) => setReferee('type', e.target.value)} className={inputCls}>{mgmRewardTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                <div><label className={labelCls}>Valor</label><div className="relative"><input type="number" value={cfg.referee_reward.amount} onChange={(e) => setReferee('amount', Number(e.target.value))} className={inputCls} /><span className="absolute right-3 top-2 text-xs text-slate-400">{mgmRewardTypes.find((t) => t.id === cfg.referee_reward.type)?.unit}</span></div></div>
                <div><label className={labelCls}>Gatilho de liberação</label><select value={cfg.referee_reward.trigger} onChange={(e) => setReferee('trigger', e.target.value)} className={inputCls}>{mgmTriggerOptions.referee.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
              </div>
              <Toggle checked={cfg.referee_reward.split_reward.enabled} onChange={(v) => setRefereeSplit('enabled', v)} label="Split de recompensa" desc="Parte no cadastro + parte na 1ª compra" />
              {cfg.referee_reward.split_reward.enabled && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div><label className={labelCls}>No cadastro (pts)</label><input type="number" value={cfg.referee_reward.split_reward.on_signup} onChange={(e) => setRefereeSplit('on_signup', Number(e.target.value))} className={inputCls} /></div>
                  <div><label className={labelCls}>Na 1ª compra (pts)</label><input type="number" value={cfg.referee_reward.split_reward.on_first_purchase} onChange={(e) => setRefereeSplit('on_first_purchase', Number(e.target.value))} className={inputCls} /></div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Referral code */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-5 shadow-sm">
        <SectionHeader id="code" icon={Share2} title="Código de indicação & compartilhamento" desc="Como o link de convite funciona" />
        {openSections.code && (
          <div className="pb-4 space-y-3">
            <div><label className={labelCls}>Formato do código</label><div className="grid grid-cols-2 gap-2">
              {[{ id: 'unique_per_member', l: 'Único por membro' }, { id: 'generic_program', l: 'Genérico do programa' }].map((f) => (
                <button key={f.id} onClick={() => setCfg({ ...cfg, referral_code: { ...cfg.referral_code, format: f.id } })} className={`p-3 rounded-lg border text-sm ${cfg.referral_code.format === f.id ? 'border-mint-500 bg-mint-50 dark:bg-mint-500/10 text-mint-700 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-600'}`}>{f.l}</button>
              ))}
            </div></div>
            <div><label className={labelCls}>Canais de compartilhamento</label><div className="flex flex-wrap gap-2">
              {['whatsapp', 'email', 'sms', 'qr_code', 'copy_link'].map((ch) => {
                const active = cfg.referral_code.share_channels.includes(ch);
                return <button key={ch} onClick={() => setCfg({ ...cfg, referral_code: { ...cfg.referral_code, share_channels: active ? cfg.referral_code.share_channels.filter((c) => c !== ch) : [...cfg.referral_code.share_channels, ch] } })} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${active ? 'border-mint-500 bg-mint-50 text-mint-700' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}>{ch.replace('_', ' ')}</button>;
              })}
            </div></div>
          </div>
        )}
      </div>

      {/* Fraud protection */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-5 shadow-sm">
        <SectionHeader id="fraud" icon={Shield} title="Proteção contra fraude" desc="Regras anti-abuso de indicação" />
        {openSections.fraud && (
          <div className="pb-4 space-y-2">
            <Toggle checked={cfg.fraud_protection.block_self_referral} onChange={(v) => setFraud('block_self_referral', v)} label="Bloquear auto-indicação" />
            <Toggle checked={cfg.fraud_protection.block_same_ip} onChange={(v) => setFraud('block_same_ip', v)} label="Bloquear mesmo IP" />
            <Toggle checked={cfg.fraud_protection.block_same_device} onChange={(v) => setFraud('block_same_device', v)} label="Bloquear mesmo dispositivo" />
            <Toggle checked={cfg.fraud_protection.block_same_email_domain} onChange={(v) => setFraud('block_same_email_domain', v)} label="Bloquear mesmo domínio de e-mail" desc="Útil contra e-mails descartáveis" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div><label className={labelCls}>Cooldown entre indicações (h)</label><input type="number" value={cfg.fraud_protection.cooldown_hours} onChange={(e) => setFraud('cooldown_hours', Number(e.target.value))} className={inputCls} /></div>
              <div><label className={labelCls}>Máx. indicações/IP/dia</label><input type="number" value={cfg.fraud_protection.max_referrals_per_ip_per_day} onChange={(e) => setFraud('max_referrals_per_ip_per_day', Number(e.target.value))} className={inputCls} /></div>
            </div>
          </div>
        )}
      </div>

      {/* Fulfillment */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-5 shadow-sm">
        <SectionHeader id="fulfillment" icon={Bell} title="Fulfillment & notificações" desc="Quem paga, expiração e avisos" />
        {openSections.fulfillment && (
          <div className="pb-4 space-y-3">
            <div><label className={labelCls}>Custo da recompensa absorvido por</label><div className="grid grid-cols-2 gap-2">
              {[{ id: 'merchant', l: 'Lojista (custo direto)' }, { id: 'program_budget', l: 'Orçamento do programa' }].map((f) => (
                <button key={f.id} onClick={() => setFulfill('paid_by', f.id)} className={`p-3 rounded-lg border text-sm ${cfg.fulfillment.paid_by === f.id ? 'border-mint-500 bg-mint-50 dark:bg-mint-500/10 text-mint-700 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-600'}`}>{f.l}</button>
              ))}
            </div></div>
            <div><label className={labelCls}>Expiração da recompensa (dias)</label><input type="number" value={cfg.fulfillment.reward_expiration_days} onChange={(e) => setFulfill('reward_expiration_days', Number(e.target.value))} className={inputCls} /></div>
            <Toggle checked={cfg.fulfillment.notify_referrer_on_conversion} onChange={(v) => setFulfill('notify_referrer_on_conversion', v)} label="Avisar indicador quando indicado converter" />
            <Toggle checked={cfg.fulfillment.notify_referee_on_signup} onChange={(v) => setFulfill('notify_referee_on_signup', v)} label="Avisar indicado ao se inscrever" />
          </div>
        )}
      </div>

      <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors"><Award className="w-4 h-4" /> Salvar configuração MGM</button>
    </div>
  );
}