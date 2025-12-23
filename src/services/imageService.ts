/**
 * Service de gestion des images
 * - Conversion en WebP
 * - Compression
 * - Upload vers Supabase Storage
 */

import { supabase } from '../lib/supabase';

interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Convertit une image en WebP et la compresse
 */
export async function convertToWebP(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<Blob> {
  const { maxWidth = 1200, maxHeight = 800, quality = 0.85 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      // Créer un canvas pour redimensionner et convertir
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Calculer les nouvelles dimensions en gardant le ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir en WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not convert image to WebP'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Génère un nom de fichier basé sur le slug de l'article
 */
export function generateImageFileName(articleSlug: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  // Nettoyer le slug pour le nom de fichier
  const cleanSlug = articleSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  return `${cleanSlug}-${timestamp}-${randomStr}.webp`;
}

/**
 * Upload une image vers Supabase Storage
 */
export async function uploadImageToSupabase(
  blob: Blob,
  fileName: string,
  bucket: string = 'article-images'
): Promise<string> {
  try {
    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`public/${fileName}`, blob, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 an de cache
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(`public/${fileName}`);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Pipeline complet: convertir et uploader une image
 */
export async function processAndUploadImage(
  file: File,
  articleSlug: string,
  options?: ImageProcessingOptions,
  bucket: string = 'article-images'
): Promise<string> {
  try {
    // 1. Convertir en WebP et compresser
    const webpBlob = await convertToWebP(file, options);

    // 2. Générer un nom de fichier
    const fileName = generateImageFileName(articleSlug);

    // 3. Upload vers Supabase
    const publicUrl = await uploadImageToSupabase(webpBlob, fileName, bucket);

    return publicUrl;
  } catch (error) {
    console.error('Error processing and uploading image:', error);
    throw error;
  }
}

/**
 * Supprimer une image de Supabase Storage
 */
export async function deleteImageFromSupabase(
  imageUrl: string,
  bucket: string = 'article-images'
): Promise<void> {
  try {
    // Extraire le chemin du fichier de l'URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `public/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
