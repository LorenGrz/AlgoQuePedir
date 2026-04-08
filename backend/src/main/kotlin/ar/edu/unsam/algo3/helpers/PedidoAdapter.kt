package ar.edu.unsam.algo3.helpers

import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.MetodosDePago
import ar.edu.unsam.algo3.dto.*
import org.springframework.stereotype.Service

interface PedidoAdapter {
    fun toDto(pedido: Pedido): PedidoDTO
}

@Service
class PedidoMapper: PedidoAdapter {
    override fun toDto(pedido: Pedido): PedidoDTO = PedidoDTO(
        id = pedido.id!!,
        estado = pedido.estadoActual.toString(),
        cliente = ClientePedidoDTO(
            nombre = pedido.cliente.nombre,
            username = pedido.cliente.username,
            imgUrl = pedido.cliente.imgUrl
        ),
        direccion = DireccionDTO(
            direccion = pedido.local.direccion.calle +" "+ pedido.local.direccion.altura,
            latitud = pedido.local.direccion.ubicacion.x,
            longitud = pedido.local.direccion.ubicacion.y
        ),
        cantidadItems = pedido.platos.count(),
        pago = PagoPedidoDTO(
            total = pedido.totalAPagar(),
            metodoPago = pedido.medioDePago.toString()
        ),
    )


}