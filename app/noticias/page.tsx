'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NewsService } from '@/lib/services';
import type { News } from '@/lib/types';
import { Calendar, ArrowRight, Loader2, Tag, User } from 'lucide-react';
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
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section - Estilo Minimalista */}
            <section className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 block">
                            Blog del Estudio
                        </span>
                        <h1 className="text-4xl md:text-5xl font-sans font-bold text-gray-900 mb-6 tracking-tight">
                            Noticias y Novedades
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Información actualizada sobre Derecho Civil, Sucesiones y temas legales de interés.
                        </p>
                    </div>
                </div>
            </section>

            {/* News List */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                        </div>
                    ) : news.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-xl text-gray-500 mb-4">
                                No hay noticias publicadas aún
                            </p>
                            <Link href="/" className="text-gray-900 hover:underline font-medium">
                                ← Volver al inicio
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {news.map((item) => (
                                <article
                                    key={item.id}
                                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="md:w-1/3 h-56 md:h-auto bg-gray-100 overflow-hidden">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 min-h-[200px] bg-gradient-to-br from-gray-100 to-gray-200">
                                                    <span className="text-7xl">📰</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="md:w-2/3 p-8">
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4" />
                                                    <time>
                                                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </time>
                                                </div>
                                                <span className="text-gray-300">•</span>
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-4 w-4" />
                                                    <span>{item.author}</span>
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                                                {item.title}
                                            </h2>

                                            <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                                {item.summary || item.content.substring(0, 250) + '...'}
                                            </p>

                                            {/* Tags */}
                                            {item.tags && item.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {item.tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                                        >
                                                            <Tag className="h-3 w-3" />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <Link
                                                href={`/noticias/${item.id}`}
                                                className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all"
                                            >
                                                Leer artículo completo
                                                <ArrowRight className="h-4 w-4" />
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
