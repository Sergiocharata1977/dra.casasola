'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Calendar,
    Newspaper,
    LayoutDashboard,
    LogOut,
    Menu,
    KanbanSquare,
    UserCog,
    Scale
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
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse text-accent font-bold text-xl">Cargando sistema...</div>
            </div>
        );
    }

    if (!user) return null;

    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className={`bg-primary text-primary-foreground w-64 fixed h-full transition-transform z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6 border-b border-primary-foreground/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Scale className="h-8 w-8 text-accent" />
                        <div>
                            <h2 className="text-lg font-serif font-bold text-primary-foreground leading-tight">Dra. Casasola</h2>
                            <span className="text-xs text-accent">Panel Admin</span>
                        </div>
                    </div>
                    <button className="md:hidden text-primary-foreground/60" onClick={() => setSidebarOpen(false)}>
                        <Menu />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    <Link href="/admin">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin') ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'}`}>
                            <LayoutDashboard size={20} />
                            Dashboard
                        </div>
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-primary-foreground/50 uppercase tracking-wider">
                        Contenido
                    </div>

                    <Link href="/admin/news">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/news') ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'}`}>
                            <Newspaper size={20} />
                            Noticias Legales
                        </div>
                    </Link>

                    <Link href="/admin/events">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/events') ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'}`}>
                            <Calendar size={20} />
                            Eventos
                        </div>
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-primary-foreground/50 uppercase tracking-wider">
                        Gestión
                    </div>

                    <Link href="/admin/tasks">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/tasks') ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'}`}>
                            <KanbanSquare size={20} />
                            Tareas
                        </div>
                    </Link>

                    <Link href="/admin/users">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/users') ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'}`}>
                            <UserCog size={20} />
                            Usuarios
                        </div>
                    </Link>

                    <div className="pt-8 px-4">
                        <Button variant="ghost" className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20 gap-3" onClick={signOut}>
                            <LogOut size={20} />
                            Cerrar Sesión
                        </Button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
                <header className="bg-card shadow-sm h-16 flex items-center px-6 sticky top-0 z-20 border-b border-border">
                    <button className="mr-4 md:hidden text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu />
                    </button>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-4">
                        <span className="text-muted-foreground font-medium text-sm">{user.email}</span>
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
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
