package ar.edu.unsam.algo3.dto

import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.MetodosDePago
import ar.edu.unsam.algo3.Resena

data class LocalDTO(
    val id: Int,
    val nombre: String,
    val direccion: String,
    val altura: Int,
    val latitud: Double,
    val longitud: Double,
    val porcentajeApp: Double,
    val porcentajeComision: Double,
    val url: String,
    val metodos: TipoPagoDTO
)
data class PublicLocalDTO(
    val id: Int,
    val nombre: String,
    val puntajeTotal: Double,
    val totalVentas: Int,
    val resenas: List<Resena>,
    val img: String,
    val distanciaKm: Double,
    val envioGratis: Boolean,
    val metodosDePago: Set<MetodosDePago>
)

data class ResumenLocalDTO(
    val id: Int,
    val nombre: String,
    val puntuacion: Double,
    val tiempoMin: Int,
    val tiempoMax: Int,
    val pesos: Int,
    val imgUrl: String,
    val direccion: Direccion
)

data class TipoPagoDTO(
    val efectivo: Boolean,
    val qr: Boolean,
    val transferencia: Boolean
)

data class LoginLocalDTO(val username: String, val password: String)
data class RetornoLocalDTO(val id: Int)

data class CardLocalDTO(
    val id: Int,
    val nombre: String,
    val direccion: String,
    val altura: Int,
    val img: String,
    val cercano: Boolean
)