import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface Plan {
    id: string;
    name: string;
    price: string;
    icon: "zap" | "star" | "crown" | "gem";
    features: string[];
    featured: boolean;
    label: string;
    checkoutUrl: string;
    active: boolean;
}

export interface SiteConfig {
    profile: {
        displayName: string;
        bio: string;
        lockedMessage: string;
        profileImage: string | null;
        bannerImage: string | null;
    };
    stats: {
        posts: number;
        subscribers: string;
        mediaCount: number;
    };
    plans: Plan[];
    settings: {
        ageRestriction: number;
        showSubscriberCount: boolean;
        showMediaCount: boolean;
        telegram: {
            enabled: boolean;
            username: string;
            link: string;
            buttonColor: string;
            tooltipText: string;
            enableAnimation: boolean;
        };
    };
    previews: {
        images: (string | null)[];
    };
    adminPassword: string;
}

export const DEFAULT_CONFIG: SiteConfig = {
    profile: {
        displayName: "Luiza Sp",
        bio: "Conteúdo exclusivo que você não encontra em nenhum outro lugar 🖤",
        lockedMessage: "Conteúdo exclusivo para assinantes",
        profileImage: null,
        bannerImage: null,
    },
    stats: {
        posts: 248,
        subscribers: "1.2k",
        mediaCount: 47,
    },
    plans: [
        {
            id: "basic",
            name: "Básico",
            price: "14,90",
            icon: "zap",
            features: ["Conteúdos leves e exclusivos", "Acesso inicial ao perfil", "Atualizações semanais"],
            featured: false,
            label: "",
            checkoutUrl: "http://app.syncpayments.com.br/payment-link/a114f2a4-b230-44e2-b554-08f9bdc891f0",
            active: true,
        },
        {
            id: "plus",
            name: "Plus",
            price: "30,90",
            icon: "star",
            features: ["Conteúdos mais completos e frequentes", "Vídeos exclusivos", "Acesso a fotos inéditas"],
            featured: false,
            label: "",
            checkoutUrl: "http://app.syncpayments.com.br/payment-link/a114f39e-f558-4bc7-9ef5-c28664b16497",
            active: true,
        },
        {
            id: "vip",
            name: "VIP",
            price: "60,90",
            icon: "crown",
            features: ["Conteúdos premium e explícitos", "Vídeos longos e exclusivos", "Drops semanais VIP", "Prioridade no atendimento"],
            featured: true,
            label: "Mais escolhido",
            checkoutUrl: "http://app.syncpayments.com.br/payment-link/a114f78d-6482-425e-bfab-4d41ffbab210",
            active: true,
        },
        {
            id: "elite",
            name: "Elite",
            price: "157,90",
            icon: "gem",
            features: ["Acesso total e ilimitado", "Conteúdos ultra exclusivos", "Materiais que não vão para outros planos", "Experiência máxima e privada"],
            featured: true,
            label: "Exclusivo",
            checkoutUrl: "http://app.syncpayments.com.br/payment-link/a114f888-c68b-4410-91fc-1049f33a09f2",
            active: true,
        },
    ],
    settings: {
        ageRestriction: 18,
        showSubscriberCount: true,
        showMediaCount: true,
        telegram: {
            enabled: true,
            username: "luizaVIP",
            link: "https://t.me/luizaVIP",
            buttonColor: "#229ED9",
            tooltipText: "Comprar pelo Telegram",
            enableAnimation: true,
        },
    },
    previews: {
        images: [null, null, null],
    },
    adminPassword: "admin123",
};

const STORAGE_KEY = "luiza_site_config";

// ─── localStorage (offline cache) ────────────────────────────────────────────

export function loadConfigFromStorage(): SiteConfig {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                ...DEFAULT_CONFIG,
                ...parsed,
                profile: { ...DEFAULT_CONFIG.profile, ...parsed.profile },
                stats: { ...DEFAULT_CONFIG.stats, ...parsed.stats },
                settings: {
                    ...DEFAULT_CONFIG.settings,
                    ...parsed.settings,
                    telegram: { ...DEFAULT_CONFIG.settings.telegram, ...parsed.settings?.telegram }
                },
                previews: { ...DEFAULT_CONFIG.previews, ...parsed.previews },
            };
        }
    } catch {
        // ignore
    }
    return DEFAULT_CONFIG;
}

function saveConfigToStorage(config: SiteConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("siteConfigChanged"));
}

// Alias kept for backwards compatibility with Admin components
export const loadConfig = loadConfigFromStorage;

// ─── Supabase (cloud) ─────────────────────────────────────────────────────────

/** Map DB row → SiteConfig */
function rowToConfig(row: Record<string, unknown>): SiteConfig {
    return {
        profile: (row.profile as SiteConfig["profile"]) ?? DEFAULT_CONFIG.profile,
        stats: (row.stats as SiteConfig["stats"]) ?? DEFAULT_CONFIG.stats,
        plans: (row.plans as Plan[]) ?? DEFAULT_CONFIG.plans,
        settings: (row.settings as SiteConfig["settings"]) ?? DEFAULT_CONFIG.settings,
        previews: (row.previews as SiteConfig["previews"]) ?? DEFAULT_CONFIG.previews,
        adminPassword: (row.admin_password as string) ?? DEFAULT_CONFIG.adminPassword,
    };
}

/** Map SiteConfig → DB update object */
function configToRow(config: SiteConfig) {
    return {
        profile: config.profile,
        stats: config.stats,
        plans: config.plans,
        settings: config.settings,
        previews: config.previews,
        admin_password: config.adminPassword,
    };
}

export async function fetchConfigFromSupabase(): Promise<SiteConfig | null> {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from("site_config")
            .select("*")
            .eq("id", "main")
            .single();
        if (error || !data) return null;
        return rowToConfig(data as Record<string, unknown>);
    } catch {
        return null;
    }
}

export async function saveConfigToSupabase(config: SiteConfig): Promise<boolean> {
    if (!supabase) return false;
    try {
        const { error } = await supabase
            .from("site_config")
            .update(configToRow(config))
            .eq("id", "main");
        return !error;
    } catch {
        return false;
    }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSiteConfig() {
    // Start from localStorage cache while waiting for Supabase
    const [config, setConfigState] = useState<SiteConfig>(loadConfigFromStorage);
    const [loading, setLoading] = useState(isSupabaseConfigured);
    const [source, setSource] = useState<"local" | "supabase">("local");

    // Load from Supabase on mount (if configured)
    useEffect(() => {
        if (!isSupabaseConfigured) return;
        let cancelled = false;
        fetchConfigFromSupabase().then((remoteConfig) => {
            if (cancelled) return;
            if (remoteConfig) {
                setConfigState(remoteConfig);
                saveConfigToStorage(remoteConfig); // update local cache
                setSource("supabase");
            }
            setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    // Listen for localStorage changes (from other tabs or admin)
    useEffect(() => {
        const handler = () => setConfigState(loadConfigFromStorage());
        window.addEventListener("siteConfigChanged", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteConfigChanged", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    const updateConfig = useCallback(
        async (updater: (prev: SiteConfig) => SiteConfig) => {
            const next = updater(config);
            // 1. Immediately update local state + localStorage cache
            setConfigState(next);
            saveConfigToStorage(next);
            // 2. Persist to Supabase in the background
            if (isSupabaseConfigured) {
                const ok = await saveConfigToSupabase(next);
                if (ok) setSource("supabase");
            }
        },
        [config]
    );

    return { config, updateConfig, loading, source };
}
