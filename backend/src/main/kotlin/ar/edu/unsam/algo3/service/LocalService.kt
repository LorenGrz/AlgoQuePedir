package ar.edu.unsam.algo3.service
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.dto.CardLocalDTO
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.repository.LocalRepository
import ar.edu.unsam.algo3.repository.UsuarioRepository
import org.springframework.stereotype.Service

@Service
class LocalService(
    val localRepository: LocalRepository,
    private val usuarioRepository: UsuarioRepository,
    private val localMapper: LocalMapper
) {
    fun localPorId(id: Int) = localRepository.getById(id)

    fun actualizarLocal(local: Local) {
        val localViejo = localRepository.getById(local.id!!)
        local.usuario = localViejo.usuario
        localRepository.update(local)
    }

    fun getLocales() = localRepository.getAll()

    fun getLocalesParaUsuario(userId: Int): List<CardLocalDTO> {
        val usuario = usuarioRepository.getById(userId)
        val locales = localRepository.getAll()
        return locales.map { local ->
            val esCercano = usuario.esCercano(local.direccion)
            localMapper.toCardDto(local, esCercano)
        }
    }

    fun getLocalesFiltrados(userId: Int, search: String, onlyNearby: Boolean): List<CardLocalDTO> {
        val usuario = usuarioRepository.getById(userId)
        val locales = localRepository.getAll()
        return locales
            .filter { local ->
                search.isBlank() || local.nombre.contains(search, ignoreCase = true) || local.direccion.calle.contains(search, ignoreCase = true)
            }
            .filter { local ->
                if (!onlyNearby) true
                else usuario.esCercano(local.direccion)
            }
            .map { local ->
                val esCercano = usuario.esCercano(local.direccion)
                localMapper.toCardDto(local, esCercano)
            }
    }
}