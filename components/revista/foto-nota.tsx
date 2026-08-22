import { cn } from '@/lib/utils'
import { nombreSeccion } from '@/lib/site-config'

type FotoNotaProps = {
  src?: string
  alt: string
  seccion?: string
  /** Proporcion del recuadro. 'tapa' es panoramica, 'cuadro' casi cuadrada. */
  formato?: 'tapa' | 'cuadro' | 'banda'
  className?: string
  priority?: boolean
  /** Dibuja el distintivo de play: la nota tiene video. */
  conVideo?: boolean
}

const proporciones: Record<NonNullable<FotoNotaProps['formato']>, string> = {
  tapa: 'aspect-[16/9]',
  cuadro: 'aspect-[4/3]',
  banda: 'aspect-[21/9]',
}

/**
 * Recuadro fotografico de la nota.
 *
 * Si la nota tiene video, marca el recuadro con un distintivo de play para
 * que el lector sepa antes de entrar que hay material audiovisual.
 *
 * Cuando la nota todavia no tiene imagen cargada, dibuja un placeholder
 * tramado con el nombre de la seccion en lugar de un hueco gris. Evita
 * que la tapa se vea rota mientras la redaccion sube el material.
 */
export function FotoNota({
  src,
  alt,
  seccion,
  formato = 'tapa',
  className,
  priority = false,
  conVideo = false,
}: FotoNotaProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-papel-2 border border-filete',
        proporciones[formato],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          className="foto-nota h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          {/* Trama diagonal tenue: reemplaza al bloque gris vacio. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, var(--pauta-tinta) 0 1px, transparent 1px 9px)',
            }}
          />
          <span className="relative meta px-3 text-center">
            {nombreSeccion(seccion)}
          </span>
        </div>
      )}

      {conVideo && (
        <span className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-tinta/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-current" aria-hidden="true">
            <path d="M2 1l9 5-9 5z" />
          </svg>
          Video
        </span>
      )}
    </div>
  )
}
