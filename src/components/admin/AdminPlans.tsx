import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Zap, Star, Crown, Gem, CheckCircle2, Save } from "lucide-react";
import { useSiteConfig, type Plan } from "@/lib/siteConfig";

const ICONS = ["zap", "star", "crown", "gem"] as const;

const IconMap = {
    zap: Zap,
    star: Star,
    crown: Crown,
    gem: Gem,
};

const PlanEditor = ({
    plan,
    onChange,
    onDelete,
}: {
    plan: Plan;
    onChange: (updated: Plan) => void;
    onDelete: () => void;
}) => {
    const [open, setOpen] = useState(false);

    const updateFeature = (i: number, val: string) => {
        const features = [...plan.features];
        features[i] = val;
        onChange({ ...plan, features });
    };

    const addFeature = () => onChange({ ...plan, features: [...plan.features, ""] });
    const removeFeature = (i: number) =>
        onChange({ ...plan, features: plan.features.filter((_, idx) => idx !== i) });

    const PlanIcon = IconMap[plan.icon as keyof typeof IconMap] || Star;

    return (
        <div className="admin-card !p-0 overflow-hidden">
            <button
                type="button"
                className="w-full flex items-center justify-between px-[18px] py-4 text-left transition-colors hover:bg-white/5"
                onClick={() => setOpen((o) => !o)}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 ${plan.active ? 'bg-[#ff7a1a]/10 text-[#ff7a1a]' : 'bg-zinc-900 text-zinc-600'}`}>
                        <PlanIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-bold text-[14px] text-white leading-tight block">{plan.name}</span>
                        <span className="text-zinc-500 text-[12px]">R${plan.price}/mês</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!plan.active && <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2.5 py-1 rounded-full uppercase font-bold tracking-tighter border border-white/5">Inativo</span>}
                    <div className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                        <ChevronDown size={18} className="text-zinc-600" />
                    </div>
                </div>
            </button>

            {open && (
                <div className="px-[18px] pb-5 pt-2 space-y-[14px] border-t border-white/5 bg-zinc-900/40">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <span className="text-[12px] text-zinc-500 ml-1">Nome do Plano</span>
                            <input
                                className="admin-input"
                                value={plan.name}
                                onChange={(e) => onChange({ ...plan, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[12px] text-zinc-500 ml-1">Preço Mensal</span>
                            <input
                                className="admin-input"
                                value={plan.price}
                                onChange={(e) => onChange({ ...plan, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <span className="text-[12px] text-zinc-500 ml-1">Destaque (Círio/Badge)</span>
                        <input
                            className="admin-input"
                            placeholder="Ex: MAIS ESCOLHIDO"
                            value={plan.label}
                            onChange={(e) => onChange({ ...plan, label: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <span className="text-[12px] text-zinc-500 ml-1">Link de Checkout</span>
                        <input
                            className="admin-input font-mono text-[11px]"
                            placeholder="https://pay.exemplo.com/..."
                            value={plan.checkoutUrl}
                            onChange={(e) => onChange({ ...plan, checkoutUrl: e.target.value })}
                        />
                    </div>

                    <div className="space-y-[14px]">
                        <span className="admin-label">Ícone de Identificação</span>
                        <div className="grid grid-cols-4 gap-2">
                            {ICONS.map((icon) => {
                                const Icon = IconMap[icon];
                                return (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => onChange({ ...plan, icon })}
                                        className={`flex flex-col items-center justify-center h-12 rounded-xl border transition-all ${plan.icon === icon
                                            ? "border-[#ff7a1a] bg-[#ff7a1a]/10 text-[#ff7a1a] shadow-[0_0_15px_rgba(255,122,26,0.1)]"
                                            : "border-white/5 bg-black/20 text-zinc-600 hover:border-white/10"
                                            }`}
                                    >
                                        <Icon size={18} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="admin-label !mb-0 text-zinc-400">Benefícios inclusos</span>
                            <button onClick={addFeature} className="text-[#ff7a1a] text-[11px] font-bold flex items-center gap-1 hover:opacity-80">
                                <Plus size={14} /> ADICIONAR
                            </button>
                        </div>
                        <div className="space-y-2">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input
                                        className="admin-input h-[36px] flex-1 text-[13px]"
                                        value={f}
                                        onChange={(e) => updateFeature(i, e.target.value)}
                                    />
                                    <button onClick={() => removeFeature(i)} className="w-[36px] h-[36px] flex items-center justify-center text-zinc-600 hover:text-red-500 transition-colors bg-black/20 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 space-y-3 border-t border-white/5 mt-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[13px] font-medium text-white">Plano Ativo</span>
                                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{plan.active ? "Visível no site" : "Oculto"}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onChange({ ...plan, active: !plan.active })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer ${plan.active ? "bg-[#ff7a1a]" : "bg-zinc-800"
                                    }`}
                            >
                                <span className={`absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-300 shadow-sm ${plan.active ? "translate-x-5 bg-white" : "translate-x-0 bg-zinc-500"
                                    }`} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onDelete}
                            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-[12px] font-bold uppercase tracking-wider"
                        >
                            <Trash2 size={14} /> Excluir Plano
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminPlans = () => {
    const { config, updateConfig } = useSiteConfig();
    const [plans, setPlans] = useState([...config.plans]);
    const [saved, setSaved] = useState(false);

    const updatePlan = (i: number, updated: Plan) => {
        setPlans((prev) => prev.map((p, idx) => (idx === i ? updated : p)));
    };

    const deletePlan = (i: number) => setPlans((prev) => prev.filter((_, idx) => idx !== i));

    const addPlan = () =>
        setPlans((prev) => [
            ...prev,
            {
                id: `plan_${Date.now()}`,
                name: "Novo Plano",
                price: "0,00",
                icon: "star" as const,
                features: ["Benefício 1"],
                featured: false,
                label: "",
                checkoutUrl: "",
                active: true,
            },
        ]);

    const handleSave = () => {
        updateConfig((prev) => ({ ...prev, plans }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-[24px] pb-6">
            <div className="flex items-center justify-between px-1">
                <div className="flex flex-col">
                    <h2 className="text-[17px] font-bold text-white leading-tight">Configurar Assinaturas</h2>
                    <p className="text-[12px] text-zinc-500">Gerencie seus planos de acesso</p>
                </div>
                <button
                    onClick={addPlan}
                    className="admin-btn-secondary h-[36px] px-4 text-[11px] font-bold flex items-center gap-2"
                >
                    <Plus size={14} /> NOVO PLANO
                </button>
            </div>

            <div className="space-y-[14px]">
                {plans.map((plan, i) => (
                    <PlanEditor
                        key={plan.id}
                        plan={plan}
                        onChange={(updated) => updatePlan(i, updated)}
                        onDelete={() => deletePlan(i)}
                    />
                ))}
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
                        <><Save size={18} /> Salvar Todos os Planos</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminPlans;
