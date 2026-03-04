import { useState } from "react";
import { useSiteConfig } from "@/lib/siteConfig";
import { ShieldCheck, Layout, ExternalLink, Lock } from "lucide-react";

const AdminCheckout = () => {
    const { config, updateConfig } = useSiteConfig();
    const [settings, setSettings] = useState({ ...config.settings });
    const [password, setPassword] = useState(config.adminPassword);
    const [saved, setSaved] = useState(false);

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
        <div className="flex items-center justify-between py-4 border-b border-zinc-800 last:border-0">
            <div className="flex-1 pr-4">
                <p className="text-sm font-semibold text-white">{label}</p>
                {description && <p className="text-[10px] text-zinc-500 mt-0.5">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer flex-shrink-0 ${value ? "bg-white" : "bg-zinc-700"
                    }`}
            >
                <span className={`absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-300 shadow-sm ${value ? "translate-x-5 bg-zinc-900" : "translate-x-0 bg-white"
                    }`} />
            </button>
        </div>
    );

    return (
        <div className="space-y-6 pb-6 mt-2">
            {/* Display Settings */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 shadow-lg overflow-hidden">
                <div className="flex items-center gap-2 pt-5 pb-3">
                    <Layout className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Exibição do Perfil
                    </h3>
                </div>
                <div className="divide-y divide-zinc-800">
                    <Toggle
                        label="Mostrar contagem de assinantes"
                        value={settings.showSubscriberCount}
                        onChange={(v) => setSettings((p) => ({ ...p, showSubscriberCount: v }))}
                    />
                    <Toggle
                        label="Mostrar contagem de mídias"
                        value={settings.showMediaCount}
                        onChange={(v) => setSettings((p) => ({ ...p, showMediaCount: v }))}
                    />
                </div>
                <div className="py-5 border-t border-zinc-800">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Restrição de Idade</label>
                    <div className="flex gap-2">
                        {[16, 18, 21].map((age) => (
                            <button
                                key={age}
                                onClick={() => setSettings((p) => ({ ...p, ageRestriction: age }))}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${settings.ageRestriction === age
                                        ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                                        : "border-zinc-800 bg-zinc-800/30 text-zinc-500 hover:border-zinc-700"
                                    }`}
                            >
                                +{age}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Links de Checkout */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-5 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Links de Checkout
                    </h3>
                </div>
                <div className="space-y-4">
                    {config.plans.map((plan, i) => (
                        <div key={plan.id} className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{plan.name}</label>
                            <input
                                className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-zinc-800"
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

            {/* Security */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-5 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Segurança
                    </h3>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Senha de Acesso</label>
                    <input
                        type="password"
                        placeholder="Sua senha secreta"
                        className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-zinc-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-[10px] text-zinc-600 font-medium">
                        Esta senha é usada para proteger o acesso a este painel (/admin).
                    </p>
                </div>
            </div>

            <button onClick={handleSave} className="w-full bg-orange-500 hover:bg-orange-600 transition-colors py-4 rounded-2xl font-bold text-white shadow-lg shadow-orange-500/20 uppercase tracking-widest text-sm">
                {saved ? "✓ Configurações Salvas!" : "Salvar Tudo"}
            </button>
        </div>
    );
};

export default AdminCheckout;
