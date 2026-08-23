/**
 * Constantes de los scripts de redaccion.
 *
 * Ojo: estos valores estan repetidos a mano desde lib/firebase-config.ts.
 * No se importan porque ese archivo es TypeScript y estos scripts corren con
 * `node` pelado, sin compilar y sin instalar una sola dependencia. Eso es a
 * proposito: el proyecto vive en un disco externo donde no hay node_modules.
 *
 * Si algun dia cambia el proyecto de Firebase, hay que tocar los dos lugares.
 * No son secretos: son los identificadores publicos del proyecto.
 */

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PROJECT_ID = 'revistanopauta';
export const API_KEY = 'AIzaSyAenIIfZXK8CYbrYS7BBEJqL3_kMhKkOmw';
export const COLECCION = 'news';

export const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CARPETA_NOTAS = join(RAIZ, 'contenido', 'notas');

/** Sesion cacheada. Esta en .gitignore: guarda un token de acceso. */
export const ARCHIVO_SESION = join(RAIZ, '.nopauta-sesion.json');

export const SITIO = 'https://revistanopauta.vercel.app';

/**
 * Secciones validas. Copiadas de lib/site-config.ts por la misma razon.
 * `editorial` no es lo mismo que `opinion`: en editorial habla la revista.
 */
export const SECCIONES = [
    'editorial',
    'politica',
    'economia',
    'sociedad',
    'judiciales',
    'regionales',
    'cultura',
    'deportes',
    'opinion',
];

export const JERARQUIAS = ['apertura', 'destacada', 'breve', 'normal'];

/**
 * Zona horaria de la revista, fija. Espejo de OFFSET_ARGENTINA en
 * lib/portada.ts: si cambia alla, cambia aca.
 *
 * Es un offset a mano y no la zona de la maquina a proposito: la hora que
 * escribe el editor tiene que significar lo mismo la corra quien la corra.
 * Argentina no mueve el reloj desde 2009, asi que el -03:00 fijo es seguro.
 */
export const OFFSET_ARGENTINA = '-03:00';
