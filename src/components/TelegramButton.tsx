import React from "react";
import { useSiteConfig } from "@/lib/siteConfig";
import { Send, MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const TelegramButton = () => {
    const { config } = useSiteConfig();
    const location = useLocation();
    const { telegram } = config.settings;

    // Hide if disabled or in admin panel
    if (!telegram?.enabled || location.pathname.startsWith("/admin")) {
        return null;
    }

    const handleClick = () => {
        const url = telegram.link || `https://t.me/${telegram.username}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="fixed bottom-[90px] right-[20px] z-[999] flex flex-col items-end group">
            {/* Tooltip */}
            <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-zinc-900 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg border border-white/10 shadow-xl whitespace-nowrap">
                    {telegram.tooltipText || "Comprar pelo Telegram"}
                </div>
                {/* Tooltip Arrow */}
                <div className="w-2 h-2 bg-zinc-900 border-r border-b border-white/10 rotate-45 mx-auto -mt-1 relative left-[40%]" />
            </div>

            {/* Button */}
            <button
                onClick={handleClick}
                style={{ backgroundColor: telegram.buttonColor || "#229ED9" }}
                className={`w-[56px] h-[56px] rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 ${telegram.enableAnimation ? "animate-tele-pulse" : ""
                    }`}
            >
                <Send size={26} className="relative -left-0.5 mt-0.5" />
            </button>
        </div>
    );
};

export default TelegramButton;
