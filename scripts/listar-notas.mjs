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

const notas = await listarNotas();

if (notas.length === 0) {
    console.log('No hay ninguna nota cargada. La portada esta vacia.');
    process.exit(0);
}

const fecha = (n) => (n.publishedAt || n.createdAt || '').slice(0, 10) || '   -      ';
notas.sort((a, b) => (b.publishedAt || b.createdAt || '').localeCompare(a.publishedAt || a.createdAt || ''));

const publicadas = notas.filter((n) => n.published !== false);

console.log('');
for (const n of notas) {
    const estado = n.published ? 'PUBLICADA' : 'borrador ';
    const opinion = n.esOpinion || n.seccion === 'opinion' ? ' [Voz Libre]' : '';
    console.log(estado + '  ' + fecha(n) + '  ' + (n.seccion || '?').padEnd(11) + (n.jerarquia || 'normal').padEnd(11) + n.title);
    console.log('           ' + SITIO + '/noticias/' + (n.slug || n.id) + opinion);
}

console.log('');
console.log(notas.length + ' nota(s), ' + publicadas.length + ' publicada(s).');

// El aviso que hubiera evitado el problema de la nota editorial: si no hay
// ninguna nota informativa, la tapa no tiene con que abrir salvo por el
// respaldo que agrega armarPortada().
const informativas = publicadas.filter((n) => !(n.esOpinion || n.seccion === 'opinion'));
if (publicadas.length > 0 && informativas.length === 0) {
    console.log('');
    console.log('Aviso: todo lo publicado es opinion. La tapa no tiene nota informativa');
    console.log('para la apertura. Si alguna es un editorial, va en la seccion "editorial".');
}
