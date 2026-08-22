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

import { SECCIONES, JERARQUIAS } from './config.mjs';

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

    const datos = {
        title: meta.titulo,
        slug: meta.slug ? generarSlug(meta.slug) : generarSlug(meta.titulo),
        content: cuerpo,
        author: meta.autor,
        seccion,
        jerarquia,
        esOpinion: meta.opinion !== undefined ? esSi(meta.opinion) : seccion === 'opinion',
        published: publicada,
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
    ];

    const cabecera = campos
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => k + ': ' + v)
        .join('\n');

    return '---\n' + cabecera + '\n---\n\n' + (nota.content || '').trim() + '\n';
}
