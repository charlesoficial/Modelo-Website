import { useState, useRef } from "react";
import { Camera, Trash2, Image as ImageIcon } from "lucide-react";
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
        <div className="space-y-6">
            <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-white">Mídias de Prévia</h2>
                    <p className="text-xs text-zinc-500">Essas imagens aparecem borradas para quem não é assinante.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {images.map((img, i) => (
                        <div key={i} className="group relative aspect-video w-full bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700">
                            {img ? (
                                <>
                                    <img src={img} className="w-full h-full object-cover" alt={`Preview ${i + 1}`} />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => {
                                                currentIdx.current = i;
                                                fileInputRef.current?.click();
                                            }}
                                            className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20"
                                        >
                                            <Camera className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => removeImage(i)}
                                            className="p-3 bg-red-500/20 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500/40 transition-all border border-red-500/30"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        currentIdx.current = i;
                                        fileInputRef.current?.click();
                                    }}
                                    className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-500 hover:text-orange-500 hover:bg-zinc-800/80 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-700 group-hover:border-orange-500/30 transition-all">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest">Adicionar Foto {i + 1}</span>
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

            <button
                onClick={handleSave}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-colors py-4 rounded-2xl font-bold text-white shadow-lg shadow-orange-500/20 uppercase tracking-widest text-sm"
            >
                {saved ? "✓ Salvo com sucesso!" : "Salvar Mídias"}
            </button>
        </div>
    );
};

export default AdminMedia;
