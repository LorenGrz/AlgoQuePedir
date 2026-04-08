package ar.edu.unsam.algo3

enum class GrupoAlimenticio {
    CEREALES_Y_TUBERCULOS,
    AZUCARES_Y_DULCES,
    LACTEOS,
    FRUTAS_Y_VERDURAS,
    GRASAS_Y_ACEITES,
    PROTEINAS
}

data class Ingrediente (
    val nombre: String,
    val costoMercado: Double,
    val grupo: GrupoAlimenticio,
    val origenAnimal: Boolean,
    override var id: Int? = null
) : EntidadConId