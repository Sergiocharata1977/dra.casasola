'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            const result = await signIn(email, password);

            if (result.success) {
                router.push('/admin');
            } else {
                // Traducir mensajes de error comunes
                let errorMsg = result.error || 'Error al iniciar sesión';
                if (errorMsg.includes('user-not-found')) {
                    errorMsg = 'Usuario no encontrado. ¿Deseas crear una cuenta?';
                } else if (errorMsg.includes('wrong-password') || errorMsg.includes('invalid-credential')) {
                    errorMsg = 'Contraseña incorrecta';
                } else if (errorMsg.includes('invalid-email')) {
                    errorMsg = 'Email inválido';
                } else if (errorMsg.includes('too-many-requests')) {
                    errorMsg = 'Demasiados intentos. Intenta más tarde.';
                } else if (errorMsg.includes('operation-not-allowed')) {
                    errorMsg = 'Error de configuración: Habilita Email/Password en Firebase Console.';
                }
                setError(errorMsg);
            }
        } catch (err) {
            console.error(err);
            setError('Error inesperado al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#5B2C83] p-4">
            <Card className="w-full max-w-md border-0 shadow-2xl">
                <CardHeader className="space-y-1 text-center pb-8 pt-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-violet-100 p-4 rounded-full">
                            <img src="/Logos-lla/Logo LLA Chaco-02.png" alt="Logo" className="w-24 h-auto" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Bienvenido</CardTitle>
                    <CardDescription className="text-gray-500 text-lg">
                        Sistema de Gestión Interna
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@lla-sudoeste.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 border-gray-300 focus-visible:ring-violet-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 border-gray-300 focus-visible:ring-violet-600"
                            />
                        </div>
                        <Button className="w-full h-12 text-lg bg-violet-600 hover:bg-violet-700 font-bold" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ingresar
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-slate-400">
                            ¿Problemas para entrar? <a href="/setup" className="underline hover:text-slate-600">Configuración inicial</a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
