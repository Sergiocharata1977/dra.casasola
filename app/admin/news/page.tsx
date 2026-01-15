'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { NewsService } from '@/lib/services';
import type { News } from '@/lib/types';
import { NewsFormDialog } from '@/components/admin/NewsFormDialog';

export default function NewsPage() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<News | null>(null);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            setLoading(true);
            const data = await NewsService.getAll();
            setNews(data);
        } catch (err) {
            console.error('Error loading news:', err);
            setError('Error al cargar las noticias');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;

        try {
            await NewsService.delete(id);
            await loadNews();
        } catch (err) {
            console.error('Error deleting news:', err);
            alert('Error al eliminar la noticia');
        }
    };

    const handleEdit = (newsItem: News) => {
        setSelectedNews(newsItem);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedNews(null);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedNews(null);
    };

    const handleSuccess = () => {
        loadNews();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-8">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Noticias</h1>
                <Button
                    className="bg-violet-600 hover:bg-violet-700 font-bold"
                    onClick={handleCreate}
                >
                    <Plus className="mr-2 h-4 w-4" /> Nueva Noticia
                </Button>
            </div>

            {news.length === 0 ? (
                <div className="text-center text-gray-500 p-8">
                    No hay noticias publicadas
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <div className="h-40 bg-gray-200 w-full object-cover flex items-center justify-center text-gray-400">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    '[Imagen Principal]'
                                )}
                            </div>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString('es-ES')}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {item.published ? 'Publicado' : 'Borrador'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight">{item.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {item.summary || item.content.substring(0, 100) + '...'}
                                </p>
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {item.tags.map((tag, idx) => (
                                            <span key={idx} className="text-xs px-2 py-0.5 bg-violet-50 text-violet-700 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" size="sm" className="h-8" onClick={() => handleEdit(item)}>
                                        <Edit className="h-3 w-3 mr-1" /> Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <NewsFormDialog
                open={dialogOpen}
                onOpenChange={handleDialogClose}
                news={selectedNews}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
