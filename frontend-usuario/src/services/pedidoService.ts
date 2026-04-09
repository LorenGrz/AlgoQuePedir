import type { PedidoModel, DetallePedido, Estado, PedidoNuevo } from '../models/pedidoModel'
import { API_URL } from '../env'
import axios from 'axios'
import { Pedido } from '../classes/Pedido'

export class PedidoService {
  async obtenerPedidosPorEstado(usuarioId: number, estadoActivo: Estado): Promise<Pedido[]> {
    const response = await axios.get<PedidoModel[]>(
      API_URL + '/pedidosPublic/estado/' + estadoActivo + '/' + usuarioId
    )
    // Mapeamos cada DTO del array usando método estático
    return response.data.map((dto) => Pedido.fromPedidoModel(dto))
  }

  async cancelarPedido(id: number) {
    const response = await axios.patch(API_URL + '/pedidos/' + id + '/CANCELADO')
    return response
  }

  async obtenerPedidoPorId(idParam: string): Promise<Pedido> {
    const response = await axios.get<DetallePedido>(API_URL + '/pedidosPublic/' + idParam)
    return Pedido.fromDetallePedido(response.data)
  }

  async guardarPedido(pedido: Pedido) {
    const pedidoNuevo = Pedido.toPedidoNuevo(pedido)
    const response = await axios.post<PedidoNuevo>(
      API_URL + '/pedidosPublic/nuevoPedido',
      pedidoNuevo
    )
    return response
  }
}

export const pedidoService: PedidoService = new PedidoService()
