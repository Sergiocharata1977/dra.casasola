import type { News } from './types';

/* ============================================================
   Helpers editoriales compartidos por portada, seccion y nota.
   ============================================================ */

/** URL de la nota. Usa el slug si existe; si no, cae al id de Firestore. */
export function hrefNota(nota: News): string {
    return `/noticias/${nota.slug || nota.id}`;
}

function fechaDe(nota: News): number {
    const iso = nota.publishedAt || nota.createdAt;
    const t = new Date(iso).getTime();
    return Number.isNaN(t) ? 0 : t;
}

export function fechaLarga(iso?: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function fechaCorta(iso?: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

/** Fecha de tapa: "domingo 17 de agosto de 2026". */
export function fechaDeTapa(fecha: Date = new Date()): string {
    return fecha.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Saca las marcas de formato del cuerpo para poder usarlo como texto corrido.
 * El cuerpo admite "## subtitulo" y "- item de lista" (ver components/revista/
 * cuerpo-nota.tsx); en un resumen esas marcas no deben aparecer.
 */
function sinMarcas(texto: string): string {
    return texto
        .split('\n')
        .map((linea) => linea.trim().replace(/^##\s+/, '').replace(/^[-*]\s+/, ''))
        .join(' ');
}

/** Texto de arrastre: bajada > summary > primeras lineas del cuerpo. */
export function resumenDe(nota: News, largo = 180): string {
    const base = nota.bajada || nota.summary || sinMarcas(nota.content || '');
    const limpio = base.replace(/\s+/g, ' ').trim();
    if (limpio.length <= largo) return limpio;
    return `${limpio.slice(0, largo).trimEnd()}...`;
}

/** Estimacion de lectura a 200 palabras por minuto. */
export function minutosDeLectura(nota: News): number {
    if (nota.tiempoLectura) return nota.tiempoLectura;
    const palabras = (nota.content || '').trim().split(/\s+/).length;
    return Math.max(1, Math.round(palabras / 200));
}

/**
 * Convierte un titulo en slug de URL.
 * "La independencia periodistica" -> "la-independencia-periodistica"
 */
export function generarSlug(texto: string): string {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // saca los acentos
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 70);
}

/**
 * Columna de opinion firmada.
 *
 * Ojo con la distincion: `opinion` son columnas de autor, cuya posicion NO
 * compromete a la revista y por eso llevan el aviso de responsabilidad. La
 * seccion `editorial` es otra cosa: ahi habla la revista, asi que no es
 * opinion firmada y puede abrir la tapa como cualquier nota informativa.
 */
export function esColumnaDeOpinion(nota: News): boolean {
    return Boolean(nota.esOpinion) || nota.seccion === 'opinion';
}

export function ordenarPorFecha(notas: News[]): News[] {
    return [...notas].sort((a, b) => fechaDe(b) - fechaDe(a));
}

/** Ordena por `ordenPortada` manual y, a igualdad, por fecha descendente. */
function ordenarPorJerarquia(notas: News[]): News[] {
    return [...notas].sort((a, b) => {
        const oa = a.ordenPortada ?? 999;
        const ob = b.ordenPortada ?? 999;
        if (oa !== ob) return oa - ob;
        return fechaDe(b) - fechaDe(a);
    });
}

/* ============================================================
   Armado de portada
   ============================================================ */

export type Portada = {
    /** Nota principal de tapa. */
    apertura: News | null;
    /** Columna izquierda: titulos sin foto. */
    breves: News[];
    /** Columna derecha "Voz Libre": columnas firmadas. */
    opinion: News[];
    /** Bloque inferior: notas con foto. */
    destacadas: News[];
    /** Cierre de tapa: el resto, en orden cronologico. */
    ultimas: News[];
};

/**
 * Convierte una lista plana de notas en una portada con jerarquia.
 *
 * Respeta el campo `jerarquia` cargado por la redaccion y, cuando no
 * alcanza para llenar un bloque, completa con las notas mas recientes
 * que todavia no se usaron. Asi la tapa nunca queda con huecos aunque
 * el editor no haya clasificado todo.
 *
 * Si no hay nada publicado, la portada vuelve vacia: la revista muestra
 * que no publico todavia en vez de inventar contenido.
 */
export function armarPortada(notas: News[]): Portada {
    const fuente = notas.filter((n) => n.published !== false);

    const usadas = new Set<string>();
    const tomar = (lista: News[], cantidad: number): News[] => {
        const salida: News[] = [];
        for (const nota of lista) {
            if (salida.length >= cantidad) break;
            if (usadas.has(nota.id)) continue;
            usadas.add(nota.id);
            salida.push(nota);
        }
        return salida;
    };

    const opinables = fuente.filter(esColumnaDeOpinion);
    const informativas = fuente.filter((n) => !esColumnaDeOpinion(n));

    // 1. Apertura: la marcada como tal; si no hay, la informativa mas reciente.
    //    Si lo unico publicado son columnas, abre con una columna antes que
    //    dejar la tapa vacia teniendo material.
    const marcadaApertura = ordenarPorJerarquia(
        informativas.filter((n) => n.jerarquia === 'apertura')
    );
    const apertura =
        tomar(marcadaApertura, 1)[0] ??
        tomar(ordenarPorFecha(informativas), 1)[0] ??
        tomar(ordenarPorJerarquia(opinables), 1)[0] ??
        null;

    // 2. Opinion (columna derecha).
    const opinion = tomar(ordenarPorJerarquia(opinables), 4);

    // 3. Breves (columna izquierda), completando con lo mas reciente.
    const breves = [
        ...tomar(ordenarPorJerarquia(informativas.filter((n) => n.jerarquia === 'breve')), 5),
    ];
    if (breves.length < 4) {
        breves.push(...tomar(ordenarPorFecha(informativas), 4 - breves.length));
    }

    // 4. Destacadas (bloque con foto), tambien con relleno.
    const destacadas = [
        ...tomar(ordenarPorJerarquia(informativas.filter((n) => n.jerarquia === 'destacada')), 4),
    ];
    if (destacadas.length < 2) {
        destacadas.push(...tomar(ordenarPorFecha(informativas), 2 - destacadas.length));
    }

    // 5. El resto, para el cierre de tapa.
    const ultimas = ordenarPorFecha(fuente.filter((n) => !usadas.has(n.id))).slice(0, 6);

    return { apertura, breves, opinion, destacadas, ultimas };
}

/**
 * Notas para listados (/noticias y /secciones/[seccion]).
 * Si no hay nada publicado devuelve una lista vacia, y el listado muestra
 * su propio estado vacio.
 */
export function notasParaListado(notas: News[]): News[] {
    return ordenarPorFecha(notas.filter((n) => n.published !== false));
}
