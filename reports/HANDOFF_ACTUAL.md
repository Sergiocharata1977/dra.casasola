# Handoff actual - Revista No Pauta

> El proyecto se llamaba `Cr. Jorge Ricardo Bade` y antes `dra.casasola`. Las
> entradas anteriores a 2026-08-17 son de esas etapas y se conservan solo como
> historia: no describen la revista.

## Linea editorial

Esta seccion no es decorativa: define como se clasifica cada nota y por que
la portada la ubica donde la ubica. Sale del editorial de apertura firmado
por la direccion, no de una redaccion generica.

**Que es No Pauta.** Una revista que analiza la realidad de Charata y del
sudoeste chaqueno desde una perspectiva independiente, sin compromisos
politicos, partidarios ni institucionales. No es un medio opositor ni
oficialista, y no es vocera de gobiernos, partidos, empresas ni sectores.

**La pregunta central.** El debate publico local suele quedar atrapado en la
grieta: una parte defiende a ciegas y la otra critica por postura. La
pregunta que ordena la cobertura es otra: que es lo que realmente le conviene
a Charata y a sus ciudadanos.

**El criterio unico.** Se evalua la medida, no quien la firmo. Una buena
decision publica se reconoce aunque venga de un adversario; una mala se
senala aunque venga de alguien cercano.

**Metodo.** Antes de opinar, observar; antes de concluir, buscar datos.
Cuando hay cifras se muestran; cuando hay dudas se reconocen; cuando lo que
se publica es una opinion, se presenta como tal.

**Registro.** Los temas complejos no se dejan a los especialistas. Presupuesto,
obra publica, salud, infraestructura y produccion se explican en lenguaje
llano, con el objetivo declarado de que el lector pueda leer informacion
publica por su cuenta.

**Territorio.** Charata es el centro de observacion. La cobertura se extiende
progresivamente a Las Brenas, Corzuela, General Pinedo, Hermoso Campo, Villa
Angela y Saenz Pena, con los que hay vinculos productivos y sociales.

**Alcance.** No solo politica. Tambien quienes producen y construyen:
comerciantes, productores, docentes, emprendedores, deportistas y gestores
culturales.

**El nombre.** No Pauta es la revista que no recibe pauta oficial. El nombre
es la promesa: agenda no condicionada.

### Como se traduce en el sistema

Esto no queda en el papel; el codigo lo aplica:

- **`editorial` y `opinion` son secciones distintas y no son intercambiables.**
  En `editorial` habla la revista: la nota puede abrir la tapa y no lleva
  descargo. En `opinion` habla un columnista: la nota va a la columna lateral
  "Voz Libre" y lleva el aviso de que las ideas son de quien las firma. La
  distincion vive en `esColumnaDeOpinion()` en `lib/portada.ts`.
- **Un editorial cargado como opinion desaparece de la tapa.** Le paso a la
  primera nota publicada. Ver la entrada del 2026-08-22.
- **No hay contenido de relleno.** Si la revista no publico, la portada dice
  que no publico. Se elimino `lib/demo-content.ts`, que armaba una tapa falsa
  con notas inventadas cuando Firestore volvia vacio.
- **Las paginas institucionales todavia no reflejan esto.** El texto de
  `/institucional/linea-editorial`, `/institucional/quienes-somos` y
  `/institucional/staff` lo redacto la IA como punto de partida y sigue siendo
  generico. Queda pendiente reemplazarlo por el criterio real de la direccion,
  que ahora esta escrito arriba.

## Actualizacion 2026-08-22 - Se corrige la primera nota, se saca el relleno y entra el video

### Por que la nota escrita "no salia"

Salia, pero en el peor lugar posible. La nota estaba publicada y visible en el
HTML de produccion; lo que fallaba era donde la ubicaba la portada.

La causa: se cargo con `seccion: opinion`. `esColumnaDeOpinion()` trata como
columna firmada a todo lo que este en esa seccion, asi que la nota se fue a la
columna lateral "Voz Libre" en letra chica. Como era la unica nota publicada,
no quedaba ninguna nota informativa para la apertura y la columna central de la
tapa mostraba, literalmente, "Todavia no hay notas publicadas" al lado de la
nota que si estaba publicada.

Se corrigio en dos frentes:

- **En el modelo.** Se creo la seccion `editorial`, distinta de `opinion`. Es
  la diferencia entre la revista hablando y un columnista hablando: un editorial
  puede abrir la tapa y no lleva el descargo de responsabilidad personal.
- **En el armado de la tapa.** `armarPortada()` ya no deja la apertura vacia
  cuando lo unico publicado son columnas: antes de mostrar el hueco, abre con
  la columna mejor rankeada. El estado vacio quedo solo para cuando de verdad
  no hay nada.

### Contenido de muestra eliminado

Se borro `lib/demo-content.ts` y todo el camino que lo usaba (`armarPortada`,
`notasParaListado`, `getNota`, los avisos `esDemo` de la portada y del listado).

Eran doce notas inventadas, con firma "Redaccion No Pauta" y titulares
verosimiles sobre fallos de la Corte, crisis de gabinete e inflacion, que se
mostraban cada vez que Firestore devolvia cero notas publicadas. Llevaban un
cartel de "portada de demostracion", pero el cartel se veia solo en la tapa: en
`/noticias` y en cada seccion las notas falsas aparecian mezcladas como si
fueran material publicado, y cada una tenia URL propia y compartible. Para un
medio cuya premisa es que se puede verificar lo que publica, era una bomba de
tiempo. Ahora, sin notas, la revista dice que no publico.

### Videos propios

Se puede subir video a la nota, alojado en el propio sitio.

- `videoUrl` y `videoEpigrafe` en `lib/types.ts`.
- `components/ui/video-upload.tsx`: subida con barra de avance
  (`uploadBytesResumable`, porque un MP4 tarda y sin progreso parece colgado).
  Tope 100 MB, con recomendacion de quedarse debajo de 50 MB.
- `components/revista/video-nota.tsx`: `<video>` nativo, sin libreria de
  terceros ni cookies ajenas. `preload="metadata"` a proposito: abrir la nota
  no descarga el video de quien no le va a dar play, y en Storage se paga por
  byte descargado.
- Si la nota tiene video, el video es la pieza principal y la foto pasa a ser
  la caratula del reproductor. En la tapa y en los listados, la foto lleva un
  distintivo "Video".
- `storage.rules`: carpeta `news-video/`, lectura publica, escritura con sesion,
  solo `video/*` y hasta 100 MB. **Hay que desplegar las reglas** (ver abajo).
- Se agrega `VideoObject` a los datos estructurados de la nota, para que el
  video aparezca en la busqueda de Google.

**Nota de costo, para tenerla escrita:** Firebase Storage cobra almacenamiento
y transferencia. Un video de 80 MB visto mil veces son 80 GB de trafico. Para
material largo conviene un canal propio de YouTube y enlazarlo; la subida
directa esta pensada para piezas cortas y editadas.

### Cuerpo de nota con jerarquia

Antes el cuerpo se partia por lineas en blanco y todo salia como parrafo, asi
que los intertitulos de la nota editorial se leian como texto corrido. Ahora
`components/revista/cuerpo-nota.tsx` entiende dos marcas, las mismas que ya
usaban las paginas institucionales:

- `## Subtitulo` para intertitulo
- `- item` para vinieta

### Publicar notas sin build ni deploy

Este proyecto vive en un disco externo sin `node_modules`, asi que no se puede
compilar ni levantar el dev server. Para que eso no impida publicar, las notas
se cargan desde archivos con scripts que no tienen una sola dependencia: solo
`node` y `fetch`.

```
npm run nota -- contenido/notas/mi-nota.md   publica o actualiza una nota
npm run notas:publicar                       publica todos los .md de la carpeta
npm run notas:ensayo                         muestra que haria, sin escribir
npm run notas:listar                         que hay cargado y donde cae en la tapa
npm run notas:bajar                          trae lo que se cargo desde el panel web
```

Una nota es un `.md` con cabecera de metadatos y cuerpo. Ver
`contenido/notas/README.md` y `contenido/notas/_PLANTILLA.md`.

Decisiones que conviene conocer antes de tocar esto:

- **Se busca por `slug`, no por id.** Si existe una nota con ese slug se
  actualiza; si no, se crea. Correr el comando dos veces no duplica, y el
  archivo del disco queda siendo la version buena.
- **Cambiar el titulo cambia la direccion web.** El slug se deriva del titulo
  cuando no se fija a mano. Si una nota ya salio, conviene fijar `slug:` para
  no romper enlaces ya compartidos.
- **La fecha de publicacion no se pisa.** Se fija la primera vez que la nota
  sale; una correccion posterior no la vuelve a poner arriba de todo.
- **Se valida todo el lote antes de escribir el primer documento.** Si el
  tercer archivo tiene la seccion mal, no queda medio lote publicado.
- **Los opcionales viajan como `null` cuando estan vacios.** `updateDoc` y el
  PATCH de Firestore hacen merge: si el campo no viaja, el valor viejo queda.
  Es el mismo bug que tenia el formulario del panel al sacar una foto.
- **La sesion se guarda como refresh token en `.nopauta-sesion.json`**, no
  como la clave. Es revocable desde Firebase Console (Authentication > el
  usuario > cerrar sesiones) y esta en `.gitignore`. El repositorio es
  publico: si ese archivo se sube, cualquiera puede escribir en la revista.
- **No hace falta redeployar.** Las paginas usan ISR con `revalidate = 60`,
  asi que la nota aparece sola dentro del minuto.
- `scripts/lib/config.mjs` repite a mano el projectId, la apiKey y la lista de
  secciones desde `lib/firebase-config.ts` y `lib/site-config.ts`, porque esos
  son TypeScript y estos scripts corren sin compilar. Si cambia el proyecto de
  Firebase o se agrega una seccion, hay que tocar los dos lugares.

Automatizacion mas alla de esto (publicar al hacer push con una GitHub Action,
o notas programadas con cron) quedo descartada por ahora: la Action obliga a
guardar credenciales del panel como secret de un repositorio publico, y el
cron necesita salir del plan Hobby de Vercel. Se reevalua cuando haya mas de
una persona cargando contenido.

### Bug arreglado de paso

En el formulario de notas, sacar la foto de una nota ya guardada no tenia
efecto: los campos opcionales solo se enviaban cuando tenian valor, y
`updateDoc` hace merge, asi que Firestore conservaba el valor viejo. Ahora al
editar se escribe `null` explicito.

### Pendiente inmediato

1. **Publicar el editorial ya corregido.** El codigo soporta la seccion
   `editorial`, pero el documento en Firestore sigue cargado como `opinion`.
   La correccion esta escrita en `contenido/notas/editorial-presentacion.md`:

   ```
   npm run nota -- contenido/notas/editorial-presentacion.md
   ```

   Pide una vez el mail y la clave de un usuario del panel. Deja la nota en
   `seccion: editorial`, `jerarquia: apertura`, con los intertitulos y las
   vinietas marcados y la firma con tilde. El texto del autor no se toca: el
   cuerpo se genero validando que, sacando las marcas de formato, fuera
   identico al original.

2. **Desplegar las reglas de Storage**, o la subida de video va a fallar con
   permiso denegado:

   ```
   firebase deploy --only storage --project revistanopauta
   ```

### Observacion sobre el texto de la nota

Una sola, y queda a criterio de la direccion: "Nuestra metodologia sera simple
pero en extincion". Se entiende (el metodo es simple y esta desapareciendo),
pero el "pero" contrapone dos cosas que no se oponen entre si. No se cambio
nada: es prosa del autor, no un error de datos. El resto del texto esta bien
escrito y sin errores de acentuacion ni de nombres propios.

## Actualizacion 2026-08-17 - Firebase propio y arreglo de la conexion

Estado: la revista quedo apuntando a su propio proyecto Firebase
`revistanopauta`. Antes usaba `dra-casasola-web`, heredado.

Que se encontro al controlar la migracion:

- **La apiKey estaba mal transcrita.** Se habia copiado una `B` como `8`
  (`...S7B8EJq...` en vez de `...S7BBEJq...`). Google respondia
  `API_KEY_INVALID` a todo lo que pasa por el SDK cliente: login, alta de
  usuarios y subida de fotos. Corregido en `lib/firebase-config.ts`, verificado
  contra `firebase apps:sdkconfig WEB --project revistanopauta`.

- **Habia dos configuraciones de Firebase conviviendo.** `lib/firebase-config.ts`
  apuntaba a `revistanopauta` y `lib/firebase/config.ts` tenia otra copia
  hardcodeada a `dra-casasola-web`, sin leer variables de entorno, por eso la
  migracion no la alcanzo. Las dos llamaban a `initializeApp` protegido por
  `getApps().length === 0`: ganaba la que cargara primero y la otra se colgaba
  en silencio del proyecto ajeno. El resultado era que la portada leia las notas
  de `revistanopauta` mientras login, `/setup` y `AuthContext` autenticaban
  contra `dra-casasola-web`. Ahora `lib/firebase/config.ts` reexporta
  `lib/firebase.ts`, que es la unica fuente de verdad.

- **El proyecto de Vercel no estaba conectado al repo.** Todos los deploys
  previos fueron manuales con la CLI; `commit + push` no disparaba nada. Se
  conecto con `vercel git connect` a `Sergiocharata1977/revistanopauta`, asi que
  ahora cada push a `main` deploya solo. Ojo: `Redeploy` en la UI reconstruye el
  mismo commit, no trae los nuevos.

Lo que quedo verificado funcionando:

- Reglas de Firestore desplegadas: `news` lee publico (200), `users` y `tasks`
  bloqueados (403).
- Reglas de Storage desplegadas: `news/` accesible, resto cerrado.
- App web registrada en Firebase con `appId`, `messagingSenderId`, bucket y
  `authDomain` correctos.
- Sitio en produccion HTTP 200, renderizando server-side.
- El proyecto Vercel no tiene variables de entorno cargadas. Funciona con los
  valores por defecto de `lib/firebase-config.ts`, que no son secretos.

Cerrado en la misma sesion:

- **Primeros administradores creados.** Se dieron de alta dos usuarios desde
  `/setup`, ya con los arreglos en produccion, asi que quedaron en el proyecto
  correcto. Con eso nacio la coleccion `users`. Nota para el futuro: se llama
  `users` en ingles, no `usuarios`, y Firestore no guarda colecciones vacias, se
  crean solas con el primer documento. Lo mismo va a pasar con `news` al
  publicar la primera nota.

- **`/setup` cerrado.** Creaba una cuenta con `role: admin` sin pedir ninguna
  credencial previa, y estaba publicada en internet: cualquiera que adivinara la
  URL se hacia administrador de la revista. Ahora responde 404 salvo que
  `SETUP_HABILITADO` valga `1` en las variables de entorno de Vercel. Se cerro en
  vez de borrarse porque al estrenar un proyecto Firebase no hay otra forma de
  crear el primer usuario; la secuencia sana es habilitar, crear y volver a
  deshabilitar. La variable no lleva prefijo `NEXT_PUBLIC` a proposito, asi vive
  solo en el servidor. Las altas siguientes van por `/admin/users`, que exige
  sesion.

- **Material partidario eliminado.** El repo arrastraba la identidad de un
  sitio de La Libertad Avanza anterior. Lo mas grave: `public/Logos-lla/` se
  estaba sirviendo, los logos de campana respondian 200 en el dominio de la
  revista, y el repositorio es publico en GitHub. Para un medio que va a
  investigar la pauta oficial, eso era un pasivo de credibilidad. Se borraron
  las dos copias de `Logos-lla/`, `milei-sudoeste-chaco.zip`, los componentes
  huerfanos `join.tsx`, `contact.tsx` y `news.tsx`, la imagen
  `jovenes-reunion-politica-argentina.jpg` y los dos scripts que apuntaban al
  proyecto `lla-landding`. Verificado en produccion: todas esas rutas dan 404 y
  portada, `/noticias`, `/login` y `/admin` siguen en 200.

- **`firestore.rules` endurecido.** Cualquier usuario autenticado podia leer y
  escribir el perfil de cualquier otro, incluido cambiarse el rol a admin.
  Ahora cada uno ve y edita el suyo, el rol lo toca solo un admin, y el listado
  de la coleccion queda reservado al admin. `get` y `list` estan separados a
  proposito: Firestore no puede verificar una condicion por documento sobre una
  consulta de coleccion y rechazaria el listado entero. Reglas desplegadas y
  verificadas: `news` y `events` publicas en 200, `users` en 403 sin sesion.

## Pendientes de esta etapa

- **Cerrar el alta publica en Firebase Authentication.** Es el pendiente de
  seguridad que queda abierto. La `apiKey` es publica por diseno, asi que
  cerrar `/setup` no alcanza: todavia se puede crear una cuenta llamando
  directamente a la API REST de Identity Toolkit, y con una cuenta se puede
  crear el propio perfil. Se cierra en Firebase Console, en Authentication >
  Settings > User actions, deshabilitando la creacion de cuentas. Ojo con el
  orden: con el alta deshabilitada, `/setup` deja de funcionar aunque se ponga
  `SETUP_HABILITADO=1`, asi que para bootstrapear hay que reabrir las dos cosas.

- **Componentes huerfanos de etapas anteriores.** Quedan sin importar:
  `about`, `agenda`, `call-to-action`, `commitment`, `contacto-form`,
  `eventos-resumen`, `hero`, `noticias-resumen`, `servicios`, `sobre-mi`,
  `three-columns` y `theme-provider`. Con ellos quedan imagenes sueltas en
  `public/`, entre otras `dra-casasola-profile.png`, que es la foto de una
  persona real de un proyecto ajeno. No se borraron en el mismo commit porque
  este clon no tiene `node_modules` y no se puede type-checkear antes de tocar
  doce archivos. Conviene hacerlo aparte y mirando el build de Vercel.

- **Plan de Vercel.** La cuenta es Hobby y arrastra un aviso de direccion de
  facturacion incompleta. Hobby es para uso no comercial y limita la frecuencia
  de cron, asi que conviene resolverlo antes de montar la automatizacion de
  recoleccion diaria.

## Actualizacion 2026-07-15 - Correccion sistema de usuarios

- Diagnostico: `/admin/users` no funcionaba como sistema real de acceso. Creaba/mostraba documentos en `users`, pero no creaba credenciales en Firebase Auth; ademas las reglas Firestore impedían listar/crear perfiles de otros usuarios si estaban desplegadas.
- `app/admin/users/page.tsx`: se agrego campo de contrasena inicial, errores visibles y sincronizacion automatica del perfil del admin logueado.
- `lib/services.ts`: `UsersService.create` ahora crea primero la cuenta en Firebase Authentication via Identity Toolkit REST y luego guarda el perfil en `users/{uid}`.
- `app/setup/page.tsx`: el alta inicial ahora tambien crea el perfil Firestore del administrador y actualiza el placeholder al dominio del contador.
- `firestore.rules`: se habilito gestion de perfiles `users` para usuarios autenticados del panel. Reglas desplegadas con `firebase deploy --only firestore:rules --project dra-casasola-web` OK.
- Validacion: `git diff --check` OK, solo warnings CRLF. Deploy Vercel produccion OK, build remoto compilo y aliaso `https://cr-jorge-bade.vercel.app`.

## Actualizacion 2026-07-15 - Boton login en header publico

- Se agrego acceso visible `Login` en `components/header.tsx`, apuntando a `/login`.
- En desktop aparece como boton secundario junto a `Solicitar Consulta`; en mobile aparece dentro del menu desplegable.
- Validacion liviana: `git diff --check` OK. Deploy manual requerido en Vercel porque el auto deploy no siempre toma los pushes en este proyecto.

## Actualizacion 2026-07-15 - Sistema de logo recuperado

- Se incorporo un componente reutilizable `components/brand-logo.tsx` para centralizar la marca del estudio.
- El logo combina isotipo `JB`, nombre completo `Cr. Jorge Ricardo Bade` y descriptor `Estudio contable`, con variantes compacta e inversa.
- Se reemplazaron textos/identidad suelta en `components/header.tsx`, `components/footer.tsx`, `app/login/page.tsx` y `app/admin/layout.tsx`.
- Se actualizo `public/icon.svg` y la metadata de `app/layout.tsx` para que el favicon use la nueva marca SVG en lugar del icono generico previo.
- Validacion liviana: `git diff --check` OK, solo warnings CRLF. No se corrio build/type-check porque el clon en D no tiene `node_modules` y el handoff indica no instalar dependencias ni correr Node pesado salvo pedido explicito.

## Actualizacion 2026-07-11 - Diseno Stitch aplicado

- Se aplico el rediseño visual estilo Stitch indicado por el usuario sobre la home publica.
- Identidad visual: azul marino profundo, fondos blancos/grises claros y acentos verde esmeralda.
- `components/header.tsx`: header compacto similar al mockup, navegacion corta y CTA `Solicitar Consulta`.
- `app/page.tsx`: hero modernizado con escena financiera visual, bloque de informacion ordenada, secciones de servicios en cards, empresas/emprendedores, personas, FAQ tipo acordeon y contacto.
- `app/page.tsx`: se agrego mapa embebido de Google Maps para `Chacabuco 56, Charata, Chaco, Argentina`.
- `components/footer.tsx`: footer oscuro reorganizado con marca, secciones y legal.
- Control simple: `git diff --check` OK; `rg` sin marcas viejas visibles en `app`/`components` principales. No se corrio build/type-check local por regla de no instalar dependencias en disco D.
- Deploy manual posterior con Vercel CLI porque el deploy automatico no habia tomado el commit `be39e08`. Produccion actual: `https://cr-jorge-bade.vercel.app`, deployment `dpl_FqFGJcyERNUXT7mdX9uUneAdmrPu`, status Ready. Verificacion HTTP 200 con texto `tomar mejores decisiones`.

## Actualizacion 2026-07-11 - Web contable y nuevo proyecto Vercel

- Se adapto la web publica desde la identidad historica `dra.casasola` hacia `Cr. Jorge Ricardo Bade - Contador Publico`.
- Home reemplazada por landing contable blanca/minimalista con menu: Inicio, El Estudio, Servicios, Empresas y Emprendedores, Personas, Preguntas Frecuentes y Contacto.
- Contenido principal incorporado: hero, presentacion del estudio, asesoramiento impositivo, contabilidad/estados contables, sueldos/gestion laboral, segmentos atendidos, FAQ y CTA de consulta.
- Rutas publicas heredadas `/noticias`, `/noticias/[id]`, `/eventos` y `/eventos/[id]` redirigen a secciones de la nueva landing para no exponer contenido juridico viejo.
- Branding actualizado en metadata, header, footer, WhatsApp, login, sidebar admin y organizador por defecto de eventos.
- Vercel anterior eliminado por el usuario. Se creo proyecto Vercel nuevo: `cr-jorge-bade` en scope `sergiocharata1977s-projects`.
- Link local creado con Vercel CLI: `.vercel/project.json` apunta a `projectName: cr-jorge-bade`, `projectId: prj_gDhzosYvOuUk6f1odWWiQg8z9ZTI`, `orgId: team_1Qiu4kWoC2qA9SP4mKibkWAB`. `.vercel` esta ignorado por Git.
- Deploy produccion OK con Vercel CLI: `https://cr-jorge-bade.vercel.app` (`dpl_553Z4pAXcuZG9QToR9JM9dFYSJEC`, status Ready).
- Verificacion HTTP: `Invoke-WebRequest` devolvio 200 y el HTML contiene `Cr. Jorge Ricardo` + `Soluciones contables`.
- Validacion local liviana: `git diff --check` OK. No se instalo Node ni se corrio build/type-check local porque este clon en D no tiene `node_modules`; el build remoto de Vercel compilo correctamente.
- Nota logs: `vercel logs` en CLI 50.23.2 quedo en modo streaming y el intento con filtros fue rechazado por la CLI; no se detectaron errores en `vercel inspect`.

## Actualizacion 2026-07-11 - Renombre local desde Dra Casasola

- Proyecto local ubicado como carpeta hermana de Transparencia Chaco: `D:\Proyectos\Cr. Jorge Ricardo Bade`.
- Repo origen: `https://github.com/Sergiocharata1977/dra.casasola`.
- Nota de identidad: aunque el repo remoto conserva el nombre `dra.casasola`, el proyecto local queda identificado como `Cr. Jorge Ricardo Bade` por pedido del usuario.
- Workspace esperado junto a: `D:\Proyectos\transparencia-chaco-website`, `D:\Proyectos\platform-empresa` y `D:\Proyectos\finazas-landing`.
- Rama observada: `main`, sincronizada con `origin/main`.
- Ultimo commit observado: `847c6f1 Add correct address, phone and Google Maps - Address: Chacabuco 56, Charata, Chaco - Phone: +54 3731 532578 - Google Maps embed in contact section`.
- Se agrego `D:/Proyectos/Cr. Jorge Ricardo Bade` como `safe.directory` por la regla operativa del disco D.
- No se instalaron dependencias ni se corrio Node, dev server, build o type-check; solo validacion liviana con `git status` y `git log -1`.

## Contexto del proyecto

- Aplicacion Next.js con Firebase y UI React.
- El nombre operativo local ya no debe documentarse como Dra Casasola salvo para referenciar el repo remoto historico.
- No existe `CLAUDE.md` al momento de crear este handoff.

## Pendientes / Riesgos

- Revisar textos, marcas visibles y metadata si se necesita completar el cambio funcional de identidad desde Dra Casasola hacia Cr. Jorge Ricardo Bade.
- Mantener la excepcion operativa local en disco D: no instalar dependencias ni correr comandos Node pesados en esta maquina salvo pedido explicito.
