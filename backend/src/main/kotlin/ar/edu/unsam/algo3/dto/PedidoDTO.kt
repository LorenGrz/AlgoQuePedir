package ar.edu.unsam.algo3.dto

data class PedidoDTO(
    val id: Int,
    val estado: String,
    val cliente: ClientePedidoDTO,
    val direccion: DireccionDTO,
    val cantidadItems: Int,
    val pago: PagoPedidoDTO,
)
data class ClientePedidoDTO(
    val nombre: String,
    val username: String,
    val imgUrl: String
)
data class PagoPedidoDTO(
    val total: Double,
    val metodoPago: String
)
data class DireccionDTO(
    val direccion: String,
    val latitud: Double,
    val longitud: Double
)