# Plan Publicacion Programada y Medicion de Lectores — Ejecucion multi-agente

**Fecha:** 2026-08-23
**Feature 1:** cargar una nota con fecha y hora futura y que salga sola en ese momento, sin cron y sin redeploy (Olas 1 a 3)
**Feature 2:** medir cuanta gente lee cada nota, sin contarnos a nosotros mismos (Ola 4, independiente)
**Proyectos afectados:** `Revistanopauta` (unico repo)
**Stack real verificado:** Next 16.1.1, React 19, Firebase 12.7, Tailwind v4

---

## Decision de arquitectura (leer antes de ejecutar)

La pregunta que dispara este plan fue: *"pongamos la nota a ingresar como
publicada + fecha exacta?"*. La respuesta es **si, y es exactamente el camino
correcto para este codigo**. Conviene entender por que, porque descarta la
alternativa obvia.

### Lo que NO se hace: un cron que da vuelta el flag

El reflejo es programar un job que a las 08:00 cambie `published: false` a
`true`. Se descarta por tres razones concretas:

1. El plan de Vercel es Hobby y limita el cron a **una corrida por dia**
   (ya esta anotado como pendiente en el handoff). Una sola hora fija de
   publicacion al dia.
2. Es un mecanismo que puede fallar en silencio: si el job no corre, la nota
   simplemente no sale y nadie se entera hasta que alguien la busca.
3. Necesita un endpoint con secreto en un repositorio publico.

### Lo que si se hace: la fecha es la fuente de verdad

La nota se guarda **ya autorizada** (`published: true`) con `publishedAt` en el
futuro, y toda lectura publica filtra `publishedAt <= ahora`.

```
published: false                    -> borrador. No sale nunca.
published: true  + fecha <= ahora   -> publicada. Se ve.
published: true  + fecha >  ahora   -> programada. No se ve todavia.
```

Tres propiedades hacen que esto encaje casi sin costo:

- **Hay un solo punto de lectura.** `getNotasPublicadas()` en
  `lib/server/notas.ts` alimenta la portada, `/noticias`, `/secciones/[seccion]`,
  `/noticias/[id]` y el `sitemap`. Un filtro ahi cubre todas las superficies
  publicas de una vez.
- **No hace falta que corra nada a la hora señalada.** El filtro se evalua en
  cada render. Si el servidor esta caido a las 08:00 no se pierde la
  publicacion: sale cuando vuelve.
- **El estado "programada" es derivado, no guardado.** No existe un campo que
  pueda quedar desincronizado con la realidad.

### Campo: se reusa `publishedAt`, no se agrega uno nuevo

`publishedAt` ya significa "el momento en que la nota salio". Programar es
poner ese momento en el futuro. No se crea `fechaProgramada` ni un enum
`estado` porque serian dos campos que pueden contradecirse entre si y
obligarian a migrar las notas ya cargadas. Ademas `ordenarPorFecha()` ya ordena
por `publishedAt`, asi que la nota programada cae sola en el lugar correcto de
la tapa el dia que sale.

**Cambio de comportamiento a tener presente:** hoy hay una regla, repetida en
el formulario y en el script, de que "la fecha no se pisa" — existe para que
corregir una nota vieja no la vuelva a poner arriba de todo. Esa regla ahora
tiene una excepcion: si el editor escribio una fecha explicita, manda la fecha
escrita.

### Zona horaria: se fija Argentina (-03:00) a mano

Vercel corre en UTC. Si el editor escribe "08:00" y se guarda tal cual, la nota
sale a las 05:00 de Charata. Peor: si se convierte usando la zona horaria de la
maquina del editor, el resultado cambia segun quien cargue la nota.

Por eso **el reloj que se escribe se interpreta siempre como hora de Argentina,
fijo en -03:00**, tanto en el panel como en los scripts. Argentina no tiene
horario de verano desde 2009, asi que el offset fijo es seguro y no depende de
la maquina de nadie.

### Limite honesto 1: la nota es legible antes de su hora

`firestore.rules` tiene `allow read: if true` sobre `news`, porque Google y
WhatsApp tienen que poder leer las notas sin sesion. Una nota programada esta
guardada en Firestore desde que se carga, asi que **cualquiera que consulte la
API REST directamente puede leerla antes de que salga**. No se ve en la web,
pero esta ahi.

Para una revista que va a investigar la pauta oficial, esto importa y tiene que
ser una decision consciente, no un descubrimiento posterior:

- **Programar sirve para ordenar el calendario, no para embargar.** Una nota
  sensible se deja en **borrador** hasta el momento de publicarla.
- El plan incluye ese aviso escrito en el propio formulario, para que la
  decision este a la vista de quien carga.

Taparlo con reglas de Firestore es mas caro de lo que parece y por eso no entra
en este plan: `publishedAt` es un string ISO, no un Timestamp, asi que las
reglas no lo pueden comparar con `request.time`; y una condicion por documento
sobre una coleccion hace que Firestore rechace **el listado entero** — el mismo
problema que ya esta documentado en las reglas de `users`. Como
`getNotasPublicadas()` lista la coleccion completa, una regla asi rompe el sitio
entero. Si algun dia hace falta embargo real, el camino es otro: guardar el
cuerpo aparte hasta la hora.

### Limite honesto 2: sale "a las 08:00", no a las 08:00:00

Las paginas usan ISR con `revalidate = 60`. La pagina cacheada se regenera
recien cuando alguien la pide, y Next le sirve la version vieja a ese primer
visitante mientras reconstruye por detras. En la practica: la nota aparece
dentro del minuto siguiente a su hora **si hay trafico**; si nadie entra a las
08:00, sale con la primera visita posterior. Para una revista local es
suficiente, pero hay que decirlo asi y no prometer precision de reloj.

La Ola 3 agrega, opcional, el empujon que cierra esa brecha.

---

## Resumen de olas

| Ola | Agentes | Paralelos entre si | Dependen de |
|-----|---------|---------------------|-------------|
| 1 | A, B | Si — A toca solo `lib/`, B toca solo `scripts/` y `contenido/` | Nada |
| 2 | A, B | Si — A toca el formulario, B toca las pantallas de lectura del panel | Ola 1 — Agente A (usan sus helpers) |
| 3 | A, B | Si — archivos distintos | Ola 2 completa |
| 4 | A, B | Si — archivos distintos | **Nada.** Es otro feature: se puede correr primero, al final o en paralelo con todo |

**Ola 3 — Agente A es opcional.** El feature funciona sin el. Decidir despues
de ver la Ola 2 andando.

**Ola 4 es un feature aparte** (medicion de lectores) y no comparte un solo
archivo con las Olas 1 a 3. Se incluye en el mismo documento porque se pidio
junto, pero no depende de nada: si te urge saber cuanta gente lee, correla
primero.

---

## Ola 1 — Regla de visibilidad y carga por archivo
> Ejecutar Agente A + Agente B en PARALELO

### Agente A — La regla de visibilidad en el nucleo
**Puede ejecutarse en paralelo con:** Agente B de esta misma ola
**Depende de:** nada — es la primera ola

#### Objetivo
Hacer que toda lectura publica de notas oculte las que tienen fecha de
publicacion futura, y exponer los helpers que el resto del sistema va a usar
para saber en que estado esta una nota.

#### Archivos a crear
- ninguno

#### Archivos a modificar
- `lib/types.ts` — documentar la nueva semantica de `publishedAt` y agregar el tipo `EstadoNota`
- `lib/portada.ts` — helpers `yaSalio()`, `estadoDeNota()`, `fechaDeSalida()`, `aIsoArgentina()`, `deIsoAInputLocal()`, `textoDeProgramacion()`; filtrar por fecha en `armarPortada()` y `notasParaListado()`
- `lib/server/notas.ts` — filtrar por fecha en `getNotasPublicadas()`

#### Prompt completo para el agente

```
Proyecto: Revista No Pauta (d:/Proyectos/Revistanopauta). Next.js 16.1.1 App Router,
TypeScript, Firebase/Firestore, Tailwind. IMPORTANTE: este clon no tiene
node_modules y no se puede correr build ni type-check local. Escribi TypeScript
conservador y verifica a ojo; el build real lo hace Vercel al pushear.

CONTEXTO DEL FEATURE
Se agrega publicacion programada: una nota se carga con fecha y hora futura y
sale sola en ese momento. El modelo elegido NO usa cron. La fecha es la fuente
de verdad y toda lectura publica filtra por ella:

  published: false                    -> borrador   (no sale nunca)
  published: true  + fecha <= ahora   -> publicada  (se ve)
  published: true  + fecha >  ahora   -> programada (todavia no se ve)

El campo de fecha es `publishedAt`, que YA EXISTE y es un string ISO. No crees
campos nuevos: programar es poner `publishedAt` en el futuro.

REGLA DE COMPATIBILIDAD, CRITICA: hay notas ya cargadas y algunas pueden no
tener `publishedAt`. Una nota SIN fecha se considera ya salida (visible), nunca
programada. El codigo actual usa `n.published !== false` (o sea, la nota sin el
campo cuenta como publicada) — manten esa permisividad, no la endurezcas, o
podes hacer desaparecer notas que hoy estan al aire.

ARCHIVOS A LEER PRIMERO (son tu modelo de estilo: comentarios en español sin
tildes, explicando el POR QUE de cada decision, no el QUE):
- lib/types.ts
- lib/portada.ts
- lib/server/notas.ts

TAREA 1 — lib/types.ts
Agrega el tipo:

  /**
   * Estado real de una nota, derivado de `published` + `publishedAt`.
   * No se guarda en Firestore: se calcula. Asi no puede quedar desincronizado.
   */
  export type EstadoNota = 'borrador' | 'programada' | 'publicada';

Y actualiza el comentario de `publishedAt` dentro de la interface News para que
diga que es el momento en que la nota sale, que puede estar en el futuro, y que
en ese caso la nota queda programada y no se muestra hasta esa hora.

TAREA 2 — lib/portada.ts
Agrega estas funciones exportadas. Ponelas junto a los otros helpers
editoriales, ANTES de la seccion "Armado de portada":

  /**
   * Zona horaria de la revista, fija en -03:00.
   * Vercel corre en UTC y las maquinas de la redaccion pueden estar en
   * cualquier zona. Si el reloj que escribe el editor se interpretara con la
   * zona de quien carga, la misma nota saldria a distinta hora segun quien la
   * cargue. Argentina no tiene horario de verano desde 2009, asi que el offset
   * fijo es seguro.
   */
  const OFFSET_ARGENTINA = '-03:00';

  /**
   * Convierte lo que escribe un <input type="datetime-local">
   * ("2026-08-25T08:00") en ISO absoluto, leyendo ese reloj como hora
   * argentina. Devuelve null si la fecha no es valida.
   */
  export function aIsoArgentina(local: string): string | null

  /**
   * Camino inverso: de ISO absoluto al formato "2026-08-25T08:00" que espera
   * el input, expresado en hora argentina. Devuelve '' si no hay fecha valida.
   */
  export function deIsoAInputLocal(iso?: string | null): string

  /** Momento en que la nota sale. null si no tiene fecha. */
  export function fechaDeSalida(nota: News): Date | null

  /**
   * Si la nota ya salio al aire. Una nota sin fecha se considera salida:
   * son las notas viejas, cargadas antes de que existiera la programacion.
   */
  export function yaSalio(nota: News, ahora: Date = new Date()): boolean

  /** Estado real de la nota. */
  export function estadoDeNota(nota: News, ahora: Date = new Date()): EstadoNota

  /**
   * "sale el 25 de agosto a las 08:00". Para avisos del panel.
   * Formatea SIEMPRE en hora argentina, no en la del navegador.
   */
  export function textoDeProgramacion(nota: News): string

Detalles de implementacion:
- `aIsoArgentina('2026-08-25T08:00')` debe dar '2026-08-25T11:00:00.000Z'.
  Implementalo como `new Date(local + ':00' + OFFSET_ARGENTINA)` cuidando que
  el string puede venir ya con segundos. Valida con Number.isNaN(d.getTime()).
- `deIsoAInputLocal` no puede usar toISOString() directo (eso da UTC). El
  camino simple es restar 3 horas al epoch y despues toISOString().slice(0,16);
  dejá un comentario explicando que eso es valido solo porque el offset es fijo.
- `estadoDeNota`: si `nota.published === false` -> 'borrador'. Si no y
  `yaSalio()` -> 'publicada'. Si no -> 'programada'.
- `textoDeProgramacion` usa toLocaleString('es-AR', { timeZone:
  'America/Argentina/Buenos_Aires', ... }) con dia, mes y hora.

TAREA 3 — lib/portada.ts, filtrar en el armado
En `armarPortada()`, la linea:
    const fuente = notas.filter((n) => n.published !== false);
pasa a ser:
    const fuente = notas.filter((n) => n.published !== false && yaSalio(n));
Con un comentario explicando que una nota programada esta autorizada pero
todavia no salio, asi que no ocupa lugar en la tapa. Esto importa porque
armarPortada tambien la usa el panel (app/admin/page.tsx) para previsualizar la
tapa: el editor tiene que ver la tapa real de ahora, no una con notas que
todavia no salieron.

En `notasParaListado()`, el mismo filtro adicional.

TAREA 4 — lib/server/notas.ts
En `getNotasPublicadas()`, la linea del filtro pasa a incluir `yaSalio(n)`.
Importa el helper desde '../portada' (ya importa ordenarPorFecha de ahi).
Agrega un comentario corto explicando que este es el punto unico por donde
pasan portada, /noticias, /secciones, /noticias/[id] y el sitemap, y que por
eso el filtro de fecha vive aca.

LO QUE NO TENES QUE HACER
- No toques components/, app/, scripts/ ni contenido/. Otros agentes trabajan
  ahi en paralelo y se pisarian.
- No agregues campos nuevos a la interface News mas alla del tipo EstadoNota.
- No toques firestore.rules.
- No cambies el criterio de orden (ordenarPorFecha queda como esta).

CRITERIO DE EXITO
1. Las tres funciones de filtrado (getNotasPublicadas, armarPortada,
   notasParaListado) excluyen notas con publishedAt futuro.
2. Una nota sin publishedAt sigue siendo visible (no rompe lo ya publicado).
3. aIsoArgentina('2026-08-25T08:00') === '2026-08-25T11:00:00.000Z' y
   deIsoAInputLocal de ese valor vuelve a '2026-08-25T08:00'. Verificalo
   mentalmente paso a paso y dejalo escrito en un comentario.
4. No queda ningun import sin usar ni ninguna funcion exportada sin implementar.
```

---

### Agente B — Programar desde archivo .md
**Puede ejecutarse en paralelo con:** Agente A de esta misma ola
**Depende de:** nada — es la primera ola

#### Objetivo
Que una nota cargada con `npm run nota` pueda traer una fecha de salida futura,
y que los comandos de listado y de ensayo muestren claramente que esta
programado y para cuando.

#### Archivos a crear
- ninguno

#### Archivos a modificar
- `scripts/lib/config.mjs` — constante `OFFSET_ARGENTINA`
- `scripts/lib/nota.mjs` — leer y escribir el campo `publicar:` de la cabecera
- `scripts/publicar-nota.mjs` — respetar la fecha del archivo al escribir en Firestore
- `scripts/listar-notas.mjs` — mostrar el estado PROGRAMADA y la fecha de salida
- `contenido/notas/_PLANTILLA.md` — documentar el campo nuevo
- `contenido/notas/README.md` — explicar como se programa

#### Prompt completo para el agente

```
Proyecto: Revista No Pauta (d:/Proyectos/Revistanopauta). Los scripts de
scripts/ corren con `node` pelado, SIN node_modules y SIN compilar: no podes
importar nada de lib/*.ts ni agregar dependencias. Es a proposito, esta
documentado en scripts/lib/config.mjs: el proyecto vive en un disco externo sin
node_modules. Si necesitas una constante que ya existe en TypeScript, se copia
a mano y se deja el comentario de que hay que mantener las dos en sintonia.

CONTEXTO DEL FEATURE
Se agrega publicacion programada. Una nota se guarda ya autorizada
(published: true) con `publishedAt` en el futuro, y el sitio filtra por esa
fecha. No hay cron: la fecha es la fuente de verdad.

  published: false                    -> borrador
  published: true  + fecha <= ahora   -> publicada
  published: true  + fecha >  ahora   -> programada

ZONA HORARIA, CRITICO: la hora que escribe el editor se interpreta SIEMPRE como
hora de Argentina (-03:00 fijo), nunca como la zona de la maquina que corre el
script. Si no, la misma nota sale a distinta hora segun quien la publique.
Argentina no tiene horario de verano desde 2009, asi que el offset fijo es
seguro.

ARCHIVOS A LEER PRIMERO (son tu modelo de estilo y de tono):
- scripts/lib/nota.mjs
- scripts/lib/config.mjs
- scripts/publicar-nota.mjs
- scripts/listar-notas.mjs
- contenido/notas/_PLANTILLA.md
- contenido/notas/README.md

TAREA 1 — scripts/lib/config.mjs
Agrega y exporta:

  /**
   * Zona horaria de la revista, fija. Espejo de OFFSET_ARGENTINA en
   * lib/portada.ts: si cambia alla, cambia aca.
   */
  export const OFFSET_ARGENTINA = '-03:00';

TAREA 2 — scripts/lib/nota.mjs
Agrega una funcion exportada:

  /**
   * Interpreta el campo "publicar" de la cabecera como fecha de salida.
   * Acepta "2026-08-25 08:00", "2026-08-25T08:00" y "2026-08-25" (que se lee
   * como las 08:00 de ese dia: una revista no publica a medianoche).
   * Devuelve un ISO absoluto, o null si el campo esta vacio.
   * Tira error con mensaje claro si la fecha no se entiende.
   */
  export function fechaDeSalida(valor, nombreArchivo)

Implementacion: normaliza el separador a 'T', si no hay hora agrega 'T08:00',
agrega segundos si faltan, concatena OFFSET_ARGENTINA, y valida con
Number.isNaN(new Date(x).getTime()). Devolve .toISOString().

Despues, en `aDatosDeNota()`:
- Lee `meta.publicar` con esa funcion y guardalo como `datos.publishedAt`
  (null si no vino).
- Validacion importante: si hay `publicar` pero `publicada` es "no", tira un
  error explicando que programar una nota implica autorizarla, y que hay que
  poner `publicada: si`. Es mejor fallar que dejar al editor creyendo que
  programo algo que nunca va a salir.

En `aArchivo()` (el volcado inverso que usa `npm run notas:bajar`), agrega el
campo `publicar` con la fecha en hora argentina y formato "YYYY-MM-DD HH:mm",
para que el ida y vuelta no pierda informacion. Ponelo al lado de `publicada`.

TAREA 3 — scripts/publicar-nota.mjs
Hoy la fecha se decide asi:
    const publishedAt = datos.published ? previa?.publishedAt || ahora : null;
La regla es "la fecha no se pisa", para que una correccion no vuelva a poner la
nota arriba de todo. Ahora tiene una excepcion: si el archivo trae fecha
explicita, manda la fecha del archivo. Queda:

    // Prioridad: lo que dice el archivo > lo que ya tenia > ahora.
    // La fecha explicita gana a proposito: es como se corrige o se adelanta
    // una programacion volviendo a correr el comando.
    const publishedAt = datos.published
        ? (datos.publishedAt || previa?.publishedAt || ahora)
        : null;

Ojo: `datos.publishedAt` viene de aDatosDeNota, no lo borres al hacer el spread.

En el modo --ensayo, la linea de estado tiene que distinguir los tres casos.
Hoy imprime 'publicada' o 'borrador'. Que imprima 'programada -> sale el
25/08/2026 08:00' cuando la fecha sea futura, formateando en hora argentina.

TAREA 4 — scripts/listar-notas.mjs
Hoy el estado es 'PUBLICADA' o 'borrador '. Agrega 'PROGRAMADA' cuando
published es true y publishedAt es futuro, y que la segunda linea de esa nota
diga cuando sale, en hora argentina.

Ademas, al final, si hay notas programadas agrega un bloque:

    Programadas (todavia no se ven en la web):
      25/08 08:00  El titulo de la nota

Y sumá una linea al conteo final: "N nota(s), N publicada(s), N programada(s)."

Mantene el aviso que ya existe sobre "todo lo publicado es opinion", y fijate
que su calculo use solo las que YA salieron, no las programadas.

TAREA 5 — contenido/notas/_PLANTILLA.md
En la seccion "--- Estado ---", documenta el campo nuevo con el mismo tono que
el resto (explicativo, tuteando al redactor, sin tildes en los comentarios):

  # publicada: si -> sale en la web.
  # publicada: no -> queda de borrador, no se ve.
  publicada: no

  # publicar: fecha y hora en que sale sola. Solo tiene efecto con
  # "publicada: si". Hora de Charata.
  #   publicar: 2026-08-25 08:00
  #   publicar: 2026-08-25          -> ese dia a las 08:00
  # Si lo dejas vacio, sale en el momento en que corras el comando.
  #
  # Ojo: la nota programada queda guardada en la base desde que la subis y la
  # base es de lectura publica. No sirve para embargar algo sensible; para eso
  # dejala en borrador hasta el momento de publicar.
  publicar:

TAREA 6 — contenido/notas/README.md
Agrega una seccion corta "Programar una nota" con: el ejemplo de cabecera, la
aclaracion de que no hace falta que corra nada a esa hora, que sale dentro del
minuto siguiente a su hora si hay trafico en el sitio, y el aviso de que
programar no es embargar.

LO QUE NO TENES QUE HACER
- No toques lib/, components/ ni app/. Otro agente trabaja ahi en paralelo.
- No agregues dependencias ni un parser de YAML. La cabecera sigue siendo
  "una clave por linea, valor en texto plano".
- No cambies el criterio de busqueda por slug ni la logica de crear/actualizar.

CRITERIO DE EXITO
1. `npm run notas:ensayo` sobre un .md con `publicar: 2026-12-25 08:00` y
   `publicada: si` imprime que esta programada y para cuando, sin escribir nada.
2. Un .md con `publicar:` pero `publicada: no` falla con mensaje claro.
3. `npm run notas:listar` distingue PUBLICADA de PROGRAMADA.
4. `npm run notas:bajar` sobre una nota programada devuelve un .md que, si se
   vuelve a publicar, conserva la misma fecha.
5. Correr los scripts no tira error de sintaxis: `node --check` sobre cada .mjs
   tocado.
```

---

## Ola 2 — Panel de redaccion
> Ejecutar SOLO despues de que Ola 1 este completa
> Ejecutar Agente A + Agente B en PARALELO

### Agente A — Elegir cuando sale, en el formulario
**Puede ejecutarse en paralelo con:** Agente B de esta misma ola
**Depende de:** Ola 1 — Agente A (usa `aIsoArgentina`, `deIsoAInputLocal`, `estadoDeNota`)

#### Objetivo
Reemplazar el checkbox "Publicada" por una eleccion de tres estados con
selector de fecha y hora, y escribir `publishedAt` en consecuencia.

#### Archivos a modificar
- `components/admin/NewsFormDialog.tsx` — bloque "Estado" y la logica de `publishedAt` en el submit

#### Prompt completo para el agente

```
Proyecto: Revista No Pauta (d:/Proyectos/Revistanopauta). Next.js 16.1.1 App Router,
React 19, TypeScript, Tailwind v4, componentes tipo shadcn en components/ui/.
Este clon NO tiene node_modules: no se puede correr build ni type-check local,
el build real lo hace Vercel. Escribi codigo conservador.

CONTEXTO
Se agrego publicacion programada. El modelo, ya implementado en lib/portada.ts
y lib/server/notas.ts, es:

  published: false                    -> borrador   (no sale nunca)
  published: true  + fecha <= ahora   -> publicada  (se ve)
  published: true  + fecha >  ahora   -> programada (todavia no se ve)

La fecha es `publishedAt`, string ISO que ya existe en el tipo News. No hay
cron: el sitio filtra por fecha en cada render.

LEE PRIMERO lib/portada.ts. Ya estan implementados y exportados:
  aIsoArgentina(local: string): string | null      // "2026-08-25T08:00" -> ISO
  deIsoAInputLocal(iso?: string | null): string    // ISO -> "2026-08-25T08:00"
  estadoDeNota(nota: News): 'borrador' | 'programada' | 'publicada'
La hora que escribe el editor se interpreta SIEMPRE como hora de Argentina, no
como la del navegador. Usa esos helpers, no reimplementes la conversion.

ARCHIVO A MODIFICAR: components/admin/NewsFormDialog.tsx
Leelo entero antes de tocar nada. Fijate especialmente en:
- el objeto VACIO y el useEffect que carga `news` en el formulario;
- el bloque de `handleSubmit` que hoy dice "La fecha de publicacion se fija la
  primera vez que se publica y no se pisa";
- la constante CLASE_SELECT y el componente Sub, que definen el estilo.

TAREA 1 — estado del formulario
En VACIO, reemplaza `published: false` por:
    estado: 'borrador',      // 'borrador' | 'ahora' | 'programada'
    fechaSalida: '',         // formato del input datetime-local
En el useEffect que carga una nota existente, deriva el estado inicial con
estadoDeNota(news) mapeando 'publicada' -> 'ahora', y llena fechaSalida con
deIsoAInputLocal(news.publishedAt).

TAREA 2 — la UI del bloque "Estado"
Reemplaza el checkbox actual por tres opciones de radio, con el label completo
en español (sin tildes en los comentarios del codigo, con tildes en el texto
visible para el usuario). Que quede asi de claro:

  ( ) Borrador — no se ve en la web
  ( ) Publicar ahora — sale apenas guardes
  ( ) Programar — sale sola el [ 25/08/2026 08:00 ]

El input de fecha es <input type="datetime-local"> con la clase CLASE_SELECT
para que pegue con el resto, y solo se muestra (o solo se habilita) cuando el
estado es 'programada'.

Debajo del input, cuando el estado es 'programada', dos aclaraciones en
text-xs text-muted-foreground:

  "Hora de Charata. La nota aparece dentro del minuto siguiente a esa hora."

  "La nota queda guardada desde que la creas y la base es de lectura publica:
   programar sirve para ordenar el calendario, no para embargar. Si el tema es
   sensible, dejala en borrador hasta el momento de publicarla."

Ese segundo aviso NO es opcional: es la unica advertencia visible de una
limitacion real del sistema.

TAREA 3 — validacion
Si el estado es 'programada' y no hay fecha, o la fecha no es valida, no
guardes: mostra el error y frena el submit. Reusá el patron que ya hay
(alert + console.error) o algo mejor si el archivo ya tiene un lugar para
errores; no inventes una libreria de notificaciones.

Si la fecha elegida ya paso, no es un error: guardala igual — es una nota que
sale al instante con fecha retroactiva, que es un caso legitimo (cargar tarde
algo que se publico antes).

TAREA 4 — el submit
Reemplaza el bloque actual de publishedAt por los tres casos:

    // Que se guarda segun el estado elegido:
    //   borrador   -> published false y sin fecha
    //   ahora      -> published true; se respeta la fecha que ya tenia para
    //                 que corregir una nota vieja no la suba de nuevo a la tapa
    //   programada -> published true con la fecha elegida, leida como hora
    //                 de Argentina
    if (formData.estado === 'borrador') {
        datos.published = false;
        datos.publishedAt = null;
    } else if (formData.estado === 'ahora') {
        datos.published = true;
        datos.publishedAt = news?.publishedAt || new Date().toISOString();
    } else {
        datos.published = true;
        datos.publishedAt = aIsoArgentina(formData.fechaSalida);
    }

Ojo: `datos` se declara con `published: formData.published` mas arriba en el
objeto inicial — actualizalo, no dejes la propiedad vieja apuntando a un campo
que ya no existe.

LO QUE NO TENES QUE HACER
- No toques app/admin/news/page.tsx ni app/admin/page.tsx: otro agente los
  esta modificando en paralelo.
- No toques lib/ ni scripts/.
- No cambies nada del resto del formulario: titulacion, seccion, jerarquia,
  foto, video y cuerpo quedan igual.
- No agregues un date picker de libreria. El <input type="datetime-local">
  nativo alcanza y no suma dependencias.

CRITERIO DE EXITO
1. Crear una nota en 'programada' con fecha futura la guarda con
   published: true y publishedAt futuro en ISO.
2. Reabrir esa nota para editarla muestra el radio en "Programar" y el input
   con la misma fecha y hora que se cargo (ida y vuelta sin corrimiento).
3. Pasar una nota programada a borrador limpia publishedAt a null.
4. Editar una nota ya publicada y guardar NO le cambia la fecha.
5. No quedan referencias a formData.published en el archivo.
```

---

### Agente B — Que el panel muestre lo que esta programado
**Puede ejecutarse en paralelo con:** Agente A de esta misma ola
**Depende de:** Ola 1 — Agente A (usa `estadoDeNota` y `textoDeProgramacion`)

#### Objetivo
Que la redaccion vea de un vistazo que notas estan esperando su hora y para
cuando, tanto en el listado como en el tablero.

#### Archivos a modificar
- `app/admin/news/page.tsx` — tercer estado en el cartelito de las tarjetas y de la lista
- `app/admin/page.tsx` — indicador de programadas y aviso de proxima salida

#### Prompt completo para el agente

```
Proyecto: Revista No Pauta (d:/Proyectos/Revistanopauta). Next.js 16.1.1 App Router,
React 19, TypeScript, Tailwind v4. Este clon NO tiene node_modules: no se puede
correr build ni type-check local, el build lo hace Vercel.

CONTEXTO
Se agrego publicacion programada. Una nota puede estar en tres estados y el
estado NO se guarda: se deriva de `published` + `publishedAt`.

  published: false                    -> borrador
  published: true  + fecha <= ahora   -> publicada
  published: true  + fecha >  ahora   -> programada

LEE PRIMERO lib/portada.ts. Ya estan implementados y exportados:
  estadoDeNota(nota: News): 'borrador' | 'programada' | 'publicada'
  textoDeProgramacion(nota: News): string   // "sale el 25 de agosto a las 08:00"
  yaSalio(nota: News): boolean
Usalos, no reimplementes la comparacion de fechas.

TAREA 1 — app/admin/news/page.tsx
Hoy hay dos lugares (vista grid y vista lista) con el mismo cartelito:

  <span className={`... ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
      {item.published ? 'Publicado' : 'Borrador'}
  </span>

Extrae eso a un componente local `EstadoNotaBadge({ nota }: { nota: News })`
definido en el mismo archivo (no crees un archivo nuevo, es un detalle de esta
pantalla) y usalo en los dos lugares. Tres variantes:

  publicada  -> verde  (bg-green-100 text-green-800),  texto "Publicado"
  programada -> ambar  (bg-amber-100 text-amber-800),  texto "Programada"
  borrador   -> gris   (bg-gray-100 text-gray-800),    texto "Borrador"

En la tarjeta de una nota programada, agrega debajo del titulo una linea
text-xs text-amber-700 con textoDeProgramacion(item). El editor tiene que poder
ver cuando sale sin abrir la nota.

Agrega tambien un contador arriba, junto al encabezado de la pantalla: si hay
notas programadas, una linea del estilo "3 notas esperando su hora". Si no hay,
no muestres nada — no agregues ruido cuando no hay nada que avisar.

TAREA 2 — app/admin/page.tsx
Leelo entero primero. Hoy calcula:

    const publicadas = notas.filter((n) => n.published);
    const borradores = notas.filter((n) => !n.published);
    const portada = armarPortada(publicadas);

Eso ahora esta mal en un punto: una nota programada tiene published true, asi
que cae en `publicadas` y el numero miente. Corregilo:

    // Una nota programada esta autorizada pero todavia no salio: no cuenta
    // como publicada ni ocupa lugar en la tapa.
    const publicadas = notas.filter((n) => estadoDeNota(n) === 'publicada');
    const programadas = notas.filter((n) => estadoDeNota(n) === 'programada');
    const borradores = notas.filter((n) => estadoDeNota(n) === 'borrador');

`armarPortada` ya filtra las programadas por dentro, asi que la previsualizacion
de tapa queda correcta sola; pero revisá que todo lo que se calcula a partir de
`publicadas` (sinSeccion, sinFoto, porSeccion, la fecha de la ultima) siga
teniendo sentido con la definicion nueva.

Agrega un cuarto indicador "Programadas" usando el mismo componente Indicador
que ya existe en el archivo, con el mismo estilo que los otros. En el pie, la
proxima que sale: ordena las programadas por publishedAt ascendente y mostra
textoDeProgramacion de la primera. Si no hay ninguna, un pie neutro tipo "No
hay notas esperando".

Elegí un icono de lucide-react coherente con los que ya usa el archivo
(Clock o CalendarClock).

LO QUE NO TENES QUE HACER
- No toques components/admin/NewsFormDialog.tsx: otro agente lo esta
  modificando en paralelo.
- No toques lib/ ni scripts/.
- No cambies NewsService ni como se leen las notas en el panel. El panel lee
  todo con NewsService.getAll() y filtra en memoria; eso queda igual.

CRITERIO DE EXITO
1. Una nota con publishedAt futuro aparece como "Programada" en ambas vistas
   del listado, con la fecha de salida visible.
2. El tablero no la cuenta como publicada.
3. La previsualizacion de tapa del tablero no la muestra.
4. Con cero notas programadas, ninguna pantalla muestra contadores ni avisos
   vacios.
```

---

## Ola 3 — Puntualidad y documentacion
> Ejecutar SOLO despues de que Ola 2 este completa
> Ejecutar Agente A + Agente B en PARALELO

### Agente A — Que salga puntual y no cuando pasa el primer lector (OPCIONAL)
**Puede ejecutarse en paralelo con:** Agente B de esta misma ola
**Depende de:** Ola 2 completa

> **Decidir si vale la pena antes de ejecutarlo.** El feature funciona sin esto.
> Solo cierra la brecha entre "sale a las 08:00" y "sale a las 08:00 si alguien
> entra al sitio". Si la revista tiene trafico a la mañana, es innecesario.

#### Objetivo
Forzar la regeneracion de la portada una vez por dia a la hora habitual de
publicacion, y permitir que el script de publicacion refresque el sitio al
instante en vez de esperar el minuto de ISR.

#### Archivos a crear
- `app/api/revalidar/route.ts` — endpoint que invalida el tag 'notas'

#### Archivos a modificar
- `vercel.json` — un cron diario
- `scripts/publicar-nota.mjs` — avisar al sitio despues de escribir

#### Prompt completo para el agente

```
Proyecto: Revista No Pauta (d:/Proyectos/Revistanopauta). Next.js 16.1.1 App Router
en Vercel, plan Hobby.

CONTEXTO
Las notas se publican solas por fecha: lib/server/notas.ts filtra
`publishedAt <= ahora` en cada render, sin cron. Pero las paginas usan ISR con
revalidate = 60 y el fetch a Firestore esta etiquetado:

    fetch(url, { next: { revalidate: 60, tags: ['notas'] } })

Ese tag existe desde antes y nunca lo invalido nadie. Consecuencia: una nota
programada para las 08:00 aparece con la primera visita despues de esa hora,
no a las 08:00 en punto. Esta tarea cierra esa brecha.

LIMITACION DEL PLAN HOBBY: Vercel Hobby permite cron UNA sola vez por dia. No
intentes programarlo cada 5 minutos, el deploy lo rechaza. Una corrida diaria a
la hora habitual de publicacion de la revista es exactamente lo que hace falta.

TAREA 1 — app/api/revalidar/route.ts
Endpoint POST y GET que llama revalidateTag('notas') y devuelve JSON con el
momento. Protegido con un secreto:

- Lee process.env.REVALIDAR_SECRETO.
- Si la variable no esta definida, responde 503 con un mensaje claro de que
  falta configurarla. NO dejes el endpoint abierto cuando falta el secreto:
  este repositorio es publico y la URL se descubre sola.
- Acepta el secreto por header 'x-secreto' o por query ?secreto=. Vercel Cron
  manda un header 'authorization: Bearer <CRON_SECRET>'; aceptalo tambien.
- Si no coincide, 401.
- export const dynamic = 'force-dynamic' para que no se cachee.

Comenta arriba del archivo por que existe: no publica nada, solo le avisa al
cache de Next que las notas cambiaron.

TAREA 2 — vercel.json
Agrega:
    "crons": [{ "path": "/api/revalidar", "schedule": "0 11 * * *" }]
Nota: el cron de Vercel corre en UTC. 11:00 UTC son las 08:00 de Charata.
Dejá ese calculo escrito en el handoff (vercel.json no admite comentarios).

TAREA 3 — scripts/publicar-nota.mjs
Al final, despues de escribir todas las notas, si existe la variable de entorno
REVALIDAR_SECRETO hace un fetch al endpoint y avisa por consola si el sitio se
refresco. Si no existe la variable, no falles: imprimi el mensaje actual ("la
portada se rearma sola en menos de un minuto") y listo. El script tiene que
seguir funcionando sin ninguna configuracion extra.

LO QUE NO TENES QUE HACER
- No cambies el valor de revalidate = 60 de ninguna pagina.
- No agregues un segundo cron.
- No toques lib/ ni components/.
- No pongas el secreto en el codigo ni en un archivo versionado.

CRITERIO DE EXITO
1. Sin REVALIDAR_SECRETO configurado, el endpoint responde 503 y el script de
   publicacion sigue andando igual que antes.
2. Con el secreto, un POST valido devuelve 200 y uno invalido 401.
3. vercel.json sigue siendo JSON valido.
4. Queda anotado en el handoff que hay que cargar REVALIDAR_SECRETO en las
   variables de entorno de Vercel, sin prefijo NEXT_PUBLIC.
```

---

### Agente B — Documentacion y handoff
**Puede ejecutarse en paralelo con:** Agente A de esta misma ola
**Depende de:** Ola 2 completa

#### Objetivo
Dejar escrito como se programa una nota y, sobre todo, cuales son los dos
limites del mecanismo, para que nadie los descubra por las malas.

#### Archivos a modificar
- `reports/HANDOFF_ACTUAL.md` — entrada nueva, arriba de la del 2026-08-22

#### Prompt completo para el agente

```
Proyecto: Revista No Pauta (d:/Proyectos/Revistanopauta).

CONTEXTO
Se acaba de implementar publicacion programada de notas. Tu tarea es
documentarla en el handoff con el mismo criterio que el resto del documento.

LEE PRIMERO reports/HANDOFF_ACTUAL.md entero, y despues estos archivos para
documentar lo que REALMENTE quedo implementado (no lo que dice el plan):
- lib/portada.ts (helpers yaSalio, estadoDeNota, aIsoArgentina)
- lib/server/notas.ts (el filtro)
- components/admin/NewsFormDialog.tsx (los tres estados)
- scripts/lib/nota.mjs (el campo `publicar`)

TONO: mira como estan escritas las entradas del 2026-08-22 y del 2026-08-17.
No son changelogs de commits: explican que estaba mal, que se decidio y por
que. Se escribe sin tildes en el cuerpo. Se dicen los limites en voz alta.

ESCRIBI una entrada nueva titulada
"## Actualizacion 2026-08-23 - Publicacion programada"
ubicada arriba de la entrada del 2026-08-22, con estas partes:

1. Que se puede hacer ahora: cargar una nota con fecha y hora futura y que
   salga sola.

2. Por que no hay cron. Tres razones: Hobby limita el cron a una corrida
   diaria; un job que no corre falla en silencio; obligaria a guardar un
   secreto para un repositorio publico. En cambio la fecha es la fuente de
   verdad y se evalua en cada render, asi que si el servidor esta caido a las
   08:00 no se pierde la publicacion, sale cuando vuelve.

3. Los tres estados y como se derivan de published + publishedAt. Aclara que
   no se agrego ningun campo: programar es poner publishedAt en el futuro, y
   que el estado no se guarda para que no pueda quedar desincronizado.

4. La zona horaria fija en -03:00, y por que no se usa la del navegador ni la
   del servidor: Vercel corre en UTC y si se usara la zona de quien carga, la
   misma nota saldria a distinta hora segun quien la publique.

5. **Los dos limites, sin suavizar:**

   - **Programar no es embargar.** firestore.rules tiene `allow read: if true`
     sobre `news` porque Google y WhatsApp tienen que leer sin sesion. Una nota
     programada esta en la base desde que se carga y se puede leer consultando
     la API REST directo. Para material sensible, borrador hasta el momento de
     publicar. Explica ademas por que no se tapa con reglas: publishedAt es un
     string ISO y no se puede comparar con request.time, y una condicion por
     documento haria que Firestore rechace el listado entero de la coleccion
     — el mismo problema ya documentado en las reglas de `users`.

   - **Sale "a las 08:00", no a las 08:00:00.** Con ISR de 60 segundos, la
     pagina se regenera cuando alguien la pide, y el primer visitante despues
     de la hora puede ver todavia la version vieja mientras Next reconstruye
     por detras.

6. Como se usa, en las dos vias: el bloque Estado del formulario del panel, y
   el campo `publicar:` de los archivos .md con un ejemplo de cabecera.

7. Si el Agente A de esta ola se ejecuto, sumá que hay un cron diario a las
   11:00 UTC (08:00 de Charata) que fuerza la regeneracion, y que hace falta
   cargar REVALIDAR_SECRETO en las variables de entorno de Vercel. Si no se
   ejecuto, no lo menciones.

LO QUE NO TENES QUE HACER
- No toques ningun archivo de codigo.
- No borres ni reescribas entradas anteriores del handoff.
- No inventes: si algo del plan no quedo implementado, documenta lo que hay.

CRITERIO DE EXITO
La entrada le alcanza a alguien que vuelve en tres meses para programar una
nota sin leer una linea de codigo, y para saber que NO tiene que programar.
```

---

## Ola 4 — Medicion de lectores (feature independiente)
> No depende de las Olas 1 a 3 y no comparte archivos con ellas.
> Ejecutar Agente A + Agente B en PARALELO

### Decision de arquitectura de la medicion (leer antes de ejecutar)

#### Lo que se descubrio mirando el codigo

`@vercel/analytics` **ya esta instalado** (1.3.1) y `<Analytics />` **ya esta
montado** en `app/layout.tsx:80`. Pero al consultar la API de Vercel Web
Analytics del proyecto `prj_Ad6QQaICBPGKL8MKYCD04C8r4GsS`, responde
`404 Web Analytics not found`.

Traduccion: **hoy no se esta midiendo nada.** El componente esta puesto pero la
funcion nunca se activo en el panel de Vercel, asi que no hay una sola visita
registrada desde que salio el sitio. El primer paso no es programar: es prender
un switch.

#### Herramienta: Vercel Web Analytics, no Google Analytics

| | Vercel Web Analytics | Google Analytics 4 | Contador propio en Firestore |
|---|---|---|---|
| Costo de implementacion | ya instalado, falta activarlo | script nuevo + banner de consentimiento | API + reglas + Admin SDK |
| Cookies / consentimiento | no usa cookies | requiere banner | no |
| Filtra bots | si | parcial | **no** |
| Datos disponibles en el sitio | no (viven en el dashboard) | no | si |
| Coherencia con la linea editorial | no depende de nadie | le entrega los lectores a Google | propio |

Se elige **Vercel Web Analytics**: el paquete ya esta, no usa cookies (asi que
no hace falta banner), y filtra bots conocidos. Ese ultimo punto no es menor:
un contador casero cuenta como lectores a los crawlers de Google, al robot que
genera la vista previa cuando alguien pega el enlace en WhatsApp y a cualquier
ping de monitoreo. La primera nota tendria "cientos de lecturas" que no existen.

Google Analytics se descarta por dos razones: obliga a un banner de
consentimiento, y para una revista cuya premisa es no depender de nadie,
mandarle el comportamiento de sus lectores a Google es una contradiccion que
no vale la pena por datos que Vercel ya da.

#### Como se muestra por nota

Cada nota tiene su propia URL (`/noticias/<slug>`), asi que el dashboard de
Vercel agrupado por `requestPath` **ya es el ranking de notas mas leidas**. No
hay que construir nada para eso.

#### El corazon de la pregunta: no contarnos a nosotros

Vercel no ofrece filtro por IP en el plan gratuito, y de todos modos la IP de
la redaccion es dinamica. La solucion va del lado del navegador: el componente
`<Analytics>` acepta una funcion `beforeSend` que corre antes de mandar cada
evento, y **si devuelve `null` el evento no se envia**. Dos reglas combinadas,
porque cubren casos distintos:

**Regla 1 — el que tiene sesion del panel no cuenta.**
Los que no deben contar son exactamente los que tienen cuenta en `/admin`.
`AuthProvider` ya envuelve todo el sitio desde `app/layout.tsx`, asi que
`useAuth()` esta disponible tambien en las paginas publicas. Son cinco lineas.
*Lo que no cubre:* si entras al sitio desde el celular sin haber iniciado
sesion, contas como lector.

**Regla 2 — marca de dispositivo, para todo lo demas.**
Una URL discreta `/no-contar` que guarda `localStorage['nopauta:interno']` y
`beforeSend` la respeta. Cada persona de la redaccion la abre una vez por
navegador y queda excluida para siempre en ese dispositivo, con sesion o sin
sesion.
*Lo que no cubre:* es por navegador, no por persona. Si borras los datos del
navegador o usas otro, hay que volver a marcarlo. Por eso la pagina muestra el
estado actual, para poder verificarlo de un vistazo.

Las dos juntas cubren el caso real: la redaccion trabajando en la compu (regla
1) y la redaccion mirando la revista desde el telefono (regla 2).

#### Lo que esto NO resuelve, dicho de frente

- **Vistas no es lectura.** Vercel cuenta que alguien abrio la pagina, no que
  leyo la nota. Para una revista que se define por el analisis, "500 vistas" y
  "500 lecturas" no son lo mismo. El Agente B agrega la metrica que si importa.
- **Los datos viven en Vercel, no en Firestore.** No sirven para mostrar "lo
  mas leido" en la portada. Si algun dia se quiere ese ranking publico, ahi si
  hace falta contador propio, y hay que resolver antes el problema de que
  `firestore.rules` exigiria una coleccion con escritura abierta — en un repo
  publico con la apiKey a la vista, eso es un boton para que cualquiera infle
  el numero de la nota que quiera. No esta en este plan.
- **Tope del plan Hobby.** El tier gratuito de Web Analytics tiene un limite
  mensual de eventos que hay que mirar en el dashboard al activarlo. Se suma al
  pendiente que ya esta en el handoff: Hobby es para uso no comercial y la
  revista no lo es.

#### Nota tecnica que evita un bug

Cualquier medicion tiene que ser **del lado del navegador**. Las paginas usan
ISR con `revalidate = 60`: el render del servidor ocurre una vez por minuto, no
una vez por lector. Un contador incrementado en el server component contaria
regeneraciones de cache, no gente. Vercel Analytics ya es client-side, asi que
esto solo importa si algun dia se hace el contador propio.

---

### Agente A — Activar la medicion y sacarnos de la cuenta
**Puede ejecutarse en paralelo con:** Agente B de esta misma ola
**Depende de:** nada

#### Objetivo
Que la revista empiece a medir de verdad, y que las visitas de la redaccion no
ensucien el numero.

#### Archivos a crear
- `components/analytics-revista.tsx` — envoltorio de `<Analytics>` con la regla de exclusion
- `app/no-contar/page.tsx` — pagina para marcar o desmarcar este navegador

#### Archivos a modificar
- `app/layout.tsx` — usar el envoltorio en lugar del `<Analytics />` pelado

#### Prompt completo para el agente

```
Proyecto: Revista No Pauta (d:/Proyectos/Revistanopauta). Next 16.1.1, React 19,
TypeScript, Tailwind v4. Este clon NO tiene node_modules: no se puede correr
build ni type-check local, el build lo hace Vercel al pushear. Escribi codigo
conservador.

SITUACION ACTUAL, VERIFICADA
- `@vercel/analytics` 1.3.1 esta en package.json.
- `app/layout.tsx` linea 80 ya monta `<Analytics />`, importado desde
  '@vercel/analytics/next'.
- Web Analytics NO esta activado en el proyecto de Vercel: la API responde
  404. O sea, hoy no se registra una sola visita.
- `AuthProvider` (contexts/AuthContext.tsx) envuelve toda la app desde el
  layout, asi que `useAuth()` funciona tambien en las paginas publicas.
  Expone { user, loading, signOut }.

OBJETIVO
Que las visitas de la redaccion no se cuenten. Vercel no da filtro por IP en el
plan gratuito, asi que se filtra en el navegador con la prop `beforeSend` de
`<Analytics>`: recibe el evento y si devolves null, no se envia.

DOS REGLAS DE EXCLUSION, las dos hacen falta:
1. Si hay sesion del panel (user != null), no se manda el evento. Cubre a la
   redaccion trabajando.
2. Si el navegador tiene la marca localStorage['nopauta:interno'] === '1', no
   se manda. Cubre a la redaccion mirando el sitio desde el telefono sin sesion.

ARCHIVOS A LEER PRIMERO:
- app/layout.tsx
- contexts/AuthContext.tsx
- components/whatsapp-button.tsx (es un client component chico; copia su estilo)

TAREA 1 — components/analytics-revista.tsx
Client component ('use client') que exporta `AnalyticsRevista`. Adentro:

  const { user } = useAuth();

  <Analytics
      beforeSend={(evento) => {
          // Los que no tienen que contar son, justamente, los que pueden
          // entrar al panel. Vercel no filtra por IP en el plan gratuito y la
          // IP de la redaccion es dinamica, asi que se filtra aca.
          if (user) return null;
          try {
              if (localStorage.getItem('nopauta:interno') === '1') return null;
          } catch {
              // Navegador con el almacenamiento bloqueado: se cuenta igual.
              // Perder una exclusion es menos grave que romper la pagina.
          }
          return evento;
      }}
  />

Importa Analytics de '@vercel/analytics/next', igual que hoy el layout.
CUIDADO: `beforeSend` corre en el navegador, pero el componente igual se
renderiza en el servidor primero — nunca leas localStorage fuera del callback.

Verifica en node_modules... no podes, no hay node_modules. Entonces: si tenes
dudas de que la version 1.3.1 acepte `beforeSend` como prop del componente,
dejalo igual y anotalo como punto a confirmar en el primer deploy. Es la API
documentada de @vercel/analytics 1.x.

TAREA 2 — app/layout.tsx
Reemplaza `import { Analytics } from '@vercel/analytics/next'` y el
`<Analytics />` de la linea 80 por el envoltorio nuevo. El componente tiene que
quedar DENTRO de <AuthProvider>, porque usa useAuth(). Verifica el orden del
JSX antes de mover nada.

TAREA 3 — app/no-contar/page.tsx
Pagina simple para marcar o desmarcar este navegador. Requisitos:

- Client component.
- Muestra el estado actual con claridad: "Este navegador NO se cuenta en las
  estadisticas" o "Este navegador SI se cuenta".
- Un boton para cambiar el estado, que escribe o borra
  localStorage['nopauta:interno'].
- Un parrafo que explique, en criollo: que la marca vale solo para ESE
  navegador y ESE dispositivo, que se pierde si se borran los datos del
  navegador, y que mientras uno tenga la sesion del panel abierta ya no se
  cuenta aunque no marque nada.
- Estilo sobrio, coherente con el resto del sitio. Usa el Header y el Footer
  como cualquier otra pagina, y las clases de Tailwind que ya se usan en
  app/institucional/[pagina]/page.tsx.
- metadata con robots: { index: false, follow: false }. Es una pagina interna:
  no tiene que aparecer en Google. Como es client component, exporta la
  metadata desde un layout.tsx hermano o usa un <meta> — resolvelo como
  corresponda en App Router, pero que quede noindex.
- NO la enlaces desde el header, el footer ni el sitemap. Se llega escribiendo
  la URL.

LO QUE NO TENES QUE HACER
- No agregues Google Analytics ni ninguna otra libreria de medicion.
- No agregues dependencias: @vercel/analytics ya esta instalado.
- No toques lib/, scripts/ ni components/admin/.
- No intentes filtrar por IP ni por user-agent: la IP de la redaccion es
  dinamica y el user-agent no distingue a nadie.
- No inventes un dashboard de estadisticas dentro del panel. Los datos viven en
  Vercel; construir una pantalla propia es otro proyecto.

CRITERIO DE EXITO
1. El sitio sigue compilando y `<AnalyticsRevista />` queda dentro de
   <AuthProvider>.
2. Con sesion del panel abierta, no se manda ningun evento.
3. Despues de visitar /no-contar y marcar, ese navegador deja de mandar eventos
   aunque no haya sesion.
4. /no-contar no aparece en el sitemap ni enlazada desde ninguna pagina, y
   lleva noindex.
5. Un navegador con localStorage bloqueado no rompe la pagina.

PASO MANUAL QUE NO PODES HACER VOS — dejalo escrito en tu resumen final:
hay que activar Web Analytics en el dashboard de Vercel
(proyecto revistanopauta > pestaña Analytics > Enable). Sin eso, todo este
codigo no mide nada.
```

---

### Agente B — Medir lectura, no solo visitas (OPCIONAL, pero es la metrica que importa)
**Puede ejecutarse en paralelo con:** Agente A de esta misma ola
**Depende de:** nada

> Para una revista de analisis, "abrio la nota" y "leyo la nota" son numeros
> muy distintos, y el segundo es el que dice si el trabajo sirvio. Son ~20
> lineas y usa el mismo `track()` de la libreria que ya esta instalada.

#### Objetivo
Registrar un evento cuando alguien llega al final de una nota, para poder
comparar cuanta gente la abrio contra cuanta la leyo de verdad.

#### Archivos a crear
- `components/revista/medidor-lectura.tsx` — dispara el evento al llegar al final

#### Archivos a modificar
- `components/revista/nota-detalle.tsx` — montar el medidor al pie de la nota

#### Prompt completo para el agente

```
Proyecto: Revista No Pauta (d:/Proyectos/Revistanopauta). Next 16.1.1, React 19,
TypeScript, Tailwind v4. Sin node_modules: no se puede compilar local.

CONTEXTO
`@vercel/analytics` 1.3.1 ya esta instalado y expone `track(nombre, datos)`
para eventos propios, ademas de las visitas automaticas.

Hoy solo se sabe cuanta gente ABRIO una nota. Para una revista que se define
por el analisis, lo que importa es cuanta gente la LEYO. La diferencia entre
esos dos numeros es la unica forma de saber si una nota larga funciono o si la
gente la abrio por el titulo y se fue.

ARCHIVOS A LEER PRIMERO:
- components/revista/nota-detalle.tsx (donde se arma la nota; fijate como
  recibe la nota y donde termina el cuerpo)
- lib/portada.ts (tiene minutosDeLectura(), que ya estima la extension)

TAREA 1 — components/revista/medidor-lectura.tsx
Client component que recibe `slug: string` y `seccion?: string`. Usa un
IntersectionObserver sobre un div invisible que se monta al final del cuerpo de
la nota. Cuando ese div entra en pantalla, manda UNA sola vez:

  track('lectura-completa', { nota: slug, seccion: seccion ?? 'sin-seccion' })

Requisitos:
- Que dispare una sola vez por montaje (useRef como guarda).
- Que desconecte el observer al desmontar.
- Que no rompa si IntersectionObserver no existe (navegador viejo): en ese caso
  simplemente no mide, no tira error.
- Que NO mida si el lector esta excluido. Reusa exactamente la misma condicion
  que el Agente A puso en components/analytics-revista.tsx: sesion del panel
  (useAuth) o localStorage['nopauta:interno'] === '1'. Si ese archivo todavia
  no existe cuando trabajas, implementa la condicion igual y dejala en una
  funcion local `noHayQueContar()` para que despues se pueda unificar.
  IMPORTANTE: no edites components/analytics-revista.tsx, lo esta escribiendo
  otro agente en paralelo.

TAREA 2 — components/revista/nota-detalle.tsx
Monta <MedidorLectura /> justo despues del cuerpo de la nota y antes de las
notas relacionadas o la firma. Ese es el punto que significa "llego al final
del texto". No lo pongas al pie de la pagina entera: contaria como lectura a
quien hizo scroll rapido hasta abajo.

LO QUE NO TENES QUE HACER
- No toques app/layout.tsx ni components/analytics-revista.tsx: otro agente
  trabaja ahi en paralelo.
- No agregues dependencias.
- No midas tiempo de permanencia ni porcentaje de scroll continuo: un evento
  binario al llegar al final es suficiente y no requiere mandar datos todo el
  tiempo.
- No guardes nada en Firestore.

CRITERIO DE EXITO
1. Abrir una nota y no bajar: no se manda el evento.
2. Bajar hasta el final del texto: se manda una sola vez.
3. Con sesion del panel o con el navegador marcado: no se manda nunca.
4. En un navegador sin IntersectionObserver, la nota se ve normal y no hay
   error en consola.

DONDE SE MIRA EL RESULTADO: en Vercel, dashboard del proyecto > Analytics >
Events, filtrando por eventName 'lectura-completa' y agrupando por la propiedad
'nota'. Dejalo anotado en tu resumen final.
```

---

## Verificacion final

Como este clon no tiene `node_modules`, no hay type-check ni build local. La
verificacion es: revision a ojo, `node --check` sobre los scripts, y el build
remoto de Vercel.

**Antes de pushear**

- [ ] `git diff --check` limpio.
- [ ] `node --check` sobre cada `.mjs` tocado en la Ola 1 — Agente B.
- [ ] Ningun import sin usar ni funcion exportada sin implementar en `lib/portada.ts`.
- [ ] `vercel.json` sigue siendo JSON valido (si se ejecuto la Ola 3 — Agente A).
- [ ] Nada de `REVALIDAR_SECRETO` ni credenciales dentro de archivos versionados.

**Despues del deploy — camino feliz**

- [ ] Cargar una nota programada para dentro de 5 minutos. No aparece en la
      portada, ni en `/noticias`, ni en su seccion.
- [ ] Su URL directa `/noticias/<slug>` da 404 mientras no salio.
- [ ] No figura en `/sitemap.xml`.
- [ ] Esperar la hora, recargar dos veces con un minuto de diferencia: aparece
      en la portada, en el listado y en su seccion.
- [ ] La fecha que muestra la nota publicada es la hora de Charata, no tres
      horas antes.

**Despues del deploy — lo que suele romperse**

- [ ] Las notas que YA estaban publicadas siguen visibles (ninguna desaparecio
      por no tener `publishedAt`).
- [ ] Editar una nota vieja y guardarla no la mueve al tope de la tapa.
- [ ] Reabrir una nota programada muestra la misma hora que se cargo, sin
      corrimiento de 3 horas en ninguna direccion.
- [ ] Pasar una programada a "Borrador" y guardar: desaparece y `publishedAt`
      queda en null.
- [ ] Poner una fecha pasada en "Programar" publica la nota al instante, con
      esa fecha retroactiva.
- [ ] `npm run notas:listar` distingue los tres estados.
- [ ] `npm run notas:bajar` de una nota programada y volver a publicarla no le
      cambia la hora.
- [ ] El tablero del panel no cuenta la programada entre las publicadas.

**Prueba del limite, para confirmarlo y no olvidarlo**

- [ ] Con una nota programada cargada, pedir la coleccion sin sesion:
      `https://firestore.googleapis.com/v1/projects/revistanopauta/databases/(default)/documents/news?key=<apiKey>`
      La nota aparece en la respuesta. Es el comportamiento esperado y
      documentado: programar ordena el calendario, no embarga.

---

### Verificacion de la Ola 4 (medicion)

**Primero, el paso que no es codigo**

- [ ] Activar Web Analytics en Vercel: proyecto `revistanopauta` > pestaña
      Analytics > Enable. **Hoy esta apagado y sin esto no se mide nada**, por
      mas codigo que se deploye.
- [ ] Anotar el tope mensual de eventos del plan Hobby que muestre el
      dashboard, y sumarlo al pendiente de plan que ya esta en el handoff.

**Que efectivamente no nos contamos**

- [ ] Abrir el sitio publico CON la sesion del panel iniciada, navegar tres
      notas. En el dashboard de Vercel no aparecen esas visitas.
- [ ] Abrir el sitio en una ventana de incognito sin sesion: esa visita SI
      aparece. (Confirma que la exclusion no apago la medicion entera, que es
      la forma silenciosa en que esto falla.)
- [ ] Visitar `/no-contar`, marcar el navegador, recargar la portada: no se
      cuenta. Desmarcar: vuelve a contarse.
- [ ] `/no-contar` no figura en `/sitemap.xml` ni esta enlazada desde ninguna
      pagina, y responde con noindex.

**Que se puede leer el resultado**

- [ ] En Vercel > Analytics, agrupando por `requestPath`, cada nota aparece con
      su propia URL. Eso es el ranking de notas mas leidas: no hay que
      construir nada mas.
- [ ] Si se ejecuto el Agente B: en Analytics > Events aparece
      `lectura-completa` con la propiedad `nota`, y el numero es menor que el
      de visitas de esa misma nota. Si fuera igual o mayor, el medidor esta mal
      ubicado y esta contando scroll rapido, no lectura.

**El error que hay que ir a buscar a proposito**

- [ ] Confirmar que `beforeSend` es una prop valida en `@vercel/analytics`
      1.3.1 con el build de Vercel. Si la version instalada no la soporta, la
      exclusion no funciona **en silencio**: se sigue midiendo todo, incluidos
      nosotros, y nada avisa. Es el unico punto del plan que no se pudo
      verificar sin `node_modules`.
