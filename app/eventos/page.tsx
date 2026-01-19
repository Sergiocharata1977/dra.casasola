'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EventsService } from '@/lib/services';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function EventosPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await EventsService.getAll();
            // Filtrar solo eventos públicos
            const publicEvents = data.filter(e => e.isPublic);
            // Ordenar por fecha de inicio
            publicEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
            setEvents(publicEvents);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase(),
            year: date.getFullYear(),
            time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section - Estilo Minimalista */}
            <section className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 block">
                            Agenda
                        </span>
                        <h1 className="text-4xl md:text-5xl font-sans font-bold text-gray-900 mb-6 tracking-tight">
                            Eventos y Actividades
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Charlas, talleres y actividades organizadas por el estudio jurídico.
                        </p>
                    </div>
                </div>
            </section>

            {/* Events List */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-xl text-gray-500 mb-4">
                                No hay eventos programados
                            </p>
                            <Link href="/" className="text-gray-900 hover:underline font-medium">
                                ← Volver al inicio
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {events.map((event) => {
                                const dateInfo = formatDate(event.startDate);
                                return (
                                    <article
                                        key={event.id}
                                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <div className="flex">
                                            {/* Date Block */}
                                            <div className="w-28 flex-shrink-0 bg-gray-900 text-white flex flex-col items-center justify-center p-4">
                                                <span className="text-4xl font-bold">{dateInfo.day}</span>
                                                <span className="text-sm font-medium tracking-wider">{dateInfo.month}</span>
                                                <span className="text-xs text-gray-400 mt-1">{dateInfo.year}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-6">
                                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                                                    {event.title}
                                                </h3>

                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {event.description}
                                                </p>

                                                <div className="space-y-2 text-sm text-gray-500 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{dateInfo.time} hs</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                    {event.capacity && (
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>Cupos: {event.capacity}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <Link
                                                    href={`/eventos/${event.id}`}
                                                    className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all"
                                                >
                                                    Ver detalles
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
