import { useState, useRef } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import { processAndUploadImage, deleteImageFromSupabase } from '../services/imageService';

interface MultiImageUploaderProps {
    imageUrls: string[];
    onImagesUpdated: (urls: string[]) => void;
    articleSlug?: string;
    bucket?: 'article-images' | 'game-images' | 'personnage' | 'coloriage' | 'decoupage';
    label?: string;
    pathPrefix?: string;
    fileSuffix?: string;
    maxWidth?: number;
    maxHeight?: number;
}

export function MultiImageUploader({
    imageUrls = [],
    onImagesUpdated,
    articleSlug,
    bucket = 'coloriage',
    label,
    pathPrefix,
    fileSuffix,
    maxWidth = 2048,
    maxHeight = 1448,
}: MultiImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        if (!file) return;

        // Validation
        if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
            setError('Format non supporté. Utilisez JPEG ou PNG uniquement.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('L\'image est trop grande. Maximum 10 MB.');
            return;
        }

        if (!articleSlug) {
            setError('Veuillez d\'abord sauvegarder pour obtenir un slug.');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // Unique suffix for multiple images
            const uniqueSuffix = `${fileSuffix || 'gallery'}-${Date.now()}`;

            const prefix = pathPrefix ? pathPrefix.replace(/\/$/, '') : 'public';
            const filePath = `${prefix}/${articleSlug}/${articleSlug}-${uniqueSuffix}.webp`;

            const publicUrl = await processAndUploadImage(
                file,
                articleSlug,
                {
                    maxWidth,
                    maxHeight,
                    quality: 0.90,
                },
                bucket,
                filePath,
                uniqueSuffix
            );

            onImagesUpdated([...imageUrls, publicUrl]);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Erreur lors de l\'upload. Veuillez réessayer.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await processFile(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemove = async (urlToRemove: string) => {
        try {
            // Optional: Delete from storage? 
            // For safety, maybe we just remove from the list for now and let the user manually clean up or handle it via a background job.
            // But typically users expect "delete" to delete.
            await deleteImageFromSupabase(urlToRemove, bucket);

            const newUrls = imageUrls.filter(url => url !== urlToRemove);
            onImagesUpdated(newUrls);
        } catch (err) {
            console.error('Delete error:', err);
            setError('Erreur lors de la suppression.');
        }
    };

    const handleClick = () => {
        if (!uploading && articleSlug) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="space-y-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            {/* Grid of images + Add Button */}
            <div className="flex flex-wrap gap-4">
                {imageUrls.map((url, index) => (
                    <div key={index} className="relative w-32 h-32 group">
                        <img
                            src={url}
                            alt={`Gallery ${index}`}
                            className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-200"
                        />
                        <button
                            onClick={() => handleRemove(url)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Supprimer"
                            type="button"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {/* Add Button */}
                <div
                    onClick={handleClick}
                    className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--brand-pink)] hover:bg-pink-50 transition-colors ${(!articleSlug || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-[var(--brand-pink)] animate-spin" />
                    ) : (
                        <>
                            <Plus className="w-8 h-8 text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">Ajouter</span>
                        </>
                    )}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
            />

            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}

            {!articleSlug && (
                <p className="text-xs text-red-500">
                    ⚠️ Sauvegardez d'abord l'élément pour pouvoir ajouter des images à la galerie.
                </p>
            )}
        </div>
    );
}
