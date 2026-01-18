'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MapPin, Calendar as CalendarIcon, Loader2, Edit, Trash2, LayoutGrid, List, Eye, Users } from 'lucide-react';
import { EventsService } from '@/lib/services';
import type { Event } from '@/lib/types';
import { EventFormDialog } from '@/components/admin/EventFormDialog';

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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

    const handleEdit = (e: React.MouseEvent, event: Event) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedEvent(event);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedEvent(null);
        setDialogOpen(true);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
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
            month: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase(),
            fullDate: date.toLocaleDateString('es-ES'),
            time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                <div className="flex gap-2">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        className="bg-primary hover:bg-primary/90 font-bold"
                        onClick={handleCreate}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Evento
                    </Button>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center text-gray-500 p-8">
                    No hay eventos programados
                </div>
            ) : viewMode === 'list' ? (
                /* List View */
                <div className="space-y-4">
                    {events.map((event) => {
                        const dateInfo = formatDate(event.startDate);
                        return (
                            <Link key={event.id} href={`/admin/events/${event.id}`}>
                                <Card className="cursor-pointer hover:shadow-lg transition-shadow shadow-md border-0">
                                    <CardContent className="p-0 flex flex-col md:flex-row">
                                        <div className="bg-accent text-white w-full md:w-32 flex flex-col items-center justify-center p-4">
                                            <span className="text-3xl font-black">{dateInfo.day}</span>
                                            <span className="uppercase text-sm font-bold">{dateInfo.month}</span>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                                                    <div className="space-y-1 text-gray-600">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <CalendarIcon className="w-4 h-4" />
                                                            {dateInfo.fullDate} - {dateInfo.time} hs
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <MapPin className="w-4 h-4" />
                                                            {event.location}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${event.isPublic
                                                    ? 'bg-accent/10 text-accent'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {event.isPublic ? 'Público' : 'Privado'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-center justify-end gap-2 md:border-l border-t md:border-t-0 border-gray-100">
                                            <Button variant="outline" size="sm" onClick={(e) => handleEdit(e, event)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={(e) => handleDelete(e, event.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const dateInfo = formatDate(event.startDate);
                        return (
                            <Link key={event.id} href={`/admin/events/${event.id}`}>
                                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-full shadow-md border-0">
                                    <div className="bg-accent text-white p-4 text-center">
                                        <span className="text-3xl font-bold block">{dateInfo.day}</span>
                                        <span className="text-sm uppercase">{dateInfo.month}</span>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{event.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${event.isPublic ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-700'}`}>
                                                {event.isPublic ? 'Público' : 'Privado'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                        <div className="space-y-2 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4" />
                                                <span>{dateInfo.time} hs</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                            {event.capacity && (
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{event.capacity} personas</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" className="h-8" onClick={(e) => handleEdit(e, event)}>
                                                <Edit className="h-3 w-3 mr-1" /> Editar
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={(e) => handleDelete(e, event.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
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
