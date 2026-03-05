import { useState, useEffect } from "react";
import { User, CreditCard, Image, Settings, LogOut, Eye, Lock, Loader2, Database, WifiOff } from "lucide-react";
import { loadConfig, useSiteConfig } from "@/lib/siteConfig";
import { isSupabaseConfigured } from "@/lib/supabase";
import AdminProfile from "@/components/admin/AdminProfile";
import AdminPlans from "@/components/admin/AdminPlans";
import AdminMedia from "@/components/admin/AdminMedia";
import AdminCheckout from "@/components/admin/AdminCheckout";

type Tab = "perfil" | "planos" | "midias" | "config";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "perfil", label: "Perfil", icon: <User size={20} /> },
    { id: "planos", label: "Planos", icon: <CreditCard size={20} /> },
    { id: "midias", label: "Mídias", icon: <Image size={20} /> },
    { id: "config", label: "Config", icon: <Settings size={20} /> },
];

// ── Login Screen ──────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const config = loadConfig();
        if (password === config.adminPassword) {
            sessionStorage.setItem("adminAuth", "true");
            onLogin();
        } else {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-5">
            <div className={`w-full max-w-[420px] ${shake ? "animate-shake" : ""}`}>
                <div className="admin-card space-y-6 text-center">
                    <div className="w-14 h-14 bg-zinc-900/50 rounded-2xl flex items-center justify-center mx-auto border border-white/5">
                        <Lock className="w-6 h-6 text-[#ff7a1a]" />
                    </div>

                    <div>
                        <h1 className="text-[20px] font-semibold text-white mb-1">Painel da Criadora</h1>
                        <p className="text-[13px] text-zinc-500 leading-relaxed px-4">
                            Gerencie seu conteúdo exclusivo, planos e mídias com segurança.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5 text-left">
                            <label className="admin-label">Senha de Acesso</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                className={`admin-input text-center text-lg tracking-[0.3em] ${error ? "border-red-500/50 focus:border-red-500" : ""}`}
                            />
                        </div>

                        <button type="submit" className="admin-btn-primary w-full">
                            Entrar no Painel
                        </button>
                    </form>

                    <p className="text-[11px] text-zinc-600 italic">
                        Apenas administradores autorizados podem acessar este painel.
                    </p>
                </div>
            </div>
        </div>
    );
};

// ── Admin Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
    const [tab, setTab] = useState<Tab>("perfil");
    const { loading, source } = useSiteConfig();

    const tabs: Record<Tab, React.ReactNode> = {
        perfil: <AdminProfile />,
        planos: <AdminPlans />,
        midias: <AdminMedia />,
        config: <AdminCheckout />,
    };

    return (
        <div className="min-h-screen bg-black text-white flex justify-center selection:bg-[#ff7a1a]/30">
            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#ff7a1a]" />
                        <p className="text-sm text-zinc-400">Sincronizando dados...</p>
                    </div>
                </div>
            )}

            <div className="w-full max-w-[420px] flex flex-col min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex flex-col">
                        <h1 className="font-bold text-[18px] leading-tight">Painel Admin</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {isSupabaseConfigured ? (
                                loading ? (
                                    <><Loader2 className="w-3 h-3 animate-spin text-zinc-500" /><span className="text-[10px] text-zinc-500">Sincronizando...</span></>
                                ) : (
                                    <><Database className="w-3 h-3 text-[#ff7a1a]" /><span className="text-[10px] text-[#ff7a1a] font-medium uppercase tracking-wider">{source === "supabase" ? "Supabase" : "Cache Local"}</span></>
                                )
                            ) : (
                                <><WifiOff className="w-3 h-3 text-yellow-500" /><span className="text-[10px] text-yellow-500 font-medium uppercase tracking-wider">Modo Offline</span></>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="/"
                            target="_blank"
                            className="w-9 h-9 flex items-center justify-center bg-zinc-900 rounded-xl border border-white/5 text-zinc-400 hover:text-white transition-colors"
                            title="Ver site"
                        >
                            <Eye size={18} />
                        </a>
                        <button
                            onClick={onLogout}
                            className="w-9 h-9 flex items-center justify-center bg-zinc-900 rounded-xl border border-white/5 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Sair"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-5 pb-24 space-y-6">
                    {tabs[tab]}
                </main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 z-40 h-[70px] bg-black/80 backdrop-blur-lg border-t border-white/5 flex items-center justify-center">
                    <div className="w-full max-w-[420px] px-6 flex justify-between items-center">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex flex-col items-center justify-center gap-1 px-2 transition-all ${tab === t.id ? "text-[#ff7a1a] scale-110" : "text-zinc-600 hover:text-zinc-400"
                                    }`}
                            >
                                {t.icon}
                                <span className={`text-[10px] font-semibold uppercase tracking-tighter ${tab === t.id ? "opacity-100" : "opacity-0 invisible"}`}>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Admin = () => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("adminAuth") === "true") setAuthenticated(true);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("adminAuth");
        setAuthenticated(false);
    };

    return authenticated
        ? <AdminDashboard onLogout={handleLogout} />
        : <LoginScreen onLogin={() => setAuthenticated(true)} />;
};

export default Admin;
