# Como publicar una nota

Se escribe la nota en un archivo `.md` de esta carpeta y se corre un comando.
La web la muestra en menos de un minuto. **No hace falta build ni deploy**,
que es lo que permite trabajar desde el disco externo sin `node_modules`.

## Publicar

```bash
npm run nota -- contenido/notas/mi-nota.md
```

Tambien sirve `node scripts/publicar-nota.mjs contenido/notas/mi-nota.md` si
no queres pasar por npm.

La primera vez pide el mail y la clave de un usuario del panel, porque las
reglas de Firestore exigen sesion para escribir. Despues guarda la sesion en
`.nopauta-sesion.json` y no vuelve a preguntar. Ese archivo esta en
`.gitignore`: **no lo subas a GitHub**, el repositorio es publico.

## El resto de los comandos

| Comando | Para que |
|---|---|
| `npm run nota -- archivo.md` | Publica o actualiza una nota |
| `npm run notas:publicar` | Publica todos los `.md` de esta carpeta |
| `npm run notas:ensayo` | Muestra que haria, sin escribir nada |
| `npm run notas:listar` | Que hay cargado y donde cae en la portada |
| `npm run notas:bajar` | Trae de Firestore lo que se cargo desde el panel web |

`notas:bajar` es auxiliar y **pisa los archivos locales**. Sirve cuando alguien
cargo una nota desde `/admin/news` en el navegador y la queres tener aca.
Si tenes cambios locales sin publicar, publicalos antes.

## Escribir una nota

Copia `_PLANTILLA.md`, ponele otro nombre y escribi. Los archivos que empiezan
con guion bajo se ignoran al publicar.

El cuerpo entiende dos marcas:

- `## Subtitulo` para un intertitulo
- `- item` para una vinieta

## Como funciona por dentro

- El comando busca en Firestore una nota con el mismo `slug`. Si existe la
  actualiza, si no la crea. Correrlo dos veces **no duplica**.
- Si no pones `slug`, se genera del titulo. Cambiar el titulo cambia el slug y
  por lo tanto la direccion web: si la nota ya salio y no queres romper el
  enlace, fija el `slug` a mano.
- La fecha de publicacion se fija la primera vez que sale y no se pisa. Una
  correccion no vuelve a poner la nota arriba de todo.
- Se validan todos los archivos antes de escribir el primero. Si el tercero
  tiene la seccion mal, no queda medio lote publicado.
- `publicada: no` deja la nota de borrador. Se puede subir asi y publicarla
  despues cambiando una palabra.

## El error que conviene no repetir

La nota de presentacion de la revista se cargo como `seccion: opinion`. La
portada trata todo lo de esa seccion como columna firmada, asi que la mando a
la columnita lateral "Voz Libre" y la tapa quedo sin nota de apertura: la
columna central decia "Todavia no hay notas publicadas" al lado de la nota que
si estaba publicada.

Un editorial va en `seccion: editorial`. `npm run notas:listar` avisa cuando
todo lo publicado es opinion.
