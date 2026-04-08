package ar.edu.unsam.algo3.repository
import ar.edu.unsam.algo3.Repositorio
import ar.edu.unsam.algo3.SearchStrategy
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.IngredienteSearchStrategy
import org.springframework.stereotype.Component

@Component
class IngredienteRepository(searchStrategy: SearchStrategy<Ingrediente> = IngredienteSearchStrategy()) : Repositorio<Ingrediente>(searchStrategy) {
}
