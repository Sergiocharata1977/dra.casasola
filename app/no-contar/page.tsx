'use client'

import { useEffect, useState } from 'react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const CLAVE = 'nopauta:interno'

/**
 * Marca este navegador como interno para que sus visitas no se cuenten.
 *
 * No esta enlazada desde ningun lado ni entra al sitemap: se llega
 * escribiendo la URL. Ver components/analytics-revista.tsx.
 */
export default function NoContarPage() {
  // null = todavia no leimos localStorage. En el render del servidor no
  // existe, asi que hasta el useEffect no mostramos ningun estado.
  const [marcado, setMarcado] = useState<boolean | null>(null)
  const [bloqueado, setBloqueado] = useState(false)

  useEffect(() => {
    try {
      setMarcado(localStorage.getItem(CLAVE) === '1')
    } catch {
      setBloqueado(true)
      setMarcado(false)
    }
  }, [])

  const alternar = () => {
    const nuevo = !marcado
    try {
      if (nuevo) {
        localStorage.setItem(CLAVE, '1')
      } else {
        localStorage.removeItem(CLAVE)
      }
      setMarcado(nuevo)
      setBloqueado(false)
    } catch {
      // Navegador con el almacenamiento bloqueado (modo privado, cookies
      // deshabilitadas). No podemos guardar nada: lo avisamos y listo.
      setBloqueado(true)
    }
  }

  return (
    <div className="min-h-screen bg-papel">
      <Header />

      <article className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
        <header className="filete-seccion pt-4">
          <p className="volanta">Uso interno</p>
          <h1 className="titular mt-3 text-[2.1rem] leading-[1.05] sm:text-[2.6rem]">
            No contar este navegador
          </h1>
          <p className="mt-4 border-b border-filete pb-5 font-serif text-lg leading-relaxed text-tinta-2">
            Para que las visitas de la redaccion no ensucien las estadisticas
            del sitio.
          </p>
        </header>

        <div className="mt-8 rounded-lg border border-filete bg-papel-2 p-6">
          {marcado === null ? (
            <p className="font-serif text-lg text-tinta-3">Revisando este navegador...</p>
          ) : (
            <>
              <p className="font-serif text-lg leading-relaxed text-tinta">
                {marcado
                  ? 'Este navegador NO se cuenta en las estadisticas.'
                  : 'Este navegador SI se cuenta en las estadisticas.'}
              </p>

              <button
                type="button"
                onClick={alternar}
                className="mt-5 rounded-md bg-tinta px-5 py-3 font-sans text-sm font-semibold uppercase tracking-wide text-papel transition-opacity hover:opacity-80"
              >
                {marcado ? 'Volver a contar este navegador' : 'Dejar de contar este navegador'}
              </button>

              {bloqueado && (
                <p className="mt-4 font-serif text-base leading-relaxed text-tinta-2">
                  Este navegador tiene bloqueado el almacenamiento local, asi que
                  no se puede guardar la marca. Probar sin modo privado o
                  habilitando los datos de sitio.
                </p>
              )}
            </>
          )}
        </div>

        <div className="cuerpo-nota mt-7">
          <h2 className="titular mb-2 mt-8 text-xl first:mt-0">Como funciona</h2>
          <p>
            La marca se guarda en este navegador y en este aparato nada mas. Si
            se abre el sitio desde la compu de la redaccion, desde el telefono y
            desde la tablet, hay que marcar cada uno por separado. Tampoco pasa
            de un navegador a otro: marcarlo en Chrome no lo marca en Firefox.
          </p>
          <p>
            Si se borran los datos del navegador (historial, cookies, datos de
            sitios) la marca se pierde y hay que volver a esta pagina a ponerla
            de nuevo. Lo mismo si se navega en ventana privada o de incognito:
            ahi la marca no queda guardada.
          </p>
          <p>
            Mientras uno tenga abierta la sesion del panel, sus visitas ya no se
            cuentan aunque no marque nada. Esta pagina sirve justamente para el
            otro caso: mirar el sitio sin haber iniciado sesion, tipico del
            telefono.
          </p>
          <p>
            Esta pagina es interna. No esta enlazada desde el menu ni desde el
            pie, y los buscadores tienen indicado no indexarla: se llega
            escribiendo la direccion a mano.
          </p>
        </div>
      </article>

      <Footer />
    </div>
  )
}
