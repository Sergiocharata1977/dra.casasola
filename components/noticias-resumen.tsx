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
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                </div>
            </section>
        );
    }

    if (news.length === 0) {
        return null; // Don't show section if no published news
    }

    return (
        <section id="noticias" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 block">
                        Blog
                    </span>
                    <h2 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 mb-4 tracking-tight">
                        Últimas Noticias
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Información actualizada sobre temas legales de interés
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="h-48 bg-gray-100 overflow-hidden">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-100 to-gray-200">
                                        <span className="text-5xl">📰</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <Calendar className="h-4 w-4" />
                                    <time>
                                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 line-clamp-3 mb-4">
                                    {item.summary || item.content.substring(0, 150) + '...'}
                                </p>
                                <Link
                                    href={`/noticias/${item.id}`}
                                    className="text-gray-900 font-semibold hover:gap-2 inline-flex items-center gap-1 transition-all"
                                >
                                    Leer más <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/noticias">
                        <Button size="lg" variant="outline" className="rounded-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8">
                            Ver todas las noticias
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
