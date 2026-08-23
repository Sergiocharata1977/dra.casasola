/**
 * Muestra que hay cargado en Firestore y donde cae en la portada.
 *
 * Uso:
 *   node scripts/listar-notas.mjs         (o: npm run notas:listar)
 *
 * No pide sesion: la lectura de `news` es publica, igual que para el sitio.
 */

import { SITIO } from './lib/config.mjs';
import { listarNotas } from './lib/firestore.mjs';
import { esFutura, fechaLegible, fechaLegibleCorta } from './lib/nota.mjs';

const notas = await listarNotas();

if (notas.length === 0) {
    console.log('No hay ninguna nota cargada. La portada esta vacia.');
    process.exit(0);
}

const fecha = (n) => (n.publishedAt || n.createdAt || '').slice(0, 10) || '   -      ';
notas.sort((a, b) => (b.publishedAt || b.createdAt || '').localeCompare(a.publishedAt || a.createdAt || ''));

// Una nota autorizada con fecha futura esta en la base pero todavia no se ve:
// para el que mira la portada no esta publicada. Se cuenta aparte.
const programadas = notas.filter((n) => n.published !== false && esFutura(n.publishedAt));
const publicadas = notas.filter((n) => n.published !== false && !esFutura(n.publishedAt));

console.log('');
for (const n of notas) {
    const estado = n.published ? (esFutura(n.publishedAt) ? 'PROGRAMADA' : 'PUBLICADA ') : 'borrador  ';
    const opinion = n.esOpinion || n.seccion === 'opinion' ? ' [Voz Libre]' : '';
    const cuando = esFutura(n.publishedAt) ? '  -> sale el ' + fechaLegible(n.publishedAt) : '';
    console.log(estado + '  ' + fecha(n) + '  ' + (n.seccion || '?').padEnd(11) + (n.jerarquia || 'normal').padEnd(11) + n.title);
    console.log('            ' + SITIO + '/noticias/' + (n.slug || n.id) + opinion + cuando);
}

console.log('');
console.log(
    notas.length + ' nota(s), ' + publicadas.length + ' publicada(s), ' + programadas.length + ' programada(s).'
);

if (programadas.length > 0) {
    // Van de la mas proxima a la mas lejana: lo que interesa es que sale
    // primero, no en que orden se cargo.
    const enOrden = [...programadas].sort((a, b) =>
        String(a.publishedAt).localeCompare(String(b.publishedAt))
    );
    console.log('');
    console.log('Programadas (todavia no se ven en la web):');
    for (const n of enOrden) {
        console.log('  ' + fechaLegibleCorta(n.publishedAt) + '  ' + n.title);
    }
}

// El aviso que hubiera evitado el problema de la nota editorial: si no hay
// ninguna nota informativa, la tapa no tiene con que abrir salvo por el
// respaldo que agrega armarPortada().
// Se mira solo lo que YA salio: una informativa programada para manana no
// arregla la tapa de hoy.
const informativas = publicadas.filter((n) => !(n.esOpinion || n.seccion === 'opinion'));
if (publicadas.length > 0 && informativas.length === 0) {
    console.log('');
    console.log('Aviso: todo lo publicado es opinion. La tapa no tiene nota informativa');
    console.log('para la apertura. Si alguna es un editorial, va en la seccion "editorial".');
}
