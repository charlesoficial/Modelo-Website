import { Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { useSiteConfig } from "@/lib/siteConfig";
import defaultPreview1 from "@/assets/foto-preview-1.jpg";
import defaultPreview2 from "@/assets/foto-preview-2.jpg";
import defaultPreview3 from "@/assets/foto-preview-3.jpg";

const DEFAULTS = [defaultPreview1, defaultPreview2, defaultPreview3];

const BlurredPreviews = () => {
  const { config } = useSiteConfig();
  const [unlockedIndex, setUnlockedIndex] = useState<number | null>(null);

  const previews = config.previews.images.map((img, i) => img || DEFAULTS[i]);

  const handleLockClick = (index: number) => {
    setUnlockedIndex(index);
    setTimeout(() => setUnlockedIndex(null), 3000);
  };

  return (
    <section className="px-4 py-10 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-serif font-semibold text-center mb-2">
        Prévia do conteúdo
      </h2>
      <p className="text-muted-foreground text-xs text-center mb-6 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" />
        Assine para desbloquear
      </p>

      <div className="grid grid-cols-3 gap-3">
        {previews.map((src, i) => (
          <div
            key={i}
            className={`${unlockedIndex === i ? "relative" : "blur-content"
              } aspect-[3/4] opacity-0 animate-fade-in transition-all duration-300`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <img
              src={src}
              alt="Conteúdo exclusivo bloqueado"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleLockClick(i)}
            >
              {unlockedIndex === i ? (
                <Unlock className="w-6 h-6 text-green-500 animate-pulse" />
              ) : (
                <Lock className="w-6 h-6 text-foreground/70" />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlurredPreviews;
