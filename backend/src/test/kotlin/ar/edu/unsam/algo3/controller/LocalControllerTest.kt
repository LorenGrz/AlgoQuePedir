package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.dto.LocalDTO
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.MetodosDePago
import ar.edu.unsam.algo3.dto.TipoPagoDTO
import ar.edu.unsam.algo3.exceptions.NotFoundException
import ar.edu.unsam.algo3.service.LocalService
import com.fasterxml.jackson.databind.ObjectMapper
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

@WebMvcTest(LocalController::class)
@DisplayName("Dado un LocalController")
class LocalControllerTest(
    @Autowired val mockMvc: MockMvc,
    @Autowired val objectMapper: ObjectMapper
) {

    @MockBean lateinit var localService: LocalService
    @MockBean lateinit var localMapper: LocalMapper

    @Test
    @DisplayName("cuando se consulta un local existente por ID, devuelve 200 con el DTO esperado")
    fun getLocalPorId_ok() {
        val local = Local(id = 1, nombre = "Bar Cheto",
            Direccion("Av. Córdoba", 2445, Point(-34.599220725558055, -58.40170853602751))
        )
        local.setPorcentajeComision(0.1)
        local.regaliasPorAutor = 0.15
        local.imgurl = "https://img.png"
        local.agregarMetodoDePago(MetodosDePago.EFECTIVO)

        val dto = LocalDTO(
            nombre = "Bar Cheto",
            direccion = "Av. Córdoba",
            altura = 2445,
            latitud = -34.599220725558055,
            longitud = -58.40170853602751,
            porcentajeApp = 10.0,
            porcentajeComision = 15.0,
            url = "https://img.png",
            metodos = TipoPagoDTO(efectivo = true, qr = false, transferencia = true),
            id = 1
        )
        `when`(localService.localPorId(1)).thenReturn(local)
        `when`(localMapper.toDto(local)).thenReturn(dto)

        mockMvc.perform(get("/local/1"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nombre").value("Bar Cheto"))
    }

    @Test
    @DisplayName("cuando se actualiza un local con datos válidos, devuelve 200 OK")
    fun putLocal_ok() {
        val dto = LocalDTO(
            nombre = "Bar Piola",
            direccion = "Mitre",
            altura = 100,
            latitud = -34.6,
            longitud = -58.4,
            porcentajeApp = 10.0,
            porcentajeComision = 15.0,
            url = "https://img.png",
            metodos = TipoPagoDTO(efectivo = true, qr = false, transferencia = true),
            id = 1
        )

        val local = Local(id = 1, nombre = "Bar Piola",
            Direccion("Mitre", 100, Point(-34.6, -58.4))
        )
        local.setPorcentajeComision(0.1)
        local.regaliasPorAutor = 0.15
        local.imgurl = "https://img.png"
        local.agregarMetodoDePago(MetodosDePago.EFECTIVO)

        `when`(localMapper.fromDto(dto, 1)).thenReturn(local)

        mockMvc.perform(
            put("/local/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        ).andExpect(status().isOk)

        verify(localService).actualizarLocal(local)
    }

    @Test
    @DisplayName("cuando se consulta un local inexistente, devuelve 404 Not Found")
    fun getLocalInexistente() {
        `when`(localService.localPorId(99)).thenThrow(NotFoundException("Local no encontrado"))

        mockMvc.perform(get("/local/99"))
            .andExpect(status().isNotFound)
    }

    @Test
    @DisplayName("cuando se consulta mal un local, devuelve 400 Bad Request")
    /* ¿Esto no es como testear si spring funciona bien? */
    /* Sí le mando un RequestBody incompleto también */
    fun getLocalConError() {
        mockMvc.perform(get("/local/sd"))
            .andExpect(status().isBadRequest)
    }
}
