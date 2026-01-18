'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { NewsService } from '@/lib/services';
import type { News } from '@/lib/types';
import { Calendar, ArrowLeft, Loader2, Tag, User } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function NoticiaDetailPage() {
    const params = useParams();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-primary mb-4">Noticia no encontrada</h1>
                    <Link href="/noticias" className="text-accent hover:underline">
                        <ArrowLeft className="inline h-4 w-4 mr-1" />
                        Volver a noticias
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Article */}
            <article className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        href="/noticias"
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a noticias
                    </Link>

                    {/* Hero Image */}
                    {news.imageUrl && (
                        <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                            <img
                                src={news.imageUrl}
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <time>
                                {new Date(news.publishedAt || news.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{news.author}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                        {news.title}
                    </h1>

                    {/* Tags */}
                    {news.tags && news.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {news.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                                >
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <div className="prose prose-lg max-w-none">
                            {news.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 bg-primary rounded-xl p-8 text-center text-white">
                        <h3 className="text-2xl font-bold mb-4">¿Necesitas asesoramiento legal?</h3>
                        <p className="mb-6 text-white/80">
                            La Dra. Lidia Casasola puede ayudarte con tu caso de derecho previsional o civil.
                        </p>
                        <Link
                            href="/#contacto"
                            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors"
                        >
                            Solicitar Consulta
                        </Link>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}
