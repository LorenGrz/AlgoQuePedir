package ar.edu.unsam.algo3.helpers
import ar.edu.unsam.algo3.dto.IngredienteDTO
import org.springframework.stereotype.Service
import ar.edu.unsam.algo3.Ingrediente

interface IngredienteAdapter {
    fun toDto(ingrediente: Ingrediente): IngredienteDTO
    fun fromDto(dto: IngredienteDTO): Ingrediente
}

@Service
class IngredienteMapper: IngredienteAdapter {
    override fun toDto(ingrediente: Ingrediente): IngredienteDTO = IngredienteDTO(
        id = ingrediente.id,
        nombre = ingrediente.nombre,
        grupoAlimenticio = ingrediente.grupo,
        origenAnimal = ingrediente.origenAnimal,
        costo = ingrediente.costoMercado
    )

    override fun fromDto(dto: IngredienteDTO): Ingrediente {
        val ingrediente = Ingrediente(
            nombre = dto.nombre,
            costoMercado = dto.costo,
            grupo = dto.grupoAlimenticio,
            origenAnimal = dto.origenAnimal
        )
        // Solo asigna el ID si existe y no está vacío
        if (dto.id != null && dto.id.toString().isNotBlank()) {
            ingrediente.id = dto.id
        }
        return ingrediente
    }
}
