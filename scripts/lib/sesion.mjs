/**
 * Sesion de redaccion para los scripts.
 *
 * Las reglas de Firestore piden `request.auth != null` para escribir en
 * `news`, asi que hay que iniciar sesion con un usuario del panel.
 *
 * La primera vez pide mail y clave. Despues guarda el refresh token en
 * `.nopauta-sesion.json` y las siguientes corridas no preguntan nada.
 *
 * Se guarda el refresh token y NO la clave: es revocable desde Firebase
 * Console (Authentication > el usuario > cerrar sesiones) y no sirve para
 * entrar al panel por la web. Igual el archivo esta en .gitignore.
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';

import { API_KEY, ARCHIVO_SESION } from './config.mjs';

async function preguntar(texto) {
    const rl = createInterface({ input: stdin, output: stdout });
    try {
        return (await rl.question(texto)).trim();
    } finally {
        rl.close();
    }
}

/** Lee una clave sin mostrarla en pantalla. */
function preguntarClave(texto) {
    return new Promise((resolve, reject) => {
        if (!stdin.isTTY) {
            reject(new Error('No hay terminal interactiva. Usa NOPAUTA_EMAIL y NOPAUTA_PASSWORD.'));
            return;
        }
        stdout.write(texto);
        let valor = '';
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');

        const alTeclear = (bloque) => {
            for (const ch of bloque) {
                if (ch === '\n' || ch === '\r' || ch === '\u0004') {
                    stdin.setRawMode(false);
                    stdin.pause();
                    stdin.removeListener('data', alTeclear);
                    stdout.write('\n');
                    resolve(valor);
                    return;
                }
                if (ch === '\u0003') {
                    stdin.setRawMode(false);
                    process.exit(130);
                }
                if (ch === '\u007f' || ch === '\b') valor = valor.slice(0, -1);
                else valor += ch;
            }
        };

        stdin.on('data', alTeclear);
    });
}

async function iniciarSesion() {
    const email = process.env.NOPAUTA_EMAIL || (await preguntar('Mail del panel: '));
    const password = process.env.NOPAUTA_PASSWORD || (await preguntarClave('Clave: '));

    const r = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + API_KEY,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
    );
    const data = await r.json();
    if (!r.ok) {
        throw new Error('No se pudo iniciar sesion: ' + (data?.error?.message ?? r.status));
    }

    writeFileSync(
        ARCHIVO_SESION,
        JSON.stringify({ email, refreshToken: data.refreshToken }, null, 2)
    );
    return data.idToken;
}

async function refrescar(refreshToken) {
    const r = await fetch('https://securetoken.googleapis.com/v1/token?key=' + API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(refreshToken),
    });
    if (!r.ok) throw new Error('refresh vencido');
    const data = await r.json();
    return data.id_token;
}

/** Devuelve un idToken valido, pidiendo credenciales solo si hace falta. */
export async function obtenerToken() {
    if (existsSync(ARCHIVO_SESION)) {
        try {
            const guardada = JSON.parse(readFileSync(ARCHIVO_SESION, 'utf8'));
            if (guardada.refreshToken) return await refrescar(guardada.refreshToken);
        } catch {
            // Sesion vencida o revocada: se descarta y se pide de nuevo.
            try {
                unlinkSync(ARCHIVO_SESION);
            } catch {}
        }
    }
    return iniciarSesion();
}
