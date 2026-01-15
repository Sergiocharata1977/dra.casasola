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

interface NewsFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    news?: News | null;
    onSuccess?: () => void;
}

export function NewsFormDialog({ open, onOpenChange, news, onSuccess }: NewsFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        imageUrl: '',
        author: '',
        published: false,
        tags: '',
    });

    useEffect(() => {
        if (news) {
            setFormData({
                title: news.title,
                summary: news.summary || '',
                content: news.content,
                imageUrl: news.imageUrl || '',
                author: news.author,
                published: news.published,
                tags: news.tags?.join(', ') || '',
            });
        } else {
            setFormData({
                title: '',
                summary: '',
                content: '',
                imageUrl: '',
                author: '',
                published: false,
                tags: '',
            });
        }
    }, [news, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newsData = {
                title: formData.title,
                summary: formData.summary || undefined,
                content: formData.content,
                imageUrl: formData.imageUrl || undefined,
                author: formData.author,
                published: formData.published,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
            };

            if (news) {
                await NewsService.update(news.id, newsData);
            } else {
                await NewsService.create(newsData);
            }

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Error al guardar la noticia');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{news ? 'Editar Noticia' : 'Nueva Noticia'}</DialogTitle>
                    <DialogDescription>
                        {news ? 'Modifica los datos de la noticia' : 'Completa los datos para crear una nueva noticia'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Título de la noticia"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary">Resumen</Label>
                        <Textarea
                            id="summary"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            placeholder="Breve resumen de la noticia"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Contenido *</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            placeholder="Contenido completo de la noticia"
                            rows={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">URL de Imagen</Label>
                        <Input
                            id="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="author">Autor *</Label>
                        <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            required
                            placeholder="Nombre del autor"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                        <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="política, economía, desarrollo"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                        />
                        <Label htmlFor="published" className="cursor-pointer">
                            Publicar inmediatamente
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {news ? 'Guardar Cambios' : 'Crear Noticia'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
