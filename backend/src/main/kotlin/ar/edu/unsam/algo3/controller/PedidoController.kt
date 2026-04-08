// Archivo: PedidoController.kt
package ar.edu.unsam.algo3.controller
import ar.edu.unsam.algo3.dto.PedidoDTO
import ar.edu.unsam.algo3.dto.PedidoCompletoDTO
import ar.edu.unsam.algo3.service.PedidoService
import ar.edu.unsam.algo3.helpers.PedidoMapper
import ar.edu.unsam.algo3.helpers.PedidoCompletoMapper
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
@RequestMapping("/pedidos")
class PedidoController(
    val pedidoService: PedidoService, 
    val pedidoMapper: PedidoMapper,
    val pedidoCompletoMapper: PedidoCompletoMapper
) {
    @GetMapping("/estado/{estado}/{idLocal}")
    fun obtenerPedidosPorEstado(@PathVariable estado: String, @PathVariable idLocal: Int): List<PedidoDTO> {
        val pedidos = pedidoService.obtenerPedidosPorEstado(estado, idLocal)
        return pedidos.map { pedidoMapper.toDto(it) }
    }

    @PatchMapping("/{id}/{estado}")
    fun cambiarEstadoDePedido(@PathVariable id: Int, @PathVariable estado: String) = pedidoService.cambiarEstado(id, estado)


    @GetMapping("/{id}")
    fun obtenerPedidoCompleto(@PathVariable id: Int): PedidoCompletoDTO {
        val pedido = pedidoService.pedidoCompletoPorId(id)
        return pedidoCompletoMapper.toCompletoDto(pedido)
    }
}