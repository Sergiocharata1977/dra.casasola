import Link from 'next/link'

import { esColumnaDeOpinion, fechaLarga, minutosDeLectura } from '@/lib/portada'
import { nombreSeccion, siteConfig } from '@/lib/site-config'
import type { News } from '@/lib/types'
import { CuerpoNota } from '@/components/revista/cuerpo-nota'
import { FotoNota } from '@/components/revista/foto-nota'
import { VideoNota } from '@/components/revista/video-nota'
import { NotaDestacada, TituloBloque } from '@/components/revista/nota-card'

/**
 * Pagina de nota.
 *
 * Componente de servidor: recibe la nota ya resuelta, asi que el titulo, la
 * bajada y el cuerpo viajan dentro del HTML. Es la diferencia entre que Google
 * y WhatsApp vean la nota o vean una pagina en blanco.
 */
export function NotaDetalle({
  nota,
  relacionadas,
}: {
  nota: News
  relacionadas: News[]
}) {
  const tieneVideo = Boolean(nota.videoUrl)
  const esOpinion = esColumnaDeOpinion(nota)

  return (
    <article className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6">
      {/* Rastro de navegacion */}
      <nav className="meta mb-6 flex items-center gap-2" aria-label="Ubicacion">
        <Link href="/" className="transition-colors hover:text-rojo">
          Portada
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/secciones/${nota.seccion ?? 'politica'}`}
          className="transition-colors hover:text-rojo"
        >
          {nombreSeccion(nota.seccion)}
        </Link>
      </nav>

      <div className="mx-auto max-w-[720px]">
        <header className="filete-seccion pt-4">
          <p className="volanta">{nota.volanta || (esOpinion ? 'Opinion' : nombreSeccion(nota.seccion))}</p>

          <h1
            className={`titular mt-3 text-[2.1rem] leading-[1.05] sm:text-[2.8rem] ${
              esOpinion ? 'italic' : ''
            }`}
          >
            {nota.title}
          </h1>

          {(nota.bajada || nota.summary) && (
            <p className="mt-4 font-serif text-lg leading-relaxed text-tinta-2">
              {nota.bajada || nota.summary}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y border-filete py-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-tinta">
              Por {nota.author}
            </span>
            {nota.autorCargo && <span className="meta">{nota.autorCargo}</span>}
            <span className="meta ml-auto">
              {fechaLarga(nota.publishedAt || nota.createdAt)} &middot; {minutosDeLectura(nota)} min
              de lectura
            </span>
          </div>
        </header>

        {esOpinion && (
          <p className="mt-5 border-l-2 border-rojo bg-papel-2 px-4 py-2.5 font-serif text-[13px] italic text-tinta-3">
            Columna de opinion. Las ideas expresadas son responsabilidad de quien las firma y no
            representan necesariamente la posicion de {siteConfig.nombreCompleto}.
          </p>
        )}

        {/*
          Pieza principal de la nota. Si hay video, manda el video y la foto
          queda de caratula del reproductor: repetir las dos cosas una arriba
          de la otra empuja el texto fuera de la primera pantalla.
        */}
        {tieneVideo ? (
          <figure className="mt-7">
            <VideoNota src={nota.videoUrl as string} poster={nota.imageUrl} />
            {(nota.videoEpigrafe || nota.epigrafe) && (
              <figcaption className="mt-2 border-b border-filete pb-3 font-serif text-xs italic leading-snug text-tinta-3">
                {nota.videoEpigrafe || nota.epigrafe}
              </figcaption>
            )}
          </figure>
        ) : nota.imageUrl || !esOpinion ? (
          <figure className="mt-7">
            <FotoNota
              src={nota.imageUrl}
              alt={nota.epigrafe || nota.title}
              seccion={nota.seccion}
              formato="tapa"
              priority
            />
            {(nota.epigrafe || nota.creditoFoto) && (
              <figcaption className="mt-2 border-b border-filete pb-3 font-serif text-xs italic leading-snug text-tinta-3">
                {nota.epigrafe}
                {nota.creditoFoto && (
                  <span className="not-italic"> &mdash; Foto: {nota.creditoFoto}</span>
                )}
              </figcaption>
            )}
          </figure>
        ) : null}

        {nota.content?.trim() ? (
          <CuerpoNota texto={nota.content} capitular className="mt-8" />
        ) : (
          <div className="cuerpo-nota mt-8">
            <p>{nota.summary}</p>
          </div>
        )}

        {nota.tags && nota.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-filete pt-5">
            {nota.tags.map((tag) => (
              <span
                key={tag}
                className="border border-filete px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-3"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 border border-filete bg-papel-2 p-5">
          <p className="volanta">Politica de correcciones</p>
          <p className="mt-2 font-serif text-sm leading-relaxed text-tinta-2">
            Si detectas un error en esta nota, escribinos a{' '}
            <a href={`mailto:${siteConfig.email}`} className="border-b border-rojo text-rojo">
              {siteConfig.email}
            </a>
            . Corregimos a la vista y dejamos constancia de la correccion.
          </p>
        </div>
      </div>

      {relacionadas.length > 0 && (
        <section className="mt-16">
          <TituloBloque href={`/secciones/${nota.seccion ?? 'politica'}`}>
            Seguir leyendo
          </TituloBloque>
          <div className="grid gap-8 sm:grid-cols-2">
            {relacionadas.map((n) => (
              <NotaDestacada key={n.id} nota={n} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
