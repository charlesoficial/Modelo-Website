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
    { id: "perfil", label: "Perfil", icon: <User className="w-5 h-5" /> },
    { id: "planos", label: "Planos", icon: <CreditCard className="w-5 h-5" /> },
    { id: "midias", label: "Mídias", icon: <Image className="w-5 h-5" /> },
    { id: "config", label: "Config", icon: <Settings className="w-5 h-5" /> },
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
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className={`w-full max-w-md ${shake ? "animate-shake" : ""}`}>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                        <Lock className="w-8 h-8 text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
                    <p className="text-gray-400 text-sm mt-1">Digite sua senha para continuar</p>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Senha</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                className={`w-full bg-zinc-800 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest placeholder:text-gray-600 focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500 ring-2 ring-red-500" : "focus:ring-orange-500"
                                    } transition-all`}
                            />
                        </div>
                        {error && (
                            <p className="text-red-400 text-sm text-center">Senha incorreta</p>
                        )}
                        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 transition-colors py-3 rounded-xl font-semibold text-white">
                            Entrar
                        </button>
                    </form>
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
        <div className="min-h-screen bg-black text-white flex justify-center">
            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <p className="text-sm text-gray-400">Conectando ao Supabase...</p>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-zinc-800 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-base text-white">Painel Admin</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                {isSupabaseConfigured ? (
                                    loading ? (
                                        <><Loader2 className="w-3 h-3 animate-spin text-gray-500" /><span className="text-xs text-gray-500">Sincronizando...</span></>
                                    ) : (
                                        <><Database className="w-3 h-3 text-orange-500" /><span className="text-xs text-orange-500">{source === "supabase" ? "Supabase" : "Cache local"}</span></>
                                    )
                                ) : (
                                    <><WifiOff className="w-3 h-3 text-yellow-500" /><span className="text-xs text-yellow-500">Modo offline</span></>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href="/"
                                target="_blank"
                                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5"
                            >
                                <Eye className="w-3.5 h-3.5" /> Ver site
                            </a>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5"
                            >
                                <LogOut className="w-3.5 h-3.5" /> Sair
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 px-4 py-5 pb-28 space-y-5">
                    {tabs[tab]}
                </main>

                {/* Bottom Tab Bar */}
                <nav className="fixed bottom-0 left-0 right-0 z-40">
                    <div className="max-w-md mx-auto bg-zinc-950 border-t border-zinc-800 flex justify-around py-2">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${tab === t.id ? "text-orange-500" : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                {t.icon}
                                <span className="text-[10px] font-medium">{t.label}</span>
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
