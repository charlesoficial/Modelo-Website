import { useState, useRef } from "react";
import { Camera, User, Image as ImageIcon, Save, CheckCircle2 } from "lucide-react";
import { useSiteConfig } from "@/lib/siteConfig";

const AdminProfile = () => {
    const { config, updateConfig } = useSiteConfig();
    const [form, setForm] = useState({ ...config.profile });
    const [stats, setStats] = useState({ ...config.stats });
    const [saved, setSaved] = useState(false);
    const profileRef = useRef<HTMLInputElement>(null);
    const bannerRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (file: File, field: "profileImage" | "bannerImage") => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            setForm((prev) => ({ ...prev, [field]: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        updateConfig((prev) => ({ ...prev, profile: form, stats }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-[24px]">
            {/* Banner Section */}
            <div className="admin-card space-y-[14px]">
                <label className="admin-label">Redefinir Banner</label>
                <div
                    className="relative w-full h-36 rounded-[14px] overflow-hidden cursor-pointer group border border-white/5 bg-zinc-900/40"
                    onClick={() => bannerRef.current?.click()}
                >
                    {form.bannerImage ? (
                        <img src={form.bannerImage} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Banner" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-600">
                            <ImageIcon size={32} strokeWidth={1.5} />
                            <span className="text-[12px] font-medium">Toque para adicionar banner</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Camera size={24} className="text-white" />
                    </div>
                </div>
                <input ref={bannerRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "bannerImage")} />
            </div>

            {/* Profile Photo Section */}
            <div className="admin-card space-y-[14px] flex flex-col items-center">
                <label className="admin-label w-full text-left">Foto de Perfil</label>
                <div
                    className="relative w-28 h-28 rounded-full overflow-hidden cursor-pointer group border-2 border-white/5 bg-zinc-900/40"
                    onClick={() => profileRef.current?.click()}
                >
                    {form.profileImage ? (
                        <img src={form.profileImage} className="w-full h-full object-cover" alt="Perfil" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <User size={40} strokeWidth={1.5} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Camera size={24} className="text-white" />
                    </div>
                </div>
                <button
                    onClick={() => profileRef.current?.click()}
                    className="admin-btn-secondary w-fit px-6 h-[38px] text-[13px]"
                >
                    Alterar Foto
                </button>
                <input ref={profileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "profileImage")} />
            </div>

            {/* General Info Card */}
            <div className="admin-card space-y-[14px]">
                <label className="admin-label">Informações Gerais</label>

                <div className="space-y-1.5">
                    <span className="text-[13px] text-zinc-400 ml-1">Nome de exibição</span>
                    <input
                        className="admin-input"
                        placeholder="Ex: Luiza Sp"
                        value={form.displayName}
                        onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
                    />
                </div>

                <div className="space-y-1.5">
                    <span className="text-[13px] text-zinc-400 ml-1">Biografia curta</span>
                    <textarea
                        className="admin-input min-h-[100px] py-3 leading-relaxed"
                        placeholder="Fale um pouco sobre você..."
                        value={form.bio}
                        onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    />
                </div>

                <div className="space-y-1.5">
                    <span className="text-[13px] text-zinc-400 ml-1">Mensagem de bloqueio</span>
                    <input
                        className="admin-input"
                        placeholder="Texto que aparece sobre as mídias bloqueadas"
                        value={form.lockedMessage}
                        onChange={(e) => setForm((p) => ({ ...p, lockedMessage: e.target.value }))}
                    />
                </div>
            </div>

            {/* Realtime Stats Card */}
            <div className="admin-card space-y-[16px]">
                <label className="admin-label">Contadores do Perfil</label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { key: "posts", label: "Posts" },
                        { key: "subscribers", label: "Assinantes" },
                        { key: "mediaCount", label: "Mídias" },
                    ].map(({ key, label }) => (
                        <div key={key} className="space-y-2">
                            <span className="text-[11px] text-zinc-500 uppercase font-bold tracking-tighter text-center block">{label}</span>
                            <input
                                className="admin-input text-center font-semibold"
                                value={String(stats[key as keyof typeof stats])}
                                onChange={(e) => setStats((p) => ({ ...p, [key]: e.target.value }))}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action / Save Button */}
            <div className="pt-2">
                <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`admin-btn-primary w-full gap-2 transition-all ${saved ? "bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.3)]" : ""}`}
                >
                    {saved ? (
                        <><CheckCircle2 size={18} /> Alterações Salvas!</>
                    ) : (
                        <><Save size={18} /> Salvar Tudo</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminProfile;
