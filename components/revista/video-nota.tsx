import { cn } from '@/lib/utils'

/**
 * Reproductor de video de la nota.
 *
 * Es el <video> nativo del navegador sobre un archivo de Firebase Storage.
 * No hay libreria de por medio a proposito: un reproductor externo agregaria
 * javascript de terceros y cookies a un sitio que hoy no tiene ninguna.
 *
 * `preload="metadata"` es deliberado: pide solo la cabecera del archivo, asi
 * abrir la nota no descarga el video entero de quien no le va a dar play.
 * En Storage se paga por byte descargado.
 */
export function VideoNota({
  src,
  poster,
  className,
}: {
  src: string
  /** Caratula previa al play. Se usa la foto de la nota si la tiene. */
  poster?: string
  className?: string
}) {
  return (
    <div className={cn('overflow-hidden border border-filete bg-black', className)}>
      <video
        src={src}
        poster={poster}
        controls
        preload="metadata"
        playsInline
        className="aspect-video h-full w-full bg-black object-contain"
      >
        Tu navegador no puede reproducir este video.{' '}
        <a href={src}>Descargalo para verlo.</a>
      </video>
    </div>
  )
}
