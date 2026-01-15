'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const COLLABORATORS = [
    { id: 1, name: 'Juan Pérez', role: 'Fiscal General', city: 'Sáenz Peña', status: 'Activo' },
    { id: 2, name: 'María Gonzalez', role: 'Voluntario', city: 'Resistencia', status: 'Activo' },
    { id: 3, name: 'Carlos Diaz', role: 'Logística', city: 'Villa Ángela', status: 'Inactivo' },
    { id: 4, name: 'Ana Silva', role: 'Redes Sociales', city: 'Charata', status: 'Activo' },
    { id: 5, name: 'Pedro Gomez', role: 'Fiscal de Mesa', city: 'Sáenz Peña', status: 'Pendiente' },
]

export default function CollaboratorsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Registro de Colaboradores</h1>
                <Button className="bg-violet-600 hover:bg-violet-700 font-bold">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Colaborador
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Listado General</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input placeholder="Buscar colaborador..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nombre</th>
                                    <th scope="col" className="px-6 py-3">Rol</th>
                                    <th scope="col" className="px-6 py-3">Ciudad</th>
                                    <th scope="col" className="px-6 py-3">Estado</th>
                                    <th scope="col" className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COLLABORATORS.map((user) => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4">{user.role}</td>
                                        <td className="px-6 py-4">{user.city}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Activo' ? 'bg-green-100 text-green-700' :
                                                    user.status === 'Inactivo' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="sm" className="text-violet-600 font-medium hover:text-violet-800">
                                                Editar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
