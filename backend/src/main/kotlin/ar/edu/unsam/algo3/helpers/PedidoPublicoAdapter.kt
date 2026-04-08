package ar.edu.unsam.algo3.helpers

import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.dto.PedidoArmadoDTO
import ar.edu.unsam.algo3.dto.PedidoModel
import org.springframework.stereotype.Component

interface PedidoPublicoAdapter {
    fun toDto(pedido: Pedido): PedidoModel
}

@Component("pedidoPublicoMapper")
class PedidoPublicoMapper : PedidoPublicoAdapter {
    override fun toDto(pedido: Pedido): PedidoModel {
        return PedidoModel(
            id = pedido.id.toString(),
            estado = pedido.estadoActual.toString(),
            nombreLocal = pedido.local.nombre,
            total = pedido.totalAPagar(),
            fecha = pedido.fechaCreacion.toString(),
            cantArticulos = pedido.platos.count(),
            imgUrl = pedido.local.imgurl
        )
    }
}