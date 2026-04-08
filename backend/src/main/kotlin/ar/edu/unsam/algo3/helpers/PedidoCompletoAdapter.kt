// En src/main/kotlin/ar/edu/unsam/algo3/helpers/PedidoCompletoMapper.kt
package ar.edu.unsam.algo3.helpers
import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.dto.*
import ar.edu.unsam.algo3.MetodosDePago 
import org.springframework.stereotype.Service

interface PedidoCompletoAdapter {
    fun toCompletoDto(pedido: Pedido): PedidoCompletoDTO
}

@Service
class PedidoCompletoMapper: PedidoCompletoAdapter {
    override fun toCompletoDto(pedido: Pedido): PedidoCompletoDTO {
        // Calcula el subtotal SIN delivery
        val subtotal = pedido.platos.sumOf { plato -> 
            plato.obtenerPrecio() - plato.obtenerDescuentos(plato.obtenerPrecio()) 
        }
        
        // Calcula la comisión de delivery
        val comisionDelivery = if (pedido.delivery != null) {
            subtotal * pedido.delivery!!.porcentajeCostoDelivery
        } else 0.0
        
        // Calcula el subtotal con delivery
        val subtotalConDelivery = subtotal + comisionDelivery
        
        // Calcula el incremento por método de pago
        val incrementoPago = if (pedido.medioDePago != MetodosDePago.EFECTIVO) {
            subtotalConDelivery * 0.05
        } else 0.0
        
        return PedidoCompletoDTO(
            id = pedido.id!!,
            estado = pedido.estadoActual.toString(),
            cliente = ClientePedidoDTO(
                nombre = pedido.cliente.nombre,
                username = pedido.cliente.username,
                imgUrl = pedido.cliente.imgUrl
            ),
            direccion = DireccionDTO(
                direccion = pedido.local.direccion.calle + " " + pedido.local.direccion.altura,
                latitud = pedido.local.direccion.ubicacion.x,
                longitud = pedido.local.direccion.ubicacion.y
            ),
            cantidadItems = pedido.platos.count(), // Total de platos individuales
            items = pedido.platos.groupBy { it.nombre }.map { (nombre, platos) ->
                val plato = platos.first()
                PlatoDetalleDTO(
                    id = plato.id!!,
                    nombre = plato.nombre,
                    descripcion = plato.descripcion,
                    precio = plato.obtenerPrecio() - plato.obtenerDescuentos(plato.obtenerPrecio()), // Precio CON descuentos
                    cantidad = platos.size, // Cantidad de platos iguales
                    imgUrl = plato.img
                )
            },
            pago = PagoPedidoDetalleDTO(
                subtotal = subtotal,
                comisionDelivery = comisionDelivery,
                incrementoPago = incrementoPago,
                total = pedido.totalAPagar(),
                metodoPago = pedido.medioDePago.toString()
            )
        )
    }
}