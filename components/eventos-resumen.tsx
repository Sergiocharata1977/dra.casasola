'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EventsService } from '@/lib/services';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, ArrowRight, Loader2 } from 'lucide-react';
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
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </div>
            </section>
        );
    }

    if (events.length === 0) {
        return null;
    }

    return (
        <section id="eventos" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                        Próximos Eventos
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Participa en nuestras charlas, seminarios y actividades
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const date = new Date(event.startDate);
                        return (
                            <article
                                key={event.id}
                                className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="bg-accent text-white p-4 text-center">
                                    <span className="text-3xl font-bold block">{date.getDate()}</span>
                                    <span className="text-sm uppercase">
                                        {date.toLocaleDateString('es-ES', { month: 'short' })}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                                        {event.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                        {event.description}
                                    </p>
                                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
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
                                        className="text-accent font-medium hover:underline inline-flex items-center gap-1"
                                    >
                                        Ver detalles <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="text-center mt-10">
                    <Link href="/eventos">
                        <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                            Ver todos los eventos
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
