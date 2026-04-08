package ar.edu.unsam.algo3.dto
import ar.edu.unsam.algo3.GrupoAlimenticio

data class IngredienteDTO(
    val id: Int?,
    val nombre: String,
    val grupoAlimenticio: GrupoAlimenticio,
    val origenAnimal: Boolean,
    val costo: Double
)
