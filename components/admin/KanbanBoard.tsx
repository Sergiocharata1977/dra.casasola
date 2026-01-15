'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    columnId: string;
    priority: 'low' | 'medium' | 'high';
}

const INITIAL_TASKS: Task[] = [
    { id: '1', title: 'Diseñar flyers para evento 25 de Mayo', columnId: 'todo', priority: 'medium' },
    { id: '2', title: 'Llamar a referentes de Villa Ángela', columnId: 'in-progress', priority: 'high' },
    { id: '3', title: 'Actualizar padrón de afiliados', columnId: 'done', priority: 'low' },
];

const COLUMNS = [
    { id: 'todo', title: 'Por Hacer', color: '#e2e8f0' },
    { id: 'in-progress', title: 'En Progreso', color: '#ddd6fe' },
    { id: 'done', title: 'Completado', color: '#bbf7d0' },
];

export default function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

    const dragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('taskId', id);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDrop = (e: React.DragEvent, columnId: string) => {
        const taskId = e.dataTransfer.getData('taskId');
        setTasks(tasks.map(t => t.id === taskId ? { ...t, columnId } : t));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Tareas (Kanban)</h1>
                <Button className="bg-violet-600 hover:bg-violet-700 font-bold">
                    <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
                </Button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
                {COLUMNS.map(col => (
                    <div
                        key={col.id}
                        className="flex-shrink-0 w-80 bg-gray-100 rounded-xl flex flex-col max-h-full"
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, col.id)}
                    >
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-gray-100 rounded-t-xl z-10">
                            <h3 className="font-bold text-gray-700">{col.title}</h3>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 shadow-sm">
                                {tasks.filter(t => t.columnId === col.id).length}
                            </span>
                        </div>

                        <div className="p-3 space-y-3 overflow-y-auto flex-1">
                            {tasks.filter(t => t.columnId === col.id).map(task => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => dragStart(e, task.id)}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                task.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                                </div>
                            ))}

                            {tasks.filter(t => t.columnId === col.id).length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg">
                                    Arrastra tareas aquí
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
