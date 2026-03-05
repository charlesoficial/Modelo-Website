import { useState } from "react";
import { useSiteConfig, SiteConfig } from "@/lib/siteConfig";
import { Layout, ExternalLink, Lock, CheckCircle2, Save, MessageCircle, Send } from "lucide-react";

const AdminCheckout = () => {
    const { config, updateConfig } = useSiteConfig();
    const [settings, setSettings] = useState({ ...config.settings });
    const [password, setPassword] = useState(config.adminPassword);
    const [saved, setSaved] = useState(false);

    // Convenience alias for local state
    const telegram = settings.telegram;
    const setTelegram = (updater: (prev: SiteConfig["settings"]["telegram"]) => SiteConfig["settings"]["telegram"]) => {
        setSettings(prev => ({
            ...prev,
            telegram: updater(prev.telegram)
        }));
    };

    const handleSave = () => {
        updateConfig((prev) => ({
            ...prev,
            settings,
            adminPassword: password,
        }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const Toggle = ({
        label,
        description,
        value,
        onChange,
    }: {
        label: string;
        description?: string;
        value: boolean;
        onChange: (v: boolean) => void;
    }) => (
        <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
            <div className="flex-1 pr-4">
                <p className="text-[14px] font-semibold text-white">{label}</p>
                {description && <p className="text-[11px] text-zinc-500 mt-0.5">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer flex-shrink-0 ${value ? "bg-[#ff7a1a]" : "bg-zinc-800"
                    }`}
            >
                <span className={`absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-300 shadow-sm ${value ? "translate-x-5 bg-white" : "translate-x-0 bg-zinc-500"
                    }`} />
            </button>
        </div>
    );

    return (
        <div className="space-y-[24px] pb-6">
            <div className="flex flex-col px-1">
                <h2 className="text-[17px] font-bold text-white leading-tight">Configurações Gerais</h2>
                <p className="text-[12px] text-zinc-500">Privacidade, exibição e segurança</p>
            </div>

            {/* Display Settings */}
            <div className="admin-card !p-0 overflow-hidden">
                <div className="flex items-center gap-2 px-5 pt-5 pb-3">
                    <Layout className="w-4 h-4 text-[#ff7a1a]" />
                    <h3 className="admin-label !mb-0">
                        Preferências de Exibição
                    </h3>
                </div>
                <div className="px-5 divide-y divide-white/5 bg-zinc-900/40 border-y border-white/5">
                    <Toggle
                        label="Contagem de assinantes"
                        description="Exibir publicamente quantos assinantes você possui"
                        value={settings.showSubscriberCount}
                        onChange={(v) => setSettings((p) => ({ ...p, showSubscriberCount: v }))}
                    />
                    <Toggle
                        label="Contagem de mídias"
                        description="Mostrar o total de fotos/vídeos no seu perfil"
                        value={settings.showMediaCount}
                        onChange={(v) => setSettings((p) => ({ ...p, showMediaCount: v }))}
                    />
                </div>
                <div className="p-5 space-y-[14px]">
                    <label className="admin-label">Restrição de Conteúdo (Idade)</label>
                    <div className="flex gap-2">
                        {[16, 18, 21].map((age) => (
                            <button
                                key={age}
                                onClick={() => setSettings((p) => ({ ...p, ageRestriction: age }))}
                                className={`flex-1 h-11 rounded-xl text-[13px] font-bold border transition-all ${settings.ageRestriction === age
                                    ? "border-[#ff7a1a] bg-[#ff7a1a]/10 text-[#ff7a1a] shadow-[0_0_15px_rgba(255,122,26,0.1)]"
                                    : "border-white/5 bg-black/20 text-zinc-600 hover:border-white/10"
                                    }`}
                            >
                                +{age}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Links de Checkout */}
            <div className="admin-card space-y-[14px]">
                <div className="flex items-center gap-2 mb-1">
                    <ExternalLink className="w-4 h-4 text-[#ff7a1a]" />
                    <h3 className="admin-label !mb-0">
                        Páginas de Pagamento (Checkout)
                    </h3>
                </div>
                <div className="space-y-4">
                    {config.plans.map((plan, i) => (
                        <div key={plan.id} className="space-y-1.5">
                            <span className="text-[12px] text-zinc-500 ml-1">URL: {plan.name}</span>
                            <input
                                className="admin-input font-mono text-[11px]"
                                defaultValue={plan.checkoutUrl}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    updateConfig((prev) => ({
                                        ...prev,
                                        plans: prev.plans.map((p, idx) =>
                                            idx === i ? { ...p, checkoutUrl: val } : p
                                        ),
                                    }));
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Contato Telegram */}
            <div className="admin-card !p-0 overflow-hidden">
                <div className="flex items-center gap-2 px-5 pt-5 pb-3">
                    <MessageCircle className="w-4 h-4 text-[#ff7a1a]" />
                    <h3 className="admin-label !mb-0">
                        Contato Telegram
                    </h3>
                </div>

                <div className="px-5 divide-y divide-white/5 bg-zinc-900/40 border-y border-white/5">
                    <Toggle
                        label="Ativar botão do Telegram"
                        description="Exibir botão flutuante na página pública"
                        value={telegram.enabled}
                        onChange={(v) => setTelegram((p) => ({ ...p, enabled: v }))}
                    />
                    <Toggle
                        label="Ativar animação chamativa"
                        description="Efeito de pulso para atrair atenção"
                        value={telegram.enableAnimation}
                        onChange={(v) => setTelegram((p) => ({ ...p, enableAnimation: v }))}
                    />
                </div>

                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="admin-label">Usuário @</label>
                            <input
                                className="admin-input"
                                placeholder="ex: luizaVIP"
                                value={telegram.username}
                                onChange={(e) => setTelegram((p) => ({ ...p, username: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="admin-label">Cor do Botão</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    className="w-10 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer overflow-hidden p-0"
                                    value={telegram.buttonColor}
                                    onChange={(e) => setTelegram((p) => ({ ...p, buttonColor: e.target.value }))}
                                />
                                <input
                                    className="admin-input flex-1 font-mono text-[12px]"
                                    value={telegram.buttonColor}
                                    onChange={(e) => setTelegram((p) => ({ ...p, buttonColor: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="admin-label">Link Completo (Opcional)</label>
                        <input
                            className="admin-input font-mono text-[11px]"
                            placeholder="https://t.me/..."
                            value={telegram.link}
                            onChange={(e) => setTelegram((p) => ({ ...p, link: e.target.value }))}
                        />
                        <p className="text-[10px] text-zinc-600 px-1">Se preenchido, ignorará o campo "Usuário @".</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="admin-label">Texto do Balão (Tooltip)</label>
                        <input
                            className="admin-input"
                            placeholder="Comprar pelo Telegram"
                            value={telegram.tooltipText}
                            onChange={(e) => setTelegram((p) => ({ ...p, tooltipText: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="admin-card space-y-[14px]">
                <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-[#ff7a1a]" />
                    <h3 className="admin-label !mb-0">
                        Senha de Segurança
                    </h3>
                </div>
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <span className="text-[12px] text-zinc-500 ml-1">Senha do Painel</span>
                        <input
                            type="password"
                            placeholder="Sua password secreta"
                            className="admin-input tracking-widest"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`admin-btn-primary w-full gap-2 transition-all ${saved ? "bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.3)]" : ""}`}
                >
                    {saved ? (
                        <><CheckCircle2 size={18} /> Salvo com Sucesso!</>
                    ) : (
                        <><Save size={18} /> Salvar Tudo</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminCheckout;
