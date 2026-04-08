package ar.edu.unsam.algo3.dto

data class CalificacionRequestDTO(
    val localId: Int,
    val puntuacion: Int,
    val comentario: String? = null
)

data class CalificacionResponseDTO(
    val ok: Boolean,
    val puntajePromedio: Double,
    val mensaje: String
)