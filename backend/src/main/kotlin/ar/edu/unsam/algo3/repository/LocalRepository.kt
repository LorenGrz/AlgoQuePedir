package ar.edu.unsam.algo3.repository
import ar.edu.unsam.algo3.LocalSearchStrategy
import ar.edu.unsam.algo3.Repositorio
import ar.edu.unsam.algo3.SearchStrategy
import ar.edu.unsam.algo3.Local
import org.springframework.stereotype.Component

@Component
class LocalRepository(searchStrategy: SearchStrategy<Local> = LocalSearchStrategy()) : Repositorio<Local>(searchStrategy) {

}