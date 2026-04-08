package ar.edu.unsam.algo3.service
import ar.edu.unsam.algo3.repository.IngredienteRepository
import org.springframework.stereotype.Service
import ar.edu.unsam.algo3.Ingrediente

@Service
class IngredienteService(val ingredienteRepository: IngredienteRepository) {
    fun getIngredientes() = ingredienteRepository.getAll()

    fun ingredienteById(id: Int) = ingredienteRepository.getById(id)

    fun eliminar(ingrediente: Ingrediente) = ingredienteRepository.delete(ingrediente)

    fun crearIngrediente(ingrediente: Ingrediente) = ingredienteRepository.create(ingrediente)

    fun actualizarIngrediente(ingrediente: Ingrediente) = ingredienteRepository.update(ingrediente)
}
