package ar.edu.unsam.algo3.helpers
import ar.edu.unsam.algo3.EstadosDePedido
import ar.edu.unsam.algo3.Local
import org.springframework.stereotype.Service
import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.dto.*
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt

interface DetallePedidoPublicoAdapter {
    fun toCompletoDto(pedido: Pedido): DetallePedido
}

@Service
class DetallePedidoPublicoMapper : DetallePedidoPublicoAdapter {

    override fun toCompletoDto(pedido: Pedido): DetallePedido {
        return DetallePedido(
            id = pedido.id.toString(),
            estado = pedido.estadoActual.toString(),
            fecha = pedido.fechaCreacion.toString(),
            formaPago = pedido.medioDePago.toString(), // Asumo que tienes este campo

            // Usamos funciones helper para mapear objetos anidados
            local = mapRestaurante(pedido),
            items =  pedido.platos
                .groupBy { it.nombre }
                .map { (_, platos) ->
                    val plato = platos.first()
                    val precioConDescuento = plato.obtenerPrecio() - plato.obtenerDescuentos(plato.obtenerPrecio())
                    ItemPedido(
                        plato = Plato(
                            id = plato.id!!.toString(),
                            nombre = plato.nombre,
                            descripcion = plato.descripcion,
                            precio = precioConDescuento,
                            img = plato.img,
                            popular = plato.popular
                        ),
                        cantidad = platos.size
                    )
                },
            resumen = mapResumen(pedido)
        )
    }

    // --- Funciones Helper Privadas ---

    private fun mapRestaurante(pedido: Pedido): RestauranteResumen {
        return RestauranteResumen(
            nombre = pedido.local.nombre,
            imagen = pedido.local.imgurl,
            calificacion = pedido.local.puntuacion(),
            distanciaKm = calcularDistanciaDeUsuarioYLocal(pedido),
            envioGratis = pedido.local.esCertificado()
        )
    }

    private fun mapResumen(pedido: Pedido): ResumenPedido {
        // Aquí debes llamar a la lógica de tu dominio para obtener los totales
        // (Es mejor que esta lógica esté en la clase 'Pedido' y no en el Mapper)
        return ResumenPedido(
            subtotal = pedido.platos.sumOf { plato ->
                plato.obtenerPrecio() - plato.obtenerDescuentos(plato.obtenerPrecio())
            },
            recargoTipoPago = 0.00,
            tarifaEntrega = 0.00,
            total = pedido.totalAPagar()
        )
    }

}
 fun calcularDistanciaDeUsuarioYLocal(pedido: Pedido): Double {
    val origen = pedido.local.direccion.ubicacion
    val destino = pedido.cliente.direccion.ubicacion

    // Radio de la Tierra en Kilómetros
    val radioTierraKm = 6371.0

    // Nota: En objetos Point estándar (JTS/GeoJSON):
    // .x suele ser Longitud
    // .y suele ser Latitud
    val lat1 = Math.toRadians(origen.y)
    val lon1 = Math.toRadians(origen.x)
    val lat2 = Math.toRadians(destino.y)
    val lon2 = Math.toRadians(destino.x)

    // Diferencia de latitudes y longitudes
    val dLat = lat2 - lat1
    val dLon = lon2 - lon1

    // Fórmula del Haversine
    val a = sin(dLat / 2).pow(2) +
            cos(lat1) * cos(lat2) *
            sin(dLon / 2).pow(2)

    val c = 2 * atan2(sqrt(a), sqrt(1 - a))

    // Distancia final
    return radioTierraKm * c
}