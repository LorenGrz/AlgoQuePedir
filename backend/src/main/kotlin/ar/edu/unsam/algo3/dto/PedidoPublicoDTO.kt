package ar.edu.unsam.algo3.dto

data class Plato(
    val id: String,
    val nombre: String,
    val descripcion: String,
    val precio: Double,
    val img: String,
    val popular: Boolean
)

data class ItemPedido(
    val plato: Plato,
    val cantidad: Int
)

data class RestauranteResumen(
    val nombre: String,
    val imagen: String,
    val calificacion: Double,
    val distanciaKm: Double,
    val envioGratis: Boolean
)

data class ResumenPedido(
    val subtotal: Double,
    val recargoTipoPago: Double,
    val tarifaEntrega: Double,
    val total: Double
)

// ---- DTOs Principales ----
data class PedidoModel(
    val id: String,
    val estado: String,
    val nombreLocal: String,
    val total: Double,
    val fecha: String, // Usar String para simplicidad, o Instant/LocalDate
    val cantArticulos: Int,
    val imgUrl: String
)

data class DetallePedido(
    val id: String,
    val estado: String,
    val local: RestauranteResumen,
    val items: List<ItemPedido>,
    val resumen: ResumenPedido,
    val formaPago: String,
    val fecha: String
)

// DTO para el pedido completo
data class PedidoArmadoDTO(
    val idCliente: Int,       // Necesario para Pedido(cliente: Usuario, ...)
    val idLocal: Int,         // Necesario para Pedido(..., local: Local)
    val items: List<ItemPedido>,
    val formaPago: String,    // "Efectivo", "Tarjeta de Crédito", etc.
)