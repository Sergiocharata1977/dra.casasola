'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { NewsService } from '@/lib/services';
import type { News } from '@/lib/types';
import { ImageUpload } from '@/components/ui/image-upload';
import { VideoUpload } from '@/components/ui/video-upload';
import { aIsoArgentina, deIsoAInputLocal, estadoDeNota, generarSlug } from '@/lib/portada';
import { secciones } from '@/lib/site-config';

interface NewsFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    news?: News | null;
    onSuccess?: () => void;
}

const VACIO = {
    title: '',
    volanta: '',
    bajada: '',
    slug: '',
    content: '',
    imageUrl: '',
    epigrafe: '',
    creditoFoto: '',
    videoUrl: '',
    videoEpigrafe: '',
    author: '',
    autorCargo: '',
    seccion: 'politica',
    esOpinion: false,
    jerarquia: 'normal',
    ordenPortada: '',
    tiempoLectura: '',
    tags: '',
    estado: 'borrador', // 'borrador' | 'ahora' | 'programada'
    fechaSalida: '', // formato del input datetime-local
};

/** Estilo compartido de los <select> nativos, para que peguen con los Input. */
const CLASE_SELECT =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

function Sub({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="border-b pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {children}
        </h3>
    );
}

export function NewsFormDialog({ open, onOpenChange, news, onSuccess }: NewsFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [slugTocado, setSlugTocado] = useState(false);
    const [formData, setFormData] = useState(VACIO);

    useEffect(() => {
        if (news) {
            // El formulario no guarda `published` suelto: trabaja con un estado
            // de tres valores. Una nota ya publicada entra como 'ahora' porque
            // en el panel las dos cosas se editan igual; la diferencia entre
            // 'ahora' y 'publicada' solo importa al guardar.
            const estadoReal = estadoDeNota(news);
            setFormData({
                title: news.title || '',
                volanta: news.volanta || '',
                bajada: news.bajada || news.summary || '',
                slug: news.slug || '',
                content: news.content || '',
                imageUrl: news.imageUrl || '',
                epigrafe: news.epigrafe || '',
                creditoFoto: news.creditoFoto || '',
                videoUrl: news.videoUrl || '',
                videoEpigrafe: news.videoEpigrafe || '',
                author: news.author || '',
                autorCargo: news.autorCargo || '',
                seccion: news.seccion || 'politica',
                esOpinion: Boolean(news.esOpinion),
                jerarquia: news.jerarquia || 'normal',
                ordenPortada: news.ordenPortada != null ? String(news.ordenPortada) : '',
                tiempoLectura: news.tiempoLectura != null ? String(news.tiempoLectura) : '',
                tags: news.tags?.join(', ') || '',
                estado: estadoReal === 'publicada' ? 'ahora' : estadoReal,
                fechaSalida: deIsoAInputLocal(news.publishedAt),
            });
            setSlugTocado(Boolean(news.slug));
        } else {
            setFormData(VACIO);
            setSlugTocado(false);
        }
    }, [news, open]);

    // Mientras nadie edite el slug a mano, se deriva del titulo.
    const cambiarTitulo = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: slugTocado ? prev.slug : generarSlug(title),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Una nota programada sin fecha valida no se puede guardar: quedaria
        // publicada al instante sin que nadie lo haya pedido. Se valida antes
        // de prender el loading para no dejar el boton bloqueado.
        let programada: string | null = null;
        if (formData.estado === 'programada') {
            programada = aIsoArgentina(formData.fechaSalida);
            if (!programada) {
                console.error('Fecha de programacion invalida:', formData.fechaSalida);
                alert('Elegi una fecha y hora validas para programar la nota.');
                return;
            }
        }

        setLoading(true);

        try {
            // Firestore rechaza `undefined`, asi que los opcionales se agregan
            // solo cuando tienen valor.
            const datos: Record<string, unknown> = {
                title: formData.title.trim(),
                content: formData.content,
                author: formData.author.trim(),
                seccion: formData.seccion,
                jerarquia: formData.jerarquia,
                esOpinion: formData.esOpinion,
                // `published` y `publishedAt` los fija el bloque de estado, mas
                // abajo, para que los tres casos queden juntos y a la vista.
            };

            const slug = (formData.slug || generarSlug(formData.title)).trim();
            if (slug) datos.slug = slug;

            const opcionales: Array<[string, string]> = [
                ['volanta', formData.volanta],
                ['bajada', formData.bajada],
                ['epigrafe', formData.epigrafe],
                ['creditoFoto', formData.creditoFoto],
                ['autorCargo', formData.autorCargo],
                ['imageUrl', formData.imageUrl],
                ['videoUrl', formData.videoUrl],
                ['videoEpigrafe', formData.videoEpigrafe],
            ];
            for (const [clave, valor] of opcionales) {
                if (valor && valor.trim()) {
                    datos[clave] = valor.trim();
                } else if (news) {
                    // Al editar hay que escribir null explicito. updateDoc hace
                    // merge: si el campo simplemente no viaja, Firestore conserva
                    // el valor viejo y sacar una foto o un video no tiene efecto.
                    datos[clave] = null;
                }
            }

            // `summary` se mantiene sincronizado con la bajada: lo siguen
            // leyendo el listado y los metadatos de las notas viejas.
            if (formData.bajada.trim()) datos.summary = formData.bajada.trim();

            const orden = parseInt(formData.ordenPortada, 10);
            if (!Number.isNaN(orden)) datos.ordenPortada = orden;

            const minutos = parseInt(formData.tiempoLectura, 10);
            if (!Number.isNaN(minutos)) datos.tiempoLectura = minutos;

            const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
            if (tags.length > 0) datos.tags = tags;

            // Que se guarda segun el estado elegido:
            //   borrador   -> published false y sin fecha
            //   ahora      -> published true; se respeta la fecha que ya tenia
            //                 para que corregir una nota vieja no la suba de
            //                 nuevo a la tapa
            //   programada -> published true con la fecha elegida, leida como
            //                 hora de Argentina
            if (formData.estado === 'borrador') {
                datos.published = false;
                datos.publishedAt = null;
            } else if (formData.estado === 'ahora') {
                // Caso borde: si la nota venia programada, la fecha que tiene
                // guardada es futura. Respetarla dejaria la nota "publicada"
                // pero invisible hasta esa hora, que es exactamente lo
                // contrario de lo que pidio el editor al elegir "publicar
                // ahora". Por eso solo se conserva la fecha vieja cuando ya
                // paso; si es futura se pisa con el instante actual.
                const ahora = new Date();
                const anteriorIso = news?.publishedAt || '';
                const anterior = anteriorIso ? new Date(anteriorIso) : null;
                const sirve =
                    anterior !== null &&
                    !Number.isNaN(anterior.getTime()) &&
                    anterior.getTime() <= ahora.getTime();
                datos.published = true;
                datos.publishedAt = sirve ? anteriorIso : ahora.toISOString();
            } else {
                datos.published = true;
                datos.publishedAt = programada;
            }

            if (news) {
                await NewsService.update(news.id, datos);
            } else {
                await NewsService.create(datos as never);
            }

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error al guardar la nota:', error);
            alert('No se pudo guardar la nota. Revisa la consola para el detalle.');
        } finally {
            setLoading(false);
        }
    };

    const esOpinion = formData.esOpinion || formData.seccion === 'opinion';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] w-[95vw] max-w-[95vw] overflow-y-auto sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>{news ? 'Editar nota' : 'Nueva nota'}</DialogTitle>
                    <DialogDescription>
                        Los campos marcados con * son obligatorios. El resto define como se ve la
                        nota en la portada y al compartirla.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ---------------- Titulacion ---------------- */}
                    <Sub>Titulacion</Sub>

                    <div className="space-y-2">
                        <Label htmlFor="volanta">Volanta</Label>
                        <Input
                            id="volanta"
                            value={formData.volanta}
                            onChange={(e) => setFormData({ ...formData, volanta: e.target.value })}
                            placeholder="Linea corta que va ARRIBA del titulo. Ej: Analisis / Medios"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Titulo *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => cambiarTitulo(e.target.value)}
                            required
                            placeholder="Titulo de la nota"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bajada">Bajada</Label>
                        <Textarea
                            id="bajada"
                            value={formData.bajada}
                            onChange={(e) => setFormData({ ...formData, bajada: e.target.value })}
                            placeholder="Parrafo de entrada, debajo del titulo. Es lo que se ve al compartir en WhatsApp."
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Direccion web</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => {
                                setSlugTocado(true);
                                setFormData({ ...formData, slug: generarSlug(e.target.value) });
                            }}
                            placeholder="se-genera-solo-desde-el-titulo"
                        />
                        <p className="text-xs text-muted-foreground">
                            /noticias/{formData.slug || 'se-genera-solo'}
                        </p>
                    </div>

                    {/* ---------------- Clasificacion ---------------- */}
                    <Sub>Clasificacion</Sub>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="seccion">Seccion *</Label>
                            <select
                                id="seccion"
                                className={CLASE_SELECT}
                                value={formData.seccion}
                                onChange={(e) =>
                                    setFormData({ ...formData, seccion: e.target.value })
                                }
                            >
                                {secciones.map((s) => (
                                    <option key={s.slug} value={s.slug}>
                                        {s.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="chaco, presupuesto, salud"
                            />
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.esOpinion}
                            onChange={(e) =>
                                setFormData({ ...formData, esOpinion: e.target.checked })
                            }
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm">
                            Es una columna de opinion firmada
                            <span className="ml-1 text-muted-foreground">
                                (va a Voz Libre y lleva el aviso de responsabilidad)
                            </span>
                        </span>
                    </label>

                    {/* ---------------- Portada ---------------- */}
                    <Sub>Lugar en la portada</Sub>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="jerarquia">Jerarquia</Label>
                            <select
                                id="jerarquia"
                                className={CLASE_SELECT}
                                value={formData.jerarquia}
                                onChange={(e) =>
                                    setFormData({ ...formData, jerarquia: e.target.value })
                                }
                                disabled={esOpinion}
                            >
                                <option value="normal">Sin lugar fijo</option>
                                <option value="breve">Apuntes (columna izquierda)</option>
                                <option value="destacada">Lecturas (con foto)</option>
                                <option value="apertura">Apertura (nota principal)</option>
                            </select>
                            {esOpinion && (
                                <p className="text-xs text-muted-foreground">
                                    Las columnas de opinion van siempre a Voz Libre.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ordenPortada">Orden dentro del bloque</Label>
                            <Input
                                id="ordenPortada"
                                type="number"
                                min={1}
                                value={formData.ordenPortada}
                                onChange={(e) =>
                                    setFormData({ ...formData, ordenPortada: e.target.value })
                                }
                                placeholder="1 = mas arriba"
                            />
                        </div>
                    </div>

                    {/* ---------------- Firma ---------------- */}
                    <Sub>Firma</Sub>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2 sm:col-span-1">
                            <Label htmlFor="author">Autor *</Label>
                            <Input
                                id="author"
                                value={formData.author}
                                onChange={(e) =>
                                    setFormData({ ...formData, author: e.target.value })
                                }
                                required
                                placeholder="Nombre de quien firma"
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-1">
                            <Label htmlFor="autorCargo">Cargo o rol</Label>
                            <Input
                                id="autorCargo"
                                value={formData.autorCargo}
                                onChange={(e) =>
                                    setFormData({ ...formData, autorCargo: e.target.value })
                                }
                                placeholder="Ej: Mesa de edicion"
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-1">
                            <Label htmlFor="tiempoLectura">Minutos de lectura</Label>
                            <Input
                                id="tiempoLectura"
                                type="number"
                                min={1}
                                value={formData.tiempoLectura}
                                onChange={(e) =>
                                    setFormData({ ...formData, tiempoLectura: e.target.value })
                                }
                                placeholder="se calcula solo"
                            />
                        </div>
                    </div>

                    {/* ---------------- Foto ---------------- */}
                    <Sub>Foto</Sub>

                    <ImageUpload
                        currentUrl={formData.imageUrl}
                        onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                        folder="news"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="epigrafe">Epigrafe</Label>
                            <Input
                                id="epigrafe"
                                value={formData.epigrafe}
                                onChange={(e) =>
                                    setFormData({ ...formData, epigrafe: e.target.value })
                                }
                                placeholder="Que se ve en la foto"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="creditoFoto">Credito</Label>
                            <Input
                                id="creditoFoto"
                                value={formData.creditoFoto}
                                onChange={(e) =>
                                    setFormData({ ...formData, creditoFoto: e.target.value })
                                }
                                placeholder="Quien saco la foto"
                            />
                        </div>
                    </div>

                    {/* ---------------- Video ---------------- */}
                    <Sub>Video</Sub>

                    <p className="text-xs text-muted-foreground">
                        Opcional. Si cargas un video, pasa a ser la pieza principal de la nota y la
                        foto de arriba queda como caratula del reproductor.
                    </p>

                    <VideoUpload
                        currentUrl={formData.videoUrl}
                        onVideoUploaded={(url) => setFormData({ ...formData, videoUrl: url })}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="videoEpigrafe">Epigrafe del video</Label>
                        <Input
                            id="videoEpigrafe"
                            value={formData.videoEpigrafe}
                            onChange={(e) =>
                                setFormData({ ...formData, videoEpigrafe: e.target.value })
                            }
                            placeholder="Que se ve en el video y quien lo filmo"
                        />
                    </div>

                    {/* ---------------- Cuerpo ---------------- */}
                    <Sub>Cuerpo</Sub>

                    <div className="space-y-2">
                        <Label htmlFor="content">Texto de la nota *</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            placeholder="Escribi la nota. Deja una linea en blanco entre parrafo y parrafo."
                            rows={12}
                        />
                        <p className="text-xs text-muted-foreground">
                            Separa los parrafos con una linea en blanco.
                        </p>
                    </div>

                    {/* ---------------- Estado ---------------- */}
                    <Sub>Estado</Sub>

                    <div className="space-y-2">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="estado"
                                value="borrador"
                                checked={formData.estado === 'borrador'}
                                onChange={() => setFormData({ ...formData, estado: 'borrador' })}
                                className="h-4 w-4 border-gray-300"
                            />
                            <span className="text-sm">
                                Borrador
                                <span className="ml-1 text-muted-foreground">
                                    — no se ve en la web
                                </span>
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="estado"
                                value="ahora"
                                checked={formData.estado === 'ahora'}
                                onChange={() => setFormData({ ...formData, estado: 'ahora' })}
                                className="h-4 w-4 border-gray-300"
                            />
                            <span className="text-sm">
                                Publicar ahora
                                <span className="ml-1 text-muted-foreground">
                                    — sale apenas guardes
                                </span>
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="estado"
                                value="programada"
                                checked={formData.estado === 'programada'}
                                onChange={() => setFormData({ ...formData, estado: 'programada' })}
                                className="h-4 w-4 border-gray-300"
                            />
                            <span className="text-sm">
                                Programar
                                <span className="ml-1 text-muted-foreground">
                                    — sale sola el día y la hora que elijas
                                </span>
                            </span>
                        </label>
                    </div>

                    {formData.estado === 'programada' && (
                        <div className="space-y-2 pl-6">
                            <Label htmlFor="fechaSalida">Fecha y hora de salida</Label>
                            <input
                                id="fechaSalida"
                                type="datetime-local"
                                className={CLASE_SELECT}
                                value={formData.fechaSalida}
                                onChange={(e) =>
                                    setFormData({ ...formData, fechaSalida: e.target.value })
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Hora de Charata. La nota aparece dentro del minuto siguiente a esa
                                hora.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                La nota queda guardada desde que la creás y la base es de lectura
                                pública: programar sirve para ordenar el calendario, no para
                                embargar. Si el tema es sensible, dejala en borrador hasta el
                                momento de publicarla.
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {news ? 'Guardar cambios' : 'Crear nota'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
