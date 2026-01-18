'use client';

import { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    currentUrl?: string;
    onImageUploaded: (url: string) => void;
    folder?: string;
}

export function ImageUpload({ currentUrl, onImageUploaded, folder = 'news' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
    const [urlInput, setUrlInput] = useState('');
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no puede superar los 5MB');
            return;
        }

        setUploading(true);

        try {
            // Create unique filename
            const timestamp = Date.now();
            const fileName = `${folder}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const storageRef = ref(storage, fileName);

            // Upload file
            await uploadBytes(storageRef, file);

            // Get download URL
            const downloadUrl = await getDownloadURL(storageRef);

            setPreviewUrl(downloadUrl);
            onImageUploaded(downloadUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen. Verifica que Firebase Storage esté habilitado.');
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            setPreviewUrl(urlInput.trim());
            onImageUploaded(urlInput.trim());
            setUrlInput('');
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onImageUploaded('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            {/* Mode Toggle */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant={mode === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('upload')}
                    className={mode === 'upload' ? 'bg-primary' : ''}
                >
                    <Upload className="w-4 h-4 mr-1" />
                    Subir imagen
                </Button>
                <Button
                    type="button"
                    variant={mode === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('url')}
                    className={mode === 'url' ? 'bg-primary' : ''}
                >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    URL externa
                </Button>
            </div>

            {/* Preview */}
            {previewUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Upload Mode */}
            {mode === 'upload' && !previewUrl && (
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-sm text-gray-500">Subiendo imagen...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-500">
                                Haz clic para seleccionar una imagen
                            </span>
                            <span className="text-xs text-gray-400">
                                JPG, PNG o WebP (máx. 5MB)
                            </span>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                </div>
            )}

            {/* URL Mode */}
            {mode === 'url' && !previewUrl && (
                <div className="flex gap-2">
                    <Input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="flex-1"
                    />
                    <Button type="button" onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                        Agregar
                    </Button>
                </div>
            )}
        </div>
    );
}
