'use client';

import { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Film, Loader2, Upload, X } from 'lucide-react';

import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

/**
 * Subida del video de una nota a Firebase Storage.
 *
 * Va aparte de ImageUpload porque un video no se maneja como una foto:
 * pesa cien veces mas, tarda, y hay que mostrar el avance o el editor cree
 * que se colgo. Por eso usa `uploadBytesResumable` en vez de `uploadBytes`.
 *
 * El tope de 100 MB coincide con el de storage.rules. No es un capricho:
 * Storage cobra por almacenamiento y por cada descarga, asi que un video
 * pesado que se ve mucho es la factura mas cara del sitio. Para material
 * largo conviene igual dejarlo en un canal propio de YouTube y enlazarlo.
 */

const MAX_BYTES = 100 * 1024 * 1024;
const RECOMENDADO_BYTES = 50 * 1024 * 1024;

interface VideoUploadProps {
    currentUrl?: string;
    onVideoUploaded: (url: string) => void;
    folder?: string;
}

function enMegas(bytes: number): string {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function VideoUpload({
    currentUrl,
    onVideoUploaded,
    folder = 'news-video',
}: VideoUploadProps) {
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const seleccionar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        if (!file.type.startsWith('video/')) {
            setError('El archivo tiene que ser un video (MP4, WebM o MOV).');
            return;
        }

        if (file.size > MAX_BYTES) {
            setError(
                `El video pesa ${enMegas(file.size)} y el tope es 100 MB. ` +
                    'Recortalo o bajale la calidad antes de subirlo.'
            );
            return;
        }

        setSubiendo(true);
        setProgreso(0);

        try {
            const nombre = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const tarea = uploadBytesResumable(ref(storage, nombre), file, {
                contentType: file.type,
            });

            await new Promise<void>((resolve, reject) => {
                tarea.on(
                    'state_changed',
                    (snap) =>
                        setProgreso(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
                    reject,
                    resolve
                );
            });

            const url = await getDownloadURL(tarea.snapshot.ref);
            setPreviewUrl(url);
            onVideoUploaded(url);
        } catch (err) {
            console.error('Error al subir el video:', err);
            setError('No se pudo subir el video. Revisa la conexion y volve a intentar.');
        } finally {
            setSubiendo(false);
        }
    };

    const quitar = () => {
        setPreviewUrl(null);
        setError(null);
        onVideoUploaded('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="space-y-3">
            {previewUrl && (
                <div className="relative overflow-hidden rounded-lg bg-black">
                    <video src={previewUrl} controls preload="metadata" className="max-h-64 w-full" />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8"
                        onClick={quitar}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {!previewUrl && (
                <div
                    className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-primary"
                    onClick={() => !subiendo && inputRef.current?.click()}
                >
                    {subiendo ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-sm text-gray-500">Subiendo video… {progreso}%</span>
                            <div className="h-1.5 w-full max-w-xs overflow-hidden rounded bg-gray-200">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${progreso}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400">
                                No cierres esta ventana hasta que termine.
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-500">
                                Haz clic para seleccionar un video
                            </span>
                            <span className="text-xs text-gray-400">
                                MP4, WebM o MOV. Maximo 100 MB; ideal menos de{' '}
                                {enMegas(RECOMENDADO_BYTES)}.
                            </span>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept="video/*"
                        onChange={seleccionar}
                        className="hidden"
                        disabled={subiendo}
                    />
                </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Film className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                    El video queda alojado en el propio sitio. Ocupa lugar y se paga por cada
                    reproduccion, asi que conviene subir piezas cortas y editadas.
                </span>
            </p>
        </div>
    );
}
