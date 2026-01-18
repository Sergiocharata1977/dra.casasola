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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { TasksService } from '@/lib/services';
import type { Task } from '@/lib/types';

interface TaskFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: Task | null;
    onSuccess?: () => void;
}

export function TaskFormDialog({ open, onOpenChange, task, onSuccess }: TaskFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'backlog' as Task['status'],
        priority: 'medium' as Task['priority'],
        assignee: '',
        dueDate: '',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                assignee: task.assignee || '',
                dueDate: task.dueDate?.split('T')[0] || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'backlog',
                priority: 'medium',
                assignee: '',
                dueDate: '',
            });
        }
    }, [task, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const taskData: Record<string, unknown> = {
                title: formData.title,
                status: formData.status,
                priority: formData.priority,
            };

            if (formData.description) taskData.description = formData.description;
            if (formData.assignee) taskData.assignee = formData.assignee;
            if (formData.dueDate) taskData.dueDate = new Date(formData.dueDate).toISOString();

            if (task) {
                await TasksService.update(task.id, taskData);
            } else {
                await TasksService.create(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
            }

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Error al guardar la tarea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{task ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
                    <DialogDescription>
                        {task ? 'Modifica los datos de la tarea' : 'Completa los datos para crear una nueva tarea'}
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
                            placeholder="Título de la tarea"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descripción detallada"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as Task['status'] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="backlog">Backlog</SelectItem>
                                    <SelectItem value="todo">Por Hacer</SelectItem>
                                    <SelectItem value="in-progress">En Progreso</SelectItem>
                                    <SelectItem value="done">Completado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Prioridad</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baja</SelectItem>
                                    <SelectItem value="medium">Media</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                    <SelectItem value="urgent">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="assignee">Responsable</Label>
                            <Input
                                id="assignee"
                                value={formData.assignee}
                                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                                placeholder="Nombre del responsable"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Fecha Límite</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-primary">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {task ? 'Guardar Cambios' : 'Crear Tarea'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
