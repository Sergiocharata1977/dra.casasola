import type { News } from '../types';
import { firebaseConfig } from '../firebase-config';
import { ordenarPorFecha } from '../portada';

/**
 * Lectura de notas DESDE EL SERVIDOR.
 *
 * Este es el modulo que hace que la revista sea visible para Google y para
 * WhatsApp. Antes las notas se pedian desde el navegador (useEffect), asi que
 * el HTML que salia de Vercel llegaba vacio: los buscadores y las redes leen
 * ese HTML y nunca ejecutan el javascript.
 *
 * Usa la API REST de Firestore en vez del SDK cliente por tres razones:
 * - no necesita credenciales: `news` es de lectura publica en firestore.rules;
 * - es un `fetch` comun, asi que Next lo cachea y revalida solo;
 * - no abre conexiones persistentes, que es lo que conviene en serverless.
 *
 * Solo debe importarse desde server components. Nunca desde un 'use client'.
 */

const BASE = 'https://firestore.googleapis.com/v1';
const COLECCION = 'news';

/** Cada cuantos segundos Vercel vuelve a pedir las notas a Firestore. */
const REVALIDAR_SEGUNDOS = 60;

/* ------------------------------------------------------------------ *
 * Conversion del formato de Firestore REST a objetos planos.
 * Firestore devuelve {stringValue: "x"} en lugar de "x", asi que hay
 * que desenvolver cada campo segun su tipo.
 * ------------------------------------------------------------------ */

type ValorFirestore = Record<string, unknown>;

function desenvolverValor(valor: ValorFirestore): unknown {
    if (valor === null || valor === undefined) return null;

    if ('stringValue' in valor) return valor.stringValue;
    if ('booleanValue' in valor) return valor.booleanValue;
    if ('integerValue' in valor) return Number(valor.integerValue);
    if ('doubleValue' in valor) return Number(valor.doubleValue);
    if ('timestampValue' in valor) return valor.timestampValue;
    if ('nullValue' in valor) return null;

    if ('arrayValue' in valor) {
        const arr = valor.arrayValue as { values?: ValorFirestore[] } | undefined;
        return (arr?.values ?? []).map(desenvolverValor);
    }

    if ('mapValue' in valor) {
        const mapa = valor.mapValue as { fields?: Record<string, ValorFirestore> } | undefined;
        return desenvolverCampos(mapa?.fields ?? {});
    }

    return null;
}

function desenvolverCampos(campos: Record<string, ValorFirestore>): Record<string, unknown> {
    const salida: Record<string, unknown> = {};
    for (const [clave, valor] of Object.entries(campos)) {
        salida[clave] = desenvolverValor(valor);
    }
    return salida;
}

type DocumentoFirestore = {
    name: string;
    fields?: Record<string, ValorFirestore>;
};

function aNota(doc: DocumentoFirestore): News {
    // El id es el ultimo segmento de "projects/.../documents/news/{id}".
    const id = doc.name.split('/').pop() ?? '';
    return { id, ...desenvolverCampos(doc.fields ?? {}) } as News;
}

/* ------------------------------------------------------------------ *
 * Acceso a datos
 * ------------------------------------------------------------------ */

/**
 * Trae todas las notas publicadas, mas recientes primero.
 *
 * Pide la coleccion completa y filtra en memoria a proposito: evita
 * depender de un indice compuesto en Firestore. Es adecuado para el
 * volumen actual; con varios cientos de notas habria que pasar a
 * `runQuery` con indice y paginado por cursor.
 */
export async function getNotasPublicadas(): Promise<News[]> {
    const url =
        `${BASE}/projects/${firebaseConfig.projectId}/databases/(default)/documents/${COLECCION}` +
        `?pageSize=300&key=${firebaseConfig.apiKey}`;

    try {
        const respuesta = await fetch(url, {
            next: { revalidate: REVALIDAR_SEGUNDOS, tags: ['notas'] },
        });

        if (!respuesta.ok) {
            console.error(`[notas] Firestore respondio ${respuesta.status}`);
            return [];
        }

        const datos = (await respuesta.json()) as { documents?: DocumentoFirestore[] };
        const notas = (datos.documents ?? []).map(aNota).filter((n) => n.published !== false);

        return ordenarPorFecha(notas);
    } catch (error) {
        // Si Firestore no responde, la pagina igual se arma vacia en lugar de
        // romper el render entero.
        console.error('[notas] No se pudo leer Firestore:', error);
        return [];
    }
}

/** Busca una nota por slug editorial o, como respaldo, por id de Firestore. */
export async function getNota(
    identificador: string
): Promise<{ nota: News | null; relacionadas: News[] }> {
    const fuente = await getNotasPublicadas();

    const nota = fuente.find((n) => n.slug === identificador || n.id === identificador) ?? null;
    if (!nota) return { nota: null, relacionadas: [] };

    // Relacionadas: primero la misma seccion, despues lo mas reciente.
    const resto = ordenarPorFecha(fuente.filter((n) => n.id !== nota.id));
    const mismaSeccion = resto.filter((n) => n.seccion === nota.seccion);
    const relacionadas = [
        ...mismaSeccion,
        ...resto.filter((n) => n.seccion !== nota.seccion),
    ].slice(0, 2);

    return { nota, relacionadas };
}
