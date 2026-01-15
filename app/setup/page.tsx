'use client';

import { useState } from 'react';
import { signUp } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SetupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            const result = await signUp(email, password);

            if (result.success) {
                setStatus({
                    type: 'success',
                    message: `Usuario ${email} creado exitosamente. Ya puedes iniciar sesión.`
                });
            } else {
                let errorMsg = result.error || 'Error desconocido';
                // Mejorar mensajes de error comunes de Firebase
                if (errorMsg.includes('email-already-in-use')) errorMsg = 'Este correo ya está registrado.';
                if (errorMsg.includes('operation-not-allowed')) errorMsg = 'El proveedor Email/Password no está habilitado en Firebase Console.';
                if (errorMsg.includes('weak-password')) errorMsg = 'La contraseña es muy débil.';

                throw new Error(errorMsg);
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Error al crear usuario'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-lg border-2 shadow-lg">
                <CardHeader className="text-center border-b bg-white rounded-t-lg pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-800">Configuración Inicial</CardTitle>
                    <CardDescription className="text-slate-600 mt-2">
                        Herramienta para crear tu primer usuario administrador y verificar la conexión con Firebase.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6 bg-white rounded-b-lg">
                    {status.message && (
                        <Alert variant={status.type === 'error' ? 'destructive' : 'default'} className={status.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : ''}>
                            {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle>{status.type === 'success' ? '¡Éxito!' : 'Error'}</AlertTitle>
                            <AlertDescription>{status.message}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@lla-sudoeste.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña (min 6 caracteres)</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="h-11"
                            />
                        </div>

                        <Button type="submit" className="w-full h-11 text-lg font-medium" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando usuario...
                                </>
                            ) : (
                                'Crear Usuario Admin'
                            )}
                        </Button>
                    </form>

                    <div className="pt-4 border-t text-center">
                        <Link href="/login" className="text-sm text-violet-600 hover:text-violet-800 font-medium">
                            &larr; Volver al Login
                        </Link>
                    </div>

                    <div className="mt-6 p-4 bg-slate-100 rounded text-xs text-slate-500">
                        <p className="font-semibold mb-1">Nota para el desarrollador:</p>
                        <p>Si recibes el error "operation-not-allowed", ve a tu consola de Firebase &gt; Authentication &gt; Sign-in method y habilita "Email/Password".</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
