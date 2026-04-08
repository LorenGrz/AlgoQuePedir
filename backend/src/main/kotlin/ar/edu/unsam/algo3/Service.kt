package ar.edu.unsam.algo3

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue

// Data Transfer Object es un objeto o clase que se utiliza para transportar
// datos entre diferentes procesos o capas de una aplicación, en este caso del servicio externo al repositorio
data class IngredienteDTO(
    val id: Int?,
    val nombre: String,
    val costo: Double,
    val grupo: String,
    val origenAnimal: Boolean
)

class ConsumoServicioIngredientes(
    private val serviceMock: ServiceIngredientes,
    private val repositorio: Repositorio<Ingrediente>
) {
    private val json = jacksonObjectMapper()

    fun sincronizar() {
        val jsonString = serviceMock.getIngredientes() // Cuando sea un servicio real, validar
        val ingredientes = json.readValue<List<IngredienteDTO>>(jsonString)

        ingredientes.forEach { dto ->
            val ingrediente = Ingrediente(
                nombre = dto.nombre,
                costoMercado = dto.costo,
                grupo = GrupoAlimenticio.valueOf(dto.grupo),
                origenAnimal = dto.origenAnimal,
                id = dto.id
            )

            if (dto.id != null && repositorio.existeConId(dto.id)) {
                repositorio.update(ingrediente) // Si me trae un id que ya tengo, lo actualizo
            } else {
                repositorio.create(ingrediente) // Si no lo tengo, lo creo
            }
        }
    }
}

interface ServiceIngredientes {
    fun getIngredientes(): String // Devuelve un JSON en formato String
}

object ServiceIngredientesMock : ServiceIngredientes { // Simulo el servicio externo con un mock estático
    override fun getIngredientes(): String = """
        [
            {
                "id": 22,
                "nombre": "Leche",
                "costo": 200.5,
                "grupo": "LACTEOS",
                "origenAnimal": true
            },
            {
                "nombre": "Arroz",
                "costo": 100.5,
                "grupo": "CEREALES_Y_TUBERCULOS",
                "origenAnimal": false
            },
            {
                "id": 3,
                "nombre": "Azúcar",
                "costo": 200.0,
                "grupo": "AZUCARES_Y_DULCES",
                "origenAnimal": false
            },
            {
            	"nombre": "Pollo",
            	"costo": 400.5,
            	"grupo": "PROTEINAS",
            	"origenAnimal": true
            },
            {
            	"id": 57,
            	"nombre": "Manzana",
            	"costo": 100.0,
            	"grupo": "FRUTAS_Y_VERDURAS",
            	"origenAnimal": false
            }
        ]
    """.trimIndent() // Elimina identado visual y espacios en blanco
}

