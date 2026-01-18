'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NewsService } from '@/lib/services';
import type { News } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2, Loader2, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { NewsFormDialog } from '@/components/admin/NewsFormDialog';

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadNews(params.id as string);
        }
    }, [params.id]);

    const loadNews = async (id: string) => {
        try {
            const data = await NewsService.getById(id);
            setNews(data);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!news || !confirm('¿Eliminar esta noticia?')) return;

        try {
            await NewsService.delete(news.id);
            router.push('/admin/news');
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!news) {
        return (
            <div className="text-center py-16">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Noticia no encontrada</h1>
                <Link href="/admin/news" className="text-primary hover:underline">
                    <ArrowLeft className="inline h-4 w-4 mr-1" />
                    Volver a noticias
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/news">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Detalle de Noticia</h1>
                </div>
                <div className="flex gap-2">
                    <Link href={`/noticias/${news.id}`} target="_blank">
                        <Button variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver Público
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => setDialogOpen(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Article Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image */}
                    {news.imageUrl && (
                        <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={news.imageUrl}
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <CardTitle className="text-xl">{news.title}</CardTitle>
                                <Badge className={news.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                    {news.published ? 'Publicado' : 'Borrador'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {news.summary && (
                                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Resumen</h3>
                                    <p className="text-gray-700">{news.summary}</p>
                                </div>
                            )}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">Contenido</h3>
                                <div className="prose max-w-none">
                                    {news.content.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="text-gray-700 mb-3">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-4">
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="text-lg">Información</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Autor</p>
                                    <p className="font-medium">{news.author}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Fecha de creación</p>
                                    <p className="font-medium">
                                        {new Date(news.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {news.publishedAt && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha de publicación</p>
                                        <p className="font-medium">
                                            {new Date(news.publishedAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {news.tags && news.tags.length > 0 && (
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="text-lg">Etiquetas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {news.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <NewsFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                news={news}
                onSuccess={() => {
                    setDialogOpen(false);
                    loadNews(news.id);
                }}
            />
        </div>
    );
}
