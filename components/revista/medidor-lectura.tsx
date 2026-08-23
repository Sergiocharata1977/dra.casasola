'use client'

import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'

import { useAuth } from '@/contexts/AuthContext'

/**
 * Medidor de lectura.
 *
 * Hoy solo sabemos cuanta gente ABRIO una nota. Este componente agrega el otro
 * numero: cuanta gente llego al final del texto. La diferencia entre los dos es
 * la unica forma de saber si una nota larga funciono o si la abrieron por el
 * titulo y se fueron.
 *
 * Un div sin alto se monta al final del cuerpo. Cuando entra en pantalla se
 * manda un unico evento y el observador se apaga: alcanza con un dato binario,
 * no hace falta reportar el scroll todo el tiempo.
 */
export function MedidorLectura({ slug, seccion }: { slug: string; seccion?: string }) {
  const sentinela = useRef<HTMLDivElement | null>(null)
  const yaMedido = useRef(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    // Mientras no se sepa si hay sesion del panel, no medir: si midieramos
    // ahora podriamos anotar como lector a alguien de la redaccion.
    if (loading === true) return
    if (yaMedido.current) return
    if (noHayQueContar(user)) return

    const nodo = sentinela.current
    if (!nodo) return

    // Navegador viejo sin IntersectionObserver: no se mide y no se rompe nada.
    if (typeof IntersectionObserver === 'undefined') return

    const observador = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue
        if (yaMedido.current) return
        yaMedido.current = true
        observador.disconnect()
        track('lectura-completa', {
          nota: slug,
          seccion: seccion ?? 'sin-seccion',
        })
        return
      }
    })

    observador.observe(nodo)
    return () => observador.disconnect()
  }, [slug, seccion, user, loading])

  return <div ref={sentinela} aria-hidden="true" className="h-0 w-full" />
}

/**
 * No hay que medir al equipo. Misma condicion que se aplica a las visitas:
 * sesion del panel abierta, o navegador marcado a mano como interno.
 *
 * Si el almacenamiento esta bloqueado se cuenta igual: perder una exclusion es
 * menos grave que romper la pagina.
 */
function noHayQueContar(user: unknown): boolean {
  if (user) return true
  try {
    return window.localStorage.getItem('nopauta:interno') === '1'
  } catch {
    return false
  }
}
