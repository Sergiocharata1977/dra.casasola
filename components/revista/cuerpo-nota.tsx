import { cn } from '@/lib/utils'

/**
 * Cuerpo de la nota.
 *
 * El editor escribe en texto plano, asi que el formato se marca con dos
 * convenciones minimas, las mismas que usan las paginas institucionales:
 *
 *   ## Subtitulo        -> intertitulo dentro de la nota
 *   - item de lista     -> vinieta (tambien vale "* item")
 *
 * Cualquier otra linea es un parrafo. Antes de esto, un intertitulo escrito
 * como una linea suelta salia como un parrafo mas: el lector no distinguia
 * el titulo de la seccion del texto que venia despues.
 */

type Bloque =
  | { tipo: 'subtitulo'; texto: string }
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'lista'; items: string[] }

export function parsearCuerpo(texto: string): Bloque[] {
  const bloques: Bloque[] = []
  let parrafo: string[] = []
  let lista: string[] = []

  const cerrarParrafo = () => {
    if (parrafo.length > 0) {
      bloques.push({ tipo: 'parrafo', texto: parrafo.join(' ') })
      parrafo = []
    }
  }
  const cerrarLista = () => {
    if (lista.length > 0) {
      bloques.push({ tipo: 'lista', items: lista })
      lista = []
    }
  }

  for (const cruda of (texto || '').split('\n')) {
    const linea = cruda.trim()

    // La linea en blanco corta el parrafo, pero no la lista: en el panel las
    // vinietas se suelen escribir separadas entre si por un renglon vacio.
    if (linea === '') {
      cerrarParrafo()
      continue
    }

    if (linea.startsWith('## ')) {
      cerrarParrafo()
      cerrarLista()
      bloques.push({ tipo: 'subtitulo', texto: linea.slice(3).trim() })
      continue
    }

    if (/^[-*]\s+/.test(linea)) {
      cerrarParrafo()
      lista.push(linea.replace(/^[-*]\s+/, ''))
      continue
    }

    cerrarLista()
    parrafo.push(linea)
  }

  cerrarParrafo()
  cerrarLista()
  return bloques
}

export function CuerpoNota({
  texto,
  capitular = false,
  className,
}: {
  texto: string
  /** Letra capitular en el primer parrafo, como en la primera plana impresa. */
  capitular?: boolean
  className?: string
}) {
  const bloques = parsearCuerpo(texto)

  return (
    <div className={cn('cuerpo-nota', capitular && 'con-capitular', className)}>
      {bloques.map((bloque, i) => {
        if (bloque.tipo === 'subtitulo') {
          return (
            <h2 key={i} className="titular mb-2 mt-8 text-xl leading-tight first:mt-0">
              {bloque.texto}
            </h2>
          )
        }

        if (bloque.tipo === 'lista') {
          return (
            <ul key={i} className="my-4 grid gap-2 border-l-2 border-filete pl-5">
              {bloque.items.map((item, j) => (
                <li key={j} className="font-serif leading-relaxed text-tinta-2">
                  {item}
                </li>
              ))}
            </ul>
          )
        }

        return <p key={i}>{bloque.texto}</p>
      })}
    </div>
  )
}
