'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MapPin, Calendar as CalendarIcon, Loader2, Edit, Trash2 } from 'lucide-react';
import { EventsService } from '@/lib/services';
import type { Event } from '@/lib/types';
import { EventFormDialog } from '@/components/admin/EventFormDialog';

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await EventsService.getAll();
            setEvents(data);
        } catch (err) {
            console.error('Error loading events:', err);
            setError('Error al cargar los eventos');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedEvent(null);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este evento?')) return;

        try {
            await EventsService.delete(id);
            await loadEvents();
        } catch (err) {
            console.error('Error deleting event:', err);
            alert('Error al eliminar el evento');
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleSuccess = () => {
        loadEvents();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('es-ES', { month: 'long' }),
            fullDate: date.toLocaleDateString('es-ES'),
            time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-8">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Agenda de Eventos</h1>
                <Button
                    className="bg-violet-600 hover:bg-violet-700 font-bold"
                    onClick={handleCreate}
                >
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Evento
                </Button>
            </div>

            {events.length === 0 ? (
                <div className="text-center text-gray-500 p-8">
                    No hay eventos programados
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => {
                        const dateInfo = formatDate(event.startDate);
                        return (
                            <Card key={event.id}>
                                <CardContent className="p-0 flex flex-col md:flex-row">
                                    <div className="bg-violet-600 text-white w-full md:w-32 flex flex-col items-center justify-center p-4">
                                        <span className="text-3xl font-black">{dateInfo.day}</span>
                                        <span className="uppercase text-sm font-bold">{dateInfo.month}</span>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                                                <div className="space-y-1 text-gray-600">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        {dateInfo.fullDate} - {dateInfo.time} hs
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin className="w-4 h-4" />
                                                        {event.location}
                                                    </div>
                                                    {event.capacity && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Capacidad: {event.capacity} personas
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${event.isPublic
                                                ? 'bg-violet-100 text-violet-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {event.isPublic ? 'Público' : 'Privado'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center justify-end gap-2 md:border-l border-t md:border-t-0 border-gray-100">
                                        <Button variant="outline" onClick={() => handleEdit(event)}>Editar</Button>
                                        <Button
                                            variant="ghost"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(event.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <EventFormDialog
                open={dialogOpen}
                onOpenChange={handleDialogClose}
                event={selectedEvent}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
