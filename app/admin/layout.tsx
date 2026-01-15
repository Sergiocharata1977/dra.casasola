'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    Calendar,
    Newspaper,
    LayoutDashboard,
    LogOut,
    Menu,
    KanbanSquare,
    UserCog,
    Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-pulse text-violet-600 font-bold text-xl">Cargando sistema...</div>
            </div>
        );
    }

    if (!user) return null;

    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`bg-gray-900 text-white w-64 fixed h-full transition-transform z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white leading-tight">LLA <span className="text-violet-400 block">ADMIN</span></h2>
                    </div>
                    <button className="md:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
                        <Menu />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    <Link href="/admin">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin') ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <LayoutDashboard size={20} />
                            Dashboard
                        </div>
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Módulos
                    </div>

                    <Link href="/admin/collaborators">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/collaborators') ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <Users size={20} />
                            Colaboradores
                        </div>
                    </Link>

                    <Link href="/admin/tasks">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/tasks') ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <KanbanSquare size={20} />
                            Gestión de Tareas
                        </div>
                    </Link>

                    <Link href="/admin/news">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/news') ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <Newspaper size={20} />
                            Noticias
                        </div>
                    </Link>

                    <Link href="/admin/events">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/events') ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <Calendar size={20} />
                            Eventos
                        </div>
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Administración
                    </div>

                    <Link href="/admin/users">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/users') ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <UserCog size={20} />
                            Gestión de Usuarios
                        </div>
                    </Link>

                    <div className="pt-8 px-4">
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 gap-3" onClick={signOut}>
                            <LogOut size={20} />
                            Cerrar Sesión
                        </Button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
                <header className="bg-white shadow-sm h-16 flex items-center px-6 sticky top-0 z-20">
                    <button className="mr-4 md:hidden text-gray-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu />
                    </button>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 font-medium text-sm">{user.email}</span>
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
                            {user.email[0].toUpperCase()}
                        </div>
                    </div>
                </header>
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
