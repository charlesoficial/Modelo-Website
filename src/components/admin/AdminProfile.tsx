import { useState, useRef } from "react";
import { Camera, User } from "lucide-react";
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
        <div className="space-y-5">
            {/* Banner */}
            <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg space-y-3">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Banner</h2>
                <div
                    className="relative w-full h-32 rounded-xl overflow-hidden cursor-pointer group border border-zinc-700"
                    onClick={() => bannerRef.current?.click()}
                >
                    {form.bannerImage ? (
                        <img src={form.bannerImage} className="w-full h-full object-cover" alt="Banner" />
                    ) : (
                        <div className="w-full h-full bg-zinc-800 flex flex-col items-center justify-center gap-2 text-gray-500">
                            <Camera className="w-7 h-7" />
                            <span className="text-xs">Toque para trocar</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-7 h-7 text-white" />
                    </div>
                </div>
                <input ref={bannerRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "bannerImage")} />
            </div>

            {/* Profile Photo */}
            <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Foto de Perfil</h2>
                <div className="flex flex-col items-center space-y-3">
                    <div
                        className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group border-2 border-zinc-700"
                        onClick={() => profileRef.current?.click()}
                    >
                        {form.profileImage ? (
                            <img src={form.profileImage} className="w-full h-full object-cover" alt="Perfil" />
                        ) : (
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                <User className="w-10 h-10 text-gray-500" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <button onClick={() => profileRef.current?.click()}
                        className="bg-zinc-800 hover:bg-zinc-700 transition-colors px-4 py-2 rounded-lg text-sm text-gray-300">
                        Trocar foto
                    </button>
                </div>
                <input ref={profileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "profileImage")} />
            </div>

            {/* Info */}
            <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg space-y-4">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Informações</h2>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Nome de exibição</label>
                    <input className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        value={form.displayName}
                        onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Bio</label>
                    <textarea className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-[80px]"
                        value={form.bio}
                        onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mensagem de bloqueio</label>
                    <input className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        value={form.lockedMessage}
                        onChange={(e) => setForm((p) => ({ ...p, lockedMessage: e.target.value }))} />
                </div>
            </div>

            {/* Stats */}
            <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg space-y-4">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Estatísticas</h2>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { key: "posts", label: "Publicações" },
                        { key: "subscribers", label: "Assinantes" },
                        { key: "mediaCount", label: "Mídias" },
                    ].map(({ key, label }) => (
                        <div key={key} className="space-y-1.5">
                            <label className="text-xs text-gray-400 text-center block">{label}</label>
                            <input
                                className="w-full bg-zinc-800 rounded-xl px-2 py-2.5 text-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={String(stats[key as keyof typeof stats])}
                                onChange={(e) => setStats((p) => ({ ...p, [key]: e.target.value }))}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleSave}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-colors py-3.5 rounded-xl font-semibold text-white">
                {saved ? "✓ Salvo!" : "Salvar Alterações"}
            </button>
        </div>
    );
};

export default AdminProfile;
