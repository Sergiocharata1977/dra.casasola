'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Newspaper, KanbanSquare, Scale } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
                        <Scale className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">+3 este mes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
                        <KanbanSquare className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">2 de alta prioridad</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Noticias Publicadas</CardTitle>
                        <Newspaper className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Última: hace 3 días</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
                        <Calendar className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">En los próximos 7 días</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="font-serif">Actividad Reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-accent"></div>
                                <div>
                                    <p className="text-sm font-medium">Nueva consulta de jubilación</p>
                                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-accent"></div>
                                <div>
                                    <p className="text-sm font-medium">Artículo publicado: Cambios ANSES 2026</p>
                                    <p className="text-xs text-muted-foreground">Hace 1 día</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-accent"></div>
                                <div>
                                    <p className="text-sm font-medium">Evento creado: Charla Previsional</p>
                                    <p className="text-xs text-muted-foreground">Hace 3 días</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="font-serif">Próximos Eventos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 bg-accent/10 rounded-lg">
                                <Calendar className="h-8 w-8 text-accent" />
                                <div>
                                    <p className="text-sm font-medium">Charla: Novedades Jubilatorias</p>
                                    <p className="text-xs text-muted-foreground">20 de Enero, 2026 - 18:00</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                                <Calendar className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Webinar Pensiones</p>
                                    <p className="text-xs text-muted-foreground">25 de Enero, 2026 - 10:00</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
