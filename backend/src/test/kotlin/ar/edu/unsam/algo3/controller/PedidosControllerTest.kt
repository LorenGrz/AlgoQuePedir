package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.dto.*
import ar.edu.unsam.algo3.exceptions.BusinessException
import ar.edu.unsam.algo3.helpers.PedidoMapper
import ar.edu.unsam.algo3.helpers.PedidoCompletoMapper
import ar.edu.unsam.algo3.service.PedidoService
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.uqbar.geodds.Point
import java.time.LocalDate

@WebMvcTest(PedidoController::class)
@DisplayName("Dado un PedidoController")
class PedidoControllerTest(
    @Autowired val mockMvc: MockMvc
) {

    @MockBean lateinit var pedidoService: PedidoService
    @MockBean lateinit var pedidoMapper: PedidoMapper
    @MockBean lateinit var pedidoCompletoMapper: PedidoCompletoMapper

    // --- Mocks de datos auxiliares ---
    val direccionMock = Direccion("Av. Córdoba", 2445, Point(-34.5992, -58.4017))
    val usuarioMock = Usuario(
        nombre = "Juan", apellido = "Perez", username = "juan.perez",
        direccion = direccionMock, id = 1, imgUrl = "img.jpg"
    )
    val pedidoMock = Pedido(
        cliente = usuarioMock,
        local = Local(1, "La Casa de Juan", Direccion("Av. Córdoba", 2445, Point(-34.0, -58.0))),
        id = 1
    )

    @Test
    @DisplayName("GET /pedidos/estado/{estado}/{idLocal} -> devuelve 200 OK con lista")
    fun obtenerPedidosPorEstado_ok() {
        val estado = EstadosDePedido.PENDIENTE
        val pedidoDTO = PedidoDTO(
            id = 1, estado = "PENDIENTE",
            cliente = ClientePedidoDTO("Juan", "juan.perez", "img.jpg"),
            direccion = DireccionDTO("Av. Córdoba 2445", -34.0, -58.0),
            cantidadItems = 1, pago = PagoPedidoDTO(1000.0, "EFECTIVO"),
        )

        // IMPORTANTE: Mockear el comportamiento exitoso
        `when`(pedidoService.obtenerPedidosPorEstado(estado.name, 4)).thenReturn(listOf(pedidoMock))
        `when`(pedidoMapper.toDto(pedidoMock)).thenReturn(pedidoDTO)

        mockMvc.perform(get("/pedidos/estado/${estado.name}/4"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].estado").value("PENDIENTE"))
            .andExpect(jsonPath("$[0].cliente.nombre").value("Juan"))
    }

    @Test
    @DisplayName("GET /pedidos/estado/INVALIDO/{idLocal} -> devuelve 400 Bad Request")
    fun obtenerPedidosPorEstado_invalido() {
        // IMPORTANTE: Simulamos que el servicio lanza la excepción cuando el estado es inválido
        `when`(pedidoService.obtenerPedidosPorEstado("INVALIDO", 4))
            .thenThrow(BusinessException("Estado inválido"))

        mockMvc.perform(get("/pedidos/estado/INVALIDO/4"))
            .andExpect(status().isBadRequest)
    }

    @Test
    @DisplayName("PATCH /pedidos/{id}/{estado} -> devuelve 200 OK")
    fun cambiarEstadoDePedido_ok() {
        val id = 1
        val estado = EstadosDePedido.PREPARADO

        doNothing().`when`(pedidoService).cambiarEstado(id, estado.name)

        mockMvc.perform(patch("/pedidos/$id/${estado.name}"))
            .andExpect(status().isOk)
    }

    @Test
    @DisplayName("PATCH /pedidos/{id}/INVALIDO -> devuelve 400 Bad Request")
    fun cambiarEstadoDePedido_invalido() {
        // IMPORTANTE: Simulamos la excepción en el método void usando doThrow
        doThrow(BusinessException("Estado inválido"))
            .`when`(pedidoService).cambiarEstado(1, "INVALIDO")

        mockMvc.perform(patch("/pedidos/1/INVALIDO"))
            .andExpect(status().isBadRequest)
    }

    @Test
    @DisplayName("GET /pedidos/{id} -> devuelve 200 OK con detalle completo")
    fun obtenerPedidoCompleto_ok() {
        val id = 1
        val pedidoCompletoDTO = PedidoCompletoDTO(
            id = 1, estado = "PENDIENTE",
            cliente = ClientePedidoDTO("Juan", "juan.perez", "img.jpg"),
            direccion = DireccionDTO("Av. Córdoba 2445", -34.5, -58.4),
            cantidadItems = 0, items = emptyList(),
            pago = PagoPedidoDetalleDTO(0.0, 0.0, 0.0, 0.0, "EFECTIVO")
        )

        `when`(pedidoService.pedidoCompletoPorId(id)).thenReturn(pedidoMock)
        `when`(pedidoCompletoMapper.toCompletoDto(pedidoMock)).thenReturn(pedidoCompletoDTO)

        mockMvc.perform(get("/pedidos/$id"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.estado").value("PENDIENTE"))
    }
}