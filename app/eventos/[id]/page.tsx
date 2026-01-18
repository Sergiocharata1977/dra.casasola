'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { EventsService } from '@/lib/services';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, Users, ArrowLeft, Loader2, User, Clock } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function EventoDetailPage() {
    const params = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadEvent(params.id as string);
        }
    }, [params.id]);

    const loadEvent = async (id: string) => {
        try {
            const data = await EventsService.getById(id);
            setEvent(data);
        } catch (error) {
            console.error('Error loading event:', error);
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

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-primary mb-4">Evento no encontrado</h1>
                    <Link href="/eventos" className="text-accent hover:underline">
                        <ArrowLeft className="inline h-4 w-4 mr-1" />
                        Volver a eventos
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero */}
            <section className="bg-primary text-white py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/eventos"
                        className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a eventos
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold">
                        {event.title}
                    </h1>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <h2 className="text-xl font-bold text-primary mb-4">Descripción</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Detalles del Evento</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-accent mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {startDate.toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-accent mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs
                                                {endDate && ` - ${endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-accent mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">{event.location}</p>
                                        </div>
                                    </div>

                                    {event.capacity && (
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-accent mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Capacidad: {event.capacity} personas
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-accent mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Organiza</p>
                                            <p className="font-medium text-gray-900">{event.organizer}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-accent rounded-xl p-6 text-center text-white">
                                <h3 className="font-bold mb-2">¿Te interesa participar?</h3>
                                <p className="text-sm text-white/80 mb-4">
                                    Contáctanos para más información
                                </p>
                                <Link
                                    href="/#contacto"
                                    className="inline-block bg-white text-accent px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Contactar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
