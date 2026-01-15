'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertCircle, Scale } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <Card className="w-full max-w-md border-0 shadow-2xl">
                <CardHeader className="space-y-1 text-center pb-8 pt-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-accent/20 p-4 rounded-full">
                            <Scale className="w-12 h-12 text-accent" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-serif font-bold tracking-tight text-foreground">
                        Dra. Lidia Casasola
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-lg">
                        Panel de Administración
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
                                placeholder="doctora@casasola.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 border-border focus-visible:ring-accent"
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
                                className="h-12 border-border focus-visible:ring-accent"
                            />
                        </div>
                        <Button
                            className="w-full h-12 text-lg bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ingresar
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-muted-foreground">
                            ¿Problemas para entrar? <a href="/setup" className="underline hover:text-accent">Configuración inicial</a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
