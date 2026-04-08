package ar.edu.unsam.algo3.service
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.dto.ResumenLocalDTO
import ar.edu.unsam.algo3.exceptions.BusinessException
import ar.edu.unsam.algo3.repository.LocalRepository
import ar.edu.unsam.algo3.repository.UsuarioRepository
import org.springframework.stereotype.Service

@Service
class UsuarioService(private val usuarioRepository: UsuarioRepository, private val localRepository: LocalRepository) {
    fun usuarioById(id: Int) = usuarioRepository.getById(id)

    fun actualizarUsuario(usuario: Usuario){
        if (usuario.id == null) {
            throw BusinessException("Error: El usuario no posee ID")
        }
        val usuarioRegitrado: Usuario = usuarioById(usuario.id!!)
        usuario.password = usuarioRegitrado.password
        usuario.fechaNacimiento = usuarioRegitrado.fechaNacimiento
        usuario.tiempoDeRegistro = usuarioRegitrado.tiempoDeRegistro

        usuarioRepository.update(usuario)
    }
}