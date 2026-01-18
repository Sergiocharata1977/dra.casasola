'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NewsService } from '@/lib/services';
import type { News } from '@/lib/types';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NoticiasResumen() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await NewsService.getPublished();
            // Only show latest 3 news
            setNews(data.slice(0, 3));
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </div>
            </section>
        );
    }

    if (news.length === 0) {
        return null; // Don't show section if no published news
    }

    return (
        <section id="noticias" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                        Noticias Legales
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Mantente informado sobre las últimas novedades en derecho previsional y civil
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="h-48 bg-gray-200 overflow-hidden">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-5xl">📰</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <Calendar className="h-4 w-4" />
                                    <time>
                                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground line-clamp-3 mb-4">
                                    {item.summary || item.content.substring(0, 150) + '...'}
                                </p>
                                <Link
                                    href={`/noticias/${item.id}`}
                                    className="text-accent font-medium hover:underline inline-flex items-center gap-1"
                                >
                                    Leer más <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link href="/noticias">
                        <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                            Ver todas las noticias
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
