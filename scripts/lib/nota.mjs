/**
 * Formato de archivo de una nota.
 *
 * Una nota es un .md con cabecera de metadatos y cuerpo:
 *
 *   ---
 *   titulo: La nota
 *   seccion: politica
 *   autor: Roberto Garcia
 *   publicada: si
 *   ---
 *
 *   Primer parrafo.
 *
 *   ## Un subtitulo
 *
 *   - una vinieta
 *
 * La cabecera es a proposito mas pobre que YAML: una clave por linea, valor
 * en texto plano hasta el fin de linea. Sin listas anidadas ni valores
 * multilinea. Alcanza para una nota y evita traer una libreria a un proyecto
 * que corre sin node_modules.
 */

import { SECCIONES, JERARQUIAS, OFFSET_ARGENTINA } from './config.mjs';

/** Igual que generarSlug() de lib/portada.ts. Mantener las dos en sintonia. */
export function generarSlug(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 70);
}

function esSi(valor) {
    return ['si', 'sí', 'yes', 'true', '1'].includes(String(valor).trim().toLowerCase());
}

/* ---------------- fechas ---------------- */

/**
 * Interpreta el campo "publicar" de la cabecera como fecha de salida.
 * Acepta "2026-08-25 08:00", "2026-08-25T08:00" y "2026-08-25" (que se lee
 * como las 08:00 de ese dia: una revista no publica a medianoche).
 * Devuelve un ISO absoluto, o null si el campo esta vacio.
 * Tira error con mensaje claro si la fecha no se entiende.
 *
 * La hora se lee SIEMPRE como hora de Argentina, no como hora de la maquina
 * que corre el script: si no, la misma nota saldria a distinta hora segun
 * quien la publique.
 */
export function fechaDeSalida(valor, nombreArchivo = 'la nota') {
    const crudo = String(valor ?? '').trim();
    if (!crudo) return null;

    // Se arma un ISO completo a mano en vez de confiar en el parseo suelto de
    // Date(): "2026-08-25 08:00" sin offset lo interpreta cada motor a su
    // gusto, y ahi es donde se cuela la zona de la maquina.
    let texto = crudo.replace(/\s+/, 'T');
    if (!texto.includes('T')) texto += 'T08:00';
    if (/T\d{2}:\d{2}$/.test(texto)) texto += ':00';
    texto += OFFSET_ARGENTINA;

    const fecha = new Date(texto);
    if (Number.isNaN(fecha.getTime())) {
        throw new Error(
            nombreArchivo + ': no entiendo "publicar: ' + crudo + '". ' +
            'Se escribe "2026-08-25 08:00" o "2026-08-25" (que sale a las 08:00).'
        );
    }
    return fecha.toISOString();
}

/**
 * Parte un ISO en dia/mes/anio/hora/minuto ya corridos a hora de Argentina.
 *
 * Se hace la cuenta a mano en vez de usar toLocaleString con timeZone porque
 * la base de zonas horarias puede no estar en la maquina que corre el script,
 * y en ese caso Node muestra UTC sin avisar: la nota diria que sale tres
 * horas antes de cuando sale.
 */
function partesEnArgentina(iso) {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return null;

    const signo = OFFSET_ARGENTINA.startsWith('-') ? -1 : 1;
    const horas = Number(OFFSET_ARGENTINA.slice(1, 3));
    const minutos = Number(OFFSET_ARGENTINA.slice(4, 6));
    const corrida = new Date(t + signo * (horas * 60 + minutos) * 60000);

    const dosDigitos = (n) => String(n).padStart(2, '0');
    return {
        anio: String(corrida.getUTCFullYear()),
        mes: dosDigitos(corrida.getUTCMonth() + 1),
        dia: dosDigitos(corrida.getUTCDate()),
        hora: dosDigitos(corrida.getUTCHours()),
        minuto: dosDigitos(corrida.getUTCMinutes()),
    };
}

/** "2026-08-25 08:00": el formato que vuelve a entender fechaDeSalida(). */
export function fechaParaArchivo(iso) {
    const p = partesEnArgentina(iso);
    return p ? p.anio + '-' + p.mes + '-' + p.dia + ' ' + p.hora + ':' + p.minuto : null;
}

/** "25/08/2026 08:00", para mostrarle la fecha al que corre el comando. */
export function fechaLegible(iso) {
    const p = partesEnArgentina(iso);
    return p ? p.dia + '/' + p.mes + '/' + p.anio + ' ' + p.hora + ':' + p.minuto : '';
}

/** "25/08 08:00", para listados donde el anio sobra. */
export function fechaLegibleCorta(iso) {
    const p = partesEnArgentina(iso);
    return p ? p.dia + '/' + p.mes + ' ' + p.hora + ':' + p.minuto : '';
}

/** true si la fecha todavia no llego: la nota esta guardada pero no se ve. */
export function esFutura(iso) {
    if (!iso) return false;
    const t = new Date(iso).getTime();
    return !Number.isNaN(t) && t > Date.now();
}

/* ---------------- lectura ---------------- */

export function parsearArchivo(texto, nombreArchivo = 'la nota') {
    const limpio = texto.replace(/\r\n/g, '\n');
    const m = limpio.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) {
        throw new Error(
            nombreArchivo + ': falta la cabecera. El archivo tiene que empezar con una linea "---".'
        );
    }

    const meta = {};
    for (const linea of m[1].split('\n')) {
        const cruda = linea.trim();
        if (!cruda || cruda.startsWith('#')) continue;
        const corte = cruda.indexOf(':');
        if (corte < 0) throw new Error(nombreArchivo + ': linea de cabecera sin ":" -> ' + cruda);
        meta[cruda.slice(0, corte).trim().toLowerCase()] = cruda.slice(corte + 1).trim();
    }

    return { meta, cuerpo: m[2].trim() };
}

/**
 * Convierte el archivo en los campos que espera Firestore.
 * Valida lo que rompe la portada si viene mal.
 */
export function aDatosDeNota({ meta, cuerpo }, nombreArchivo = 'la nota') {
    const falla = (m) => {
        throw new Error(nombreArchivo + ': ' + m);
    };

    if (!meta.titulo) falla('falta "titulo".');
    if (!meta.autor) falla('falta "autor".');
    if (!cuerpo) falla('el cuerpo esta vacio.');

    const seccion = (meta.seccion || 'politica').toLowerCase();
    if (!SECCIONES.includes(seccion)) {
        falla('seccion "' + seccion + '" no existe. Validas: ' + SECCIONES.join(', ') + '.');
    }

    const jerarquia = (meta.jerarquia || 'normal').toLowerCase();
    if (!JERARQUIAS.includes(jerarquia)) {
        falla('jerarquia "' + jerarquia + '" no existe. Validas: ' + JERARQUIAS.join(', ') + '.');
    }

    const publicada = meta.publicada === undefined ? false : esSi(meta.publicada);
    const bajada = meta.bajada || '';

    // Programar es autorizar con fecha: no hay cron que la despierte despues,
    // la fecha sola es la que la muestra. Un archivo con "publicar" y
    // "publicada: no" nunca va a salir, y el editor se queda creyendo que
    // programo algo. Mejor no publicar nada y decirlo.
    const publishedAt = fechaDeSalida(meta.publicar, nombreArchivo);
    if (publishedAt && !publicada) {
        falla(
            'tiene "publicar: ' + meta.publicar + '" pero "publicada: no", y asi no va a salir nunca. ' +
            'Programar una nota es autorizarla: pone "publicada: si" y sale sola en esa fecha. ' +
            'Si todavia no la queres autorizar, borra el "publicar" y dejala de borrador.'
        );
    }

    const datos = {
        title: meta.titulo,
        slug: meta.slug ? generarSlug(meta.slug) : generarSlug(meta.titulo),
        content: cuerpo,
        author: meta.autor,
        seccion,
        jerarquia,
        esOpinion: meta.opinion !== undefined ? esSi(meta.opinion) : seccion === 'opinion',
        published: publicada,
        // Fecha de salida pedida por el archivo. null = la decide el que
        // publica (ver publicar-nota.mjs), no significa "sin fecha".
        publishedAt,
        // Los opcionales van siempre, con null cuando estan vacios: si no
        // viajan, Firestore conserva el valor viejo y sacar una foto o
        // cambiar una volanta no tiene efecto al actualizar.
        volanta: meta.volanta || null,
        bajada: bajada || null,
        summary: bajada || null,
        autorCargo: meta.cargo || null,
        imageUrl: meta.foto || null,
        epigrafe: meta.epigrafe || null,
        creditoFoto: meta.credito || null,
        videoUrl: meta.video || null,
        videoEpigrafe: meta.videoepigrafe || null,
        ordenPortada: meta.orden ? Number(meta.orden) : null,
        tiempoLectura: meta.lectura ? Number(meta.lectura) : null,
        tags: meta.tags
            ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : null,
    };

    if (datos.ordenPortada !== null && Number.isNaN(datos.ordenPortada)) {
        falla('"orden" tiene que ser un numero.');
    }
    if (datos.tiempoLectura !== null && Number.isNaN(datos.tiempoLectura)) {
        falla('"lectura" tiene que ser un numero.');
    }

    return datos;
}

/* ---------------- escritura ---------------- */

/** Vuelca una nota de Firestore al formato de archivo, para poder editarla. */
export function aArchivo(nota) {
    const campos = [
        ['titulo', nota.title],
        ['slug', nota.slug],
        ['volanta', nota.volanta],
        ['bajada', nota.bajada || nota.summary],
        ['seccion', nota.seccion],
        ['jerarquia', nota.jerarquia],
        ['orden', nota.ordenPortada],
        ['autor', nota.author],
        ['cargo', nota.autorCargo],
        ['lectura', nota.tiempoLectura],
        ['foto', nota.imageUrl],
        ['epigrafe', nota.epigrafe],
        ['credito', nota.creditoFoto],
        ['video', nota.videoUrl],
        ['videoEpigrafe', nota.videoEpigrafe],
        ['tags', Array.isArray(nota.tags) ? nota.tags.join(', ') : nota.tags],
        ['opinion', nota.esOpinion ? 'si' : 'no'],
        ['publicada', nota.published ? 'si' : 'no'],
        // Va en hora argentina y en el mismo formato que entiende la cabecera,
        // para que bajar y volver a publicar no le corra la fecha a la nota.
        // Solo si esta publicada: con "publicada: no" el par seria invalido y
        // el propio archivo que bajamos no se dejaria publicar.
        ['publicar', nota.published ? fechaParaArchivo(nota.publishedAt) : null],
    ];

    const cabecera = campos
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => k + ': ' + v)
        .join('\n');

    return '---\n' + cabecera + '\n---\n\n' + (nota.content || '').trim() + '\n';
}
