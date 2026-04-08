package ar.edu.unsam.algo3.dto

import java.time.LocalDate

data class PlatoMenuDTO(
    val id: Int,
    val nombre: String,
    val descripcion: String,
    val precio: Double,
    val img: String,
    val popular: Boolean
)

data class PlatoDTO(
    val id: Int?,
    val nombre: String,
    val descripcion: String,
    val precioBase: Double,
    val imgUrl: String,
    val autor: Boolean,
    val porcentajeDescuento: Double?,
    val ingredientes: List<IngredienteDTO>,
    val nuevo: Boolean,
    val lanzamiento: LocalDate?
)

data class PlatoRequest(
    val plato: PlatoDTO,
    val localId: Int
)
