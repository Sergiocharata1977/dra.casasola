/**
 * Publica notas desde archivos.
 *
 * Uso:
 *   node scripts/publicar-nota.mjs contenido/notas/mi-nota.md
 *   node scripts/publicar-nota.mjs --todas
 *   node scripts/publicar-nota.mjs --todas --ensayo     (no escribe nada)
 *
 * O por npm:
 *   npm run nota -- contenido/notas/mi-nota.md
 *   npm run notas:publicar
 *
 * Que hace: busca en Firestore una nota con el mismo `slug`. Si existe, la
 * actualiza; si no, la crea. Asi correr el comando dos veces no duplica nada
 * y el archivo del disco es siempre la version buena.
 *
 * La portada se regenera sola dentro del minuto siguiente (ISR de Next).
 * No hay que redeployar para que salga una nota.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

import { CARPETA_NOTAS, SITIO } from './lib/config.mjs';
import { actualizarNota, crearNota, listarNotas } from './lib/firestore.mjs';
import { aDatosDeNota, esFutura, fechaLegible, parsearArchivo } from './lib/nota.mjs';
import { obtenerToken } from './lib/sesion.mjs';

const args = process.argv.slice(2);
const ensayo = args.includes('--ensayo') || args.includes('--dry');
const todas = args.includes('--todas');
const rutas = args.filter((a) => !a.startsWith('--'));

function archivosAPublicar() {
    if (todas) {
        return readdirSync(CARPETA_NOTAS)
            .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md')
            .map((f) => join(CARPETA_NOTAS, f));
    }
    if (rutas.length === 0) {
        console.error('Falta el archivo. Ejemplo:');
        console.error('  node scripts/publicar-nota.mjs contenido/notas/mi-nota.md');
        console.error('  node scripts/publicar-nota.mjs --todas');
        process.exit(1);
    }
    return rutas.map((r) => resolve(r));
}

const archivos = archivosAPublicar();

// Se leen y validan TODOS antes de escribir uno solo: si el tercer archivo
// tiene la seccion mal, no queda medio lote publicado.
const preparadas = archivos.map((ruta) => {
    const nombre = basename(ruta);
    const texto = readFileSync(ruta, 'utf8');
    return { ruta, nombre, datos: aDatosDeNota(parsearArchivo(texto, nombre), nombre) };
});

const existentes = await listarNotas();
const porSlug = new Map(existentes.filter((n) => n.slug).map((n) => [n.slug, n]));

if (ensayo) {
    console.log('Ensayo: no se escribe nada.\n');
    for (const { nombre, datos } of preparadas) {
        const previa = porSlug.get(datos.slug);
        console.log((previa ? '[actualiza] ' : '[crea]      ') + nombre);
        console.log('   titulo   : ' + datos.title);
        console.log('   seccion  : ' + datos.seccion + '  jerarquia: ' + datos.jerarquia);
        // Sin fecha explicita ni fecha previa sale ahora mismo, asi que ese
        // caso no es "programada": es "publicada".
        const salida = datos.publishedAt || previa?.publishedAt || null;
        const estado = !datos.published
            ? 'borrador'
            : esFutura(salida)
              ? 'programada -> sale el ' + fechaLegible(salida)
              : 'publicada';
        console.log('   estado   : ' + estado);
        console.log('   url      : ' + SITIO + '/noticias/' + datos.slug);
        console.log('');
    }
    process.exit(0);
}

const token = await obtenerToken();
const ahora = new Date().toISOString();

for (const { nombre, datos } of preparadas) {
    const previa = porSlug.get(datos.slug);

    // La fecha de publicacion se fija la primera vez que sale y no se pisa
    // despues: una correccion no vuelve a poner la nota arriba de todo.
    //
    // Prioridad: lo que dice el archivo > lo que ya tenia > ahora.
    // La fecha explicita gana a proposito: es como se corrige o se adelanta
    // una programacion volviendo a correr el comando.
    const publishedAt = datos.published
        ? (datos.publishedAt || previa?.publishedAt || ahora)
        : null;

    if (previa) {
        await actualizarNota(token, previa.id, { ...datos, publishedAt, updatedAt: ahora });
        console.log('actualizada  ' + nombre);
    } else {
        await crearNota(token, {
            ...datos,
            publishedAt,
            createdAt: ahora,
            updatedAt: ahora,
        });
        console.log('creada       ' + nombre);
    }
    console.log('             ' + SITIO + '/noticias/' + datos.slug);
}

console.log('');

/**
 * Empujon opcional al cache del sitio.
 *
 * Sin esto la portada igual se rearma sola dentro del minuto (ISR), asi que
 * este paso es un lujo, no un requisito: si no hay secreto cargado o si el
 * pedido falla, el script termina bien igual. Nunca corta la publicacion, que
 * a esta altura ya quedo escrita en Firestore.
 *
 * El secreto se toma del entorno (REVALIDAR_SECRETO), nunca de un archivo
 * versionado. Es el mismo valor que hay que cargar en Vercel.
 */
async function refrescarSitio() {
    const secreto = process.env.REVALIDAR_SECRETO;
    if (!secreto) {
        console.log('Listo. La portada se rearma sola en menos de un minuto.');
        return;
    }

    try {
        const respuesta = await fetch(SITIO + '/api/revalidar', {
            method: 'POST',
            headers: { 'x-secreto': secreto },
        });

        if (respuesta.ok) {
            console.log('Listo. El sitio ya se refresco: las notas estan visibles ahora.');
        } else {
            console.log(
                'Listo. El refresco del sitio respondio ' +
                    respuesta.status +
                    '; la portada se rearma sola en menos de un minuto.'
            );
        }
    } catch (error) {
        console.log(
            'Listo. No se pudo avisar al sitio (' +
                (error?.message || error) +
                '); la portada se rearma sola en menos de un minuto.'
        );
    }
}

await refrescarSitio();
