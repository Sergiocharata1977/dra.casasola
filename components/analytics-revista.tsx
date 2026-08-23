'use client'

import { Analytics } from '@vercel/analytics/next'

import { useAuth } from '@/contexts/AuthContext'

/**
 * Analytics de Vercel, sin contar a la redaccion.
 *
 * Vercel no permite filtrar por IP en el plan gratuito y la IP de la redaccion
 * es dinamica, asi que el filtro se hace aca, en el navegador: `beforeSend`
 * recibe cada evento antes de mandarlo y, si devolvemos null, no se manda.
 *
 * Son dos exclusiones porque cubren casos distintos:
 *  1. Sesion del panel abierta -> la redaccion trabajando en la compu.
 *  2. Marca en localStorage -> la redaccion mirando el sitio desde el telefono,
 *     sin sesion. Se pone y se saca en /no-contar.
 */
export function AnalyticsRevista() {
  const { user, loading } = useAuth()

  // Firebase resuelve la sesion en forma asincronica y <Analytics> manda la
  // visita apenas se monta. Si lo montaramos antes de saber quien es, la
  // primera visita de la redaccion se contaria igual, porque en ese instante
  // `user` todavia es null. Esperamos: al lector anonimo se le cuenta la
  // visita unos milisegundos mas tarde y no se pierde nada.
  if (loading) return null

  return (
    <Analytics
      beforeSend={(evento) => {
        // Los que no tienen que contar son, justamente, los que pueden
        // entrar al panel.
        if (user) return null

        try {
          if (localStorage.getItem('nopauta:interno') === '1') return null
        } catch {
          // Navegador con el almacenamiento bloqueado: se cuenta igual.
          // Perder una exclusion es menos grave que romper la pagina.
        }

        return evento
      }}
    />
  )
}
