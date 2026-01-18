'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { EventsService } from '@/lib/services';
import type { Event } from '@/lib/types';

interface EventFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event?: Event | null;
    onSuccess?: () => void;
}

export function EventFormDialog({ open, onOpenChange, event, onSuccess }: EventFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        capacity: '',
        isPublic: true,
        organizer: '',
    });

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                startDate: event.startDate.split('T')[0],
                endDate: event.endDate?.split('T')[0] || '',
                location: event.location,
                capacity: event.capacity?.toString() || '',
                isPublic: event.isPublic,
                organizer: event.organizer || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                location: '',
                capacity: '',
                isPublic: true,
                organizer: '',
            });
        }
    }, [event, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Build data object without undefined values (Firebase doesn't accept undefined)
            const eventData: Record<string, unknown> = {
                title: formData.title,
                description: formData.description,
                startDate: new Date(formData.startDate).toISOString(),
                location: formData.location,
                isPublic: formData.isPublic,
                organizer: formData.organizer || 'Dra. Lidia Casasola',
            };

            // Only add optional fields if they have values
            if (formData.endDate) eventData.endDate = new Date(formData.endDate).toISOString();
            if (formData.capacity) eventData.capacity = parseInt(formData.capacity);

            if (event) {
                await EventsService.update(event.id, eventData);
            } else {
                await EventsService.create(eventData);
            }

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error al guardar el evento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{event ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
                    <DialogDescription>
                        {event ? 'Modifica los datos del evento' : 'Completa los datos para crear un nuevo evento'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Título del evento"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            placeholder="Descripción del evento"
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Fecha de Inicio *</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">Fecha de Fin</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Ubicación *</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                            placeholder="Dirección o lugar del evento"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacidad (opcional)</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min="1"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            placeholder="Número máximo de asistentes"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                            className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                        />
                        <Label htmlFor="isPublic" className="cursor-pointer">
                            Evento público (visible para todos)
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {event ? 'Guardar Cambios' : 'Crear Evento'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
