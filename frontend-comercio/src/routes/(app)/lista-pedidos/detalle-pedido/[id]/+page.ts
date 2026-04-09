import { error, redirect } from '@sveltejs/kit'
import { pedidoService } from '../../../../../lib/components/services/Pedido-service'
import type { PageLoad } from './$types'
import { errorHandler } from '$lib/Error-handler'

export const ssr = false

export const load: PageLoad = async ({ params }) => {
  const pedidoId = params.id

  if (!pedidoId) {
    throw error(404, 'ID de pedido no encontrado en la URL')
  }
  
  try {
    const localId = localStorage.getItem('localId')
    
    if (!localId) {
      redirect(302, '/login')
    }
    
    const pedido = await pedidoService.obtenerPedidoPorId(pedidoId)
    
    if (!pedido) {
      throw error(404, `No se encontró el pedido con ID ${pedidoId}`)
    }

    return { pedido }
  } catch (e: unknown) {
    errorHandler(e)
  }
}