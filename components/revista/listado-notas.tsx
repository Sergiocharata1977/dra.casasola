'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

import { secciones } from '@/lib/site-config'
import type { News } from '@/lib/types'
import { NotaLista } from '@/components/revista/nota-card'

type ListadoNotasProps = {
  /** Notas ya resueltas en el servidor. Llegan renderizadas en el HTML. */
  notas: News[]
  /** Si se pasa, solo muestra notas de esa seccion. */
  seccion?: string
  /** Muestra el buscador de texto sobre el listado. */
  conBuscador?: boolean
  /** Muestra la barra de filtros por seccion. */
  conFiltros?: boolean
}

const POR_PAGINA = 10

/**
 * Listado de notas.
 *
 * Sigue siendo un componente cliente porque el buscador y el boton de
 * "cargar mas" necesitan estado, pero ya no pide datos: los recibe del
 * servidor. Por eso la primera tanda de notas viaja dentro del HTML.
 */
export function ListadoNotas({
  notas,
  seccion,
  conBuscador = false,
  conFiltros = false,
}: ListadoNotasProps) {
  const [busqueda, setBusqueda] = useState('')
  const [visibles, setVisibles] = useState(POR_PAGINA)

  // Al cambiar el filtro, volver a la primera tanda.
  useEffect(() => {
    setVisibles(POR_PAGINA)
  }, [busqueda, seccion])

  const filtradas = useMemo(() => {
    let lista = seccion ? notas.filter((n) => n.seccion === seccion) : notas

    const q = busqueda.trim().toLowerCase()
    if (q) {
      lista = lista.filter((n) =>
        [n.title, n.summary, n.bajada, n.volanta, n.author, n.content]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    }
    return lista
  }, [notas, seccion, busqueda])

  return (
    <div>
      {conBuscador && (
        <div id="buscar" className="mb-6 flex items-center gap-2 border border-filete px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-tinta-3" aria-hidden="true" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en el archivo de Pauta"
            aria-label="Buscar notas"
            className="w-full bg-transparent font-serif text-[15px] text-tinta outline-none placeholder:text-tinta-3"
          />
        </div>
      )}

      {conFiltros && (
        <div className="mb-8 flex flex-wrap gap-px border-y border-filete bg-filete">
          <Link
            href="/noticias"
            className="bg-papel px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-tinta transition-colors hover:text-rojo"
          >
            Todas
          </Link>
          {secciones.map((s) => (
            <Link
              key={s.slug}
              href={`/secciones/${s.slug}`}
              className="bg-papel px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-tinta-2 transition-colors hover:text-rojo"
            >
              {s.nombre}
            </Link>
          ))}
        </div>
      )}

      {filtradas.length === 0 ? (
        <p className="border-y border-filete py-12 text-center font-serif text-tinta-3">
          {busqueda
            ? `No hay notas que coincidan con "${busqueda}".`
            : 'Todavia no hay notas publicadas en esta seccion.'}
        </p>
      ) : (
        <>
          <div>
            {filtradas.slice(0, visibles).map((nota) => (
              <NotaLista key={nota.id} nota={nota} />
            ))}
          </div>

          {visibles < filtradas.length && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibles((v) => v + POR_PAGINA)}
                className="border border-tinta px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-tinta transition-colors hover:bg-tinta hover:text-white"
              >
                Cargar mas notas
              </button>
              <p className="meta mt-3">
                {Math.min(visibles, filtradas.length)} de {filtradas.length}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
