import { revalidateTag } from 'next/cache';
import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Refresco manual del cache de notas.
 *
 * Este endpoint NO publica nada ni toca Firestore. Lo unico que hace es
 * avisarle al cache de Next que los datos etiquetados como 'notas' quedaron
 * viejos (`revalidateTag('notas')`), para que la proxima visita se arme con
 * lo que hay ahora mismo en la base.
 *
 * Por que hace falta: las notas se publican solas por fecha
 * (lib/server/notas.ts filtra `publishedAt <= ahora` en cada render), pero las
 * paginas son ISR con `revalidate = 60` y el fetch a Firestore esta etiquetado
 * con 'notas'. Hasta ahora nadie invalidaba ese tag, asi que una nota
 * programada para las 08:00 aparecia recien con la primera visita posterior a
 * esa hora. Lo llaman dos cosas:
 * - el cron de Vercel (ver vercel.json), una vez por dia a las 11:00 UTC, que
 *   son las 08:00 de Charata, la hora habitual de publicacion;
 * - scripts/publicar-nota.mjs al terminar de escribir, si hay secreto cargado.
 *
 * Seguridad: este repositorio es publico y la URL se descubre sola, asi que el
 * endpoint exige un secreto SIEMPRE. Si no hay secreto configurado responde
 * 503 en lugar de quedar abierto.
 *
 * Variables de entorno (en Vercel, SIN prefijo NEXT_PUBLIC: son secretos y
 * NEXT_PUBLIC las expondria en el navegador):
 * - REVALIDAR_SECRETO: el que usa el script de publicacion y cualquier llamada
 *   manual. Se manda por header 'x-secreto' o por query ?secreto=.
 * - CRON_SECRET: opcional, la que genera Vercel para sus crons. Llega como
 *   header 'authorization: Bearer <valor>'.
 */

/** Nunca cachear la respuesta: el pedido tiene que llegar de verdad. */
export const dynamic = 'force-dynamic';

const TAG = 'notas';

/**
 * Compara sin filtrar la longitud del secreto.
 *
 * `timingSafeEqual` exige buffers del mismo largo (tira excepcion si no), y
 * comparar largos antes ya seria una filtracion. Por eso se comparan los
 * sha256: siempre miden 32 bytes, vengan de donde vengan.
 */
function coincide(recibido: string | null, esperado: string | undefined): boolean {
    if (!recibido || !esperado) return false;
    const a = createHash('sha256').update(recibido).digest();
    const b = createHash('sha256').update(esperado).digest();
    return timingSafeEqual(a, b);
}

function autorizado(request: Request): boolean {
    const secreto = process.env.REVALIDAR_SECRETO;
    const secretoCron = process.env.CRON_SECRET;

    const url = new URL(request.url);
    const porHeader = request.headers.get('x-secreto');
    const porQuery = url.searchParams.get('secreto');

    if (coincide(porHeader, secreto) || coincide(porQuery, secreto)) return true;

    // Vercel Cron manda 'authorization: Bearer <CRON_SECRET>'.
    const authorization = request.headers.get('authorization');
    if (secretoCron && authorization?.startsWith('Bearer ')) {
        return coincide(authorization.slice('Bearer '.length), secretoCron);
    }

    return false;
}

async function manejar(request: Request): Promise<Response> {
    if (!process.env.REVALIDAR_SECRETO) {
        return Response.json(
            {
                ok: false,
                error:
                    'Falta la variable de entorno REVALIDAR_SECRETO. Cargala en Vercel ' +
                    '(Settings > Environment Variables) sin prefijo NEXT_PUBLIC y volve a desplegar.',
            },
            { status: 503 }
        );
    }

    if (!autorizado(request)) {
        return Response.json({ ok: false, error: 'Secreto invalido.' }, { status: 401 });
    }

    // `await` a proposito: en Next 16 esta funcion puede devolver una promesa.
    // Si resulta sincrona, awaitear un valor comun no cambia nada.
    await revalidateTag(TAG);

    return Response.json({
        ok: true,
        revalidado: TAG,
        momento: new Date().toISOString(),
    });
}

export async function POST(request: Request): Promise<Response> {
    return manejar(request);
}

/** Mismo comportamiento que POST: el cron de Vercel llama por GET. */
export async function GET(request: Request): Promise<Response> {
    return manejar(request);
}
