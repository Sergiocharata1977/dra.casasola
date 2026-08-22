/**
 * Corrige la nota editorial de apertura directamente en Firestore.
 *
 * Por que existe: la nota "Pensamiento critico sin compromisos politicos"
 * se cargo en la seccion Opinion, y por eso la portada la mandaba a la
 * columnita lateral "Voz Libre" en vez de abrir la tapa con ella. Ademas
 * sus intertitulos y su lista estaban escritos como parrafos sueltos, asi
 * que salian sin ninguna jerarquia visual.
 *
 * No usa el SDK de Firebase a proposito: habla REST con fetch, asi que
 * corre con Node 18+ sin instalar una sola dependencia.
 *
 * Uso:
 *   node scripts/corregir-editorial.mjs
 *
 * Pide el mail y la clave de un usuario del panel (las reglas de Firestore
 * exigen sesion para escribir en `news`). Tambien se pueden pasar por
 * variables de entorno:
 *   NOPAUTA_EMAIL=... NOPAUTA_PASSWORD=... node scripts/corregir-editorial.mjs
 */

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PROJECT_ID = 'revistanopauta';
const API_KEY = 'AIzaSyAenIIfZXK8CYbrYS7BBEJqL3_kMhKkOmw';
const DOC_ID = 'a9pfjSxzpKdcTt8mxmq5';

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * El cuerpo corregido vive en un .txt al lado de este script.
 *
 * Solo se le agrego formato: "## " marca intertitulo y "- " marca vinieta,
 * las dos convenciones que entiende components/revista/cuerpo-nota.tsx.
 * Ni una palabra del texto del autor esta cambiada.
 */
const CUERPO = readFileSync(join(AQUI, 'editorial-cuerpo.txt'), 'utf8').replace(/\r\n/g, '\n').trim();

/** Campos que se reescriben, en el formato tipado que pide Firestore REST. */
const CAMPOS = {
    // Editorial, no Opinion: aca habla la revista, no un columnista invitado.
    // Eso es lo que hacia que la nota cayera en la columna lateral.
    seccion: { stringValue: 'editorial' },
    esOpinion: { booleanValue: false },
    // Abre la tapa.
    jerarquia: { stringValue: 'apertura' },
    ordenPortada: { integerValue: '1' },
    volanta: { stringValue: 'Editorial de apertura' },
    // Faltaba la tilde en el apellido de la firma.
    author: { stringValue: 'Roberto Garc\u00eda' },
    content: { stringValue: CUERPO },
    tags: {
        arrayValue: {
            values: [
                { stringValue: 'editorial' },
                { stringValue: 'charata' },
                { stringValue: 'sudoeste chaque\u00f1o' },
            ],
        },
    },
    updatedAt: { stringValue: new Date().toISOString() },
};

async function pedirCredenciales() {
    let email = process.env.NOPAUTA_EMAIL;
    let password = process.env.NOPAUTA_PASSWORD;
    if (email && password) return { email, password };

    const rl = createInterface({ input: stdin, output: stdout });
    try {
        email = email || (await rl.question('Mail del panel: '));
        password = password || (await rl.question('Clave: '));
    } finally {
        rl.close();
    }
    return { email: email.trim(), password };
}

async function iniciarSesion(email, password) {
    const url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + API_KEY;
    const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await r.json();
    if (!r.ok) {
        throw new Error('No se pudo iniciar sesion: ' + (data?.error?.message ?? r.status));
    }
    return data.idToken;
}

async function actualizar(idToken) {
    const mascara = Object.keys(CAMPOS)
        .map((c) => 'updateMask.fieldPaths=' + encodeURIComponent(c))
        .join('&');

    const url =
        'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
        '/databases/(default)/documents/news/' + DOC_ID + '?' + mascara;

    const r = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify({ fields: CAMPOS }),
    });

    const data = await r.json();
    if (!r.ok) {
        throw new Error('Firestore rechazo la escritura: ' + (data?.error?.message ?? r.status));
    }
    return data;
}

try {
    const { email, password } = await pedirCredenciales();
    const idToken = await iniciarSesion(email, password);
    const doc = await actualizar(idToken);

    console.log('');
    console.log('Nota corregida.');
    console.log('  seccion   :', doc.fields.seccion.stringValue);
    console.log('  jerarquia :', doc.fields.jerarquia.stringValue);
    console.log('  firma     :', doc.fields.author.stringValue);
    console.log('');
    console.log('La portada se regenera sola en un minuto:');
    console.log('  https://revistanopauta.vercel.app/');
} catch (error) {
    console.error('');
    console.error(error.message);
    process.exitCode = 1;
}
