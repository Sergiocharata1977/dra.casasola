import type { EstadoNota, News } from './types';

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

/* ------------------------------------------------------------------ *
 * Programacion de notas
 *
 * No hay cron ni job: la fecha es la fuente de verdad. Una nota con
 * `publishedAt` en el futuro esta autorizada pero todavia no salio, y
 * cada lectura publica la descarta hasta que el reloj la alcanza.
 * ------------------------------------------------------------------ */

/**
 * Zona horaria de la revista, fija en -03:00.
 * Vercel corre en UTC y las maquinas de la redaccion pueden estar en
 * cualquier zona. Si el reloj que escribe el editor se interpretara con la
 * zona de quien carga, la misma nota saldria a distinta hora segun quien la
 * cargue. Argentina no tiene horario de verano desde 2009, asi que el offset
 * fijo es seguro.
 */
const OFFSET_ARGENTINA = '-03:00';

/** Nombre IANA de la misma zona, para los formateos con Intl. */
const ZONA_ARGENTINA = 'America/Argentina/Buenos_Aires';

/** Milisegundos que hay que correr un instante UTC para leerlo en Argentina. */
const MS_OFFSET_ARGENTINA = 3 * 60 * 60 * 1000;

/**
 * Convierte lo que escribe un <input type="datetime-local">
 * ("2026-08-25T08:00") en ISO absoluto, leyendo ese reloj como hora
 * argentina. Devuelve null si la fecha no es valida.
 *
 * Paso a paso: '2026-08-25T08:00' -> '2026-08-25T08:00:00-03:00' -> Date
 * -> toISOString() -> '2026-08-25T11:00:00.000Z'. Las 8 en punto de
 * Argentina son las 11 UTC, que es la hora con la que compara el servidor.
 */
export function aIsoArgentina(local: string): string | null {
    // Exigimos la forma exacta del input antes de tocar Date. El parser de
    // Date es demasiado permisivo: 'cualquier cosa:00-03:00' no tira NaN,
    // devuelve una fecha inventada, y esa fecha terminaria guardada como
    // momento de salida de la nota.
    const forma = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.exec(local ?? '');
    if (!forma) return null;

    // Algunos navegadores agregan segundos al valor del input y otros no,
    // asi que los completamos solo cuando faltan.
    const completo = forma[1] ? local : `${local}:00`;

    const d = new Date(`${completo}${OFFSET_ARGENTINA}`);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
}

/**
 * Camino inverso: de ISO absoluto al formato "2026-08-25T08:00" que espera
 * el input, expresado en hora argentina. Devuelve '' si no hay fecha valida.
 */
export function deIsoAInputLocal(iso?: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';

    // toISOString() siempre imprime UTC, asi que primero corremos el instante
    // tres horas hacia atras: los digitos que quedan impresos pasan a ser los
    // de la hora argentina. Esto vale unicamente porque el offset es fijo y no
    // cambia nunca; con horario de verano habria que armar el string con Intl.
    // '2026-08-25T11:00:00.000Z' - 3h -> '2026-08-25T08:00:00.000Z'
    // -> slice(0, 16) -> '2026-08-25T08:00'.
    const corrido = new Date(d.getTime() - MS_OFFSET_ARGENTINA);
    return corrido.toISOString().slice(0, 16);
}

/** Momento en que la nota sale. null si no tiene fecha. */
export function fechaDeSalida(nota: News): Date | null {
    if (!nota.publishedAt) return null;
    const d = new Date(nota.publishedAt);
    return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Si la nota ya salio al aire. Una nota sin fecha se considera salida:
 * son las notas viejas, cargadas antes de que existiera la programacion.
 * Endurecer este caso haria desaparecer notas que hoy estan publicadas.
 */
export function yaSalio(nota: News, ahora: Date = new Date()): boolean {
    const salida = fechaDeSalida(nota);
    if (!salida) return true;
    return salida.getTime() <= ahora.getTime();
}

/** Estado real de la nota. */
export function estadoDeNota(nota: News, ahora: Date = new Date()): EstadoNota {
    // `published: false` gana siempre: un borrador con fecha futura sigue
    // siendo borrador, no una nota programada.
    if (nota.published === false) return 'borrador';
    return yaSalio(nota, ahora) ? 'publicada' : 'programada';
}

/**
 * "sale el 25 de agosto a las 08:00". Para avisos del panel.
 * Formatea SIEMPRE en hora argentina, no en la del navegador: el editor tiene
 * que leer la misma hora que escribio, este donde este la maquina.
 */
export function textoDeProgramacion(nota: News): string {
    const salida = fechaDeSalida(nota);
    if (!salida) return '';

    const dia = salida.toLocaleString('es-AR', {
        timeZone: ZONA_ARGENTINA,
        day: 'numeric',
        month: 'long',
    });
    // hour12: false a proposito: es-AR por defecto imprime "08:00 a. m.",
    // y la revista escribe la hora como en papel, de 0 a 23.
    const hora = salida.toLocaleString('es-AR', {
        timeZone: ZONA_ARGENTINA,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return `sale el ${dia} a las ${hora}`;
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
    // Una nota programada esta autorizada pero todavia no salio, asi que no
    // ocupa lugar en la tapa. Importa que el filtro este aca y no solo en la
    // lectura publica: el panel usa armarPortada() para previsualizar, y el
    // editor tiene que ver la tapa real de ahora, no una con notas futuras.
    const fuente = notas.filter((n) => n.published !== false && yaSalio(n));

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
    // Mismo criterio que la tapa: lo programado todavia no existe para el lector.
    return ordenarPorFecha(notas.filter((n) => n.published !== false && yaSalio(n)));
}
