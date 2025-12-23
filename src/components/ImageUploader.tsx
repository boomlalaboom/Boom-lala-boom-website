import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { processAndUploadImage, deleteImageFromSupabase } from '../services/imageService';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  articleSlug?: string;
  bucket?: 'article-images' | 'game-images';
  label?: string;
}

export function ImageUploader({ currentImageUrl, onImageUploaded, articleSlug, bucket = 'article-images', label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
      // Créer preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Supprimer l'ancienne image si elle existe
      if (currentImageUrl) {
        try {
          await deleteImageFromSupabase(currentImageUrl, bucket);
        } catch (err) {
          console.warn('Could not delete old image:', err);
        }
      }

      // Convertir, compresser et uploader
      const publicUrl = await processAndUploadImage(file, articleSlug, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.85,
      }, bucket);

      onImageUploaded(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Erreur lors de l\'upload. Veuillez réessayer.');
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRemove = async () => {
    if (!currentImageUrl) return;

    try {
      await deleteImageFromSupabase(currentImageUrl, bucket);
      setPreview(null);
      onImageUploaded('');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Erreur lors de la suppression.');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label || 'Image (JPEG/PNG → WebP)'}
      </label>

      <div className="relative">
        {preview ? (
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Supprimer l'image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm">Conversion en WebP et upload...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`w-full h-48 border-2 border-dashed rounded-lg transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer ${
              isDragging
                ? 'border-[var(--brand-pink)] bg-pink-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[var(--brand-pink)]'
            } ${(uploading || !articleSlug) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-[var(--brand-pink)] animate-spin" />
                <p className="text-gray-600">Upload en cours...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-orange)] rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-medium">
                    {isDragging ? 'Déposez l\'image ici' : 'Cliquez ou glissez-déposez une image'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPEG ou PNG (max 10 MB)
                  </p>
                  {!articleSlug && (
                    <p className="text-xs text-red-500 mt-2">
                      ⚠️ Sauvegardez d'abord
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          L'image sera automatiquement:
        </p>
        <ul className="pl-6 space-y-0.5">
          <li>• Convertie en WebP</li>
          <li>• Compressée (qualité 85%)</li>
          <li>• Redimensionnée (max 1200x800)</li>
          <li>• Renommée selon le slug de l'article</li>
        </ul>
      </div>
    </div>
  );
}
