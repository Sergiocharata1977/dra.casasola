'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CalendarClock, FileText, Newspaper, PenLine, Star } from 'lucide-react';
import { NewsService } from '@/lib/services';
import type { News } from '@/lib/types';
import {
    armarPortada,
    estadoDeNota,
    fechaCorta,
    hrefNota,
    ordenarPorFecha,
    textoDeProgramacion,
} from '@/lib/portada';
import { nombreSeccion, secciones } from '@/lib/site-config';

/**
 * Panel de la redaccion.
 *
 * Todo lo que se muestra sale de la coleccion `news`. Antes esta pantalla
 * tenia numeros escritos a mano heredados del sitio anterior ("Casos
 * Activos", "consultas de jubilacion") que no correspondian a nada.
 */
export default function AdminDashboard() {
    const [notas, setNotas] = useState<News[] | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        NewsService.getAll()
            .then(setNotas)
            .catch(() => setError(true));
    }, []);

    if (error) {
        return (
            <div className="space-y-2">
                <h1 className="font-serif text-3xl font-bold">Redaccion</h1>
                <p className="text-sm text-muted-foreground">
                    No se pudo leer la base de notas. Revisa la conexion con Firestore.
                </p>
            </div>
        );
    }

    if (!notas) {
        return (
            <div className="space-y-6">
                <h1 className="font-serif text-3xl font-bold">Redaccion</h1>
                <div className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 rounded-lg border bg-muted/40" />
                    ))}
                </div>
            </div>
        );
    }

    // Una nota programada esta autorizada pero todavia no salio: no cuenta
    // como publicada ni ocupa lugar en la tapa.
    const publicadas = notas.filter((n) => estadoDeNota(n) === 'publicada');
    const programadas = notas.filter((n) => estadoDeNota(n) === 'programada');
    const borradores = notas.filter((n) => estadoDeNota(n) === 'borrador');

    const portada = armarPortada(publicadas);

    // La proxima en salir. getAll() ordena por createdAt, que no dice nada
    // sobre el orden de salida, asi que la cola se ordena por publishedAt.
    const momentoDeSalida = (n: News) => (n.publishedAt ? new Date(n.publishedAt).getTime() : 0);
    const colaProgramadas = [...programadas].sort(
        (a, b) => momentoDeSalida(a) - momentoDeSalida(b)
    );

    // La ultima publicada es la de fecha de salida mas reciente, no la ultima
    // creada: son cosas distintas desde que existe la programacion.
    const ultimaPublicada = ordenarPorFecha(publicadas)[0];

    // Los pendientes se miran sobre todo lo que ya esta autorizado a salir:
    // una nota programada sin foto conviene corregirla ANTES de que salga,
    // no cuando ya esta en la web.
    const autorizadas = [...publicadas, ...programadas];
    const sinSeccion = autorizadas.filter((n) => !n.seccion);
    const sinFoto = autorizadas.filter((n) => !n.imageUrl);

    const ultimas = ordenarPorFecha(notas).slice(0, 6);

    // Cuantas notas publicadas tiene cada seccion. Sirve para ver que area
    // esta quedando sin cobertura. Cuenta solo lo que ya salio: es cobertura
    // real de la revista, no cobertura prometida.
    const porSeccion = secciones.map((s) => ({
        ...s,
        cantidad: publicadas.filter((n) => n.seccion === s.slug).length,
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h1 className="font-serif text-3xl font-bold">Redaccion</h1>
                <Link
                    href="/admin/news"
                    className="text-sm font-medium text-accent hover:underline"
                >
                    Ir a las notas
                </Link>
            </div>

            {/* ---- Numeros reales ---- */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
                <Indicador
                    titulo="Publicadas"
                    icono={<Newspaper className="h-4 w-4 text-accent" />}
                    valor={publicadas.length}
                    pie={
                        publicadas.length > 0
                            ? `Ultima: ${fechaCorta(
                                  ultimaPublicada?.publishedAt || ultimaPublicada?.createdAt
                              )}`
                            : 'Todavia no publicaste ninguna'
                    }
                />
                <Indicador
                    titulo="Programadas"
                    icono={<CalendarClock className="h-4 w-4 text-accent" />}
                    valor={programadas.length}
                    pie={
                        colaProgramadas.length > 0
                            ? `Proxima: ${textoDeProgramacion(colaProgramadas[0])}`
                            : 'No hay notas esperando'
                    }
                />
                <Indicador
                    titulo="Borradores"
                    icono={<PenLine className="h-4 w-4 text-accent" />}
                    valor={borradores.length}
                    pie={borradores.length > 0 ? 'Sin salir a la web' : 'No hay pendientes'}
                />
                <Indicador
                    titulo="Apertura de tapa"
                    icono={<Star className="h-4 w-4 text-accent" />}
                    valor={portada.apertura ? 1 : 0}
                    pie={portada.apertura ? portada.apertura.title.slice(0, 38) : 'Sin definir'}
                />
                <Indicador
                    titulo="Para revisar"
                    icono={<AlertTriangle className="h-4 w-4 text-accent" />}
                    valor={sinSeccion.length + sinFoto.length}
                    pie="Al aire o programadas, sin seccion o sin foto"
                />
            </div>

            {/* Si ya hay algo programado la tapa esta por llenarse sola: no
                corresponde el cartel de "todavia no hay nada". */}
            {publicadas.length === 0 && programadas.length === 0 && (
                <Card className="border-accent/40 bg-accent/5">
                    <CardContent className="pt-6">
                        <p className="font-medium">La revista todavia no tiene notas propias.</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            La portada esta vacia hasta que salga la primera. En cuanto publiques
                            una nota, la tapa se arma sola con lo tuyo.
                        </p>
                        <Link
                            href="/admin/news"
                            className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                        >
                            Escribir la primera nota
                        </Link>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* ---- Ultimo movimiento ---- */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif">Ultimo movimiento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {ultimas.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Sin notas cargadas.</p>
                        ) : (
                            <ul className="space-y-3">
                                {ultimas.map((n) => {
                                    const estado = estadoDeNota(n);
                                    return (
                                        <li key={n.id} className="flex items-start gap-3">
                                            <span
                                                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                                    estado === 'publicada'
                                                        ? 'bg-emerald-500'
                                                        : estado === 'programada'
                                                          ? 'bg-amber-500'
                                                          : 'bg-muted-foreground/40'
                                                }`}
                                                aria-hidden="true"
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {estado === 'publicada'
                                                        ? 'Publicada'
                                                        : estado === 'programada'
                                                          ? textoDeProgramacion(n)
                                                          : 'Borrador'}{' '}
                                                    · {nombreSeccion(n.seccion)} ·{' '}
                                                    {fechaCorta(n.updatedAt || n.createdAt)}
                                                </p>
                                            </div>
                                            {/* El link publico solo existe si la nota ya salio. */}
                                            {estado === 'publicada' && (
                                                <a
                                                    href={hrefNota(n)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="ml-auto shrink-0 text-xs text-accent hover:underline"
                                                >
                                                    Ver
                                                </a>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                {/* ---- Cobertura por seccion ---- */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif">Cobertura por seccion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {porSeccion.map((s) => (
                                <li key={s.slug} className="flex items-center gap-3">
                                    <span className="w-24 shrink-0 text-sm">{s.nombre}</span>
                                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                        <span
                                            className="block h-full bg-accent"
                                            style={{
                                                width: `${
                                                    publicadas.length > 0
                                                        ? (s.cantidad / publicadas.length) * 100
                                                        : 0
                                                }%`,
                                            }}
                                        />
                                    </span>
                                    <span className="w-6 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                                        {s.cantidad}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* ---- Pendientes concretos ---- */}
            {(sinSeccion.length > 0 || sinFoto.length > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-serif">
                            <FileText className="h-4 w-4" />
                            Para completar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-muted-foreground">
                        {sinSeccion.length > 0 && (
                            <p>
                                {sinSeccion.length} nota(s) publicadas o programadas sin seccion
                                asignada: no aparecen en ninguna portada de seccion.
                            </p>
                        )}
                        {sinFoto.length > 0 && (
                            <p>
                                {sinFoto.length} nota(s) publicadas o programadas sin foto: al
                                compartirlas en WhatsApp salen sin imagen.
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function Indicador({
    titulo,
    icono,
    valor,
    pie,
}: {
    titulo: string;
    icono: React.ReactNode;
    valor: number;
    pie: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
                {icono}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{valor}</div>
                <p className="truncate text-xs text-muted-foreground">{pie}</p>
            </CardContent>
        </Card>
    );
}
