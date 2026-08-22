import Link from 'next/link'

import { cn } from '@/lib/utils'
import { nombreSeccion } from '@/lib/site-config'
import { fechaCorta, hrefNota, minutosDeLectura, resumenDe } from '@/lib/portada'
import type { News } from '@/lib/types'
import { FotoNota } from '@/components/revista/foto-nota'

/* ============================================================
   Encabezado de bloque: filete grueso + nombre del bloque.
   Es el recurso que separa cuerpos en una primera plana impresa.
   ============================================================ */

export function TituloBloque({
  children,
  href,
  className,
}: {
  children: React.ReactNode
  href?: string
  className?: string
}) {
  return (
    <div className={cn('filete-seccion mb-4 flex items-baseline justify-between pt-2', className)}>
      <h2 className="font-display text-[13px] font-black uppercase tracking-[0.16em] text-tinta">
        {children}
      </h2>
      {href && (
        <Link href={href} className="meta transition-colors hover:text-rojo">
          Ver todo
        </Link>
      )}
    </div>
  )
}

/* ============================================================
   Firma y metadatos
   ============================================================ */

function Firma({ nota, className }: { nota: News; className?: string }) {
  return (
    <p className={cn('meta', className)}>
      Por {nota.author}
      {nota.autorCargo ? ` · ${nota.autorCargo}` : ''}
      {' · '}
      {fechaCorta(nota.publishedAt || nota.createdAt)}
      {' · '}
      {minutosDeLectura(nota)} min
    </p>
  )
}

function Volanta({ nota }: { nota: News }) {
  const texto = nota.volanta || nombreSeccion(nota.seccion)
  return <p className="volanta">{texto}</p>
}

/* ============================================================
   Apertura: la nota principal de la tapa.
   ============================================================ */

export function NotaApertura({ nota }: { nota: News }) {
  return (
    <article className="grupo-nota">
      <Volanta nota={nota} />

      <h1 className="titular mt-2 text-[2rem] leading-[1.03] sm:text-[2.7rem] md:text-[3.1rem]">
        <Link href={hrefNota(nota)} className="transition-colors hover:text-rojo">
          {nota.title}
        </Link>
      </h1>

      {(nota.bajada || nota.summary) && (
        <p className="mt-4 font-serif text-lg leading-relaxed text-tinta-2 sm:text-xl">
          {nota.bajada || nota.summary}
        </p>
      )}

      <Firma nota={nota} className="mt-4 border-t border-filete pt-3" />

      <Link href={hrefNota(nota)} className="mt-5 block">
        <FotoNota
          src={nota.imageUrl}
          alt={nota.title}
          seccion={nota.seccion}
          formato="banda"
          conVideo={Boolean(nota.videoUrl)}
          priority
        />
      </Link>

      {(nota.epigrafe || nota.creditoFoto) && (
        <p className="mt-2 border-b border-filete pb-3 font-serif text-xs italic leading-snug text-tinta-3">
          {nota.epigrafe}
          {nota.creditoFoto && (
            <span className="not-italic"> &mdash; Foto: {nota.creditoFoto}</span>
          )}
        </p>
      )}

      {/* Arranque del cuerpo con capitular, como en la primera plana. */}
      <div className="cuerpo-nota con-capitular mt-5">
        <p>{resumenDe(nota, 420)}</p>
      </div>

      <Link
        href={hrefNota(nota)}
        className="mt-4 inline-block border-b-2 border-rojo pb-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-rojo transition-colors hover:border-tinta hover:text-tinta"
      >
        Seguir leyendo
      </Link>
    </article>
  )
}

/* ============================================================
   Breve: columna izquierda, sin foto.
   ============================================================ */

export function NotaBreve({ nota }: { nota: News }) {
  return (
    <article className="grupo-nota border-b border-filete pb-4 last:border-b-0 last:pb-0">
      <Volanta nota={nota} />
      <h3 className="titular mt-1.5 text-[1.05rem] leading-[1.15]">
        <Link href={hrefNota(nota)} className="transition-colors hover:text-rojo">
          {nota.title}
        </Link>
      </h3>
      <p className="lineas-3 mt-2 font-serif text-[13px] leading-snug text-tinta-3">
        {resumenDe(nota, 130)}
      </p>
    </article>
  )
}

/* ============================================================
   Destacada: bloque inferior con foto.
   ============================================================ */

export function NotaDestacada({ nota }: { nota: News }) {
  return (
    <article className="grupo-nota">
      <Link href={hrefNota(nota)} className="block">
        <FotoNota
          src={nota.imageUrl}
          alt={nota.title}
          seccion={nota.seccion}
          formato="tapa"
          conVideo={Boolean(nota.videoUrl)}
        />
      </Link>
      <div className="mt-3">
        <Volanta nota={nota} />
        <h3 className="titular mt-1.5 text-[1.35rem] leading-[1.1] sm:text-2xl">
          <Link href={hrefNota(nota)} className="transition-colors hover:text-rojo">
            {nota.title}
          </Link>
        </h3>
        <p className="lineas-3 mt-2.5 font-serif text-[15px] leading-relaxed text-tinta-2">
          {resumenDe(nota, 170)}
        </p>
        <Firma nota={nota} className="mt-3" />
      </div>
    </article>
  )
}

/* ============================================================
   Opinion: columna derecha "Voz Libre".
   ============================================================ */

export function NotaOpinion({ nota }: { nota: News }) {
  return (
    <article className="grupo-nota border-b border-filete pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-3">
        {/* Retrato del columnista. Con inicial mientras no haya foto. */}
        <span
          className="grid h-10 w-10 shrink-0 place-items-center border border-filete bg-papel-3 font-display text-base font-bold text-tinta-3"
          aria-hidden="true"
        >
          {nota.author.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta">
            {nota.author}
          </p>
          {nota.autorCargo && (
            <p className="text-[10px] uppercase tracking-[0.1em] text-tinta-3">{nota.autorCargo}</p>
          )}
        </div>
      </div>

      <h3 className="titular mt-2.5 text-[1.05rem] italic leading-[1.18]">
        <Link href={hrefNota(nota)} className="transition-colors hover:text-rojo">
          {nota.title}
        </Link>
      </h3>
      <p className="lineas-2 mt-1.5 font-serif text-[13px] leading-snug text-tinta-3">
        {resumenDe(nota, 110)}
      </p>
    </article>
  )
}

/* ============================================================
   Lista: archivo y portadas de seccion.
   ============================================================ */

export function NotaLista({ nota }: { nota: News }) {
  return (
    <article className="grupo-nota grid gap-4 border-b border-filete py-6 first:pt-0 sm:grid-cols-[200px_1fr]">
      <Link href={hrefNota(nota)} className="block">
        <FotoNota
          src={nota.imageUrl}
          alt={nota.title}
          seccion={nota.seccion}
          formato="cuadro"
          conVideo={Boolean(nota.videoUrl)}
        />
      </Link>
      <div>
        <Volanta nota={nota} />
        <h3 className="titular mt-1.5 text-xl leading-[1.12] sm:text-[1.6rem]">
          <Link href={hrefNota(nota)} className="transition-colors hover:text-rojo">
            {nota.title}
          </Link>
        </h3>
        <p className="lineas-3 mt-2 font-serif text-[15px] leading-relaxed text-tinta-2">
          {resumenDe(nota, 210)}
        </p>
        <Firma nota={nota} className="mt-3" />
      </div>
    </article>
  )
}

/* ============================================================
   Titular suelto: cierre de tapa, sin foto ni resumen.
   ============================================================ */

export function NotaTitular({ nota }: { nota: News }) {
  return (
    <article className="grupo-nota border-t border-filete pt-3">
      <Volanta nota={nota} />
      <h3 className="titular mt-1.5 text-[0.98rem] leading-[1.16]">
        <Link href={hrefNota(nota)} className="transition-colors hover:text-rojo">
          {nota.title}
        </Link>
      </h3>
    </article>
  )
}
