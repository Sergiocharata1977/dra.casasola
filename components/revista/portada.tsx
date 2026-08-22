import Link from 'next/link'

import { type Portada as PortadaData } from '@/lib/portada'
import { secciones } from '@/lib/site-config'
import {
  NotaApertura,
  NotaBreve,
  NotaDestacada,
  NotaOpinion,
  NotaTitular,
  TituloBloque,
} from '@/components/revista/nota-card'

/**
 * Tapa de la revista.
 *
 * Es un componente de servidor puro: recibe la portada ya armada y solo la
 * dibuja. Al no pedir datos desde el navegador, el HTML sale completo y las
 * notas quedan visibles para buscadores y redes sociales.
 */
export function Portada({ portada }: { portada: PortadaData }) {
  const { apertura, breves, opinion, destacadas, ultimas } = portada

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
      {/* ---- Cuerpo principal de la tapa: tres columnas ---- */}
      <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)_270px] lg:gap-10">
        {/* Columna izquierda: breves */}
        <aside className="order-2 lg:order-1">
          {breves.length > 0 && (
            <>
              <TituloBloque>Apuntes</TituloBloque>
              <div className="grid gap-4">
                {breves.map((nota) => (
                  <NotaBreve key={nota.id} nota={nota} />
                ))}
              </div>
            </>
          )}

          <div className={breves.length > 0 ? 'mt-8' : ''}>
            <TituloBloque>Secciones</TituloBloque>
            <div className="grid gap-px bg-filete">
              {secciones.map((s) => (
                <Link
                  key={s.slug}
                  href={`/secciones/${s.slug}`}
                  className="bg-papel py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-2 transition-colors hover:text-rojo"
                >
                  {s.nombre}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Columna central: la apertura */}
        <main className="order-1 lg:order-2 lg:border-l lg:border-filete lg:px-7">
          {apertura ? (
            <NotaApertura nota={apertura} />
          ) : (
            <div className="border border-filete bg-papel-2 px-5 py-8">
              <p className="volanta">Sin publicar</p>
              <p className="mt-2 font-serif text-base leading-relaxed text-tinta-2">
                Todavia no hay notas publicadas. La tapa se arma sola con la primera que salga
                desde el panel de redaccion.
              </p>
            </div>
          )}
        </main>

        {/* Columna derecha: opinion */}
        <aside className="order-3 lg:border-l lg:border-filete lg:pl-7">
          <TituloBloque href="/secciones/opinion">Voz Libre</TituloBloque>
          <div className="grid gap-4">
            {opinion.length > 0 ? (
              opinion.map((nota) => <NotaOpinion key={nota.id} nota={nota} />)
            ) : (
              <p className="font-serif text-sm text-tinta-3">
                Sin columnas publicadas esta semana.
              </p>
            )}
          </div>

          <div className="mt-8 border border-filete bg-papel-2 p-5">
            <p className="volanta">Sumate</p>
            <p className="titular mt-2 text-lg leading-tight">
              El periodismo que no se puede comprar se sostiene entre todos
            </p>
            <p className="mt-2.5 font-serif text-[13px] leading-snug text-tinta-3">
              No Pauta no publica contenido pago sin identificar. Si te sirve lo que hacemos,
              acompanalo.
            </p>
            <Link
              href="/institucional/contacto"
              className="mt-4 inline-block bg-tinta px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-rojo"
            >
              Quiero colaborar
            </Link>
          </div>
        </aside>
      </div>

      {/* ---- Bloque de destacadas con foto ---- */}
      {destacadas.length > 0 && (
        <section className="mt-20">
          <TituloBloque href="/noticias">Lecturas</TituloBloque>
          <div className="grid gap-12 sm:grid-cols-2">
            {destacadas.map((nota) => (
              <NotaDestacada key={nota.id} nota={nota} />
            ))}
          </div>
        </section>
      )}

      {/* ---- Cierre de tapa: titulares sueltos ---- */}
      {ultimas.length > 0 && (
        <section className="mt-20">
          <TituloBloque href="/noticias">Lo ultimo</TituloBloque>
          <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {ultimas.map((nota) => (
              <NotaTitular key={nota.id} nota={nota} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
