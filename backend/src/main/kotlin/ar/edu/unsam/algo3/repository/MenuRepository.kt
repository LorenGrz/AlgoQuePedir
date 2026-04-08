package ar.edu.unsam.algo3.repository
import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.PlatoSearchStrategy
import ar.edu.unsam.algo3.Repositorio
import ar.edu.unsam.algo3.SearchStrategy
import org.springframework.stereotype.Component

@Component
class MenuRepository(searchStrategy: SearchStrategy<Plato> = PlatoSearchStrategy()) : Repositorio<Plato>(searchStrategy) {

}