package ar.edu.unsam.algo3.repository

import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.PedidoSearchStrategy
import ar.edu.unsam.algo3.Repositorio
import ar.edu.unsam.algo3.SearchStrategy
import org.springframework.stereotype.Component

@Component
class PedidoRepository(searchStrategy: SearchStrategy<Pedido> = PedidoSearchStrategy()) : Repositorio<Pedido>(searchStrategy) {
}