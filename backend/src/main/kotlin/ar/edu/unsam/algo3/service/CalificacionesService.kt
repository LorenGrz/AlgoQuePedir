package ar.edu.unsam.algo3.service

import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Resena
import ar.edu.unsam.algo3.dto.CalificacionRequestDTO
import ar.edu.unsam.algo3.repository.LocalRepository
import ar.edu.unsam.algo3.repository.UsuarioRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class CalificacionService(
    private val usuarioRepository: UsuarioRepository,
    private val localRepository: LocalRepository
) {
    fun localesPendientes(usuarioId: Int): List<Local> {
        val usuario = usuarioRepository.getById(usuarioId)
        return usuario.localesAPuntuar.keys.filter { usuario.puedePuntuar(it) }
    }

    fun calificar(usuarioId: Int, respuesta: CalificacionRequestDTO): Pair<Boolean, Local> {
        val usuario = usuarioRepository.getById(usuarioId)
        val local = localRepository.getById(respuesta.localId)
        val nuevaResena = Resena(
            idResena = local.resenas.size + 1,
            user = usuario.username,
            comentario = respuesta.comentario ?: "",
            puntuacion = respuesta.puntuacion.toDouble(),
            fecha = java.time.LocalDate.now().toString()
        )
        val ok = usuario.puntuarLocal(local, nuevaResena)
        if (ok) {
            localRepository.update(local)
            usuarioRepository.update(usuario)
        }
        return ok to local
    }
}