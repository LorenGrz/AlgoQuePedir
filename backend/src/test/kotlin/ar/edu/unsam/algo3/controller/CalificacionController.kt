package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Direccion
import ar.edu.unsam.algo3.Local
import ar.edu.unsam.algo3.Usuario
import ar.edu.unsam.algo3.dto.CalificacionRequestDTO
import ar.edu.unsam.algo3.dto.CalificacionResponseDTO
import ar.edu.unsam.algo3.dto.ResumenLocalDTO
import ar.edu.unsam.algo3.exceptions.NotFoundException
import ar.edu.unsam.algo3.helpers.LocalMapper
import ar.edu.unsam.algo3.service.CalificacionService
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.uqbar.geodds.Point
import java.time.LocalDate

@WebMvcTest(CalificacionController::class)
@DisplayName("Dado un CalificacionController")
class CalificacionControllerTest(
    @Autowired val mockMvc: MockMvc,
    @Autowired val objectMapper: ObjectMapper
) {
    @MockBean lateinit var calificacionService: CalificacionService
    @MockBean lateinit var localMapper: LocalMapper

    @Test
    @DisplayName("cuando se consultan locales pendientes de un usuario existente, devuelve 200 OK con la lista")
    fun pendientes_exitoso() {
        val usuarioId = 1
        val local1 = Local(
            id = 5,
            nombre = "La Esquina",
            direccion = Direccion("San Martín", 1234, Point(-34.6, -58.4))
        )
        val local2 = Local(
            id = 6,
            nombre = "El Buen Sabor",
            direccion = Direccion("Av. Corrientes", 5678, Point(-34.6, -58.4))
        )

        val resumen1 = ResumenLocalDTO(
            id = 5,
            nombre = "La Esquina",
            puntuacion = 4.5,
            tiempoMin = 30,
            tiempoMax = 45,
            pesos = 1500,
            imgUrl = "img1.jpg",
            direccion = Direccion("San Martín", 1234, Point(-34.6, -58.4))
        )
        val resumen2 = ResumenLocalDTO(
            id = 6,
            nombre = "El Buen Sabor",
            puntuacion = 4.0,
            tiempoMin = 25,
            tiempoMax = 40,
            pesos = 1200,
            imgUrl = "img2.jpg",
            direccion = Direccion("Av. Corrientes", 5678, Point(-34.6, -58.4))
        )

        `when`(calificacionService.localesPendientes(usuarioId)).thenReturn(listOf(local1, local2))
        `when`(localMapper.toResumenDto(local1)).thenReturn(resumen1)
        `when`(localMapper.toResumenDto(local2)).thenReturn(resumen2)

        mockMvc.perform(get("/calificaciones/$usuarioId/pendientes"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].id").value(5))
            .andExpect(jsonPath("$[0].nombre").value("La Esquina"))
            .andExpect(jsonPath("$[1].id").value(6))
            .andExpect(jsonPath("$[1].nombre").value("El Buen Sabor"))

        verify(calificacionService).localesPendientes(usuarioId)
    }

    @Test
    @DisplayName("cuando se consultan locales pendientes de un usuario inexistente, devuelve 404 Not Found")
    fun pendientes_usuarioInexistente() {
        val usuarioId = 999

        `when`(calificacionService.localesPendientes(usuarioId))
            .thenThrow(NotFoundException("No se encontró el objeto con ID $usuarioId."))

        mockMvc.perform(get("/calificaciones/$usuarioId/pendientes"))
            .andExpect(status().isNotFound)

        verify(calificacionService).localesPendientes(usuarioId)
    }

    @Test
    @DisplayName("cuando un usuario no tiene locales pendientes, devuelve 200 OK con lista vacía")
    fun pendientes_listaVacia() {
        val usuarioId = 1

        `when`(calificacionService.localesPendientes(usuarioId)).thenReturn(emptyList())

        mockMvc.perform(get("/calificaciones/$usuarioId/pendientes"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isEmpty)

        verify(calificacionService).localesPendientes(usuarioId)
    }

    @Test
    @DisplayName("cuando se califica un local correctamente, devuelve 200 OK con respuesta exitosa")
    fun calificar_exitoso() {
        val usuarioId = 1
        val requestDTO = CalificacionRequestDTO(
            localId = 5,
            puntuacion = 4,
            comentario = "Muy buena comida"
        )

        val local = Local(
            id = 5,
            nombre = "La Esquina",
            direccion = Direccion("San Martín", 1234, Point(-34.6, -58.4))
        )

        `when`(calificacionService.calificar(usuarioId, requestDTO)).thenReturn(true to local)

        mockMvc.perform(
            post("/calificaciones/$usuarioId/calificar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.ok").value(true))
            .andExpect(jsonPath("$.mensaje").value("Calificación exitosa"))
            .andExpect(jsonPath("$.puntajePromedio").exists())

        verify(calificacionService).calificar(usuarioId, requestDTO)
    }

    @Test
    @DisplayName("cuando se califica un local sin comentario, devuelve 200 OK")
    fun calificar_sinComentario() {
        val usuarioId = 1
        val requestDTO = CalificacionRequestDTO(
            localId = 5,
            puntuacion = 5,
            comentario = null
        )

        val local = Local(
            id = 5,
            nombre = "La Esquina",
            direccion = Direccion("San Martín", 1234, Point(-34.6, -58.4))
        )

        `when`(calificacionService.calificar(usuarioId, requestDTO)).thenReturn(true to local)

        mockMvc.perform(
            post("/calificaciones/$usuarioId/calificar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.ok").value(true))

        verify(calificacionService).calificar(usuarioId, requestDTO)
    }

    @Test
    @DisplayName("cuando no se puede calificar un local (ya calificado o fuera de tiempo), devuelve 200 OK con ok=false")
    fun calificar_noSePudoCalificar() {
        val usuarioId = 1
        val requestDTO = CalificacionRequestDTO(
            localId = 5,
            puntuacion = 3,
            comentario = "Ya lo califiqué antes"
        )

        val local = Local(
            id = 5,
            nombre = "La Esquina",
            direccion = Direccion("San Martín", 1234, Point(-34.6, -58.4))
        )

        `when`(calificacionService.calificar(usuarioId, requestDTO)).thenReturn(false to local)

        mockMvc.perform(
            post("/calificaciones/$usuarioId/calificar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.ok").value(false))
            .andExpect(jsonPath("$.mensaje").value("No se pudo calificar el local"))
            .andExpect(jsonPath("$.puntajePromedio").exists())

        verify(calificacionService).calificar(usuarioId, requestDTO)
    }

    @Test
    @DisplayName("cuando se intenta calificar con un usuario inexistente, devuelve 404 Not Found")
    fun calificar_usuarioInexistente() {
        val usuarioId = 999
        val requestDTO = CalificacionRequestDTO(
            localId = 5,
            puntuacion = 4,
            comentario = "Test"
        )

        `when`(calificacionService.calificar(usuarioId, requestDTO))
            .thenThrow(NotFoundException("No se encontró el objeto con ID $usuarioId."))

        mockMvc.perform(
            post("/calificaciones/$usuarioId/calificar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO))
        )
            .andExpect(status().isNotFound)

        verify(calificacionService).calificar(usuarioId, requestDTO)
    }

    @Test
    @DisplayName("cuando se intenta calificar un local inexistente, devuelve 404 Not Found")
    fun calificar_localInexistente() {
        val usuarioId = 1
        val requestDTO = CalificacionRequestDTO(
            localId = 999,
            puntuacion = 4,
            comentario = "Test"
        )

        `when`(calificacionService.calificar(usuarioId, requestDTO))
            .thenThrow(NotFoundException("No se encontró el objeto con ID 999."))

        mockMvc.perform(
            post("/calificaciones/$usuarioId/calificar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO))
        )
            .andExpect(status().isNotFound)

        verify(calificacionService).calificar(usuarioId, requestDTO)
    }
}