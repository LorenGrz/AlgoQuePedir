package ar.edu.unsam.algo3.service
import ar.edu.unsam.algo3.Delivery
import ar.edu.unsam.algo3.DeliveryComun
import ar.edu.unsam.algo3.EstadosDePedido
import ar.edu.unsam.algo3.MetodosDePago
import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.dto.PedidoArmadoDTO
import ar.edu.unsam.algo3.exceptions.BusinessException
import ar.edu.unsam.algo3.repository.LocalRepository
import ar.edu.unsam.algo3.repository.MenuRepository
import ar.edu.unsam.algo3.repository.PedidoRepository
import ar.edu.unsam.algo3.repository.UsuarioRepository
import org.springframework.stereotype.Service
import org.uqbar.geodds.Point
import org.uqbar.geodds.Polygon

@Service
class PedidoService(val platoRepository: MenuRepository,val pedidoRepository: PedidoRepository, val usuarioRepository: UsuarioRepository, val localRepository: LocalRepository) {
    fun agregarPedido(dto: PedidoArmadoDTO) {
        val cliente = usuarioRepository.getById(dto.idCliente)
        val local = localRepository.getById(dto.idLocal)
        val pedido = Pedido(cliente, local)
        pedido.cambiarMedioDePago(mapFormaPago(dto.formaPago))
        dto.items.forEach { itemDto ->
            val plato = platoRepository.getById(itemDto.plato.id.toInt())
            // Si la cantidad es 3, agrega el plato 3 veces
            repeat(itemDto.cantidad) {
                pedido.agregarPlato(plato)
            }
        }
        val deliveryMaria = Delivery(
            nombre = "María López",
            username = "maria.l",
            password = "maria123",
            zonaDeTrabajo = Polygon(listOf(Point(-10.0, -10.0), Point(10.0, -10.0), Point(10.0, 10.0), Point(-10.0, 10.0))),
            criterio = DeliveryComun(),
            id = 2,
        )
        pedido.delivery = deliveryMaria
        pedidoRepository.create(pedido)
    }
    private fun mapFormaPago(formaPagoStr: String): MetodosDePago {
        return when (formaPagoStr.uppercase()) {
            "EFECTIVO" -> MetodosDePago.EFECTIVO
            "TARJETA" -> MetodosDePago.TARJETA
            "QR" -> MetodosDePago.QR
            "TRANSFERENCIA" -> MetodosDePago.TRANSFERENCIA
            else -> throw BusinessException("Método de pago no reconocido: $formaPagoStr")
        }
    }
    fun obtenerPedidosPorEstado(estado: String, idLocal: Int): List<Pedido> {
        val estadoEnum = EstadosDePedido.entries
            .firstOrNull { it.name.equals(estado, ignoreCase = true) }
            ?: throw BusinessException("Estado inválido: $estado")
        val todosLosPedidos = pedidoRepository.getAll()
        return todosLosPedidos.filter { it.local.id == idLocal && it.estadoActual == estadoEnum }
    }
    fun obtenerPedidosPublicoPorEstado(estado: String, idUsuario: String): List<Pedido> {
        val estadoEnum = EstadosDePedido.entries
            .firstOrNull { it.name.equals(estado, ignoreCase = true) }
            ?: throw BusinessException("Estado inválido: $estado")
        val todosLosPedidos = pedidoRepository.getAll()
        // Si tiene el mismo estado y el mismo IdUsuario
        return todosLosPedidos.filter { it.estadoActual == estadoEnum && it.cliente.id == idUsuario.toInt() }
    }

    fun cambiarEstado(id: Int, estadoString: String) {
        val estado = EstadosDePedido.entries
            .firstOrNull { it.name.equals(estadoString, ignoreCase = true) }
            ?: throw BusinessException("Estado inválido: $estadoString")
        val pedido = pedidoRepository.getById(id)
        pedido.cambioDeEstadoDePedido(estado)
    }
    
    fun pedidoCompletoPorId(id: Int): Pedido {
        return pedidoRepository.getById(id)
    }
}