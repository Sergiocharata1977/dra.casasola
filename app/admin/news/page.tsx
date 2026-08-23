'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Loader2, LayoutGrid, List, Eye } from 'lucide-react';
import { NewsService } from '@/lib/services';
import type { News } from '@/lib/types';
import { estadoDeNota, textoDeProgramacion } from '@/lib/portada';
import { NewsFormDialog } from '@/components/admin/NewsFormDialog';

/**
 * Cartelito de estado de una nota.
 *
 * El estado no se guarda: sale de `published` + `publishedAt` via
 * estadoDeNota(). Una nota programada esta autorizada pero todavia no salio,
 * asi que no puede mostrarse como "Publicado".
 *
 * `className` es para las clases de posicionamiento que cada vista necesita
 * (la lista lo pone dentro de un flex y precisa `flex-shrink-0`).
 */
function EstadoNotaBadge({ nota, className = '' }: { nota: News; className?: string }) {
    const estado = estadoDeNota(nota);
    const estilos = {
        publicada: 'bg-green-100 text-green-800',
        programada: 'bg-amber-100 text-amber-800',
        borrador: 'bg-gray-100 text-gray-800',
    } as const;
    const textos = {
        publicada: 'Publicado',
        programada: 'Programada',
        borrador: 'Borrador',
    } as const;

    return (
        <span className={`text-xs px-2 py-0.5 rounded-full ${className} ${estilos[estado]}`}>
            {textos[estado]}
        </span>
    );
}

export default function NewsPage() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;

        try {
            await NewsService.delete(id);
            await loadNews();
        } catch (err) {
            console.error('Error deleting news:', err);
            alert('Error al eliminar la noticia');
        }
    };

    const handleEdit = (e: React.MouseEvent, newsItem: News) => {
        e.preventDefault();
        e.stopPropagation();
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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

    // Aviso solo cuando hay algo que avisar: con cero programadas no se
    // muestra nada, para no agregar ruido al encabezado.
    const programadas = news.filter((item) => estadoDeNota(item) === 'programada');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Noticias</h1>
                    {programadas.length > 0 && (
                        <p className="mt-1 text-sm text-amber-700">
                            {programadas.length === 1
                                ? '1 nota esperando su hora'
                                : `${programadas.length} notas esperando su hora`}
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        className="bg-primary hover:bg-primary/90 font-bold"
                        onClick={handleCreate}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nueva Noticia
                    </Button>
                </div>
            </div>

            {news.length === 0 ? (
                <div className="text-center text-gray-500 p-8">
                    No hay noticias publicadas
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <Link key={item.id} href={`/admin/news/${item.id}`}>
                            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-full shadow-md border-0">
                                <div className="h-40 bg-gray-200 w-full object-cover flex items-center justify-center text-gray-400">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl">📰</span>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString('es-ES')}
                                        </span>
                                        <EstadoNotaBadge nota={item} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight line-clamp-2">{item.title}</h3>
                                    {estadoDeNota(item) === 'programada' && (
                                        <p className="text-xs text-amber-700 mb-2 -mt-1">
                                            {textoDeProgramacion(item)}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {item.summary || item.content.substring(0, 100) + '...'}
                                    </p>
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="sm" className="h-8" onClick={(e) => handleEdit(e, item)}>
                                            <Edit className="h-3 w-3 mr-1" /> Editar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={(e) => handleDelete(e, item.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="space-y-3">
                    {news.map((item) => (
                        <Link key={item.id} href={`/admin/news/${item.id}`}>
                            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow shadow-md border-0">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Thumbnail */}
                                        <div className="h-16 w-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl">📰</span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                                                <EstadoNotaBadge nota={item} className="flex-shrink-0" />
                                            </div>
                                            {estadoDeNota(item) === 'programada' && (
                                                <p className="text-xs text-amber-700 mb-1">
                                                    {textoDeProgramacion(item)}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600 truncate">
                                                {item.summary || item.content.substring(0, 100)}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                                <span>{new Date(item.createdAt).toLocaleDateString('es-ES')}</span>
                                                <span>Por {item.author}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button variant="ghost" size="sm" className="h-8" asChild>
                                                <Link href={`/admin/news/${item.id}`} onClick={(e) => e.stopPropagation()}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8" onClick={(e) => handleEdit(e, item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={(e) => handleDelete(e, item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
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
