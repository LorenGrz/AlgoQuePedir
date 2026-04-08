package ar.edu.unsam.algo3.service
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.exceptions.BusinessException
import ar.edu.unsam.algo3.exceptions.NotFoundException
import ar.edu.unsam.algo3.repository.MenuRepository
import ar.edu.unsam.algo3.repository.UsuarioRepository
import org.springframework.stereotype.Service

@Service
class MenuService(val menuRepository: MenuRepository, val usuarioRepository: UsuarioRepository) {
    fun platoPorId(id: Int) = menuRepository.getById(id)

    fun getPlatos() = menuRepository.getAll()

    fun actualizarPlato(plato: Plato) {
        if (plato.id == null) {
            throw BusinessException("Error: El plato no posee ID")
        }

       return menuRepository.update(plato)
    }

    fun crearPlato(plato: Plato) = menuRepository.create(plato)

    fun platosPorLocal(idLocal: Int, userId: Int?) : List<Plato> {
        val allPlatos = menuRepository.getAll()
        val platosLocal = allPlatos.filter { it.local.id == idLocal }

        if (platosLocal.isEmpty()) {
            throw NotFoundException("El local que estás buscando no tiene platos a la venta")
        }
        if (userId == null) return platosLocal

        val usuario = usuarioRepository.getById(userId)

        val platosElegibles = platosLocal.filter { usuario.esPlatoAcorde(it) }

        return platosElegibles
    }
}