package ar.edu.unsam.algo3.repository
import ar.edu.unsam.algo3.UsuarioSearchStrategy
import ar.edu.unsam.algo3.Repositorio
import ar.edu.unsam.algo3.SearchStrategy
import ar.edu.unsam.algo3.Usuario
import org.springframework.stereotype.Component

@Component
class UsuarioRepository(searchStrategy: SearchStrategy<Usuario> = UsuarioSearchStrategy()) : Repositorio<Usuario>(searchStrategy) {
}