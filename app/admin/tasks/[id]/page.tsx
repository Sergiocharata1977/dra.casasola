'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TasksService } from '@/lib/services';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2, Loader2, Calendar, User, Flag } from 'lucide-react';
import { TaskFormDialog } from '@/components/admin/TaskFormDialog';

export default function TaskDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadTask(params.id as string);
        }
    }, [params.id]);

    const loadTask = async (id: string) => {
        try {
            const data = await TasksService.getById(id);
            setTask(data);
        } catch (error) {
            console.error('Error loading task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!task || !confirm('¿Eliminar esta tarea?')) return;

        try {
            await TasksService.delete(task.id);
            router.push('/admin/tasks');
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'backlog': 'bg-gray-100 text-gray-700',
            'todo': 'bg-blue-100 text-blue-700',
            'in-progress': 'bg-amber-100 text-amber-700',
            'done': 'bg-green-100 text-green-700',
        };
        const labels: Record<string, string> = {
            'backlog': 'Backlog',
            'todo': 'Por Hacer',
            'in-progress': 'En Progreso',
            'done': 'Completado',
        };
        return (
            <Badge className={styles[status] || styles.backlog}>
                {labels[status] || status}
            </Badge>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            urgent: 'bg-red-100 text-red-700',
            high: 'bg-orange-100 text-orange-700',
            medium: 'bg-yellow-100 text-yellow-700',
            low: 'bg-green-100 text-green-700',
        };
        const labels: Record<string, string> = {
            urgent: 'Urgente',
            high: 'Alta',
            medium: 'Media',
            low: 'Baja',
        };
        return (
            <Badge className={styles[priority] || styles.medium}>
                {labels[priority] || priority}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="text-center py-16">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Tarea no encontrada</h1>
                <Link href="/admin/tasks" className="text-primary hover:underline">
                    <ArrowLeft className="inline h-4 w-4 mr-1" />
                    Volver a tareas
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/tasks">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Detalle de Tarea</h1>
                </div>
                <div className="flex gap-2">
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
                {/* Task Details */}
                <div className="lg:col-span-2">
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-xl">{task.title}</CardTitle>
                                <div className="flex gap-2">
                                    {getStatusBadge(task.status)}
                                    {getPriorityBadge(task.priority)}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Descripción</h3>
                                    <p className="text-gray-700">
                                        {task.description || 'Sin descripción'}
                                    </p>
                                </div>
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
                                <Flag className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Prioridad</p>
                                    <p className="font-medium capitalize">{task.priority}</p>
                                </div>
                            </div>

                            {task.assignee && (
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Responsable</p>
                                        <p className="font-medium">{task.assignee}</p>
                                    </div>
                                </div>
                            )}

                            {task.dueDate && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha Límite</p>
                                        <p className="font-medium">
                                            {new Date(task.dueDate).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
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
                                    {new Date(task.createdAt).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Actualizado:</span>
                                <span>
                                    {new Date(task.updatedAt).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <TaskFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                task={task}
                onSuccess={() => {
                    setDialogOpen(false);
                    loadTask(task.id);
                }}
            />
        </div>
    );
}
