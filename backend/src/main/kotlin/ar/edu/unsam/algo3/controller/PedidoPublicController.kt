package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Pedido
import ar.edu.unsam.algo3.dto.DetallePedido
import ar.edu.unsam.algo3.dto.PedidoArmadoDTO
import ar.edu.unsam.algo3.dto.PedidoModel
import ar.edu.unsam.algo3.helpers.DetallePedidoPublicoMapper

import ar.edu.unsam.algo3.helpers.PedidoPublicoMapper
import ar.edu.unsam.algo3.service.PedidoService
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
@RequestMapping("/pedidosPublic")
class PedidoPublicController(
    val pedidoService: PedidoService,
    val pedidoPublicoMapper: PedidoPublicoMapper,
    val detallePedidoPublicoMapper: DetallePedidoPublicoMapper
) {
    @GetMapping("/estado/{estado}/{idUsuario}")
    fun obtenerPedidosPorEstado(
        @PathVariable estado: String,@PathVariable idUsuario: String,
    ): List<PedidoModel> {
        val pedidos: List<Pedido> = pedidoService.obtenerPedidosPublicoPorEstado(estado, idUsuario)
        return pedidos.map { pedidoPublicoMapper.toDto(it) }
    }

    @PostMapping("/nuevoPedido")
    fun obtenerNuevoPedido(@RequestBody pedido: PedidoArmadoDTO) {pedidoService.agregarPedido(pedido)}

    @GetMapping("/{id}")
    fun obtenerPedidoPorId(
        @PathVariable id: Int
    ): DetallePedido{
        val pedido = pedidoService.pedidoCompletoPorId(id)

        return detallePedidoPublicoMapper.toCompletoDto(pedido)
    }
}