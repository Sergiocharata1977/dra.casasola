/**
 * Baja las notas de Firestore a archivos.
 *
 * Uso:
 *   node scripts/bajar-notas.mjs          (o: npm run notas:bajar)
 *
 * Sirve para dos cosas: tener el contenido versionado en git junto al codigo,
 * y poder editar en el disco una nota que se cargo desde el panel web.
 *
 * Pisa los archivos que ya existen: la fuente de verdad de este comando es
 * Firestore. Si tenes cambios locales sin publicar, publicalos antes.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { CARPETA_NOTAS } from './lib/config.mjs';
import { listarNotas } from './lib/firestore.mjs';
import { aArchivo, generarSlug } from './lib/nota.mjs';

mkdirSync(CARPETA_NOTAS, { recursive: true });

const notas = await listarNotas();

if (notas.length === 0) {
    console.log('No hay notas en Firestore.');
    process.exit(0);
}

for (const nota of notas) {
    const nombre = (nota.slug || generarSlug(nota.title || nota.id)) + '.md';
    writeFileSync(join(CARPETA_NOTAS, nombre), aArchivo(nota), 'utf8');
    console.log((nota.published ? 'publicada  ' : 'borrador   ') + nombre);
}

console.log('');
console.log(notas.length + ' nota(s) en contenido/notas/');
