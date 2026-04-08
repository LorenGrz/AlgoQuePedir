import { redirect } from '@sveltejs/kit'
import { pedidoService } from '../../../../lib/components/services/Pedido-service'
import { errorHandler } from '$lib/Error-handler'
import { EstadoPedidoModel } from '$lib/components/models/pedido-models'
export const ssr = false

export async function load({ params, depends }) {
  depends('get:pedidos')
  try {
    const estadoParam = (params.estado.toUpperCase() as EstadoPedidoModel) ?? EstadoPedidoModel.Pendiente
    if (estadoParam == null) {
      throw redirect(307, '/lista-pedidos/pendiente')
    }

    const localId = localStorage.getItem('localId')
    if (!localId) {
      // Ruta protegida
      redirect(302, '/login')
    }
    const pedidos = await pedidoService.obtenerPedidosPorEstado(estadoParam, Number(localId))
    
    return { pedidos, estadoParam}
  } catch(e: unknown){
    errorHandler(e)
  }
}
