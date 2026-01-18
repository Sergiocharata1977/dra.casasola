'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Pencil, Trash2, Calendar, Loader2, LayoutGrid, List, Eye, Flag } from 'lucide-react';
import { TasksService } from '@/lib/services';
import type { Task } from '@/lib/types';
import { TaskFormDialog } from './TaskFormDialog';

const COLUMNS = [
    { id: 'backlog', title: 'Backlog', color: 'bg-gray-50' },
    { id: 'todo', title: 'Por Hacer', color: 'bg-blue-50' },
    { id: 'in-progress', title: 'En Progreso', color: 'bg-amber-50' },
    { id: 'done', title: 'Completado', color: 'bg-green-50' },
];

const PRIORITY_STYLES: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
};

const PRIORITY_LABELS: Record<string, string> = {
    urgent: 'Urgente',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
};

const STATUS_STYLES: Record<string, string> = {
    'backlog': 'bg-gray-100 text-gray-700',
    'todo': 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    'done': 'bg-green-100 text-green-700',
};

const STATUS_LABELS: Record<string, string> = {
    'backlog': 'Backlog',
    'todo': 'Por Hacer',
    'in-progress': 'En Progreso',
    'done': 'Completado',
};

export default function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [draggingTask, setDraggingTask] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await TasksService.getAll();
            setTasks(data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggingTask(taskId);
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, newStatus: Task['status']) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (!taskId) return;

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        setDraggingTask(null);

        try {
            await TasksService.update(taskId, { status: newStatus });
        } catch (error) {
            console.error('Error updating task:', error);
            loadTasks();
        }
    };

    const handleEdit = (e: React.MouseEvent, task: Task) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingTask(task);
        setDialogOpen(true);
    };

    const handleDelete = async (e: React.MouseEvent, taskId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('¿Eliminar esta tarea?')) return;

        try {
            await TasksService.delete(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleNewTask = () => {
        setEditingTask(null);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingTask(null);
    };

    const handleSuccess = () => {
        handleDialogClose();
        loadTasks();
    };

    const getTasksByStatus = (status: string) => {
        return tasks.filter(t => t.status === status);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h1>
                <div className="flex gap-2">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 ${viewMode === 'kanban' ? 'bg-white shadow-sm' : ''}`}
                            onClick={() => setViewMode('kanban')}
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
                    <Button onClick={handleNewTask} className="bg-primary hover:bg-primary/90 font-bold">
                        <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
                    </Button>
                </div>
            </div>

            {viewMode === 'kanban' ? (
                /* Kanban View */
                <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
                    {COLUMNS.map(col => (
                        <div
                            key={col.id}
                            className={`flex-shrink-0 w-80 ${col.color} rounded-xl flex flex-col max-h-full shadow-sm`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id as Task['status'])}
                        >
                            <div className="p-4 flex items-center justify-between sticky top-0 rounded-t-xl z-10">
                                <h3 className="font-bold text-gray-700">{col.title}</h3>
                                <Badge variant="secondary" className="bg-white shadow-sm">
                                    {getTasksByStatus(col.id).length}
                                </Badge>
                            </div>

                            <div className="p-3 space-y-3 overflow-y-auto flex-1">
                                {getTasksByStatus(col.id).map(task => (
                                    <Link key={task.id} href={`/admin/tasks/${task.id}`}>
                                        <Card
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task.id)}
                                            className={`cursor-grab active:cursor-grabbing hover:shadow-lg transition-all bg-white shadow-md border-0 ${draggingTask === task.id ? 'opacity-50 rotate-2' : ''
                                                }`}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
                                                        {PRIORITY_LABELS[task.priority] || task.priority}
                                                    </span>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/tasks/${task.id}`}>
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    Ver Detalles
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => handleEdit(e, task)}>
                                                                <Pencil className="w-4 h-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={(e) => handleDelete(e, task.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <h4 className="font-medium text-gray-900 text-sm mb-1 hover:text-primary">
                                                    {task.title}
                                                </h4>

                                                {task.description && (
                                                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                                                        {task.description}
                                                    </p>
                                                )}

                                                {task.dueDate && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(task.dueDate).toLocaleDateString('es-ES')}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}

                                {getTasksByStatus(col.id).length === 0 && (
                                    <div className="text-center py-8 text-gray-400 text-sm rounded-lg bg-white/50 shadow-inner">
                                        Arrastra tareas aquí
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="space-y-3">
                    {tasks.length === 0 ? (
                        <div className="text-center text-gray-500 p-8">
                            No hay tareas creadas
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <Link key={task.id} href={`/admin/tasks/${task.id}`}>
                                <Card className="cursor-pointer hover:shadow-lg transition-shadow shadow-md border-0">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Status indicator */}
                                            <div className={`h-12 w-2 rounded-full ${task.status === 'done' ? 'bg-green-500' :
                                                    task.status === 'in-progress' ? 'bg-amber-500' :
                                                        task.status === 'todo' ? 'bg-blue-500' : 'bg-gray-400'
                                                }`} />

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-900 truncate">{task.title}</h3>
                                                    <Badge className={STATUS_STYLES[task.status] || 'bg-gray-100'}>
                                                        {STATUS_LABELS[task.status] || task.status}
                                                    </Badge>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
                                                        {PRIORITY_LABELS[task.priority] || task.priority}
                                                    </span>
                                                </div>
                                                {task.description && (
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                                    {task.dueDate && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(task.dueDate).toLocaleDateString('es-ES')}
                                                        </span>
                                                    )}
                                                    {task.assignee && (
                                                        <span>Asignado a: {task.assignee}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Button variant="ghost" size="sm" className="h-8" asChild>
                                                    <Link href={`/admin/tasks/${task.id}`} onClick={(e) => e.stopPropagation()}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" className="h-8" onClick={(e) => handleEdit(e, task)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={(e) => handleDelete(e, task.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            )}

            <TaskFormDialog
                open={dialogOpen}
                onOpenChange={handleDialogClose}
                task={editingTask}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
