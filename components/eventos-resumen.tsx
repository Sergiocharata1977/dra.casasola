'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EventsService } from '@/lib/services';
import type { Event } from '@/lib/types';
import { Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EventosResumen() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await EventsService.getAll();
            // Filter upcoming public events and take first 3
            const now = new Date();
            const upcomingPublic = data
                .filter(e => e.isPublic && new Date(e.startDate) >= now)
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .slice(0, 3);
            setEvents(upcomingPublic);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                </div>
            </section>
        );
    }

    if (events.length === 0) {
        return null;
    }

    return (
        <section id="eventos" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 block">
                        Agenda
                    </span>
                    <h2 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 mb-4 tracking-tight">
                        Próximos Eventos
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Charlas, talleres y actividades del estudio
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {events.map((event) => {
                        const date = new Date(event.startDate);
                        return (
                            <article
                                key={event.id}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="bg-gray-900 text-white p-6 text-center">
                                    <span className="text-4xl font-bold block">{date.getDate()}</span>
                                    <span className="text-sm uppercase tracking-wider">
                                        {date.toLocaleDateString('es-ES', { month: 'short' })}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {event.description}
                                    </p>
                                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/eventos/${event.id}`}
                                        className="text-gray-900 font-semibold hover:gap-2 inline-flex items-center gap-1 transition-all"
                                    >
                                        Ver detalles <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="text-center mt-12">
                    <Link href="/eventos">
                        <Button size="lg" variant="outline" className="rounded-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8">
                            Ver todos los eventos
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
