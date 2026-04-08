package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.*
import ar.edu.unsam.algo3.dto.*
import ar.edu.unsam.algo3.dto.Plato
import ar.edu.unsam.algo3.exceptions.BusinessException
import ar.edu.unsam.algo3.helpers.DetallePedidoPublicoMapper
import ar.edu.unsam.algo3.helpers.PedidoPublicoMapper
import ar.edu.unsam.algo3.service.PedidoService
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
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

@WebMvcTest(PedidoPublicController::class)
@DisplayName("Dado un PedidoPublicController")
class PedidoPublicControllerTest(
    @Autowired val mockMvc: MockMvc
) {

    @MockBean lateinit var pedidoService: PedidoService
    @MockBean lateinit var pedidoPublicoMapper: PedidoPublicoMapper
    @MockBean lateinit var detallePedidoPublicoMapper: DetallePedidoPublicoMapper

    val mapper = jacksonObjectMapper() // Para convertir objetos a JSON en el POST

    // Mock de datos básicos
    val usuarioMock = Usuario("Juan", "Perez", "juan.perez", Direccion("Calle 1", 123, Point(0.0, 0.0)), 1, imgUrl = "")
    val pedidoMock = Pedido(usuarioMock, Local(1, "Local Test", Direccion("Calle 2", 456, Point(0.0, 0.0))))

    @Test
    @DisplayName("GET /pedidosPublic/estado/{estado}/{idUsuario} -> ok")
    fun obtenerPedidosPorEstado_ok() {
        val estado = "PENDIENTE"
        val idUsuario = "1"

        // Mock respuesta del mapper
        val pedidoModel = PedidoModel(
            id = "1", nombreLocal = "local",
            cantArticulos = 2, total = 1500.0,
            imgUrl = "img.jpg", fecha = "",
            estado = "PENDIENTE"
        )

        `when`(pedidoService.obtenerPedidosPublicoPorEstado(estado, idUsuario))
            .thenReturn(listOf(pedidoMock))
        `when`(pedidoPublicoMapper.toDto(pedidoMock)).thenReturn(pedidoModel)

        mockMvc.perform(get("/pedidosPublic/estado/$estado/$idUsuario"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].nombreLocal").value("local"))
            .andExpect(jsonPath("$[0].estado").value("PENDIENTE"))
    }

    @Test
    @DisplayName("GET /pedidosPublic/estado/INVALIDO/{idUsuario} -> devuelve 400 Bad Request")
    fun obtenerPedidosPorEstado_invalido() {
        // Simulamos la excepción del Service
        `when`(pedidoService.obtenerPedidosPublicoPorEstado("INVALIDO", "1"))
            .thenThrow(BusinessException("Estado inválido"))

        mockMvc.perform(get("/pedidosPublic/estado/INVALIDO/1"))
            .andExpect(status().isBadRequest)
    }

    @Test
    @DisplayName("POST /pedidosPublic/nuevoPedido -> crea el pedido y devuelve 200 OK")
    fun nuevoPedido_ok() {
        val nuevoPedidoDTO = PedidoArmadoDTO(
            idLocal = 1, idCliente = 1,
            formaPago = "EFECTIVO",
            items = listOf()
        )

        // CORRECCIÓN: Quitamos refEq() y pasamos el objeto directo
        doNothing().`when`(pedidoService).agregarPedido(nuevoPedidoDTO)

        mockMvc.perform(post("/pedidosPublic/nuevoPedido")
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(nuevoPedidoDTO)))
            .andExpect(status().isOk)

        // CORRECCIÓN: Quitamos refEq().
        // Como es un data class, Mockito comparará campo por campo automáticamente.
        verify(pedidoService, times(1)).agregarPedido(nuevoPedidoDTO)
    }

    @Test
    @DisplayName("GET /pedidosPublic/{id} -> devuelve detalle del pedido con estructura anidada")
    fun obtenerPedidoPorId_ok() {
        val id = 1

        // 1. Armamos los objetos anidados requeridos por tus data classes
        val resumenLocal = RestauranteResumen(
            nombre = "Local Test",
            imagen = "img_local.jpg",
            calificacion = 4.5,
            distanciaKm = 2.0,
            envioGratis = false
        )

        val resumenEconomico = ResumenPedido(
            subtotal = 2000.0,
            recargoTipoPago = 0.0,
            tarifaEntrega = 200.0,
            total = 2200.0
        )

        val platoMock = Plato(
            id = "10",
            nombre = "Milanesa",
            descripcion = "Con puré",
            precio = 1000.0,
            img = "mila.jpg",
            popular = true
        )

        val itemsMock = listOf(ItemPedido(platoMock, 2))

        // 2. Armamos el DTO principal que devuelve el mapper
        val detalleDTO = DetallePedido(
            id = "1", // Nota: En tu data class es String
            estado = "EN_CAMINO",
            local = resumenLocal,
            items = itemsMock,
            resumen = resumenEconomico,
            formaPago = "EFECTIVO",
            fecha = "2023-10-25"
        )

        // 3. Mockeamos las llamadas
        `when`(pedidoService.pedidoCompletoPorId(id)).thenReturn(pedidoMock)
        `when`(detallePedidoPublicoMapper.toCompletoDto(pedidoMock)).thenReturn(detalleDTO)

        // 4. Ejecutamos y verificamos la estructura JSON anidada
        mockMvc.perform(get("/pedidosPublic/$id"))
            .andExpect(status().isOk)
            // Verificamos campos directos
            .andExpect(jsonPath("$.id").value("1"))
            .andExpect(jsonPath("$.estado").value("EN_CAMINO"))
            .andExpect(jsonPath("$.formaPago").value("EFECTIVO"))

            // Verificamos objeto anidado 'local'
            .andExpect(jsonPath("$.local.nombre").value("Local Test"))
            .andExpect(jsonPath("$.local.distanciaKm").value(2.0))

            // Verificamos objeto anidado 'resumen'
            .andExpect(jsonPath("$.resumen.total").value(2200.0))

            // Verificamos la lista de items
            .andExpect(jsonPath("$.items").isArray)
            .andExpect(jsonPath("$.items[0].plato.nombre").value("Milanesa"))
            .andExpect(jsonPath("$.items[0].cantidad").value(2))
    }
}