'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EventsService } from '@/lib/services';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';

export default function EventosPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await EventsService.getAll();
            // Filter public events and sort by start date
            const publicEvents = data
                .filter(e => e.isPublic)
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
            setEvents(publicEvents);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase(),
            time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    const isUpcoming = (dateStr: string) => {
        return new Date(dateStr) >= new Date();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-primary text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Próximos Eventos
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl">
                        Acompáñanos en nuestras actividades, charlas y eventos relacionados
                        con el derecho previsional y civil.
                    </p>
                </div>
            </section>

            {/* Events List */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">
                                No hay eventos programados aún
                            </p>
                            <Link href="/" className="text-accent hover:underline mt-4 inline-block">
                                <ArrowLeft className="inline h-4 w-4 mr-1" />
                                Volver al inicio
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {events.map((event) => {
                                const date = formatDate(event.startDate);
                                const upcoming = isUpcoming(event.startDate);

                                return (
                                    <article
                                        key={event.id}
                                        className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${!upcoming ? 'opacity-60' : ''
                                            }`}
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Date Box */}
                                            <div className={`md:w-32 ${upcoming ? 'bg-accent' : 'bg-gray-400'} text-white p-6 flex flex-col items-center justify-center`}>
                                                <span className="text-4xl font-bold">{date.day}</span>
                                                <span className="text-sm font-medium">{date.month}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h2 className="text-xl font-bold text-primary mb-2">
                                                            {event.title}
                                                        </h2>
                                                        <p className="text-gray-600 mb-4">
                                                            {event.description}
                                                        </p>
                                                    </div>
                                                    {!upcoming && (
                                                        <Badge variant="secondary">Finalizado</Badge>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{date.time} hs</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                    {event.capacity && (
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-4 w-4" />
                                                            <span>{event.capacity} personas</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-4">
                                                    <Link
                                                        href={`/eventos/${event.id}`}
                                                        className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                                    >
                                                        Ver detalles
                                                    </Link>
                                                </div>
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
