'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NewsService } from '@/lib/services';
import type { News } from '@/lib/types';
import { Calendar, ArrowLeft, Loader2, Tag } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function NoticiasPage() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await NewsService.getPublished();
            setNews(data);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-primary text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Noticias Legales
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl">
                        Mantente informado sobre las últimas novedades en derecho previsional,
                        jubilaciones, pensiones y sucesiones.
                    </p>
                </div>
            </section>

            {/* News List */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : news.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">
                                No hay noticias publicadas aún
                            </p>
                            <Link href="/" className="text-accent hover:underline mt-4 inline-block">
                                <ArrowLeft className="inline h-4 w-4 mr-1" />
                                Volver al inicio
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {news.map((item) => (
                                <article
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 overflow-hidden">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 min-h-[200px]">
                                                    <span className="text-6xl">📰</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="md:w-2/3 p-6">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <time>
                                                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </time>
                                                </div>
                                                <span>•</span>
                                                <span>Por {item.author}</span>
                                            </div>

                                            <h2 className="text-2xl font-bold text-primary mb-3">
                                                {item.title}
                                            </h2>

                                            <p className="text-muted-foreground mb-4">
                                                {item.summary || item.content.substring(0, 300) + '...'}
                                            </p>

                                            {/* Tags */}
                                            {item.tags && item.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {item.tags.map((tag, idx) => (
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

                                            <Link
                                                href={`/noticias/${item.id}`}
                                                className="inline-block bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                                            >
                                                Leer artículo completo
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
