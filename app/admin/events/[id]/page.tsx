'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventsService } from '@/lib/services';
import type { Event } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2, Loader2, Calendar, MapPin, Users, User, ExternalLink, Clock } from 'lucide-react';
import { EventFormDialog } from '@/components/admin/EventFormDialog';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

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

    const handleDelete = async () => {
        if (!event || !confirm('¿Eliminar este evento?')) return;

        try {
            await EventsService.delete(event.id);
            router.push('/admin/events');
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-16">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Evento no encontrado</h1>
                <Link href="/admin/events" className="text-primary hover:underline">
                    <ArrowLeft className="inline h-4 w-4 mr-1" />
                    Volver a eventos
                </Link>
            </div>
        );
    }

    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/events">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Detalle de Evento</h1>
                </div>
                <div className="flex gap-2">
                    {event.isPublic && (
                        <Link href={`/eventos/${event.id}`} target="_blank">
                            <Button variant="outline">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver Público
                            </Button>
                        </Link>
                    )}
                    <Button variant="outline" onClick={() => setDialogOpen(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Event Content */}
                <div className="lg:col-span-2">
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <CardTitle className="text-xl">{event.title}</CardTitle>
                                <Badge className={event.isPublic ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-800'}>
                                    {event.isPublic ? 'Público' : 'Privado'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">Descripción</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-4">
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="text-lg">Información</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-accent" />
                                <div>
                                    <p className="text-sm text-gray-500">Fecha</p>
                                    <p className="font-medium">
                                        {startDate.toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-accent" />
                                <div>
                                    <p className="text-sm text-gray-500">Horario</p>
                                    <p className="font-medium">
                                        {startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs
                                        {endDate && ` - ${endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-accent" />
                                <div>
                                    <p className="text-sm text-gray-500">Ubicación</p>
                                    <p className="font-medium">{event.location}</p>
                                </div>
                            </div>

                            {event.capacity && (
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-accent" />
                                    <div>
                                        <p className="text-sm text-gray-500">Capacidad</p>
                                        <p className="font-medium">{event.capacity} personas</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-accent" />
                                <div>
                                    <p className="text-sm text-gray-500">Organizador</p>
                                    <p className="font-medium">{event.organizer}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="text-lg">Historial</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Creado:</span>
                                <span>
                                    {new Date(event.createdAt).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Actualizado:</span>
                                <span>
                                    {new Date(event.updatedAt).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <EventFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                event={event}
                onSuccess={() => {
                    setDialogOpen(false);
                    loadEvent(event.id);
                }}
            />
        </div>
    );
}
