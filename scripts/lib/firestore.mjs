/**
 * Acceso a Firestore por REST, sin SDK.
 *
 * Firestore no devuelve `"hola"` sino `{stringValue: "hola"}`, asi que todo
 * lo que entra y sale pasa por un traductor. Es el mismo criterio que usa
 * lib/server/notas.ts del lado de la web.
 */

import { API_KEY, COLECCION, PROJECT_ID } from './config.mjs';

const BASE =
    'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents';

/* ---------------- traduccion de valores ---------------- */

export function aValor(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') {
        return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    }
    if (Array.isArray(v)) return { arrayValue: { values: v.map(aValor) } };
    return { stringValue: String(v) };
}

function deValor(v) {
    if (!v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return Number(v.doubleValue);
    if ('timestampValue' in v) return v.timestampValue;
    if ('nullValue' in v) return null;
    if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(deValor);
    if ('mapValue' in v) return deCampos(v.mapValue.fields ?? {});
    return null;
}

export function aCampos(obj) {
    const salida = {};
    for (const [k, v] of Object.entries(obj)) salida[k] = aValor(v);
    return salida;
}

export function deCampos(campos) {
    const salida = {};
    for (const [k, v] of Object.entries(campos)) salida[k] = deValor(v);
    return salida;
}

/* ---------------- operaciones ---------------- */

async function pedir(url, opciones = {}) {
    const r = await fetch(url, opciones);
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
        throw new Error('Firestore respondio ' + r.status + ': ' + (data?.error?.message ?? ''));
    }
    return data;
}

/** Todas las notas, publicadas o no. La lectura de `news` es publica. */
export async function listarNotas() {
    const data = await pedir(BASE + '/' + COLECCION + '?pageSize=300&key=' + API_KEY);
    return (data.documents ?? []).map((doc) => ({
        id: doc.name.split('/').pop(),
        ...deCampos(doc.fields ?? {}),
    }));
}

export async function crearNota(token, datos) {
    const data = await pedir(BASE + '/' + COLECCION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ fields: aCampos(datos) }),
    });
    return data.name.split('/').pop();
}

/**
 * Actualiza solo los campos que se mandan.
 *
 * El updateMask es obligatorio: sin el, Firestore borra todo campo del
 * documento que no venga en el cuerpo.
 */
export async function actualizarNota(token, id, datos) {
    const mascara = Object.keys(datos)
        .map((c) => 'updateMask.fieldPaths=' + encodeURIComponent(c))
        .join('&');

    await pedir(BASE + '/' + COLECCION + '/' + id + '?' + mascara, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ fields: aCampos(datos) }),
    });
    return id;
}
