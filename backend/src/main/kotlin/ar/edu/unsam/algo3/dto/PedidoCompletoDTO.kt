package ar.edu.unsam.algo3.dto

data class PedidoCompletoDTO(
    val id: Int,
    val estado: String,
    val cliente: ClientePedidoDTO,
    val direccion: DireccionDTO,
    val cantidadItems: Int,
    val items: List<PlatoDetalleDTO>,
    val pago: PagoPedidoDetalleDTO
)

data class PagoPedidoDetalleDTO(
    val subtotal: Double,
    val comisionDelivery: Double,
    val incrementoPago: Double,
    val total: Double,
    val metodoPago: String
)

data class PlatoDetalleDTO(
    val id: Int,
    val nombre: String,
    val descripcion: String,
    val precio: Double,
    val cantidad: Int,
    val imgUrl: String
)