package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.GrupoAlimenticio
import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.dto.IngredienteDTO
import ar.edu.unsam.algo3.helpers.IngredienteMapper
import ar.edu.unsam.algo3.service.IngredienteService
import ar.edu.unsam.algo3.exceptions.NotFoundException
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@WebMvcTest(IngredienteController::class)
@DisplayName("Dado un IngredienteController")
class IngredienteControllerTest(
    @Autowired val mockMvc: MockMvc,
    @Autowired val objectMapper: ObjectMapper
) {

    @MockBean lateinit var ingredienteService: IngredienteService
    @MockBean lateinit var ingredienteMapper: IngredienteMapper

    @Test
    @DisplayName("cuando se consultan todos los ingredientes, devuelve 200 con la lista de DTOs")
    fun getIngredientes_ok() {
        val ingredientes = listOf(
            Ingrediente("Tomate", 80.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 1),
            Ingrediente("Lechuga", 60.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 2)
        )
        
        val dtos = listOf(
            IngredienteDTO(1, "Tomate", GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 80.0),
            IngredienteDTO(2, "Lechuga", GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 60.0)
        )

        `when`(ingredienteService.getIngredientes()).thenReturn(ingredientes)
        `when`(ingredienteMapper.toDto(ingredientes[0])).thenReturn(dtos[0])
        `when`(ingredienteMapper.toDto(ingredientes[1])).thenReturn(dtos[1])

        mockMvc.perform(get("/ingredientes"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].nombre").value("Tomate"))
            .andExpect(jsonPath("$[0].costo").value(80.0))
            .andExpect(jsonPath("$[1].nombre").value("Lechuga"))
            .andExpect(jsonPath("$[1].costo").value(60.0))

        verify(ingredienteService).getIngredientes()
    }

    @Test
    @DisplayName("cuando se consulta un ingrediente existente por el ID, devuelve 200 con el DTO")
    fun getIngredientePorId_ok() {
        val ingrediente = Ingrediente("Tomate", 80.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 1)
        val dto = IngredienteDTO(1, "Tomate", GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 80.0)

        `when`(ingredienteService.ingredienteById(1)).thenReturn(ingrediente)
        `when`(ingredienteMapper.toDto(ingrediente)).thenReturn(dto)

        mockMvc.perform(get("/ingrediente/1"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nombre").value("Tomate"))
            .andExpect(jsonPath("$.costo").value(80.0))

        verify(ingredienteService).ingredienteById(1)
        verify(ingredienteMapper).toDto(ingrediente)
    }

    @Test
    @DisplayName("cuando se consulta un ingrediente que no existe, devuelve 404 Not Found")
    fun getIngredienteInexistente() {
        `when`(ingredienteService.ingredienteById(99)).thenThrow(NotFoundException("Ingrediente no encontrado"))

        mockMvc.perform(get("/ingrediente/99"))
            .andExpect(status().isNotFound)

        verify(ingredienteService).ingredienteById(99)
    }

    @Test
    @DisplayName("cuando se crea un ingrediente con datos válidos, devuelve 200 con el DTO creado")
    fun crearIngrediente_ok() {
        val dtoRequest = IngredienteDTO(0, "Pimiento", GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 95.0)
        val ingrediente = Ingrediente("Pimiento", 95.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 0)
        val dtoResponse = IngredienteDTO(1, "Pimiento", GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 95.0)

        `when`(ingredienteMapper.fromDto(dtoRequest)).thenReturn(ingrediente)
        `when`(ingredienteMapper.toDto(ingrediente)).thenReturn(dtoResponse)

        mockMvc.perform(
            post("/ingrediente")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoRequest))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nombre").value("Pimiento"))
            .andExpect(jsonPath("$.costo").value(95.0))

        verify(ingredienteService).crearIngrediente(ingrediente)
        verify(ingredienteMapper).fromDto(dtoRequest)
        verify(ingredienteMapper).toDto(ingrediente)
    }

    @Test
    @DisplayName("cuando se actualiza un ingrediente que existe, devuelve 200 con el DTO actualizado")
    fun actualizarIngrediente_ok() {
        val dtoRequest = IngredienteDTO(1, "Tomate Cherry", GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 120.0)
        val ingrediente = Ingrediente("Tomate Cherry", 120.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 1)
        val dtoResponse = IngredienteDTO(1, "Tomate Cherry", GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 120.0)

        `when`(ingredienteMapper.fromDto(dtoRequest)).thenReturn(ingrediente)
        `when`(ingredienteMapper.toDto(ingrediente)).thenReturn(dtoResponse)

        mockMvc.perform(
            put("/ingrediente")  // ← CAMBIO: de /ingrediente/1 a /ingrediente
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoRequest))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.nombre").value("Tomate Cherry"))
            .andExpect(jsonPath("$.costo").value(120.0))

        verify(ingredienteService).actualizarIngrediente(ingrediente)
        verify(ingredienteMapper).fromDto(dtoRequest)
        verify(ingredienteMapper).toDto(ingrediente)
    }

    @Test
    @DisplayName("cuando se elimina un ingrediente existente, devuelve 200 OK")
    fun eliminarIngrediente_ok() {
        val dtoRequest = IngredienteDTO(1, "Tomate", GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 80.0)
        val ingrediente = Ingrediente("Tomate", 80.0, GrupoAlimenticio.FRUTAS_Y_VERDURAS, false, 1)

        `when`(ingredienteMapper.fromDto(dtoRequest)).thenReturn(ingrediente)

        mockMvc.perform(
            delete("/ingrediente/eliminar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoRequest))
        )
            .andExpect(status().isOk)

        verify(ingredienteService).eliminar(ingrediente)
        verify(ingredienteMapper).fromDto(dtoRequest)
    }

    @Test
    @DisplayName("cuando se envía un JSON malformado, devuelve 400 Bad Request")
    fun crearIngredienteConJsonMalformado() {
        mockMvc.perform(
            post("/ingrediente")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ json malformado }")
        )
            .andExpect(status().isBadRequest)
    }

    @Test
    @DisplayName("cuando se consulta con un ID inválido, devuelve 400 Bad Request")
    fun getIngredienteConIdInvalido() {
        mockMvc.perform(get("/ingrediente/abc"))
            .andExpect(status().isBadRequest)
    }
}