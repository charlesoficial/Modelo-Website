import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Zap, Star, Crown, Gem } from "lucide-react";
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
        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg">
            <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4 bg-zinc-900 text-left transition-colors hover:bg-zinc-800/50"
                onClick={() => setOpen((o) => !o)}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${plan.active ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-800 text-zinc-500'}`}>
                        <PlanIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-bold text-sm block text-white">{plan.name}</span>
                        <span className="text-zinc-500 text-xs">R${plan.price}/mês</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!plan.active && <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Inativo</span>}
                    {open ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>
            </button>

            {open && (
                <div className="px-5 pb-5 pt-2 space-y-5 bg-zinc-900 border-t border-zinc-800">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Nome</label>
                            <input
                                className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                value={plan.name}
                                onChange={(e) => onChange({ ...plan, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Preço (R$)</label>
                            <input
                                className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                value={plan.price}
                                onChange={(e) => onChange({ ...plan, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Badge (ex: MAIS ESCOLHIDO)</label>
                        <input
                            className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            value={plan.label}
                            onChange={(e) => onChange({ ...plan, label: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Link de Checkout</label>
                        <input
                            className="w-full bg-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            value={plan.checkoutUrl}
                            onChange={(e) => onChange({ ...plan, checkoutUrl: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-2">Ícone</label>
                        <div className="grid grid-cols-4 gap-2">
                            {ICONS.map((icon) => {
                                const Icon = IconMap[icon];
                                return (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => onChange({ ...plan, icon })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${plan.icon === icon
                                                ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                                                : "border-zinc-800 bg-zinc-800/30 text-zinc-500 hover:border-zinc-700"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Benefícios</label>
                            <button onClick={addFeature} className="text-orange-500 text-xs font-bold flex items-center gap-1 hover:text-orange-400 transition-colors">
                                <Plus className="w-3 h-3" /> ADICIONAR
                            </button>
                        </div>
                        <div className="space-y-2">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input
                                        className="flex-1 bg-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                        value={f}
                                        onChange={(e) => updateFeature(i, e.target.value)}
                                    />
                                    <button onClick={() => removeFeature(i)} className="p-2.5 text-zinc-600 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-3">
                        <div className="flex items-center justify-between bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">Status do Plano</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{plan.active ? "Ativo no site" : "Oculto no site"}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onChange({ ...plan, active: !plan.active })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer ${plan.active ? "bg-white" : "bg-zinc-700"
                                    }`}
                            >
                                <span className={`absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-300 ${plan.active ? "translate-x-5 bg-zinc-900" : "translate-x-0 bg-white"
                                    }`} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onDelete}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider hover:bg-red-500/5 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Remover este plano
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
        <div className="space-y-6 pb-6 mt-2">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white">Seus Planos</h2>
                <button
                    onClick={addPlan}
                    className="bg-zinc-900 border border-orange-500/30 text-orange-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-500/5 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> NOVO PLANO
                </button>
            </div>

            <div className="space-y-4">
                {plans.map((plan, i) => (
                    <PlanEditor
                        key={plan.id}
                        plan={plan}
                        onChange={(updated) => updatePlan(i, updated)}
                        onDelete={() => deletePlan(i)}
                    />
                ))}
            </div>

            <button onClick={handleSave} className="w-full bg-orange-500 hover:bg-orange-600 transition-colors py-4 rounded-2xl font-bold text-white shadow-lg shadow-orange-500/20 uppercase tracking-widest text-sm">
                {saved ? "✓ Salvo com sucesso!" : "Salvar Configurações"}
            </button>
        </div>
    );
};

export default AdminPlans;
