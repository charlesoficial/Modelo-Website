import { useState, useRef } from "react";
import { Camera, Trash2, Image as ImageIcon, CheckCircle2, Save } from "lucide-react";
import { useSiteConfig } from "@/lib/siteConfig";

const AdminMedia = () => {
    const { config, updateConfig } = useSiteConfig();
    const [images, setImages] = useState([...config.previews.images]);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentIdx = useRef<number | null>(null);

    const handleImageUpload = (file: File, index: number) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            const newImages = [...images];
            newImages[index] = base64;
            setImages(newImages);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
    };

    const handleSave = () => {
        updateConfig((prev) => ({
            ...prev,
            previews: { images },
        }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-[24px]">
            <div className="flex flex-col px-1">
                <h2 className="text-[17px] font-bold text-white leading-tight">Mídias de Prévia</h2>
                <p className="text-[12px] text-zinc-500">Imagens que aparecem borradas para visitantes</p>
            </div>

            <div className="admin-card space-y-[14px]">
                <label className="admin-label">Galeria de Exposição</label>

                <div className="grid grid-cols-1 gap-4">
                    {images.map((img, i) => (
                        <div key={i} className="group relative aspect-video w-full bg-black/40 rounded-[14px] overflow-hidden border border-white/5">
                            {img ? (
                                <>
                                    <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={`Preview ${i + 1}`} />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                        <button
                                            onClick={() => {
                                                currentIdx.current = i;
                                                fileInputRef.current?.click();
                                            }}
                                            className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all border border-white/20"
                                            title="Trocar Imagem"
                                        >
                                            <Camera size={22} />
                                        </button>
                                        <button
                                            onClick={() => removeImage(i)}
                                            className="w-12 h-12 flex items-center justify-center bg-red-500/20 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500/40 transition-all border border-red-500/30"
                                            title="Remover"
                                        >
                                            <Trash2 size={22} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        currentIdx.current = i;
                                        fileInputRef.current?.click();
                                    }}
                                    className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-600 hover:text-[#ff7a1a] hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:border-[#ff7a1a]/30 transition-all">
                                        <ImageIcon size={24} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Adicionar Espaço {i + 1}</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.[0] && currentIdx.current !== null) {
                        handleImageUpload(e.target.files[0], currentIdx.current);
                    }
                }}
            />

            <div className="pt-2">
                <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`admin-btn-primary w-full gap-2 transition-all ${saved ? "bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.3)]" : ""}`}
                >
                    {saved ? (
                        <><CheckCircle2 size={18} /> Mídias Atualizadas!</>
                    ) : (
                        <><Save size={18} /> Salvar Galeria</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminMedia;
